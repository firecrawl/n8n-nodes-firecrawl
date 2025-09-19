import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'cancelCrawl';
export const displayName = 'Cancel Crawl';

export const operationName = 'cancelCrawl';

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
		description: 'ID of the crawl job to cancel',
		placeholder: '1234abcd-5678-efgh-9012-ijklmnopqrst',
		routing: {
			request: {
				url: '=/crawl/{{$value}}',
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
 * Create the properties for the cancelCrawl operation
 */
function createCancelCrawlProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name, 'DELETE'),

		// Crawl ID input
		createCrawlIdProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	createCancelCrawlProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'DELETE',
	},
};

export { options, properties };
