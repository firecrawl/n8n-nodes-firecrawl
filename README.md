# n8n-nodes-firecrawl 🔥

This is an n8n community node. It lets you use **[Firecrawl](https://firecrawl.dev)** in your n8n workflows.

> 🔥 Turn entire websites into LLM-ready markdown or structured data. Scrape, crawl and extract with a single API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[AI Agent Tool Usage](#ai-agent-tool-usage)
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

## AI Agent Tool Usage

This node can be used as a tool with n8n's AI Agent node, allowing AI agents to scrape, crawl, and extract data from websites dynamically.

### Requirements

- **n8n version 1.79.0 or higher** is required for AI tool support
- Set the environment variable `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` to enable community nodes as AI tools

### Docker Configuration

```yaml
version: '3'
services:
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
    ports:
      - "5678:5678"
    volumes:
      - ~/.n8n:/home/node/.n8n
```

### Using with AI Agents

1. Add the **AI Agent** node to your workflow
2. Connect the **Firecrawl** node as a tool input to the AI Agent
3. The AI agent can now dynamically decide when and how to use Firecrawl operations

### Dynamic Parameters with $fromAI()

When using Firecrawl as an AI tool, you can let the AI agent decide parameter values dynamically using the `$fromAI()` function. Click the "Let the model define this parameter" button next to any field to enable this feature.

Example expressions:
```javascript
// Let AI decide the URL to scrape
{{ $fromAI("url", "The URL to scrape", "string") }}

// Let AI decide the search query
{{ $fromAI("query", "Search query for finding relevant pages", "string") }}

// Let AI decide whether to include subdomains
{{ $fromAI("includeSubdomains", "Whether to include subdomains", "boolean", false) }}
```

### Best Practices for AI Tool Usage

1. **Use clear operation names**: The AI agent uses operation descriptions to decide when to use each tool
2. **Provide context in prompts**: When using the Extract operation, provide clear prompts to guide data extraction
3. **Set reasonable limits**: Configure default limits to prevent excessive API usage
4. **Use the Map operation first**: For unknown sites, use Map to discover URLs before scraping

## Credentials

To use the Firecrawl node, you need to:

1. Sign up for a Firecrawl account at [https://firecrawl.dev](https://firecrawl.dev)
2. Get your API key from the Firecrawl dashboard
3. In n8n, add your Firecrawl API key to the node's credentials

> [!CAUTION]  
> The API key should be kept secure and never shared publicly

## Compatibility

- **Minimum n8n version: 1.79.0** (required for AI tool support)
- Tested against n8n versions: 1.79.0+
- Node.js version: 18 or higher

> **Note**: If you don't need AI tool support, earlier versions of n8n may work, but 1.79.0+ is recommended.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Firecrawl Documentation](https://firecrawl.dev/docs)
* [Firecrawl API Reference](https://docs.firecrawl.dev/api-reference/introduction)

## Version history

### 1.1.0
- **AI Agent Tool Support**: Node can now be used as a tool with n8n's AI Agent node
  - Added `usableAsTool: true` to enable tool mode
  - Enhanced all field descriptions for better AI context understanding
  - Supports `$fromAI()` function for dynamic parameter values
- Updated minimum n8n version requirement to 1.79.0
- Improved operation descriptions for clearer AI agent decision making

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
