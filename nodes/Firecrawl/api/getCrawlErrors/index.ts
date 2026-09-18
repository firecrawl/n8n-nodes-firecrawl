import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'getCrawlErrors';
export const displayName = 'Get Crawl Errors';
export const action = 'Get crawl errors';
export const description = 'Get crawl errors and URLs blocked by robots.txt';
export const resourceName = 'Crawling';

function createCrawlIdProperty(): INodeProperties {
	return {
		displayName: 'Crawl ID',
		name: 'crawlId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		description: 'ID of the crawl job',
		routing: {
			request: {
				url: '=/crawl/{{$value}}/errors',
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
	return [createCrawlIdProperty()];
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
