import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'interactStop';
export const displayName = 'Stop interaction';
export const operationName = 'interactStop';
export const resourceName = 'Interact';

function createScrapeIdProperty(): INodeProperties {
	return {
		displayName: 'Scrape ID',
		name: 'scrapeId',
		type: 'string',
		required: true,
		default: '',
		description:
			'The scrape job ID of the interactive session to stop. This immediately destroys the browser session, releases all resources, and stops billing. If using a profile with saveChanges=true, browser state (cookies, localStorage) is saved before closing.',
		placeholder: '550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/scrape/{{$value}}/interact',
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

function createInteractStopProperties(): INodeProperties[] {
	return [
		createOperationNotice(resourceName, name, 'DELETE'),
		createScrapeIdProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	createInteractStopProperties(),
);

options.routing = {
	request: {
		method: 'DELETE',
	},
};

export { options, properties };
