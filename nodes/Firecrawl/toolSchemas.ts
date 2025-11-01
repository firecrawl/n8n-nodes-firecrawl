import { INodeProperties } from 'n8n-workflow';

/**
 * Tool operation properties for AI Agent compatibility
 * These provide structured schemas that AI agents can understand
 */
export const toolOperationProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tool'],
			},
		},
		options: [
			{
				name: 'Scrape',
				value: 'scrape',
				description: 'Scrape a URL and extract content in various formats',
				action: 'Scrape URL',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search the web and optionally scrape results',
				action: 'Search Web',
			},
			{
				name: 'Map',
				value: 'map',
				description: 'Map a website and discover all URLs',
				action: 'Map Website',
			},
			{
				name: 'Crawl',
				value: 'crawl',
				description: 'Crawl a website and scrape all discovered URLs',
				action: 'Crawl Website',
			},
			{
				name: 'Extract',
				value: 'extract',
				description: 'Extract structured data from URLs using AI',
				action: 'Extract Data',
			},
			{
				name: 'Batch Scrape',
				value: 'batchScrape',
				description: 'Scrape multiple URLs in a batch operation',
				action: 'Batch Scrape',
			},
			{
				name: 'Get Crawl Status',
				value: 'getCrawlStatus',
				description: 'Get the status of a crawl job',
				action: 'Get Crawl Status',
			},
			{
				name: 'Cancel Crawl',
				value: 'cancelCrawl',
				description: 'Cancel a running crawl job',
				action: 'Cancel Crawl',
			},
			{
				name: 'Get Extract Status',
				value: 'getExtractStatus',
				description: 'Get the status of an extraction job',
				action: 'Get Extract Status',
			},
			{
				name: 'Team Token Usage',
				value: 'teamTokenUsage',
				description: 'Get remaining and plan tokens for the authenticated team',
				action: 'Get Token Usage',
			},
			{
				name: 'Team Credit Usage',
				value: 'teamCreditUsage',
				description: 'Get remaining and plan credits for the authenticated team',
				action: 'Get Credit Usage',
			},
		],
		default: 'scrape',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: 'https://firecrawl.dev',
		description: 'The URL to scrape',
		routing: {
			request: {
				body: {
					url: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['scrape', 'map', 'crawl'],
			},
		},
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		description: 'The search query',
		routing: {
			request: {
				body: {
					query: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'fixedCollection',
		default: {},
		description: 'URLs to process',
		options: [
			{
				displayName: 'URLs',
				name: 'list',
				values: [
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
					},
				],
				typeOptions: {
					multipleValues: true,
				},
			},
		],
		routing: {
			request: {
				body: {
					urls: '={{$value.list ? $value.list.map(i => i.url) : []}}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['extract', 'batchScrape'],
			},
		},
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		required: true,
		default: '',
		description: 'Natural language prompt describing what to extract',
		routing: {
			request: {
				body: {
					prompt: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['extract'],
			},
		},
	},
	{
		displayName: 'Crawl ID',
		name: 'crawlId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the crawl job',
		routing: {
			request: {
				url: '=/crawl/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['getCrawlStatus', 'cancelCrawl'],
			},
		},
	},
	{
		displayName: 'Extract ID',
		name: 'extractId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the extraction job',
		routing: {
			request: {
				url: '=/extract/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['getExtractStatus'],
			},
		},
	},
	{
		displayName: 'Formats',
		name: 'formats',
		type: 'multiOptions',
		options: [
			{ name: 'Markdown', value: 'markdown' },
			{ name: 'HTML', value: 'html' },
			{ name: 'Raw HTML', value: 'rawHtml' },
			{ name: 'Links', value: 'links' },
			{ name: 'Screenshot', value: 'screenshot' },
			{ name: 'Summary', value: 'summary' },
			{ name: 'JSON', value: 'json' },
		],
		default: ['markdown'],
		description: 'Output formats to extract',
		routing: {
			request: {
				body: {
					formats: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['scrape', 'batchScrape'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 5,
		description: 'Maximum number of results to return',
		routing: {
			request: {
				body: {
					limit: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['search', 'map', 'crawl'],
			},
		},
	},
	{
		displayName: 'Only Main Content',
		name: 'onlyMainContent',
		type: 'boolean',
		default: true,
		description: 'Whether to only return the main content excluding headers, navs, footers',
		routing: {
			request: {
				body: {
					onlyMainContent: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['tool'],
				operation: ['scrape', 'batchScrape'],
			},
		},
	},
];
