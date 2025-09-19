import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'getBatchScrapeErrors';
export const displayName = 'Get Batch Scrape Errors';

export const operationName = 'getBatchScrapeErrors';

/**
 * Creates the batch scrape ID property for errors
 * @returns The batch scrape ID property
 */
function createBatchScrapeIdProperty(): INodeProperties {
	return {
		displayName: 'Batch Scrape ID',
		name: 'batchScrapeId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the batch scrape job to get errors for',
		placeholder: '1234abcd-5678-efgh-9012-ijklmnopqrst',
		routing: {
			request: {
				url: '=/batch/scrape/{{$value}}/errors',
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
 * Create the properties for the getBatchScrapeErrors operation
 */
function createGetBatchScrapeErrorsProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name, 'GET'),

		// Batch Scrape ID input
		createBatchScrapeIdProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	createGetBatchScrapeErrorsProperties(),
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