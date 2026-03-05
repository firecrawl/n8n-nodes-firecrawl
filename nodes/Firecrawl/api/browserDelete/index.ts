import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'browserDelete';
export const displayName = 'Delete browser session';
export const operationName = 'browserDelete';
export const resourceName = 'Browser';

function createSessionIdProperty(): INodeProperties {
	return {
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		default: '',
		description:
			'The unique identifier of the browser session to destroy. This immediately terminates the session and releases all associated resources. Obtain the session ID from the "Create browser session" or "List browser sessions" operations. The session must exist (active or not yet cleaned up).',
		placeholder: '550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/browser/{{$value}}',
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

function createBrowserDeleteProperties(): INodeProperties[] {
	return [
		createOperationNotice(resourceName, name, 'DELETE'),
		createSessionIdProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	createBrowserDeleteProperties(),
);

options.routing = {
	request: {
		method: 'DELETE',
	},
};

export { options, properties };
