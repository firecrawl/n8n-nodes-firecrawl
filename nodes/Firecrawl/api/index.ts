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
 * Combined operation options
 */
const operationOptions: INodePropertyOptions[] = [
	searchOptions,
	mapOptions,
	scrapeOptions,
	crawlOptions,
	batchScrapeOptions,
	batchScrapeStatusOptions,
	batchScrapeErrorsOptions,
	crawlActiveOptions,
	crawlParamsPreviewOptions,
	cancelCrawlOptions,
	getCrawlErrorsOptions,
	cancelBatchScrapeOptions,
	getCrawlStatusOptions,
	extractOptions,
	getExtractStatusOptions,
	agentOptions,
	getAgentStatusOptions,
	teamTokenUsageOptions,
	teamCreditUsageOptions,
	teamTokenUsageHistoricalOptions,
	teamQueueStatusOptions,
	creditUsageHistoricalOptions,
];

/**
 * Combined properties from all operations
 */
const rawProperties: INodeProperties[] = [
	...searchProperties,
	...mapProperties,
	...scrapeProperties,
	...crawlProperties,
	...batchScrapeProperties,
	...batchScrapeStatusProperties,
	...batchScrapeErrorsProperties,
	...crawlActiveProperties,
	...crawlParamsPreviewProperties,
	...cancelCrawlProperties,
	...getCrawlErrorsProperties,
	...cancelBatchScrapeProperties,
	...getCrawlStatusProperties,
	...extractProperties,
	...getExtractStatusProperties,
	...agentProperties,
	...getAgentStatusProperties,
	...teamTokenUsageProperties,
	...teamCreditUsageProperties,
	...teamTokenUsageHistoricalProperties,
	...teamQueueStatusProperties,
	...creditUsageHistoricalProperties,
];

/**
 * Operation selector property
 */
const operationSelector: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Default'],
		},
	},
	default: 'map',
	options: operationOptions,
};

/**
 * All API properties
 */
export const apiProperties: INodeProperties[] = [operationSelector, ...rawProperties];

/**
 * All API methods
 */
export const apiMethods = {
	Default: {
		search: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		map: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		scrape: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
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
		agent: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		getAgentStatus: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		teamTokenUsage: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		creditUsageHistorical: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		cancelBatchScrape: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		teamCreditUsage: {
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
};
