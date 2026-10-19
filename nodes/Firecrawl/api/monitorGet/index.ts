import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'monitorGet';
export const displayName = 'Get Monitor';
export const action = 'Get monitor';
export const description = 'Get the configuration and latest check summary of a monitor';
export const operationName = 'monitorGet';
export const resourceName = 'Monitor';

function createMonitorIdProperty(): INodeProperties {
	return {
		displayName: 'Monitor ID',
		name: 'monitorId',
		type: 'string',
		required: true,
		default: '',
		description:
			'ID of the monitor to retrieve. Returned by the Create Monitor and Get Many Monitors operations.',
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

function createMonitorGetProperties(): INodeProperties[] {
	return [createMonitorIdProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createMonitorGetProperties(),
);

options.routing = {
	request: {
		method: 'GET',
	},
};

export { options, properties };
