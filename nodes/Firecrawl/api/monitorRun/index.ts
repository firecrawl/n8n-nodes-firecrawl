import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'monitorRun';
export const displayName = 'Run Monitor Check';
export const action = 'Run monitor check';
export const description = 'Trigger a monitor check now instead of waiting for the schedule';
export const operationName = 'monitorRun';
export const resourceName = 'Monitor';

function createMonitorIdProperty(): INodeProperties {
	return {
		displayName: 'Monitor ID',
		name: 'monitorId',
		type: 'string',
		required: true,
		default: '',
		description:
			'ID of the monitor to check now. Fails if the monitor is paused or a check is already running. Use Get Monitor Check with the returned check ID to read the results.',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/monitor/{{$value}}/run',
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

function createMonitorRunProperties(): INodeProperties[] {
	return [createMonitorIdProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createMonitorRunProperties(),
);

options.routing = {
	request: {
		method: 'POST',
	},
};

export { options, properties };
