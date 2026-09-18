import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

const name = 'getExtractStatus';
const displayName = 'Get Extract Status';
const action = 'Get extract status';
const description = 'Get the status and results of an extract job';
export const operationName = 'getExtractStatus';
export const resourceName = 'Extract';

/**
 * Creates the extract ID property
 * @returns The extract ID property
 */
function createExtractIdProperty(): INodeProperties {
	return {
		displayName: 'Extract ID',
		name: 'extractId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the extract job to get status for',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/extract/{{$value}}',
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
 * Creates all properties for the get extract status operation
 * @returns Array of properties for the get extract status operation
 */
function createGetExtractStatusProperties(): INodeProperties[] {
	return [createExtractIdProperty()];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createGetExtractStatusProperties(),
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
