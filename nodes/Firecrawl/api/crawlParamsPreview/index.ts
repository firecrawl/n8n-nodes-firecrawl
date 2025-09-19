import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice, createPromptProperty, createUrlProperty } from '../common';

// Define the operation name and display name
export const name = 'crawlParamsPreview';
export const displayName = 'Crawl Params Preview';

export const operationName = 'crawlParamsPreview';

/**
 * Create the properties for the crawlParamsPreview operation
 */
function createCrawlParamsPreviewProperties(): INodeProperties[] {
	return [
		// Operation notice
		createOperationNotice('Default', name, 'POST'),

		// URL input property
		createUrlProperty(operationName),

		// Natural Language Prompt property
		createPromptProperty(operationName, 'Prompt describing what you want to crawl')
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(
	name,
	displayName,
	createCrawlParamsPreviewProperties(),
);

// Override the default routing for this operation
options.routing = {
	request: {
		method: 'POST',
		url: '/crawl/params-preview',
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
