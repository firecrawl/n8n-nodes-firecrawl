# n8n-nodes-firecrawl 🔥

This is an n8n community node. It lets you use **[Firecrawl](https://firecrawl.dev)** in your n8n workflows.

> 🔥 Turn entire websites into LLM-ready markdown or structured data. Scrape, crawl and extract with a single API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Tool Node Support](#tool-node-support)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The **Firecrawl** node supports the following operations:

### Search
- Search and optionally scrape search results

### Map
- Input a website and get all the website urls

### Scrape
- Scrapes a URL and get its content in LLM-ready format (markdown, structured data via LLM Extract, screenshot, html)

### Crawl
- Scrapes all the URLs of a web page and return content in LLM-ready format

### Batch Scrape
- Start a batch job to scrape multiple URLs at once

### Batch Scrape Status
- Get the status/result of a batch scrape job by ID

### Batch Scrape Errors
- Retrieve errors for a batch scrape job by ID

### Crawl Active
- List all currently active crawl jobs for your team

### Crawl Params Preview
- Preview crawl parameters generated from a natural-language prompt

### Cancel Crawl
- Cancel a running crawl job by ID

### Get Crawl Errors
- Retrieve errors for a crawl job by ID

### Get Crawl Status
- Check the current status of a crawl job

### Extract Data
- Get structured data from single page, multiple pages or entire websites with AI

### Get Extract Status
- Get the current status of an extraction job

### Team Token Usage
- Get remaining and plan tokens for the authenticated team

### Team Credit Usage
- Get remaining and plan credits for the authenticated team

### Historical Credit Usage
- Get historical credit usage for your team

### Historical Token Usage
- Get historical token usage for your team

### Team Queue Status
- Get your team's current queue load (waiting, active, max concurrency)

## Tool Node Support

The Firecrawl node now supports **Tool Node** functionality for n8n's AI Agent system! This makes Firecrawl seamlessly usable by AI Agents in n8n workflows.

### Available Tools

When used as a Tool Node, Firecrawl exposes the following tools that AI Agents can use:

#### 1. **scrape_url**
Scrapes a URL and extracts its content in LLM-ready format (markdown, HTML, or structured data).

**Parameters:**
- `url` (required): The URL to scrape
- `formats`: Output formats (comma-separated): markdown, html, rawHtml, screenshot, summary
- `onlyMainContent`: Only return main content (default: true)
- `actions`: JSON array of actions to interact with dynamic content
- `headers`: JSON object of custom headers
- `waitFor`: Wait milliseconds for page to load

#### 2. **extract_data**
Extracts structured data from one or more URLs using AI. Define a schema to get specific data fields from pages.

**Parameters:**
- `urls` (required): Comma-separated list of URLs to extract from (supports glob patterns)
- `schema` (required): JSON schema defining the structure of data to extract
- `prompt`: Optional prompt to guide the extraction
- `enableWebSearch`: Enable web search to find additional data
- `ignoreSitemap`: Ignore the website sitemap
- `includeSubdomains`: Include subdomains

#### 3. **search_website**
Search through a website and optionally scrape the results.

**Parameters:**
- `url` (required): The URL to search on
- `search` (required): Search query
- `scrape`: Whether to scrape search results
- `limit`: Maximum number of results

#### 4. **crawl_website**
Crawls an entire website and returns structured data from all pages.

**Parameters:**
- `url` (required): The URL to start crawling from
- `limit`: Maximum number of pages to crawl (default: 100)
- `excludePaths`: Comma-separated path patterns to exclude
- `includePaths`: Comma-separated path patterns to include
- `prompt`: Natural language prompt to guide the crawl
- `formats`: Output formats
- `allowExternalLinks`: Allow crawling external domains
- `allowSubdomains`: Allow crawling subdomains

#### 5. **map_website**
Get all URLs from a website without scraping content.

**Parameters:**
- `url` (required): The URL to map
- `limit`: Maximum number of URLs (default: 1000)
- `excludePaths`: Path patterns to exclude
- `includePaths`: Path patterns to include

### Using Firecrawl with n8n AI Agents

To use Firecrawl as a Tool Node in your n8n AI Agent workflows:

1. Add a Firecrawl node to your workflow
2. Configure your Firecrawl credentials
3. The AI Agent will automatically discover and use Firecrawl tools
4. When the agent needs to scrape, extract, search, or crawl, it will use the appropriate Firecrawl tool

This makes it easier to integrate web data extraction into AI Agent workflows without manual configuration.

## Credentials

To use the Firecrawl node, you need to:

1. Sign up for a Firecrawl account at [https://firecrawl.dev](https://firecrawl.dev)
2. Get your API key from the Firecrawl dashboard
3. In n8n, add your Firecrawl API key to the node's credentials

> [!CAUTION]  
> The API key should be kept secure and never shared publicly

## Compatibility

- Minimum n8n version: 1.0.0
- Tested against n8n versions: 1.0.0, 1.1.0, 1.2.0
- Node.js version: 18 or higher

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Firecrawl Documentation](https://firecrawl.dev/docs)
* [Firecrawl API Reference](https://docs.firecrawl.dev/api-reference/introduction)

## Version history

### 1.0.7
- Add Tool Node support for n8n AI Agent system
- Firecrawl can now be used as a Tool Node in AI Agent workflows
- Added tool definitions for scrape_url, extract_data, search_website, crawl_website, and map_website
- Improved discoverability and easier setup for AI Agent integrations

### 1.0.6
- Add support for additional Firecrawl endpoints:
  - Batch Scrape (start/status/errors)
  - Crawl Active
  - Crawl Params Preview
  - Cancel Crawl 
  - Get Crawl Errors
  - Team Token Usage
  - Team Credit Usage
  - Historical Credit Usage
  - Historical Token Usage
  - Team Queue Status
- Wire new operations into the node and align with Firecrawl API v2

### 1.0.5
- API version updated to [/v2](https://docs.firecrawl.dev/migrate-to-v2)
- Unified sitemap configuration parameters in Map operation
- Replaced `ignoreSitemap` and `sitemapOnly` with unified `sitemap` parameter
- `sitemap` parameter now accepts: "include" (default), "only", or "skip"

### 1.0.4
- Add additional fields property for custom data in Firecrawl API nodes

### 1.0.2
- Add integration parameter in all endpoint calls

### 1.0.1
- Support for Search operation

### 1.0.0
- Initial release
- Support for all basic Firecrawl operations:
  - Map URLs
  - Scrape URL
  - Crawl Website
  - Get Crawl Status
  - Extract Data
  - Get Extract Status
- Basic error handling and response processing
- Support for custom body options

## More information

Refer to our [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
