import { INodeType } from 'n8n-workflow';
import { apiMethods } from './api';

/**
 * All methods for the Firecrawl API node
 *
 * This file centralizes all methods used by the Firecrawl API node.
 * Methods are organized by their respective API operations and
 * include functionality for handling HTTP requests and responses.
 *
 * Currently includes API methods for:
 * - Search
 * - Map
 * - Scrape
 * - Crawl (submit, status, errors, active, params preview, cancel)
 * - Extract (submit, status)
 * - Batch Scrape (submit, status, errors, cancel)
 * - Team (credit usage, credit usage historical, token usage, token usage historical, queue status)
 *
 * @returns The combined methods object that implements INodeType['methods']
 */
export const allMethods = {
	Default: {
		...apiMethods.Default,
	},
} as INodeType['methods'];
