import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'getCreditUsage';
export const displayName = 'Get Credit Usage';

export const operationName = 'getCreditUsage';

/**
 * Create the properties for the getCreditUsage operation
 */
function createGetCreditUsageProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name, 'GET'),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	createGetCreditUsageProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'GET',
		url: '/team/credit-usage',
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
