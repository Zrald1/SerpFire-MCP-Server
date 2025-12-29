#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

if (!SERPER_API_KEY) {
    console.error("Error: SERPER_API_KEY is not set");
    process.exit(1);
}

if (!FIRECRAWL_API_KEY) {
    console.error("Error: FIRECRAWL_API_KEY is not set");
    process.exit(1);
}

const server = new Server(
    {
        name: "serpfire",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Tool Definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "serper_search",
                description: "Search Google using Serper.dev",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Search query" },
                        num: { type: "number", description: "Number of results (default 10)" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "firecrawl_scrape",
                description: "Scrape a single URL using Firecrawl",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: { type: "string", description: "URL to scrape" },
                        formats: {
                            type: "array",
                            items: { type: "string", enum: ["markdown", "html", "rawHtml", "links", "screenshot", "extract", "screenshot@fullPage"] },
                            description: "Formats to return (default ['markdown'])",
                        },
                    },
                    required: ["url"],
                },
            },
            {
                name: "firecrawl_crawl",
                description: "Crawl a website using Firecrawl",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: { type: "string", description: "Base URL to crawl" },
                        limit: { type: "number", description: "Maximum number of pages to crawl" },
                        scrapeOptions: {
                            type: "object",
                            properties: {
                                formats: { type: "array", items: { type: "string" } },
                            },
                        },
                    },
                    required: ["url"],
                },
            },
            {
                name: "research_topic",
                description: "Research a topic by searching and then scraping the top results",
                inputSchema: {
                    type: "object",
                    properties: {
                        topic: { type: "string", description: "Topic to research" },
                        max_sources: { type: "number", description: "Number of top sources to scrape (default 3)" },
                    },
                    required: ["topic"],
                },
            },
        ],
    };
});

// Tool Implementation
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        switch (request.params.name) {
            case "serper_search": {
                const query = String(request.params.arguments?.query);
                const num = Number(request.params.arguments?.num || 10);

                const response = await axios.post(
                    "https://google.serper.dev/search",
                    { q: query, num },
                    { headers: { "X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json" } }
                );

                return {
                    content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
                };
            }

            case "firecrawl_scrape": {
                const url = String(request.params.arguments?.url);
                const formats = (request.params.arguments?.formats as string[]) || ["markdown"];

                const response = await axios.post(
                    "https://api.firecrawl.dev/v1/scrape",
                    { url, formats },
                    { headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, "Content-Type": "application/json" } }
                );

                return {
                    content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
                };
            }

            case "firecrawl_crawl": {
                const url = String(request.params.arguments?.url);
                const limit = Number(request.params.arguments?.limit || 5);
                const scrapeOptions = request.params.arguments?.scrapeOptions || { formats: ["markdown"] };

                const response = await axios.post(
                    "https://api.firecrawl.dev/v1/crawl",
                    { url, limit, scrapeOptions },
                    { headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, "Content-Type": "application/json" } }
                );

                return {
                    content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
                };
            }

            case "research_topic": {
                const topic = String(request.params.arguments?.topic);
                const maxSources = Number(request.params.arguments?.max_sources || 3);


                // 1. Search
                const searchResponse = await axios.post(
                    "https://google.serper.dev/search",
                    { q: topic, num: maxSources },
                    { headers: { "X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json" } }
                );

                if (!searchResponse) {
                    throw new Error("Failed to get response from Serper");
                }

                const organicResults = (searchResponse.data as any).organic || [];
                const topUrls = organicResults.slice(0, maxSources).map((r: any) => r.link);

                if (topUrls.length === 0) {
                    return { content: [{ type: "text", text: `No search results found for: ${topic}` }] };
                }

                // 2. Scrape (in parallel)
                const scrapePromises = topUrls.map(async (url: string) => {
                    try {
                        const scrapeRes = await axios.post(
                            "https://api.firecrawl.dev/v1/scrape",
                            { url, formats: ["markdown"] },
                            { headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, "Content-Type": "application/json" } }
                        );
                        return { url, data: scrapeRes.data, success: true };
                    } catch (error: any) {
                        return { url, error: error.message, success: false };
                    }
                });

                const scrapedResults = await Promise.all(scrapePromises);

                // 3. Format Output
                let summary = `Research Results for "${topic}"\n\n`;
                summary += `Found ${topUrls.length} sources:\n`;
                topUrls.forEach((url: string) => (summary += `- ${url}\n`));
                summary += "\n---\n\n";

                scrapedResults.forEach((res) => {
                    summary += `### Source: ${res.url}\n`;
                    if (res.success) {
                        const markdown = res.data.data?.markdown || JSON.stringify(res.data);
                        // Truncate if too long (arbitrary limit of 5000 chars per source to avoid context overflow)
                        const content = markdown.length > 5000 ? markdown.substring(0, 5000) + "... [TRUNCATED]" : markdown;
                        summary += content;
                    } else {
                        summary += `[Failed to scrape: ${res.error}]`;
                    }
                    summary += "\n\n---\n\n";
                });

                return {
                    content: [{ type: "text", text: summary }],
                };
            }

            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const apiError = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            return {
                content: [{ type: "text", text: `API Error: ${apiError}` }],
                isError: true,
            };
        }
        throw error;
    }
});


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Serper/Firecrawl MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
