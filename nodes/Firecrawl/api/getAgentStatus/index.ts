import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

const name = 'getAgentStatus';
const displayName = 'Get Agent Status';
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
		placeholder: '1234abcd-5678-efgh-9012-ijklmnopqrst',
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
	return [createOperationNotice(resourceName, name, 'GET'), createAgentIdProperty()];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
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
				type: 'rootProperty',
				properties: {
					property: 'body',
				},
			},
		],
	},
};

export { options, properties };
