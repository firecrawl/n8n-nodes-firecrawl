import {
	INodeProperties,
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';
import {
	buildApiProperties,
	createOperationNotice,
	createScrapeOptionsProperty,
	createUrlProperty,
} from '../common';

// Define the operation name and display name
export const name = 'scrape';
export const displayName = '/scrape';
export const operationName = 'scrape';
export const resourceName = 'Scraping';

/**
 * Creates the parsers property
 * @param operationName - The name of the operation
 * @returns The parsers property
 */
function createParsersProperty(operationName: string): INodeProperties {
	return {
		displayName: 'Parsers',
		name: 'parsers',
		type: 'multiOptions',
		options: [
			{
				name: 'PDF',
				value: 'pdf',
				description: 'Extract PDF content as markdown (1 credit per page)',
			},
		],
		default: [],
		description:
			'Enable file parsers for content extraction. Select "PDF" to extract PDF content as markdown text. Leave empty to get PDFs as base64 data.',
		routing: {
			request: {
				body: {
					parsers: '={{ $value }}',
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

						// Transform parsers to the correct API format: [{ type: "pdf" }]
						if (body.parsers !== undefined) {
							let rawValue = body.parsers as unknown;

							// Flatten nested arrays (handles cases like [["pdf"]] or [[["pdf"]]])
							while (Array.isArray(rawValue) && rawValue.length === 1 && Array.isArray(rawValue[0])) {
								rawValue = rawValue[0];
							}

							// Extract string values from the input
							const extractStrings = (val: unknown): string[] => {
								if (typeof val === 'string') {
									// Try to parse as JSON first
									try {
										const parsed = JSON.parse(val);
										return extractStrings(parsed);
									} catch {
										// Not JSON, treat as single value
										return val.trim() ? [val.trim().toLowerCase()] : [];
									}
								}
								if (Array.isArray(val)) {
									return val.flatMap(extractStrings);
								}
								if (typeof val === 'object' && val !== null && 'type' in val) {
									const typeVal = (val as { type: unknown }).type;
									if (typeof typeVal === 'string') {
										return [typeVal.toLowerCase()];
									}
								}
								return [];
							};

							const parsersArray = extractStrings(rawValue);

							// Filter to valid parser types and deduplicate
							const validParsers = ['pdf'];
							const uniqueParsers = [...new Set(parsersArray)].filter((p) =>
								validParsers.includes(p),
							);

							// Remove if empty, otherwise convert to API format
							if (uniqueParsers.length === 0) {
								delete body.parsers;
							} else {
								body.parsers = uniqueParsers.map((parser) => ({ type: parser }));
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
				operation: [operationName],
			},
		},
	};
}

/**
 * Create additional fields property for custom data
 */
function createAdditionalFieldsProperty(operation: string): INodeProperties {
	return {
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Additional fields to send in the request body',
		options: [
			{
				displayName: 'Custom Properties (JSON)',
				name: 'customProperties',
				type: 'json',
				default: '{}',
				description: 'Custom JSON properties to add to the request body',
			},
		],
		routing: {
			request: {
				body: {
					additionalFields: '={{ $value }}',
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
						const additionalFields = body.additionalFields as IDataObject;

						if (additionalFields) {
							// Handle custom properties JSON
							if (additionalFields.customProperties) {
								try {
									const customProps = JSON.parse(additionalFields.customProperties as string);
									Object.assign(requestOptions.body as IDataObject, customProps);
								} catch (error) {
									// If JSON parsing fails, just skip
								}
							}

							// Remove the additionalFields wrapper
							delete body.additionalFields;
						}

						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			show: {
				operation: [operation],
				useCustomBody: [true],
			},
		},
	};
}

/**
 * Creates the profile property for persistent browser state across interact sessions
 */
function createProfileProperty(): INodeProperties {
	return {
		displayName: 'Profile',
		name: 'profile',
		type: 'fixedCollection',
		default: {},
		description:
			'Enable persistent browser state across interact sessions. Use profiles to maintain cookies, localStorage, and login state between scrapes. Sessions with the same profile name share storage. Required only when using the Interact feature with persistent state.',
		options: [
			{
				displayName: 'Profile Settings',
				name: 'settings',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
						description:
							'A unique name for the profile (1-128 characters). Scrapes with the same name share browser state. Use descriptive names like "gmail-account" or "dashboard-session".',
					},
					{
						displayName: 'Save Changes',
						name: 'saveChanges',
						type: 'boolean',
						default: true,
						description:
							'Whether to save browser state (cookies, localStorage, etc.) back to the profile when the interact session stops. Set to false to load existing profile data without writing changes. Only one saving session per profile is allowed at a time.',
					},
				],
			},
		],
		routing: {
			request: {
				body: {
					profile:
						'={{$value.settings ? { name: $value.settings.name, saveChanges: $value.settings.saveChanges } : undefined}}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

/**
 * Create the properties for the scrape operation
 */
function createScrapeProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice(resourceName, name),

		// URL input
		createUrlProperty(name, 'https://firecrawl.dev', resourceName),

		// Parsers
		createParsersProperty(operationName),

		// Scrape options
		createScrapeOptionsProperty(operationName, false, false, resourceName),

		// Profile for persistent interact sessions
		createProfileProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(name, displayName, createScrapeProperties());

// Add the additional fields property separately so it appears only when custom body is enabled
properties.push(createAdditionalFieldsProperty(name));

export { options, properties };
