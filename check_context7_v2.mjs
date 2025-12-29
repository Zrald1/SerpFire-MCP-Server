import axios from 'axios';

async function checkUrl(url, headers = {}) {
    try {
        console.log(`Checking ${url}...`);
        const res = await axios.get(url, { headers, validateStatus: () => true });
        console.log(`[${res.status}]`);
        if (res.status === 200) {
            console.log("Success! Data preview:");
            console.log(JSON.stringify(res.data, null, 2).substring(0, 1000));
        } else {
            console.log(res.data);
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

async function main() {
    const apiKey = "ctx7sk-b5d766fc-9f13-4f95-bc4a-c3fdf97c29e6";
    // Check headers format provided by user
    const headers = {
        "CONTEXT7_API_KEY": apiKey,
        "Content-Type": "application/json"
    };

    // Testing V2 API
    // We don't know the exact endpoint path (e.g. /search, /query), so we guess common ones
    // based on previous v1 endpoint naming /api/search

    const endpoints = [
        'https://context7.com/api/v2/search?query=redis',
        'https://context7.com/api/v2/search?q=redis', // Retrying just in case
    ];

    for (const url of endpoints) {
        await checkUrl(url, headers);
    }

    // Try POST
    try {
        console.log("Checking POST https://context7.com/api/v2/search...");
        const res = await axios.post(
            'https://context7.com/api/v2/search',
            { query: "redis" },
            { headers, validateStatus: () => true }
        );
        console.log(`[${res.status}]`);
        if (res.status === 200) console.log(JSON.stringify(res.data, null, 2).substring(0, 1000));
        else console.log(res.data);
    } catch (e) { console.log(e.message); }
}

main();
