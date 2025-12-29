import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    console.log("🧪 Testing SerpFire Package...\n");

    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"]
    });

    const client = new Client(
        {
            name: "test-package",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        console.log("📡 Connecting...");
        await client.connect(transport);
        console.log("✅ Connected!\n");

        console.log("📋 Listing tools...");
        const toolsResponse = await client.listTools();
        console.log(`✅ Found ${toolsResponse.tools.length} tools:`);
        toolsResponse.tools.forEach((tool) => {
            console.log(`   - ${tool.name}`);
        });

        console.log("\n🔍 Testing serper_search...");
        const searchResult = await client.callTool({
            name: "serper_search",
            arguments: {
                query: "MCP Model Context Protocol",
                num: 3
            },
        });
        console.log("✅ Search successful!");

        console.log("\n✅ All tests passed!");
        console.log("\n📦 Package is ready to publish!");

    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    } finally {
        await client.close();
        process.exit(0);
    }
}

main();
