import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'cancelBatchScrape';
export const displayName = 'Cancel Batch Scrape';

export const operationName = 'cancelBatchScrape';

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
		description: 'ID of the batch scrape job to cancel',
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
 * Create the properties for the cancelBatchScrape operation
 */
function createCancelBatchScrapeProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name, 'DELETE'),

		// Batch Scrape ID input
		createBatchScrapeIdProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	createCancelBatchScrapeProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'DELETE',
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