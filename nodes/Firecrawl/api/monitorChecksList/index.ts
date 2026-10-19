import {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'monitorChecksList';
export const displayName = 'Get Many Monitor Checks';
export const action = 'Get many monitor checks';
export const description = 'List the check history of a monitor';
export const operationName = 'monitorChecksList';
export const resourceName = 'Monitor';

function createMonitorIdProperty(): INodeProperties {
	return {
		displayName: 'Monitor ID',
		name: 'monitorId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the monitor that owns the checks',
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/monitor/{{$value}}/checks',
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
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

function createOffsetProperty(): INodeProperties {
	return {
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		description: 'Number of checks to skip, for pagination',
		routing: {
			send: {
				type: 'query',
				property: 'offset',
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

function createStatusFilterProperty(): INodeProperties {
	return {
		displayName: 'Status Filter',
		name: 'statusFilter',
		type: 'options',
		default: '',
		description: 'Only return checks with this status. Leave empty to return all checks.',
		options: [
			{
				name: 'All',
				value: '',
			},
			{
				name: 'Completed',
				value: 'completed',
			},
			{
				name: 'Failed',
				value: 'failed',
			},
			{
				name: 'Partial',
				value: 'partial',
			},
			{
				name: 'Queued',
				value: 'queued',
			},
			{
				name: 'Running',
				value: 'running',
			},
			{
				name: 'Skipped (No Credits)',
				value: 'skipped_no_credits',
			},
			{
				name: 'Skipped (Overlap)',
				value: 'skipped_overlap',
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

function createMonitorChecksListProperties(): INodeProperties[] {
	return [
		createMonitorIdProperty(),
		createLimitProperty(),
		createOffsetProperty(),
		createStatusFilterProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createMonitorChecksListProperties(),
);

options.routing = {
	request: {
		method: 'GET',
	},
};

export { options, properties };
