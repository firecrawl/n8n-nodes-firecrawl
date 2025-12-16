import {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
	INodeExecutionData,
	IN8nHttpFullResponse,
	sleep,
} from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

const name = 'agent';
const displayName = 'Agent - AI-powered web data extraction (waits for completion)';
export const operationName = 'agent';
export const resourceName = 'Agent';

// Default polling configuration
const DEFAULT_POLL_INTERVAL_MS = 2000; // 2 seconds
const DEFAULT_MAX_WAIT_TIME_SECONDS = 300; // 5 minutes

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
				resource: [resourceName],
				operation: ['agent'],
			},
		},
	};
}

/**
 * Creates the specify URLs toggle property
 * @returns The specify URLs toggle property
 */
function createSpecifyUrlsProperty(): INodeProperties {
	return {
		displayName: 'Specify URLs',
		name: 'specifyUrls',
		type: 'boolean',
		default: false,
		description:
			'Whether to specify URLs for the agent to focus on. If disabled, the agent will autonomously search and navigate the web to find your data.',
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: [resourceName],
				operation: ['agent'],
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
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		description:
			'URLs to focus the agent on specific pages. Accepts multiple formats: a single URL, multiple URLs separated by commas or newlines, or a JSON array like ["url1", "url2"].',
		placeholder: 'https://example.com/page1\nhttps://example.com/page2',
		routing: {
			request: {
				body: {
					urls: '={{ $value }}',
				},
			},
			send: {
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						if (typeof requestOptions.body !== 'object' || !requestOptions.body) {
							return requestOptions;
						}

						const body = requestOptions.body as IDataObject;

						if (body.urls !== undefined) {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							let rawValue: any = body.urls;

							// If empty string or null/undefined, remove urls from body
							if (!rawValue || (typeof rawValue === 'string' && !rawValue.trim())) {
								delete body.urls;
								return requestOptions;
							}

							// Helper to extract URLs from any input format
							const extractUrls = (val: unknown): string[] => {
								// Already an array - flatten and extract strings
								if (Array.isArray(val)) {
									return val.flatMap(extractUrls);
								}

								// String input - try various parsing strategies
								if (typeof val === 'string') {
									const trimmed = val.trim();
									if (!trimmed) return [];

									// Try parsing as JSON array first
									if (trimmed.startsWith('[')) {
										try {
											const parsed = JSON.parse(trimmed);
											return extractUrls(parsed);
										} catch {
											// Not valid JSON, continue with other methods
										}
									}

									// Check for newlines (most common for pasted lists)
									if (trimmed.includes('\n')) {
										return trimmed
											.split('\n')
											.map((u) => u.trim())
											.filter((u) => u && u.startsWith('http'));
									}

									// Check for comma separation
									if (trimmed.includes(',')) {
										return trimmed
											.split(',')
											.map((u) => u.trim())
											.filter((u) => u && u.startsWith('http'));
									}

									// Check for space separation (multiple URLs)
									if (trimmed.includes(' http')) {
										return trimmed
											.split(/\s+/)
											.map((u) => u.trim())
											.filter((u) => u && u.startsWith('http'));
									}

									// Single URL
									if (trimmed.startsWith('http')) {
										return [trimmed];
									}

									return [];
								}

								// Object with url property
								if (typeof val === 'object' && val !== null && 'url' in val) {
									const urlVal = (val as { url: unknown }).url;
									if (typeof urlVal === 'string') {
										return [urlVal];
									}
								}

								return [];
							};

							const urlsArray = extractUrls(rawValue);

							// Remove duplicates and empty values
							const uniqueUrls = [...new Set(urlsArray)].filter(Boolean);

							// If no valid URLs found, remove urls from body (it's optional)
							if (uniqueUrls.length === 0) {
								delete body.urls;
							} else {
								body.urls = uniqueUrls;
							}
						}

						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: [resourceName],
				operation: ['agent'],
				specifyUrls: [true],
			},
		},
	};
}

/**
 * Creates the schema type selector property
 * @returns The schema type property
 */
function createSchemaTypeProperty(): INodeProperties {
	return {
		displayName: 'Schema Type',
		name: 'schemaType',
		type: 'options',
		default: 'none',
		description: 'Optionally define a schema for the extracted data structure',
		options: [
			{
				name: 'None',
				value: 'none',
				description: 'No schema - let the agent determine the output structure',
			},
			{
				name: 'Generate From JSON Example',
				value: 'fromExample',
				description: 'Generate a schema from an example JSON object',
			},
			{
				name: 'Define using JSON Schema',
				value: 'manual',
				description: 'Define the JSON schema manually',
			},
		],
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: [resourceName],
				operation: ['agent'],
			},
		},
	};
}

/**
 * Creates the JSON example property for schema generation
 * @returns The JSON example property
 */
function createJsonExampleProperty(): INodeProperties {
	return {
		displayName: 'JSON Example',
		name: 'jsonExample',
		type: 'json',
		default: '{\n  "founders": [\n    {\n      "name": "John Doe",\n      "role": "CEO"\n    }\n  ]\n}',
		description:
			'Provide an example of the JSON structure you want to extract. The schema will be automatically generated from this example.',
		routing: {
			request: {
				body: {
					jsonExample: '={{ $value }}',
				},
			},
			send: {
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						if (typeof requestOptions.body !== 'object' || !requestOptions.body) {
							return requestOptions;
						}

						const body = requestOptions.body as IDataObject;

						// Convert JSON example to schema
						if (body.jsonExample !== undefined) {
							try {
								let example: unknown;
								if (typeof body.jsonExample === 'string') {
									const trimmed = (body.jsonExample as string).trim();
									if (!trimmed) {
										delete body.jsonExample;
										return requestOptions;
									}
									example = JSON.parse(trimmed);
								} else {
									example = body.jsonExample;
								}

								// Convert the example to a JSON Schema
								const convertToSchema = (value: unknown): Record<string, unknown> => {
									if (value === null) {
										return { type: 'null' };
									}

									if (Array.isArray(value)) {
										if (value.length === 0) {
											return { type: 'array', items: {} };
										}
										return {
											type: 'array',
											items: convertToSchema(value[0]),
										};
									}

									switch (typeof value) {
										case 'string':
											return { type: 'string' };
										case 'number':
											return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
										case 'boolean':
											return { type: 'boolean' };
										case 'object': {
											const properties: Record<string, unknown> = {};
											for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
												properties[key] = convertToSchema(val);
											}
											return {
												type: 'object',
												properties,
											};
										}
										default:
											return {};
									}
								};

								body.schema = convertToSchema(example);
								delete body.jsonExample;
							} catch (error) {
								throw new Error('Invalid JSON example. Please provide valid JSON.');
							}
						}

						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: [resourceName],
				operation: ['agent'],
				schemaType: ['fromExample'],
			},
		},
	};
}

/**
 * Creates the schema property for manual JSON Schema definition
 * @returns The schema property
 */
function createSchemaProperty(): INodeProperties {
	return {
		displayName: 'Schema',
		name: 'schema',
		type: 'json',
		default: '{\n  "type": "object",\n  "properties": {\n    "founders": {\n      "type": "array",\n      "items": {\n        "type": "object",\n        "properties": {\n          "name": { "type": "string" },\n          "role": { "type": "string" }\n        }\n      }\n    }\n  }\n}',
		description:
			'JSON Schema defining the structure of extracted data. Use JSON Schema format with type definitions. $refs syntax is currently not supported.',
		routing: {
			request: {
				body: {
					schema: '={{ JSON.parse($value) }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: [resourceName],
				operation: ['agent'],
				schemaType: ['manual'],
			},
		},
	};
}

/**
 * Creates the max wait time property
 * @returns The max wait time property
 */
function createMaxWaitTimeProperty(): INodeProperties {
	return {
		displayName: 'Max Wait Time',
		name: 'maxWaitTime',
		type: 'number',
		default: DEFAULT_MAX_WAIT_TIME_SECONDS,
		description: 'Maximum time in seconds to wait for the agent to complete. If exceeded, the job ID will be returned so you can check status manually.',
		typeOptions: {
			minValue: 2,
			maxValue: 600,
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: [resourceName],
				operation: ['agent'],
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
		createOperationNotice(resourceName, name, 'POST'),
		createPromptProperty(),
		createSpecifyUrlsProperty(),
		createUrlsProperty(),
		createSchemaTypeProperty(),
		createJsonExampleProperty(),
		createSchemaProperty(),
		createMaxWaitTimeProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(name, displayName, createAgentProperties());

// Override the default routing to use the /agent endpoint with polling
options.routing = {
	request: {
		method: 'POST',
		url: '=/agent',
	},
	output: {
		postReceive: [
			async function (
				this: IExecuteSingleFunctions,
				items: INodeExecutionData[],
				response: IN8nHttpFullResponse,
			): Promise<INodeExecutionData[]> {
				const responseBody = response.body as IDataObject;

				// Check if we got a job ID (async response)
				if (!responseBody.id) {
					// Already completed or error, return as-is
					return items.map(() => ({
						json: responseBody,
					}));
				}

				const jobId = responseBody.id as string;
				const credentials = await this.getCredentials('firecrawlApi');
				const baseUrl = (credentials.baseUrl as string) || 'https://api.firecrawl.dev/v2';
				const apiKey = credentials.apiKey as string;

				// Get max wait time from node parameter (in seconds), convert to ms
				const maxWaitTimeSeconds = this.getNodeParameter('maxWaitTime', DEFAULT_MAX_WAIT_TIME_SECONDS) as number;
				const maxWaitTimeMs = maxWaitTimeSeconds * 1000;

				// Poll until completion
				// Initial POST response may not include status, so default to 'processing'
				const startTime = Date.now();
				let status = (responseBody.status as string) || 'processing';

				while (status === 'processing' || status === 'pending') {
					// Check for timeout
					if (Date.now() - startTime > maxWaitTimeMs) {
						throw new Error(
							`Agent job timed out after ${maxWaitTimeSeconds} seconds. Job ID: ${jobId}. You can check the status manually using the "Get Agent Status" operation.`,
						);
					}

					// Wait before polling
					await sleep(DEFAULT_POLL_INTERVAL_MS);

					// Poll the status endpoint
					const statusResponse = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/agent/${jobId}`,
						headers: {
							Authorization: `Bearer ${apiKey}`,
							Accept: 'application/json',
						},
						json: true,
					});

					status = statusResponse.status as string;

					// If completed or failed, return the result
					if (status === 'completed' || status === 'failed') {
						return [
							{
								json: statusResponse as IDataObject,
							},
						];
					}
				}

				// Return whatever we have (should not reach here normally)
				return [
					{
						json: responseBody,
					},
				];
			},
		],
	},
};

export { options, properties };
