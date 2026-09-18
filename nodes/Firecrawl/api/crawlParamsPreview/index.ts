import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createUrlProperty } from '../common';

export const name = 'crawlParamsPreview';
export const displayName = 'Preview Crawl Parameters';
export const action = 'Preview crawl parameters from prompt';
export const description =
	'Generate crawl parameters from a natural language prompt without starting a crawl';
export const resourceName = 'Crawling';

function createPromptProperty(): INodeProperties {
	return {
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. Focus on product pages and pricing information',
		description: 'Natural language prompt describing crawl behavior',
		routing: {
			request: {
				body: {
					prompt: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [name],
			},
		},
	};
}

function createProperties(): INodeProperties[] {
	return [createUrlProperty(name, undefined, resourceName), createPromptProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createProperties(),
);

options.routing = {
	request: {
		url: '=/crawl/params-preview',
	},
};

export { options, properties };
