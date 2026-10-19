import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'monitorList';
export const displayName = 'Get Many Monitors';
export const action = 'Get many monitors';
export const description = 'List the monitors on your team';
export const operationName = 'monitorList';
export const resourceName = 'Monitor';

function createLimitProperty(): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

function createOffsetProperty(): INodeProperties {
	return {
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		description: 'Number of monitors to skip, for pagination',
		routing: {
			send: {
				type: 'query',
				property: 'offset',
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

function createMonitorListProperties(): INodeProperties[] {
	return [createLimitProperty(), createOffsetProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createMonitorListProperties(),
);

options.routing = {
	request: {
		method: 'GET',
		url: '=/monitor',
	},
};

export { options, properties };
