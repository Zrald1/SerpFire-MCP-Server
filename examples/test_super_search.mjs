import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    console.log("🔧 Starting MCP Super Search Test...\n");

    // Point to the compiled JS in dist
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
        await client.connect(transport);
        console.log("✅ Connected!\n");

        const topic = "redis"; // A topic likely to have documentation
        console.log(`\n🔍 Testing 'super_search' with: "${topic}"`);
        console.log("⏳ This may take a while...\n");

        const result = await client.callTool({
            name: "super_search",
            arguments: {
                topic: topic
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

    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await client.close();
        process.exit(0);
    }
}

main();
