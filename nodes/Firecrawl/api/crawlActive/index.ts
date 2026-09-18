import { buildApiProperties } from '../common';

export const name = 'crawlActive';
export const displayName = 'Get Many Active Crawls';
export const action = 'Get many active crawls';
export const description = 'List all crawl jobs currently running for your team';
export const resourceName = 'Crawling';

const { options, properties } = buildApiProperties(name, displayName, action, description);

options.routing = {
	request: {
		method: 'GET',
		url: '=/crawl/active',
	},
};

export { options, properties };
