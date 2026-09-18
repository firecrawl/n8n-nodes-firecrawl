import {
	INodeProperties,
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { buildApiProperties, createScrapeOptionsProperty, createUrlProperty } from '../common';

// Define the operation name and display name
export const name = 'crawl';
export const displayName = 'Crawl Website';
export const action = 'Crawl website';
export const description = 'Crawl a website and scrape pages based on defined options';
export const operationName = 'crawl';
export const resourceName = 'Crawling';

/**
 * Creates the exclude paths property
 * @param operationName - The name of the operation
 * @param omitDisplayOptions - Whether to omit the display options
 * @returns The exclude paths property
 */
function createExcludePathsProperty(
	operationName: string,
	omitDisplayOptions: boolean = false,
): INodeProperties {
	return {
		displayName: 'Exclude Paths',
		name: 'excludePaths',
		type: 'fixedCollection',
		default: [],
		typeOptions: {
			multipleValues: true,
		},
		description:
			'URL path patterns to skip during crawling. Use glob patterns like "blog/*" to exclude sections. Useful for avoiding large archives, user-generated content, or irrelevant pages.',
		placeholder: 'Add path pattern to exclude',
		options: [
			{
				displayName: 'Items',
				name: 'items',
				values: [
					{
						displayName: 'Path',
						name: 'path',
						type: 'string',
						default: '',
						placeholder: 'e.g. blog/*',
						description:
							'Path pattern to exclude (e.g., blog/* will exclude paths like /blog/article-1)',
					},
				],
			},
		],
		routing: {
			request: {
				body: {
					excludePaths: '={{$value.items.map(item => item.path)}}',
				},
			},
		},
		displayOptions: omitDisplayOptions
			? undefined
			: {
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
 * Creates the include paths property
 * @param operationName - The name of the operation
 * @param omitDisplayOptions - Whether to omit the display options
 * @returns The include paths property
 */
function createIncludePathsProperty(
	operationName: string,
	omitDisplayOptions: boolean = false,
): INodeProperties {
	return {
		displayName: 'Include Paths',
		name: 'includePaths',
		type: 'fixedCollection',
		default: [],
		typeOptions: {
			multipleValues: true,
		},
		description:
			'URL path patterns to include in the crawl. Only pages matching these patterns will be scraped. Use glob patterns like "docs/*" to focus on specific sections.',
		placeholder: 'Add path pattern to include',
		options: [
			{
				displayName: 'Items',
				name: 'items',
				values: [
					{
						displayName: 'Path',
						name: 'path',
						type: 'string',
						default: '',
						placeholder: 'e.g. blog/*',
						description:
							'Path pattern to include (e.g., blog/* will only include paths like /blog/article-1)',
					},
				],
			},
		],
		routing: {
			request: {
				body: {
					includePaths: '={{$value.items.map(item => item.path)}}',
				},
			},
		},
		displayOptions: omitDisplayOptions
			? undefined
			: {
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
 * Creates the limit property
 * @param operationName - The name of the operation
 * @returns The limit property
 */
function createLimitProperty(operationName: string): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		routing: {
			request: {
				body: {
					limit: '={{ $value }}',
				},
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
 * Creates the delay property
 * @param operationName - The name of the operation
 * @returns The delay property
 */
function createDelayProperty(operationName: string): INodeProperties {
	return {
		displayName: 'Delay',
		name: 'delay',
		type: 'number',
		typeOptions: {
			minValue: 0,
		},
		default: 0,
		description:
			'Wait time in milliseconds between scraping each page. Use to be polite to servers or avoid rate limiting. 0 means no delay between requests.',
		routing: {
			request: {
				body: {
					delay: '={{ $value }}',
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

						// Remove delay parameter if it's 0
						if (body.delay === 0) {
							delete body.delay;
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
 * Creates the maxConcurrency property
 * @param operationName - The name of the operation
 * @returns The maxConcurrency property
 */
function createMaxConcurrencyProperty(operationName: string): INodeProperties {
	return {
		displayName: 'Max Concurrency',
		name: 'maxConcurrency',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		// IMPORTANT: We don't support 100 concurrent scrapes, but we're setting a high default to avoid issues
		default: 100,
		description:
			'Maximum number of pages to scrape simultaneously. Higher values complete faster but may trigger rate limits on target sites. Use your team\'s plan limit by default.',
		routing: {
			request: {
				body: {
					maxConcurrency: '={{ $value }}',
				},
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
 * Creates the prompt property
 * @param operationName - The name of the operation
 * @returns The prompt property
 */
function createPromptProperty(operationName: string): INodeProperties {
	return {
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: '',
		placeholder: 'e.g. Focus on product pages and pricing information',
		description:
			'Natural language instructions to guide the crawl. Use to specify what content to focus on, pages to prioritize, or extraction goals (e.g., "Focus on product pages and pricing information").',
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
				operation: [operationName],
			},
		},
	};
}

/**
 * Creates a notice warning version 1 users that Ignore Sitemap sends a v1-only
 * parameter, which returns a 400 error if used with the v2 Firecrawl API
 * @param operationName - The name of the operation
 * @returns The version 1 Ignore Sitemap notice property
 */
function createIgnoreSitemapVersionNoticeProperty(operationName: string): INodeProperties {
	return {
		displayName:
			'Ignore Sitemap is a v1 API option. The v2 API (the default Base URL) rejects it with a 400 error even when it is turned off. Remove this option, or re-add the Firecrawl node to use the new Sitemap option instead.',
		name: 'ignoreSitemapVersionNotice',
		type: 'notice',
		typeOptions: {
			theme: 'warning',
		},
		default: '',
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
				'@version': [1],
				'/crawlOptions.ignoreSitemap': [{ _cnd: { exists: true } }],
			},
		},
	};
}

/**
 * Creates the crawl options property
 * @param operationName - The name of the operation
 * @returns The crawl options property
 */
function createCrawlOptionsProperty(operationName: string): INodeProperties {
	return {
		displayName: 'Crawl Options',
		name: 'crawlOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Allow External Links',
				name: 'allowExternalLinks',
				type: 'boolean',
				default: false,
				description:
					'Whether to follow links to other domains during the crawl. Use with caution as this can significantly expand the crawl scope and credit usage.',
				routing: {
					request: {
						body: {
							allowExternalLinks: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Allow Subdomains',
				name: 'allowSubdomains',
				type: 'boolean',
				default: false,
				description:
					'Whether to include subdomains like blog.example.com or docs.example.com when crawling example.com. Enable to capture content across the entire domain ecosystem.',
				routing: {
					request: {
						body: {
							allowSubdomains: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Ignore Query Params',
				name: 'ignoreQueryParameters',
				type: 'boolean',
				default: false,
				description:
					'Whether to treat URLs with different query parameters as the same page. Enable to avoid duplicate scrapes of pages like /products?page=1 and /products?page=2.',
				routing: {
					request: {
						body: {
							ignoreQueryParameters: '={{ $value }}',
						},
					},
				},
			},
			{
				// Deprecated in node version 1.1+ in favor of the 'Sitemap' option below, which
				// matches the Map operation and the v2 API specification. Kept as-is for
				// version 1 workflows.
				displayName: 'Ignore Sitemap',
				name: 'ignoreSitemap',
				type: 'boolean',
				default: false,
				description:
					'Whether to skip reading the website\'s sitemap.xml. Enable if the sitemap is inaccurate, outdated, or you want to discover pages through link following only.',
				displayOptions: {
					show: {
						'@version': [1],
					},
				},
				routing: {
					request: {
						body: {
							ignoreSitemap: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Sitemap',
				name: 'sitemap',
				type: 'options',
				options: [
					{
						name: 'Include',
						value: 'include',
						description: 'Use sitemap plus link discovery (default, most comprehensive)',
					},
					{
						name: 'Only',
						value: 'only',
						description: 'Only crawl URLs from sitemap.xml (fastest, but may miss pages)',
					},
					{
						name: 'Skip',
						value: 'skip',
						description: 'Ignore sitemap, discover pages through links only',
					},
				],
				default: 'include',
				description:
					'Control how URLs are discovered. "Include" combines sitemap with link crawling for best coverage. "Only" is fastest but limited to sitemap. "Skip" relies purely on link following.',
				displayOptions: {
					show: {
						'@version': [{ _cnd: { gte: 1.1 } }],
					},
				},
				routing: {
					request: {
						body: {
							sitemap: '={{ $value }}',
						},
					},
				},
			},
		],
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
 * Create the properties for the crawl operation
 */
function createCrawlProperties(): INodeProperties[] {
	return [
		// URL input
		createUrlProperty(name, 'https://firecrawl.dev', resourceName),

		// Prompt
		createPromptProperty(operationName),

		// Limit
		createLimitProperty(operationName),

		// Delay
		createDelayProperty(operationName),

		// Max Concurrency
		createMaxConcurrencyProperty(operationName),

		// Exclude paths
		createExcludePathsProperty(operationName),

		// Include paths
		createIncludePathsProperty(operationName),

		// Crawl options
		createCrawlOptionsProperty(operationName),

		// Version 1 Ignore Sitemap notice
		createIgnoreSitemapVersionNoticeProperty(operationName),

		// Scrape options
		createScrapeOptionsProperty(operationName, true, false, resourceName),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createCrawlProperties(),
);

// Add the additional fields property separately so it appears only when custom body is enabled
properties.push(createAdditionalFieldsProperty(name));

export { options, properties };
