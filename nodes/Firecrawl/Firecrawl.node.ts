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
	};

	methods = allMethods;

	async execute(this: any) {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Handle tool resource operations
		if (resource === 'tool') {
			// Map tool operations to API endpoints and HTTP methods
			const crawlId = (this.getNodeParameter('crawlId', 0, null) as string) || '';
			const extractId = (this.getNodeParameter('extractId', 0, null) as string) || '';
			const endpointMap: Record<string, { method: string; url: string }> = {
				scrape: { method: 'POST', url: '/scrape' },
				search: { method: 'POST', url: '/search' },
				map: { method: 'POST', url: '/map' },
				crawl: { method: 'POST', url: '/crawl' },
				extract: { method: 'POST', url: '/extract' },
				batchScrape: { method: 'POST', url: '/batch/scrape' },
				getCrawlStatus: { method: 'GET', url: `/crawl/${crawlId}` },
				cancelCrawl: { method: 'DELETE', url: `/crawl/${crawlId}` },
				getExtractStatus: { method: 'GET', url: `/extract/${extractId}` },
				teamTokenUsage: { method: 'GET', url: '/team/token-usage' },
				teamCreditUsage: { method: 'GET', url: '/team/credit-usage' },
			};

			const mapping = endpointMap[operation] || endpointMap.scrape;

			// Build request body based on tool properties
			const body: any = {};
			if (this.getNodeParameter('url', 0, undefined) !== undefined) {
				body.url = this.getNodeParameter('url', 0);
			}
			if (this.getNodeParameter('query', 0, undefined) !== undefined) {
				body.query = this.getNodeParameter('query', 0);
			}
			if (this.getNodeParameter('urls', 0, undefined) !== undefined) {
				body.urls = this.getNodeParameter('urls', 0);
			}
			if (this.getNodeParameter('prompt', 0, undefined) !== undefined) {
				body.prompt = this.getNodeParameter('prompt', 0);
			}
			if (this.getNodeParameter('formats', 0, undefined) !== undefined) {
				body.formats = this.getNodeParameter('formats', 0);
			}
			if (this.getNodeParameter('limit', 0, undefined) !== undefined) {
				body.limit = this.getNodeParameter('limit', 0);
			}
			if (this.getNodeParameter('onlyMainContent', 0, undefined) !== undefined) {
				body.onlyMainContent = this.getNodeParameter('onlyMainContent', 0);
			}

			return this.helpers.httpRequest({
				method: mapping.method,
				url: mapping.url,
				// Only send body for non-GET/DELETE by default
				...(mapping.method === 'POST' || mapping.method === 'PUT'
					? { body }
					: {}),
			});
		}

		// Handle default resource operations
		const method = this.getNodeMethod(resource, operation);
		if (method && method.execute) {
			return method.execute.call(this);
		}

		throw new Error(`Unknown operation: ${operation} for resource: ${resource}`);
	}
}
