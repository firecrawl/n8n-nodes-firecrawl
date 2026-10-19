import {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'monitorCheckGet';
export const displayName = 'Get Monitor Check';
export const action = 'Get monitor check';
export const description = 'Get the results of a single monitor check, including per-page changes';
export const operationName = 'monitorCheckGet';
export const resourceName = 'Monitor';

const displayOptions = {
	show: {
		resource: [resourceName],
		operation: [operationName],
	},
};

function createMonitorIdProperty(): INodeProperties {
	return {
		displayName: 'Monitor ID',
		name: 'monitorId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the monitor that owns the check',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/monitor/{{$value}}/checks/{{$parameter.checkId}}',
			},
		},
		displayOptions,
	};
}

function createCheckIdProperty(): INodeProperties {
	return {
		displayName: 'Check ID',
		name: 'checkId',
		type: 'string',
		required: true,
		default: '',
		description:
			'ID of the check to retrieve. Returned by the Run Monitor Check and Get Many Monitor Checks operations.',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		displayOptions,
	};
}

function createLimitProperty(): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
		},
		displayOptions,
	};
}

function createSkipProperty(): INodeProperties {
	return {
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		description: 'Number of pages to skip, for pagination',
		routing: {
			send: {
				type: 'query',
				property: 'skip',
			},
		},
		displayOptions,
	};
}

function createStatusFilterProperty(): INodeProperties {
	return {
		displayName: 'Page Status Filter',
		name: 'statusFilter',
		type: 'options',
		default: '',
		description: 'Only return pages with this change status. Leave empty to return all pages.',
		options: [
			{
				name: 'All',
				value: '',
			},
			{
				name: 'Changed',
				value: 'changed',
			},
			{
				name: 'Error',
				value: 'error',
			},
			{
				name: 'New',
				value: 'new',
			},
			{
				name: 'Removed',
				value: 'removed',
			},
			{
				name: 'Same',
				value: 'same',
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
		displayOptions,
	};
}

function createMonitorCheckGetProperties(): INodeProperties[] {
	return [
		createMonitorIdProperty(),
		createCheckIdProperty(),
		createLimitProperty(),
		createSkipProperty(),
		createStatusFilterProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createMonitorCheckGetProperties(),
);

options.routing = {
	request: {
		method: 'GET',
	},
};

export { options, properties };
