import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

const name = 'agent';
const displayName = 'Agent - AI-powered web data extraction (faster, cheaper than Extract)';
export const operationName = 'agent';

/**
 * Creates the prompt property (required)
 * @returns The prompt property
 */
function createPromptProperty(): INodeProperties {
	return {
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		description:
			'Natural language description of the data you want to extract (max 10,000 characters). Be specific about what data you need. Examples: "Find the founders of Firecrawl", "Extract pricing information from this page", "Compare features between these products".',
		placeholder: 'e.g., Find the founders of Firecrawl and their roles',
		routing: {
			request: {
				body: {
					prompt: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

/**
 * Creates the URLs property (optional)
 * @returns The URLs property
 */
function createUrlsProperty(): INodeProperties {
	return {
		displayName: 'URLs (Optional)',
		name: 'urls',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description:
			'Optional list of URLs to focus the agent on specific pages. If not provided, the agent will autonomously search and navigate the web to find your data.',
		placeholder: 'Add URL',
		options: [
			{
				displayName: 'Items',
				name: 'items',
				values: [
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						description: 'URL to focus the agent on',
					},
				],
			},
		],
		routing: {
			request: {
				body: {
					urls: '={{$value.items && $value.items.length > 0 ? $value.items.map(item => item.url) : undefined}}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

/**
 * Creates the schema property (optional)
 * @returns The schema property
 */
function createSchemaProperty(): INodeProperties {
	return {
		displayName: 'Schema (Optional)',
		name: 'schema',
		type: 'json',
		default: '',
		description:
			'Optional JSON Schema defining the structure of extracted data. When provided, the agent will return data matching this schema. Specify property names, types (string, number, boolean, array, object), and descriptions for best results.',
		placeholder:
			'{\n  "type": "object",\n  "properties": {\n    "founders": {\n      "type": "array",\n      "items": {\n        "type": "object",\n        "properties": {\n          "name": { "type": "string" },\n          "role": { "type": "string" }\n        }\n      }\n    }\n  }\n}',
		routing: {
			request: {
				body: {
					schema: '={{ $value ? JSON.parse($value) : undefined }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

/**
 * Creates all properties for the agent operation
 * @returns Array of properties for the agent operation
 */
function createAgentProperties(): INodeProperties[] {
	return [
		createOperationNotice('Default', name, 'POST'),
		createPromptProperty(),
		createUrlsProperty(),
		createSchemaProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(name, displayName, createAgentProperties());

// Override the default routing to use the /agent endpoint
options.routing = {
	request: {
		method: 'POST',
		url: '=/agent',
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
