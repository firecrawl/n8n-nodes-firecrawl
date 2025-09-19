import { INodeType } from 'n8n-workflow';
import { apiMethods } from './api';

/**
 * All methods for the Firecrawl API node
 *
 * This file centralizes all methods used by the Firecrawl API node.
 * Methods are organized by their respective API operations and
 * include functionality for handling HTTP requests and responses.
 *
 * Currently includes:
 * - API methods for map operations
 * - API methods for scrape operations
 * - API methods for crawl operations
 * - API methods for getCrawlStatus operations
 * - API methods for extract operations
 * - API methods for getExtractStatus operations
 * - API methods for batchScrape operations
 * - API methods for cancelBatchScrape operations
 * - API methods for getBatchScrapeStatus operations
 * - API methods for getBatchScrapeErrors operations
 * - API methods for search operations
 * - API methods for cancelCrawl operations
 * - API methods for getActiveCrawls operations
 * - API methods for getCrawlErrors operations
 * - API methods for getCrawlParamsPreview operations
 * - API methods for getCreditUsage operations
 * - API methods for getTokenUsage operations
 *
 * @returns The combined methods object that implements INodeType['methods']
 */
export const allMethods = {
	Default: {
		...apiMethods.Default,
	},
} as INodeType['methods'];
