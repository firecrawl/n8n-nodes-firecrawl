# n8n-nodes-firecrawl 🔥

This is an n8n community node. It lets you use **[Firecrawl](https://firecrawl.dev)** in your n8n workflows.

> 🔥 Turn entire websites into LLM-ready markdown or structured data. Scrape, crawl and extract with a single API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## ✨ NEW: AI Agent Tool Support

The Firecrawl node now supports **n8n's AI Agent system**! Use it as a tool in AI Agent workflows for intelligent web scraping and data extraction.

[Installation](#installation)
[AI Agent Tool Usage](#ai-agent-tool-usage)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

**For AI Agent Tool usage**, you must also set this environment variable:
```bash
export N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

## AI Agent Tool Usage

The Firecrawl node can now be used as a **Tool Node** in n8n's AI Agent workflows! This enables AI agents to intelligently scrape websites, search the web, and extract structured data.

### Quick Start

1. **Install** the Firecrawl node (see installation above)
2. **Set environment variable**: `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true`
3. **Restart n8n**
4. **Create a workflow** with an AI Agent node
5. **Connect** the Firecrawl node to the AI Agent
6. **Configure** your Firecrawl API credentials

### Example AI Agent Prompts

Once connected to an AI Agent, you can use natural language prompts like:

- *"Scrape the content from https://example.com and summarize it"*
- *"Search for recent AI research papers and extract key insights"*
- *"Map all URLs on https://company.com and then scrape their About page"*
- *"Extract product information (name, price, description) from this e-commerce page"*

### Available Tool Operations

When used as an AI Agent tool, Firecrawl provides these capabilities:

- **🔍 Web Search**: Find information across multiple websites
- **📄 Page Scraping**: Extract content from specific URLs
- **🗺️ Site Mapping**: Discover all URLs on a website
- **🕷️ Website Crawling**: Extract content from multiple related pages
- **🎯 Data Extraction**: Get structured data using AI prompts
- **📊 Batch Operations**: Handle multiple URLs efficiently

### Benefits of AI Agent Integration

- **One-click setup**: No complex workflow design needed
- **Natural language control**: Use simple prompts instead of manual configuration
- **Intelligent decision making**: AI chooses the right Firecrawl operation automatically
- **Seamless integration**: Works with any AI model supported by n8n
- **Reduced complexity**: Eliminates the need for manual parameter configuration

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
- Get your team’s current queue load (waiting, active, max concurrency)

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

### 1.0.7 (AI Agent Tool Support)
- ✨ **NEW**: Added support for n8n's AI Agent system
- 🤖 Node can now be used as an AI Agent Tool for intelligent web scraping
- 🔧 Added `usableAsTool: true` property for seamless AI integration
- 📚 Enhanced node description for better AI agent understanding
- 🛠️ Created tools.ts with AI-friendly operation descriptions
- 📖 Updated documentation with AI Agent usage examples
- 🎯 Enables natural language control of web scraping operations
- 🚀 One-click integration with AI workflows

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
