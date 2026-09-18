import { buildApiProperties } from '../common';

export const name = 'teamQueueStatus';
export const displayName = 'Get Team Queue Status';
export const action = 'Get team queue status';
export const description = "Get metrics about your team's scrape queue";
export const resourceName = 'Account';

const { options, properties } = buildApiProperties(name, displayName, action, description);

options.routing = {
	request: {
		method: 'GET',
		url: '=/team/queue-status',
	},
};

export { options, properties };
