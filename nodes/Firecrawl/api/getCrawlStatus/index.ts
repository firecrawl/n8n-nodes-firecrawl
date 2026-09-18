import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties /* createUrlProperty */ } from '../common';

// Define the operation name and display name
export const name = 'getCrawlStatus';
export const displayName = 'Get Crawl Status';
export const action = 'Get crawl status';
export const description = 'Get the status and scraped pages of a crawl job';
export const operationName = 'getCrawlStatus';
export const resourceName = 'Crawling';

/**
 * Creates the crawl ID property
 * @returns The crawl ID property
 */
function createCrawlIdProperty(): INodeProperties {
	return {
		displayName: 'Crawl ID',
		name: 'crawlId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the crawl job to get status for',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/crawl/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

/**
 * Create the properties for the getCrawlStatus operation
 */
function createGetCrawlStatusProperties(): INodeProperties[] {
	return [
		// Crawl ID input
		createCrawlIdProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createGetCrawlStatusProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'GET',
	},
	output: {
		postReceive: [
			{
				type: 'setKeyValue',
				properties: {
					data: '={{$response.body}}',
				},
			},
		],
	},
};

export { options, properties };
