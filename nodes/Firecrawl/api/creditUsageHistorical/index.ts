import { buildApiProperties } from '../common';

export const name = 'creditUsageHistorical';
export const displayName = 'Get Historical Credit Usage';
export const action = 'Get historical credit usage';
export const description = "Get your team's credit usage over past billing periods";
export const resourceName = 'Account';

const { options, properties } = buildApiProperties(name, displayName, action, description);

options.routing = {
	request: {
		method: 'GET',
		url: '=/team/credit-usage/historical',
	},
};

export { options, properties };
