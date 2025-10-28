import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { allMethods } from './methods';
import { allProperties } from './properties';
import { tools } from './tools';
import type { Tool } from './tools';

/**
 * Firecrawl API Node implementation
 * Supports both standard node and Tool Node formats for n8n AI Agent integration
 */
export class Firecrawl implements INodeType {
	description: INodeTypeDescription & { tools?: Tool[] } = {
		displayName: 'Firecrawl',
		name: 'firecrawl',
		icon: 'file:firecrawl.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get data from Firecrawl API',
		defaults: {
			name: 'Firecrawl',
		},
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
		// Add Tool Node support for n8n AI Agent system
		tools: tools,
	};

	methods = allMethods;
}
