import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

const name = 'getAgentStatus';
const displayName = 'Get Agent Status';
const action = 'Get agent status';
const description = 'Get the status and results of an agent job';
export const operationName = 'getAgentStatus';
export const resourceName = 'Agent';

/**
 * Creates the agent job ID property
 * @returns The agent job ID property
 */
function createAgentIdProperty(): INodeProperties {
	return {
		displayName: 'Agent Job ID',
		name: 'agentId',
		type: 'string',
		required: true,
		default: '',
		description:
			'ID of the agent job to get status for. Returns status (processing, completed, failed), extracted data, credits used, and expiration time. Job results are available for 24 hours after completion.',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/agent/{{$value}}',
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

/**
 * Creates all properties for the get agent status operation
 * @returns Array of properties for the get agent status operation
 */
function createGetAgentStatusProperties(): INodeProperties[] {
	return [createAgentIdProperty()];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createGetAgentStatusProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'GET',
	},
	output: {
		postReceive: [
			{
				type: 'setKeyValue',
				properties: {
					data: '={{$response.body}}',
				},
			},
		],
	},
};

export { options, properties };
