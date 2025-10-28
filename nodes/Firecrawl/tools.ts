/**
 * Tool definitions for Firecrawl operations in n8n AI Agent system
 * These tools enable Firecrawl to function as a Tool Node in n8n
 * 
 * Note: The 'tools' property in INodeTypeDescription is currently a newer feature
 * in n8n. If ITool type is not available, we define the structure manually.
 */
export interface ToolParameter {
	name: string;
	type: string;
	required?: boolean;
	description?: string;
	placeholder?: string;
	default?: string | boolean | number;
}

export interface Tool {
	name: string;
	description: string;
	parameters: ToolParameter[];
}

export const tools: Tool[] = [
	{
		name: 'scrape_url',
		description: 'Scrapes a URL and extracts its content in LLM-ready format (markdown, HTML, or structured data). Use this to get clean, formatted content from any webpage.',
		parameters: [
			{
				name: 'url',
				type: 'string',
				required: true,
				description: 'The URL to scrape',
				placeholder: 'https://example.com',
			},
			{
				name: 'formats',
				type: 'string',
				description: 'Output formats (comma-separated): markdown, html, rawHtml, screenshot, summary',
				default: 'markdown',
			},
			{
				name: 'onlyMainContent',
				type: 'boolean',
				description: 'Only return main content excluding headers, navs, footers',
				default: true,
			},
			{
				name: 'actions',
				type: 'string',
				description: 'JSON array of actions to interact with dynamic content (click, wait, scroll, etc.)',
			},
			{
				name: 'headers',
				type: 'string',
				description: 'JSON object of custom headers to send with the request',
			},
			{
				name: 'waitFor',
				type: 'number',
				description: 'Wait milliseconds for page to load before fetching content',
				default: 0,
			},
		],
	},
	{
		name: 'extract_data',
		description: 'Extracts structured data from one or more URLs using AI. Define a schema to get specific data fields from pages.',
		parameters: [
			{
				name: 'urls',
				type: 'string',
				required: true,
				description: 'Comma-separated list of URLs to extract from (supports glob patterns)',
				placeholder: 'https://example.com/*',
			},
			{
				name: 'schema',
				type: 'string',
				required: true,
				description: 'JSON schema defining the structure of data to extract',
				placeholder: '{"title": "string", "price": "number"}',
			},
			{
				name: 'prompt',
				type: 'string',
				description: 'Optional prompt to guide the extraction process',
			},
			{
				name: 'enableWebSearch',
				type: 'boolean',
				description: 'Enable web search to find additional data',
				default: false,
			},
			{
				name: 'ignoreSitemap',
				type: 'boolean',
				description: 'Ignore the website sitemap when crawling',
				default: true,
			},
			{
				name: 'includeSubdomains',
				type: 'boolean',
				description: 'Include subdomains of the website',
				default: false,
			},
		],
	},
	{
		name: 'search_website',
		description: 'Search through a website and optionally scrape the results. Useful for finding specific content across a domain.',
		parameters: [
			{
				name: 'url',
				type: 'string',
				required: true,
				description: 'The URL to search on',
				placeholder: 'https://example.com',
			},
			{
				name: 'search',
				type: 'string',
				required: true,
				description: 'Search query to find content',
				placeholder: 'keywords to search for',
			},
			{
				name: 'scrape',
				type: 'boolean',
				description: 'Whether to scrape the search results',
				default: false,
			},
			{
				name: 'limit',
				type: 'number',
				description: 'Maximum number of search results to return',
				default: 10,
			},
		],
	},
	{
		name: 'crawl_website',
		description: 'Crawls an entire website and returns structured data from all pages. Use this to get content from multiple pages on a domain.',
		parameters: [
			{
				name: 'url',
				type: 'string',
				required: true,
				description: 'The URL to start crawling from',
				placeholder: 'https://example.com',
			},
			{
				name: 'limit',
				type: 'number',
				description: 'Maximum number of pages to crawl',
				default: 100,
			},
			{
				name: 'excludePaths',
				type: 'string',
				description: 'Comma-separated path patterns to exclude (e.g., "blog/*,admin/*")',
			},
			{
				name: 'includePaths',
				type: 'string',
				description: 'Comma-separated path patterns to include',
			},
			{
				name: 'prompt',
				type: 'string',
				description: 'Natural language prompt to guide the crawl',
			},
			{
				name: 'formats',
				type: 'string',
				description: 'Output formats (comma-separated): markdown, html, screenshot',
				default: 'markdown',
			},
			{
				name: 'allowExternalLinks',
				type: 'boolean',
				description: 'Allow crawling external domains',
				default: false,
			},
			{
				name: 'allowSubdomains',
				type: 'boolean',
				description: 'Allow crawling subdomains',
				default: false,
			},
		],
	},
	{
		name: 'map_website',
		description: 'Get all URLs from a website without scraping content. Use this to discover all pages on a domain.',
		parameters: [
			{
				name: 'url',
				type: 'string',
				required: true,
				description: 'The URL to map',
				placeholder: 'https://example.com',
			},
			{
				name: 'limit',
				type: 'number',
				description: 'Maximum number of URLs to return',
				default: 1000,
			},
			{
				name: 'excludePaths',
				type: 'string',
				description: 'Comma-separated path patterns to exclude',
			},
			{
				name: 'includePaths',
				type: 'string',
				description: 'Comma-separated path patterns to include',
			},
		],
	},
];

/**
 * Maps tool names to their corresponding Firecrawl operations
 */
export const toolToOperationMap: Record<string, string> = {
	scrape_url: 'scrape',
	extract_data: 'extract',
	search_website: 'search',
	crawl_website: 'crawl',
	map_website: 'map',
};

