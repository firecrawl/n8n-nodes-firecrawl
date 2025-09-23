import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'getCrawlErrors';
export const displayName = 'Get crawl errors';

export const operationName = 'getCrawlErrors';

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
		description: 'ID of the crawl job to get errors for',
		placeholder: '1234abcd-5678-efgh-9012-ijklmnopqrst',
		routing: {
			request: {
				url: '=/crawl/{{$value}}/errors',
			},
		},
		displayOptions: {
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

/**
 * Create the properties for the getCrawlErrors operation
 */
function createGetCrawlErrorsProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name, 'GET'),

		// Crawl ID input
		createCrawlIdProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	createGetCrawlErrorsProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'GET',
		url: '/crawl/{{$parameter.crawlId}}/errors',
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