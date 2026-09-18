import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'batchScrapeStatus';
export const displayName = 'Get Batch Scrape Status';
export const action = 'Get batch scrape status';
export const description = 'Get the status and results of a batch scrape job';
export const resourceName = 'Scraping';

function createBatchIdProperty(): INodeProperties {
	return {
		displayName: 'Batch ID',
		name: 'batchId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		description: 'ID of the batch scrape job',
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
		method: 'GET',
	},
};

export { options, properties };
