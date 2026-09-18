import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'cancelCrawl';
export const displayName = 'Cancel Crawl Job';
export const action = 'Cancel a crawl job';
export const description = 'Cancel a running crawl job';
export const resourceName = 'Crawling';

function createCrawlIdProperty(): INodeProperties {
	return {
		displayName: 'Crawl ID',
		name: 'crawlId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		description: 'ID of the crawl job to cancel',
		routing: {
			request: {
				url: '=/crawl/{{$value}}',
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
		method: 'DELETE',
	},
};

export { options, properties };
