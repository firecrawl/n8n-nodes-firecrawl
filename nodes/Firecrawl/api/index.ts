import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

// Import options and properties from each operation
import { options as searchOptions, properties as searchProperties } from './search';
import { options as mapOptions, properties as mapProperties } from './map';
import { options as scrapeOptions, properties as scrapeProperties } from './scrape';
import { options as crawlOptions, properties as crawlProperties } from './crawl';
import { options as batchScrapeOptions, properties as batchScrapeProperties } from './batchScrape';
import {
	options as batchScrapeStatusOptions,
	properties as batchScrapeStatusProperties,
} from './batchScrapeStatus';
import {
	options as batchScrapeErrorsOptions,
	properties as batchScrapeErrorsProperties,
} from './batchScrapeErrors';
import { options as crawlActiveOptions, properties as crawlActiveProperties } from './crawlActive';
import {
	options as crawlParamsPreviewOptions,
	properties as crawlParamsPreviewProperties,
} from './crawlParamsPreview';
import { options as cancelCrawlOptions, properties as cancelCrawlProperties } from './cancelCrawl';
import {
	options as getCrawlErrorsOptions,
	properties as getCrawlErrorsProperties,
} from './getCrawlErrors';
import {
	options as getCrawlStatusOptions,
	properties as getCrawlStatusProperties,
} from './getCrawlStatus';
import { options as extractOptions, properties as extractProperties } from './extract';
import {
	options as getExtractStatusOptions,
	properties as getExtractStatusProperties,
} from './getExtractStatus';
import { options as agentOptions, properties as agentProperties } from './agent';
import { options as agentAsyncOptions, properties as agentAsyncProperties } from './agentAsync';
import {
	options as getAgentStatusOptions,
	properties as getAgentStatusProperties,
} from './getAgentStatus';
import {
	options as teamTokenUsageOptions,
	properties as teamTokenUsageProperties,
} from './teamTokenUsage';
import {
	options as creditUsageHistoricalOptions,
	properties as creditUsageHistoricalProperties,
} from './creditUsageHistorical';
import {
	options as cancelBatchScrapeOptions,
	properties as cancelBatchScrapeProperties,
} from './cancelBatchScrape';
import {
	options as teamCreditUsageOptions,
	properties as teamCreditUsageProperties,
} from './teamCreditUsage';
import {
	options as teamTokenUsageHistoricalOptions,
	properties as teamTokenUsageHistoricalProperties,
} from './teamTokenUsageHistorical';
import {
	options as teamQueueStatusOptions,
	properties as teamQueueStatusProperties,
} from './teamQueueStatus';

/**
 * Operation options organized by resource
 */
const scrapingOperationOptions: INodePropertyOptions[] = [
	scrapeOptions,
	batchScrapeOptions,
	batchScrapeStatusOptions,
	batchScrapeErrorsOptions,
	cancelBatchScrapeOptions,
];

const crawlingOperationOptions: INodePropertyOptions[] = [
	crawlOptions,
	getCrawlStatusOptions,
	cancelCrawlOptions,
	getCrawlErrorsOptions,
	crawlActiveOptions,
	crawlParamsPreviewOptions,
];

const agentOperationOptions: INodePropertyOptions[] = [
	agentOptions,
	agentAsyncOptions,
	getAgentStatusOptions,
];

const mapSearchOperationOptions: INodePropertyOptions[] = [
	mapOptions,
	searchOptions,
];

const accountOperationOptions: INodePropertyOptions[] = [
	teamCreditUsageOptions,
	creditUsageHistoricalOptions,
	teamTokenUsageOptions,
	teamTokenUsageHistoricalOptions,
	teamQueueStatusOptions,
];

const extractOperationOptions: INodePropertyOptions[] = [
	extractOptions,
	getExtractStatusOptions,
];

/**
 * Operation selectors for each resource
 */
const scrapingOperationSelector: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Scraping'],
		},
	},
	default: 'scrape',
	options: scrapingOperationOptions,
};

const crawlingOperationSelector: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Crawling'],
		},
	},
	default: 'crawl',
	options: crawlingOperationOptions,
};

const agentOperationSelector: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Agent'],
		},
	},
	default: 'agent',
	options: agentOperationOptions,
};

const mapSearchOperationSelector: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['MapSearch'],
		},
	},
	default: 'map',
	options: mapSearchOperationOptions,
};

const accountOperationSelector: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Account'],
		},
	},
	default: 'teamCreditUsage',
	options: accountOperationOptions,
};

const extractOperationSelector: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Extract'],
		},
	},
	default: 'extract',
	options: extractOperationOptions,
};

/**
 * Combined properties from all operations
 */
const rawProperties: INodeProperties[] = [
	// Scraping operations
	...scrapeProperties,
	...batchScrapeProperties,
	...batchScrapeStatusProperties,
	...batchScrapeErrorsProperties,
	...cancelBatchScrapeProperties,
	// Crawling operations
	...crawlProperties,
	...getCrawlStatusProperties,
	...cancelCrawlProperties,
	...getCrawlErrorsProperties,
	...crawlActiveProperties,
	...crawlParamsPreviewProperties,
	// Agent operations
	...agentProperties,
	...agentAsyncProperties,
	...getAgentStatusProperties,
	// Map & Search operations
	...mapProperties,
	...searchProperties,
	// Account operations
	...teamCreditUsageProperties,
	...creditUsageHistoricalProperties,
	...teamTokenUsageProperties,
	...teamTokenUsageHistoricalProperties,
	...teamQueueStatusProperties,
	// Extract operations (Legacy)
	...extractProperties,
	...getExtractStatusProperties,
];

/**
 * All API properties with operation selectors for each resource
 */
export const apiProperties: INodeProperties[] = [
	scrapingOperationSelector,
	crawlingOperationSelector,
	agentOperationSelector,
	mapSearchOperationSelector,
	accountOperationSelector,
	extractOperationSelector,
	...rawProperties,
];

/**
 * All API methods
 */
export const apiMethods = {
	Scraping: {
		scrape: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		batchScrape: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		batchScrapeStatus: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		batchScrapeErrors: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		cancelBatchScrape: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
	},
	Crawling: {
		crawl: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		getCrawlStatus: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		cancelCrawl: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		getCrawlErrors: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		crawlActive: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		crawlParamsPreview: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
	},
	Agent: {
		agent: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		agentAsync: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		getAgentStatus: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
	},
	MapSearch: {
		map: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		search: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
	},
	Account: {
		teamCreditUsage: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		creditUsageHistorical: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		teamTokenUsage: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		teamTokenUsageHistorical: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		teamQueueStatus: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
	},
	Extract: {
		extract: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		getExtractStatus: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
	},
};
