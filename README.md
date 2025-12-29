# SerpFire MCP Server

A powerful Model Context Protocol (MCP) server that combines **Serper.dev** (Google Search) and **Firecrawl** (Web Scraping) to provide AI agents with comprehensive research capabilities.

## Features

- 🔍 **Google Search** via Serper.dev API
- 🌐 **Web Scraping** via Firecrawl API  
- 🤖 **Smart Research** - Automatically search and scrape top results
- 🚀 **Easy Integration** with Cursor, Claude Desktop, and other MCP clients

## Installation

```bash
npm install -g @zrald/serpfire
```

## Prerequisites

You need API keys from:
- [Serper.dev](https://serper.dev) - Google Search API
- [Firecrawl.dev](https://firecrawl.dev) - Web Scraping API

## Configuration

### For Cursor / Claude Desktop

Add to your MCP settings file (e.g., `mcp.json`):

```json
{
  "mcpServers": {
    "serpfire": {
      "command": "npx",
      "args": ["-y", "@zrald/serpfire"],
      "env": {
        "SERPER_API_KEY": "your_serper_api_key_here",
        "FIRECRAWL_API_KEY": "your_firecrawl_api_key_here"
      }
    }
  }
}
```

### Environment Variables

Alternatively, set environment variables:

```bash
export SERPER_API_KEY="your_serper_api_key"
export FIRECRAWL_API_KEY="your_firecrawl_api_key"
```

## Available Tools

### 1. `serper_search`
Search Google and get structured results.

**Arguments:**
- `query` (string, required): Search query
- `num` (number, optional): Number of results (default: 10)

### 2. `firecrawl_scrape`
Scrape a single web page.

**Arguments:**
- `url` (string, required): URL to scrape
- `formats` (array, optional): Output formats (default: `["markdown"]`)

### 3. `firecrawl_crawl`
Crawl an entire website.

**Arguments:**
- `url` (string, required): Base URL to crawl
- `limit` (number, optional): Max pages to crawl

### 4. `research_topic` ⭐ (Recommended)
Automatically search a topic and scrape top results.

**Arguments:**
- `topic` (string, required): Topic to research
- `max_sources` (number, optional): Number of sources to scrape (default: 3)

**How it works:**
1. Searches Google for the topic
2. Extracts top N URLs
3. Scrapes all URLs in parallel
4. Returns synthesized research

## Usage Examples

Once configured, ask your AI assistant:

- *"Use serpfire to research the latest AI developments"*
- *"Search for MCP servers and scrape the top 3 results"*
- *"Find information about Firecrawl API features"*

## License

ISC

## Author

Created by Zrald

## Links

- [GitHub Repository](https://github.com/Zrald1/SerpFire-MCP-Server)
- [npm Package](https://www.npmjs.com/package/@zrald/serpfire)

## 💝 Support Development

If you find this project helpful, consider supporting development:

**Crypto Donations**

- **BNB (Binance Smart Chain):** `0xB8E0b6D4BaaFd1ac4De9245A760cB8F09bB7D084`
- **Bitcoin (BTC):** `bc1q77k0ju6ta3sp0vm3phm6dek432rzg7cqwf43z6`
- **Ethereum (ETH):** `0xB8E0b6D4BaaFd1ac4De9245A760cB8F09bB7D084`
- **Polygon (MATIC):** `0xB8E0b6D4BaaFd1ac4De9245A760cB8F09bB7D084`
- **Dogecoin (DOGE):** `DGbDQEgJLnNR2yEmWFrusFd7jLya4aoZMA`

Your support helps maintain and improve this open-source project! 🙏
