import { INodeProperties } from 'n8n-workflow';
import { apiProperties } from './api';
import { preSendActionCustomBody } from './helpers';

/**
 * Authentication properties for the Firecrawl API
 */
export const authenticationProperties: INodeProperties[] = [];

/**
 * Resource selector properties - categories for grouping operations
 */
export const resourceSelect: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Scraping',
				value: 'Scraping',
			},
			{
				name: 'Crawling',
				value: 'Crawling',
			},
			{
				name: 'Agent',
				value: 'Agent',
			},
			{
				name: 'Map & Search',
				value: 'MapSearch',
			},
			{
				name: 'Account',
				value: 'Account',
			},
			{
				name: 'Extract (Legacy)',
				value: 'Extract',
			},
		],
		default: 'Scraping',
	},
];

/**
 * Extra properties for custom body options
 */
export const extraProperties: INodeProperties[] = [
	{
		displayName: 'Use Custom Body',
		name: 'useCustomBody',
		type: 'boolean',
		description: 'Whether to use a custom body',
		default: false,
	},
	{
		displayName: 'Custom Body',
		name: 'customBody',
		type: 'json',
		default:
			'{\n  "url": "string",\n  "limit": 0,\n  "excludePaths": [\n    "string"\n  ],\n  "webhook": "string",\n  "scrapeOptions": {\n    "formats": [\n      {\n        "type": "markdown"\n      }\n    ],\n    "extract": {\n      "schema": "string",\n      "systemPrompt": "string",\n      "prompt": "string"\n    }\n  }\n}',
		description: 'Custom body to send',
		routing: {
			request: {
				body: {
					customBody: '={{JSON.parse($value)}}',
				},
			},
			send: {
				preSend: [preSendActionCustomBody],
			},
		},
		displayOptions: {
			show: {
				useCustomBody: [true],
				resource: ['Crawling'],
				operation: ['crawl'],
			},
		},
	},
	{
		displayName: 'Custom Body',
		name: 'customBody',
		type: 'json',
		default:
			'{\n  "url": "string",\n  "formats": [\n    {\n      "type": "markdown"\n    }\n  ],\n  "extract": {\n    "schema": "string",\n    "systemPrompt": "string",\n    "prompt": "string"\n  },\n  "actions": [\n    {\n      "type": "wait",\n      "selector": "string",\n      "milliseconds": 0,\n      "text": "string",\n      "key": "string"\n    }\n  ]\n}',
		description: 'Custom body to send',
		routing: {
			request: {
				body: {
					customBody: '={{JSON.parse($value)}}',
				},
			},
			send: {
				preSend: [preSendActionCustomBody],
			},
		},
		displayOptions: {
			show: {
				useCustomBody: [true],
				resource: ['Scraping'],
				operation: ['scrape'],
			},
		},
	},
	{
		displayName: 'Custom Body',
		name: 'customBody',
		type: 'json',
		default: '{\n  "url": "https://firecrawl.dev",\n  "search": "docs"\n}',
		description: 'Custom body to send',
		routing: {
			request: {
				body: {
					customBody: '={{JSON.parse($value)}}',
				},
			},
			send: {
				preSend: [preSendActionCustomBody],
			},
		},
		displayOptions: {
			show: {
				useCustomBody: [true],
				resource: ['MapSearch'],
				operation: ['map'],
			},
		},
	},
];

/**
 * Combine all properties into a single array
 */
export const allProperties = [
	...authenticationProperties,
	...resourceSelect,
	...apiProperties,
	...extraProperties,
];
