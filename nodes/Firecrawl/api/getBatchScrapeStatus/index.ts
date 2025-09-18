import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'getBatchScrapeStatus';
export const displayName = 'Get Batch Scrape Status';

export const operationName = 'getBatchScrapeStatus';

/**
 * Creates the batch scrape ID property
 * @returns The batch scrape ID property
 */
function createBatchScrapeIdProperty(): INodeProperties {
	return {
		displayName: 'Batch Scrape ID',
		name: 'batchScrapeId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the batch scrape job to get status for',
		placeholder: '1234abcd-5678-efgh-9012-ijklmnopqrst',
		routing: {
			request: {
				url: '=/batch/scrape/{{$value}}',
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
 * Create the properties for the getBatchScrapeStatus operation
 */
function createGetBatchScrapeStatusProperties(): INodeProperties[] {
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
	createGetBatchScrapeStatusProperties(),
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
