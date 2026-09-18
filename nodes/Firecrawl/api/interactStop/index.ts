import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'interactStop';
export const displayName = 'Stop Interaction';
export const action = 'Stop interaction';
export const description = 'Stop the browser session of a previous scrape and release its resources';
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
		placeholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
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
	return [createScrapeIdProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createInteractStopProperties(),
);

options.routing = {
	request: {
		method: 'DELETE',
	},
};

export { options, properties };
