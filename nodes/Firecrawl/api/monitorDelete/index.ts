import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'monitorDelete';
export const displayName = 'Delete Monitor';
export const action = 'Delete monitor';
export const description = 'Delete a monitor and stop its scheduled checks';
export const operationName = 'monitorDelete';
export const resourceName = 'Monitor';

function createMonitorIdProperty(): INodeProperties {
	return {
		displayName: 'Monitor ID',
		name: 'monitorId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the monitor to delete. Scheduled checks stop immediately.',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/monitor/{{$value}}',
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

function createMonitorDeleteProperties(): INodeProperties[] {
	return [createMonitorIdProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createMonitorDeleteProperties(),
);

options.routing = {
	request: {
		method: 'DELETE',
	},
};

export { options, properties };
