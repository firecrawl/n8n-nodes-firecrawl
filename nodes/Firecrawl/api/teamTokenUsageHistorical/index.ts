import { buildApiProperties } from '../common';

export const name = 'teamTokenUsageHistorical';
export const displayName = 'Get Historical Token Usage';
export const action = 'Get historical token usage';
export const description = "Get your team's Extract API token usage over past billing periods";
export const resourceName = 'Account';

const { options, properties } = buildApiProperties(name, displayName, action, description);

options.routing = {
	request: {
		method: 'GET',
		url: '=/team/token-usage/historical',
	},
};

export { options, properties };
