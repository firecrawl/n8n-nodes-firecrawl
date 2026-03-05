import {
	INodeProperties,
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'browserList';
export const displayName = 'List browser sessions';
export const operationName = 'browserList';
export const resourceName = 'Browser';

function createStatusFilterProperty(): INodeProperties {
	return {
		displayName: 'Status Filter',
		name: 'statusFilter',
		type: 'options',
		default: '',
		description:
			'Filter sessions by their current status. "Active" shows only running sessions that can still receive commands. "Destroyed" shows sessions that have been terminated or expired. Leave empty to list all sessions regardless of status.',
		options: [
			{
				name: 'All',
				value: '',
				description: 'Show all sessions regardless of status',
			},
			{
				name: 'Active',
				value: 'active',
				description: 'Only show sessions that are currently running and accepting commands',
			},
			{
				name: 'Destroyed',
				value: 'destroyed',
				description: 'Only show sessions that have been terminated or expired',
			},
		],
		routing: {
			send: {
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						const statusFilter = this.getNodeParameter('statusFilter', '') as string;
						if (statusFilter) {
							requestOptions.qs = requestOptions.qs || {};
							(requestOptions.qs as IDataObject).status = statusFilter;
						}
						return requestOptions;
					},
				],
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

function createBrowserListProperties(): INodeProperties[] {
	return [
		createOperationNotice(resourceName, name, 'GET'),
		createStatusFilterProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	createBrowserListProperties(),
);

options.routing = {
	request: {
		method: 'GET',
		url: '=/browser',
	},
};

export { options, properties };
