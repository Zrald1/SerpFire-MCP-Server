import axios from 'axios';

async function checkUrl(url, headers = {}) {
    try {
        console.log(`Checking ${url}...`);
        const res = await axios.get(url, { headers, validateStatus: () => true });
        console.log(`[${res.status}]`);
        if (res.status === 200) {
            console.log("Success! Data preview:");
            console.log(JSON.stringify(res.data, null, 2).substring(0, 1000));
            return res.data;
        } else {
            console.log(res.data);
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

async function main() {
    const apiKey = "ctx7sk-b5d766fc-9f13-4f95-bc4a-c3fdf97c29e6";
    // Correct header format provided by user
    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };

    // 1. Search
    console.log("--- Testing Search ---");
    const searchUrl = 'https://context7.com/api/v2/search?query=redis';
    const searchData = await checkUrl(searchUrl, headers);

    if (searchData && searchData.results && searchData.results.length > 0) {
        const firstId = searchData.results[0].id;
        console.log(`\n--- Testing Fetch for ID: ${firstId} ---`);

        // Trying to guess the fetch endpoint based on common patterns and the fact that we have an ID
        // The user hasn't provided the fetch endpoint, only search.
        // Let's try a few obvious ones.
        const encodedId = encodeURIComponent(firstId);
        const fetchEndpoints = [
            `https://context7.com/api/v2/fetch?id=${encodedId}`,
            `https://context7.com/api/v2/${firstId}`, // path parameter often excludes leading slash if it's part of id
            `https://context7.com/api/v2/library?id=${encodedId}`,
            `https://context7.com/api/v2/snippets?id=${encodedId}`,
            // Maybe without the leading slash in ID?
            `https://context7.com/api/v2/fetch?id=${encodeURIComponent(firstId.replace(/^\//, ''))}`
        ];

        for (const url of fetchEndpoints) {
            await checkUrl(url, headers);
        }
    }
}

main();
