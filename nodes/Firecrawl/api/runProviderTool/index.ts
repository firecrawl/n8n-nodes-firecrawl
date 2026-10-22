import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'runProviderTool';
export const displayName = 'Run Data Provider Tool';
export const action = 'Run a data provider tool';
export const description =
	'Run an Alexandria data provider capability and return its records';
export const operationName = 'runProviderTool';
export const resourceName = 'DataProviders';

const show = { resource: [resourceName], operation: [operationName] };

function createRunProviderToolProperties(): INodeProperties[] {
	return [
		{
			displayName: 'Provider',
			name: 'provider',
			type: 'string',
			required: true,
			default: '',
			description: 'The provider ID returned by Find Data Provider Tools, for example sec-gov',
			placeholder: 'e.g. sec-gov',
			displayOptions: { show },
		},
		{
			displayName: 'Capability',
			name: 'capability',
			type: 'string',
			required: true,
			default: '',
			description: 'The capability ID returned by Find Data Provider Tools, for example filings/filings',
			placeholder: 'e.g. filings/filings',
			displayOptions: { show },
		},
		{
			displayName: 'Inputs',
			name: 'providerOptions',
			type: 'json',
			default: '{}',
			description: 'The capability\'s inputs as a JSON object, following the contract Find Data Provider Tools returns',
			displayOptions: { show },
		},
		{
			displayName: 'Timeout (Ms)',
			name: 'providerTimeout',
			type: 'number',
			typeOptions: { minValue: 1000, maxValue: 120000 },
			default: 60000,
			description: 'How long the provider call may run, at most 120000',
			displayOptions: { show },
		},
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createRunProviderToolProperties(),
);

options.routing = {
	request: {
		method: 'POST',
		url: '=/scrape',
		timeout: 150000,
		body: {
			alexandria:
				'={{ [{ provider: $parameter.provider.trim(), capability: $parameter.capability.trim(), options: typeof $parameter.providerOptions === "string" ? JSON.parse($parameter.providerOptions || "{}") : $parameter.providerOptions }] }}',
			timeout: '={{ $parameter.providerTimeout }}',
		},
	},
};

export { options, properties };
