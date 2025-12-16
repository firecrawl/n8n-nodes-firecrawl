import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'teamQueueStatus';
export const displayName = 'Get team queue status';
export const resourceName = 'Account';

function createProperties(): INodeProperties[] {
	return [createOperationNotice(resourceName, name, 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createProperties());

options.routing = {
	request: {
		method: 'GET',
		url: '=/team/queue-status',
	},
};

export { options, properties };
