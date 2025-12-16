import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'teamTokenUsage';
export const displayName = 'Get team token usage';
export const resourceName = 'Account';

function createProperties(): INodeProperties[] {
	return [createOperationNotice(resourceName, name, 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createProperties());

options.routing = {
	request: {
		method: 'GET',
		url: '=/team/token-usage',
	},
};

export { options, properties };
