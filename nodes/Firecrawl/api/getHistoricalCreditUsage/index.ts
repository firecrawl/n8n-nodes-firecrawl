import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'getHistoricalCreditUsage';
export const displayName = 'Get Historical Credit Usage';

export const operationName = 'getHistoricalCreditUsage';

/**
 * Creates the byApiKey property
 * @returns The byApiKey property
 */
function createByApiKeyProperty(): INodeProperties {
	return {
		displayName: 'By API Key',
		name: 'byApiKey',
		type: 'boolean',
		default: false,
		description: 'Whether to get historical credit usage by API key',
		routing: {
			request: {
				qs: {
					byApiKey: '={{$value}}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

/**
 * Create the properties for the getHistoricalCreditUsage operation
 */
function createGetHistoricalCreditUsageProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name, 'GET'),

		// byApiKey property
		createByApiKeyProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	createGetHistoricalCreditUsageProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'GET',
		url: '/team/credit-usage/historical',
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
