import axios from 'axios';

async function checkUrl(url, headers = {}) {
    try {
        console.log(`Checking ${url}...`);
        const res = await axios.get(url, { headers, validateStatus: () => true });
        console.log(`[${res.status}] ${url}`);
        // If successful, log a preview of data
        if (res.status === 200) {
            console.log("Success! Data preview:");
            console.log(JSON.stringify(res.data).substring(0, 500) + "...");
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

    console.log("Testing with API Key...");

    // Testing various potential endpoints found in search results or standard conventions
    const endpoints = [
        'https://api.context7.com/query?q=redis',
        'https://api.context7.com/v1/search?q=redis',
        'https://context7.com/api/search?q=redis', // The one that returned 200 OK before (empty array)
        'https://context7.com/api/v1/search?q=redis'
    ];

    for (const url of endpoints) {
        await checkUrl(url, headers);
    }
}

main();
