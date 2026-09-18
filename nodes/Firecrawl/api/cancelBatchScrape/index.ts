import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'cancelBatchScrape';
export const displayName = 'Cancel Batch Scrape Job';
export const action = 'Cancel batch scrape job';
export const description = 'Cancel a running batch scrape job';
export const resourceName = 'Scraping';

function createBatchIdProperty(): INodeProperties {
	return {
		displayName: 'Batch ID',
		name: 'batchId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		description: 'ID of the batch scrape job to cancel',
		routing: {
			request: {
				url: '=/batch/scrape/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [name],
			},
		},
	};
}

function createProperties(): INodeProperties[] {
	return [createBatchIdProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createProperties(),
);

options.routing = {
	request: {
		method: 'DELETE',
	},
};

export { options, properties };
