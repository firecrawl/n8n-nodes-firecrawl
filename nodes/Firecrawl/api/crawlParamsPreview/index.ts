import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice, createUrlProperty } from '../common';

export const name = 'crawlParamsPreview';
export const displayName = 'Preview crawl params from prompt';
export const resourceName = 'Crawling';

function createPromptProperty(): INodeProperties {
	return {
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: '',
		required: true,
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
	return [createOperationNotice(resourceName, name), createUrlProperty(name, undefined, resourceName), createPromptProperty()];
}

const { options, properties } = buildApiProperties(name, displayName, createProperties());

options.routing = {
	request: {
		url: '=/crawl/params-preview',
	},
};

export { options, properties };
