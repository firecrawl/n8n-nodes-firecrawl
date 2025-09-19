import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'getTokenUsage';
export const displayName = 'Get Token Usage';

export const operationName = 'getTokenUsage';

/**
 * Create the properties for the getTokenUsage operation
 */
function createGetTokenUsageProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name, 'GET'),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	createGetTokenUsageProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'GET',
		url: '/team/token-usage',
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
