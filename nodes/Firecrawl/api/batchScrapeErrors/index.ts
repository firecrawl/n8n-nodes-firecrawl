import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'batchScrapeErrors';
export const displayName = 'Get Batch Scrape Errors';
export const action = 'Get batch scrape errors';
export const description = 'Get the errors and robots.txt blocks of a batch scrape job';
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
				url: '=/batch/scrape/{{$value}}/errors',
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
