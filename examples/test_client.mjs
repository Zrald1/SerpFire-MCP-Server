import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    console.log("🔧 Starting MCP Test Client...\n");

    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"]
    });

    const client = new Client(
        {
            name: "test-client",
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

        console.log("📋 Listing available tools...");
        const toolsResponse = await client.listTools();
        console.log("Available tools:");
        toolsResponse.tools.forEach((tool) => {
            console.log(`  - ${tool.name}: ${tool.description}`);
        });

        const topic = "What is Firecrawl";
        console.log(`\n🔍 Testing 'research_topic' with: "${topic}"`);
        console.log("⏳ This may take 10-20 seconds...\n");

        const result = await client.callTool({
            name: "research_topic",
            arguments: {
                topic: topic,
                max_sources: 1
            },
        });

        console.log("--- RESULT ---\n");
        if (result.content) {
            for (const item of result.content) {
                if (item.type === "text") {
                    console.log(item.text);
                }
            }
        } else {
            console.log("❌ Unexpected result format:", JSON.stringify(result, null, 2));
        }

        console.log("\n✅ Test completed successfully!");

    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    } finally {
        await client.close();
        process.exit(0);
    }
}

main();
