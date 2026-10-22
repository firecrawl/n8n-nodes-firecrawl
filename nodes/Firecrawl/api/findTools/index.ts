import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'findTools';
export const displayName = 'Find Data Provider Tools';
export const action = 'Find data provider tools';
export const description =
	'Search the Alexandria catalogue for a data provider capability and its inputs';
export const operationName = 'findTools';
export const resourceName = 'DataProviders';

const show = { resource: [resourceName], operation: [operationName] };

function createFindToolsProperties(): INodeProperties[] {
	return [
		{
			displayName: 'Query',
			name: 'findToolsQuery',
			type: 'string',
			default: '',
			description:
				'What data you need, for example "SEC filings for a company" or "job listings at a company". Leave empty to browse categories.',
			placeholder: 'e.g. SEC filings for a company',
			displayOptions: { show },
		},
		{
			displayName: 'Additional Fields',
			name: 'findToolsOptions',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			displayOptions: { show },
			options: [
				{
					displayName: 'URLs',
					name: 'urls',
					type: 'string',
					default: '',
					description: 'Comma-separated website URLs, so providers for those sites come first',
				},
				{
					displayName: 'Providers',
					name: 'providers',
					type: 'string',
					default: '',
					description: 'Comma-separated provider IDs to narrow the search, for example sec-gov',
				},
				{
					displayName: 'Include Contracts',
					name: 'expand',
					type: 'boolean',
					default: false,
					description: 'Whether to return each tool\'s inputs, response shape and examples',
				},
				{
					displayName: 'Limit',
					name: 'limit',
					type: 'number',
					typeOptions: { minValue: 1 },
					default: 50,
					description: 'Max number of results to return',
				},
			],
		},
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createFindToolsProperties(),
);

options.routing = {
	request: {
		method: 'POST',
		url: '=/scrape',
		body: {
			alexandria:
				'={{ (() => { const extra = $parameter.findToolsOptions || {}; const list = (value) => String(value || "").split(",").map((item) => item.trim()).filter(Boolean); const options = {}; if ($parameter.findToolsQuery) options.query = $parameter.findToolsQuery; if (list(extra.urls).length) options.urls = list(extra.urls); if (list(extra.providers).length) options.providers = list(extra.providers); if (extra.expand) options.expand = ["options", "response", "examples"]; if (extra.limit) options.limit = extra.limit; return [{ provider: "firecrawl", capability: "find-tools", options }]; })() }}',
		},
	},
};

export { options, properties };
