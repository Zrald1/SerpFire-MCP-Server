import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    console.log("🔧 Starting SerpFire Research...\n");

    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"]
    });

    const client = new Client(
        {
            name: "research-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        console.log("📡 Connecting to SerpFire MCP server...");
        await client.connect(transport);
        console.log("✅ Connected!\n");

        const topic = "latest AI developments December 2025";
        console.log(`🔍 Researching: "${topic}"`);
        console.log("⏳ Searching Google and scraping top 3 sources...\n");
        console.log("=".repeat(60));

        const result = await client.callTool({
            name: "research_topic",
            arguments: {
                topic: topic,
                max_sources: 3
            },
        });

        console.log("\n📊 RESEARCH RESULTS\n");
        console.log("=".repeat(60));

        if (result.content) {
            for (const item of result.content) {
                if (item.type === "text") {
                    console.log(item.text);
                }
            }
        }

        console.log("\n" + "=".repeat(60));
        console.log("✅ Research completed successfully!");

    } catch (error) {
        console.error("❌ Research failed:", error);
        process.exit(1);
    } finally {
        await client.close();
        process.exit(0);
    }
}

main();
