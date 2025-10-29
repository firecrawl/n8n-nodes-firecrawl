/**
 * AI Tool Configuration for Firecrawl Node
 *
 * This file provides configuration and helper functions to make the Firecrawl node
 * compatible with n8n's AI Agent system. The main enablement is through the
 * usableAsTool: true property in the main node description.
 */

export const firecrawlToolDescription = {
	// Tool descriptions for AI Agents to understand capabilities
	scrape: `
		Scrape content from a single URL with advanced options.
		Best for single page content extraction when you know the exact URL.
		Returns markdown, HTML, or other specified formats.
	`,

	search: `
		Search the web and optionally extract content from search results.
		Best for finding information across multiple websites when you don't know which site has it.
		Returns search results with optional scraped content.
	`,

	map: `
		Map a website to discover all indexed URLs on the site.
		Best for discovering URLs before deciding what to scrape.
		Returns array of URLs found on the site.
	`,

	crawl: `
		Start a crawl job on a website to extract content from multiple pages.
		Best for comprehensive coverage of related pages.
		Returns operation ID for status checking.
	`,

	extract: `
		Extract structured information from web pages using LLM capabilities.
		Best for extracting specific structured data like prices, names, details.
		Returns extracted structured data as defined by schema.
	`,

	checkCrawlStatus: `
		Check the status of a crawl job.
		Returns status and progress of the crawl job, including results if available.
	`
};

// Example usage patterns for AI Agents
export const firecrawlToolExamples = {
	scrape: {
		description: "Scrape content from a specific webpage",
		example: {
			operation: "scrape",
			resource: "content",
			url: "https://example.com",
			formats: ["markdown"],
			onlyMainContent: true
		}
	},

	search: {
		description: "Search the web for information",
		example: {
			operation: "search",
			resource: "web",
			query: "latest AI research papers 2024",
			limit: 10,
			sources: ["web"]
		}
	},

	map: {
		description: "Discover URLs on a website",
		example: {
			operation: "map",
			resource: "website",
			url: "https://example.com",
			limit: 100
		}
	}
};

/**
 * Helper function to validate tool parameters for AI Agents
 */
export function validateToolParameters(operation: string, parameters: any): { valid: boolean; error?: string } {
	switch (operation) {
		case 'scrape':
			if (!parameters.url) {
				return { valid: false, error: 'URL is required for scrape operation' };
			}
			break;
		case 'search':
			if (!parameters.query) {
				return { valid: false, error: 'Query is required for search operation' };
			}
			break;
		case 'map':
			if (!parameters.url) {
				return { valid: false, error: 'URL is required for map operation' };
			}
			break;
		default:
			return { valid: false, error: `Unknown operation: ${operation}` };
	}
	return { valid: true };
}