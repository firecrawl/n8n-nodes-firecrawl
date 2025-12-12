import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { allMethods } from './methods';
import { allProperties } from './properties';

/**
 * Firecrawl API Node implementation
 */
export class Firecrawl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Firecrawl',
		name: 'firecrawl',
		icon: 'file:firecrawl.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Scrape, crawl, map, search, and extract structured data from websites using Firecrawl API',
		defaults: {
			name: 'Firecrawl',
		},
		usableAsTool: true,
		inputs: `={{["main"]}}`,
		outputs: `={{["main"]}}`,
		credentials: [
			{
				name: 'firecrawlApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{ $credentials.baseUrl || "https://api.firecrawl.dev/v2" }}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: {
				integration: 'n8n',
			},
		},
		properties: allProperties,
	};

	methods = allMethods;
}
