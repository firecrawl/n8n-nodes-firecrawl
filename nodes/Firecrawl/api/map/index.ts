import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice, createUrlProperty, createAdditionalFieldsProperty } from '../common';

// Define the operation name and display name
export const name = 'map';
export const displayName = 'Map a website and get urls';
export const operationName = 'map';

function createSitemapProperty(): INodeProperties {
	return {
		displayName: 'Sitemap',
		name: 'sitemap',
		type: 'options',
		options: [
			{
				name: 'Include',
				value: 'include',
				description: 'Include sitemap when crawling (default)',
			},
			{
				name: 'Only',
				value: 'only',
				description: 'Only return links found in the website sitemap',
			},
			{
				name: 'Skip',
				value: 'skip',
				description: 'Ignore the website sitemap when crawling',
			},
		],
		default: 'include',
		description: 'How to handle the website sitemap during crawling',
		routing: {
			request: {
				body: {
					sitemap: '={{ $value }}',
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

function createIncludeSubdomainsProperty(): INodeProperties {
	return {
		displayName: 'Include Subdomains',
		name: 'includeSubdomains',
		type: 'boolean',
		default: false,
		description: 'Whether to include subdomains of the website',
		routing: {
			request: {
				body: {
					includeSubdomains: '={{ $value }}',
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

function createLimitProperty(): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			// eslint-disable-next-line n8n-nodes-base/node-param-type-options-max-value-present
			maxValue: 5000,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: 5000,
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
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

function createTimeoutProperty(): INodeProperties {
	return {
		displayName: 'Timeout (Ms)',
		name: 'timeout',
		type: 'number',
		default: 10000,
		description: 'Timeout in milliseconds for the request',
		routing: {
			request: {
				body: {
					timeout: '={{ $value }}',
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
 * Create additional fields property for custom data
 */
// Additional Fields handled via shared helper

/**
 * Create the properties for the map operation
 */
function createMapProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name),

		createUrlProperty(name),

		createSitemapProperty(),

		createIncludeSubdomainsProperty(),

		createLimitProperty(),

		createTimeoutProperty(),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(name, displayName, createMapProperties());

// Add the additional fields property separately so it appears only when custom body is enabled
properties.push(createAdditionalFieldsProperty(name));

export { options, properties };
