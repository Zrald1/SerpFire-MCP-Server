import axios from 'axios';

async function checkUrl(url, method = 'GET', data = null, headers = {}) {
    try {
        console.log(`Checking ${method} ${url}...`);
        const config = {
            method,
            url,
            headers,
            data,
            validateStatus: () => true
        };
        const res = await axios(config);
        console.log(`[${res.status}] ${url}`);
        if (res.data) {
            const str = JSON.stringify(res.data);
            console.log(str.substring(0, 500));
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

async function main() {
    const apiKey = "ctx7sk-b5d766fc-9f13-4f95-bc4a-c3fdf97c29e6";
    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };

    // Attempt POST to search
    await checkUrl('https://context7.com/api/search', 'POST', { query: "redis" }, headers);
    await checkUrl('https://context7.com/api/conversation', 'POST', { messages: [{ role: "user", content: "help with redis" }] }, headers);

    // Attempt GET with key
    await checkUrl('https://context7.com/api/search?q=redis', 'GET', null, headers);

    // Try MCP SSE endpoint if it exists
    await checkUrl('https://mcp.context7.com/sse', 'GET', null, headers);
}

main();
