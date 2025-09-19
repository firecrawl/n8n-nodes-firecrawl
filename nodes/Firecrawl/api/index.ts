import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

// Import options and properties from each operation
import { options as searchOptions, properties as searchProperties } from './search';
import { options as mapOptions, properties as mapProperties } from './map';
import { options as scrapeOptions, properties as scrapeProperties } from './scrape';
import { options as batchScrapeOptions, properties as batchScrapeProperties } from './batchScrape';
import { options as crawlOptions, properties as crawlProperties } from './crawl';
import {
	options as getCrawlStatusOptions,
	properties as getCrawlStatusProperties,
} from './getCrawlStatus';
import { options as extractOptions, properties as extractProperties } from './extract';
import {
	options as getExtractStatusOptions,
	properties as getExtractStatusProperties,
} from './getExtractStatus';
import {
	options as getBatchScrapeStatusOptions,
	properties as getBatchScrapeStatusProperties,
} from './getBatchScrapeStatus';
import {
	options as getBatchScrapeErrorsOptions,
	properties as getBatchScrapeErrorsProperties,
} from './getBatchScrapeErrors';
import {
	options as cancelBatchScrapeOptions,
	properties as cancelBatchScrapeProperties,
} from './cancelBatchScrape';

/**
 * Combined operation options
 */
const operationOptions: INodePropertyOptions[] = [
	searchOptions,
	mapOptions,
	scrapeOptions,
	batchScrapeOptions,
	crawlOptions,
	getCrawlStatusOptions,
	extractOptions,
	getExtractStatusOptions,
	getBatchScrapeStatusOptions,
	getBatchScrapeErrorsOptions,
	cancelBatchScrapeOptions,
];

/**
 * Combined properties from all operations
 */
const rawProperties: INodeProperties[] = [
	...searchProperties,
	...mapProperties,
	...scrapeProperties,
	...batchScrapeProperties,
	...crawlProperties,
	...getCrawlStatusProperties,
	...extractProperties,
	...getExtractStatusProperties,
	...getBatchScrapeStatusProperties,
	...getBatchScrapeErrorsProperties,
	...cancelBatchScrapeProperties,
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
		batchScrape: {
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
		getBatchScrapeStatus: {
			execute(this: any) {
				return this.helpers.httpRequest as any;
			},
		},
		getBatchScrapeErrors: {
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
};
