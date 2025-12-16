import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'crawlActive';
export const displayName = 'List active crawls';
export const resourceName = 'Crawling';

function createProperties(): INodeProperties[] {
	return [createOperationNotice(resourceName, name, 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createProperties());

options.routing = {
	request: {
		method: 'GET',
		url: '=/crawl/active',
	},
};

export { options, properties };
