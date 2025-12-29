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
    const headers = {
        "CONTEXT7_API_KEY": apiKey,
        "Content-Type": "application/json"
    };

    const libId = "websites/redis_io"; // trying without leading slash too
    const libId2 = "%2Fwebsites%2Fredis_io"; // encoded

    const endpoints = [
        `https://context7.com/api/v2/${libId}`,
        `https://context7.com/api/v2/library?id=${libId2}`,
        `https://context7.com/api/v2/libraries/${libId}`,
        `https://context7.com/api/v2/fetch?id=${libId2}`
    ];

    for (const url of endpoints) {
        await checkUrl(url, headers);
    }
}

main();
