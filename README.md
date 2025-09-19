# n8n-nodes-firecrawl 🔥

This is an n8n community node. It lets you use **[Firecrawl](https://firecrawl.dev)** in your n8n workflows.

> 🔥 Turn entire websites into LLM-ready markdown or structured data. Scrape, crawl and extract with a single API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  
[Version history](#version-history)  
[Examples](#examples)

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

### Batch Scrape
- Submit multiple URLs to scrape in a single request for higher throughput and simpler flows

### Crawl
- Scrapes all the URLs of a web page and return content in LLM-ready format

### Preview Crawl Params
- Preview/validate crawl parameters without starting a crawl

### Get Crawl Status
- Check the current status of a crawl job

### Get Crawl Errors
- Retrieve errors for a crawl job

### Get Active Crawls
- List active crawl jobs for the team

### Cancel Crawl
- Cancel an in-progress crawl job

### Extract Data
- Get structured data from single page, multiple pages or entire websites with AI

### Get Extract Status
- Get the current status of an extraction job

### Get Batch Scrape Status
- Check the current status of a batch scrape job

### Get Batch Scrape Errors
- Retrieve errors for a batch scrape job

### Cancel Batch Scrape
- Cancel an in-progress batch scrape job

### Team Credit Usage
- Get current team credit usage

### Team Credit Usage Historical
- Get historical credit usage data

### Team Token Usage
- Get current team token usage

### Team Token Usage Historical
- Get historical token usage data

### Team Queue Status
- Get current team queue status

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

## Examples

- Batch scrape multiple URLs
  - Add a Firecrawl node with Operation set to “Batch Scrape”.
  - Enter a list of URLs and choose output formats (e.g., Markdown + JSON with a schema).
  - Optionally set Max Concurrency, Ignore Invalid URLs, and a Webhook.
  - Use “Get Batch Scrape Status” with the returned `data.id` to poll until `data.status` is `completed`.
  - Use “Get Batch Scrape Errors” to retrieve any failed URLs if needed.
  - Fan out the `data` payload using Item Lists for downstream processing.

- Preview crawl parameters
  - Add a Firecrawl node with Operation “Preview Crawl Params”.
  - Configure URL, include/exclude paths, limits/delay, crawl options, and scrape options.
  - Inspect the returned `data` to validate parameters before running a full crawl.

- Team usage and status
  - Add Firecrawl operations under Team (Credit/Token usage, Queue Status) to monitor quotas or queue health.
  - Combine with If nodes and notifications to alert on thresholds.

## Version history

### 1.1.0
- Added support for all publicly documented endpoints missing from previous versions:
  - Batch Scrape: POST /batch/scrape, GET /batch/scrape/{id}, GET /batch/scrape/{id}/errors, DELETE /batch/scrape/{id}
  - Crawl: GET /crawl/{id}/errors, GET /crawl/active, POST /crawl/params-preview, DELETE /crawl/{id}
  - Team: GET /team/credit-usage, GET /team/credit-usage/historical, GET /team/token-usage, GET /team/token-usage/historical, GET /team/queue-status
- Output shape aligned for n8n: status/info endpoints return `data` key for smooth downstream use
- Updated README with new operations

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
