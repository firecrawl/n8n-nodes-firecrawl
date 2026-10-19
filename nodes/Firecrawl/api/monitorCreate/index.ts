import {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { buildApiProperties, extractUrls } from '../common';

export const name = 'monitorCreate';
export const displayName = 'Create Monitor';
export const action = 'Create monitor';
export const description =
	'Create a scheduled monitor that tracks changes to pages, a crawled site or search results';
export const operationName = 'monitorCreate';
export const resourceName = 'Monitor';

const displayOptions = {
	show: {
		resource: [resourceName],
		operation: [operationName],
	},
	hide: {
		useCustomBody: [true],
	},
};

function createNameProperty(): INodeProperties {
	return {
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Pricing page changes',
		description: 'A name for the monitor (up to 256 characters)',
		routing: {
			request: {
				body: {
					name: '={{ $value }}',
				},
			},
		},
		displayOptions,
	};
}

function createScheduleTypeProperty(): INodeProperties {
	return {
		displayName: 'Schedule Type',
		name: 'scheduleType',
		type: 'options',
		default: 'text',
		description: 'How the schedule is expressed',
		options: [
			{
				name: 'Natural Language',
				value: 'text',
				description: 'For example "every 6 hours" or "daily at 9am"',
			},
			{
				name: 'Cron Expression',
				value: 'cron',
				description: 'A standard cron expression, for example "0 */6 * * *"',
			},
		],
		displayOptions,
	};
}

function createScheduleProperty(): INodeProperties {
	return {
		displayName: 'Schedule',
		name: 'schedule',
		type: 'string',
		required: true,
		default: 'every 6 hours',
		placeholder: 'e.g. every 6 hours',
		description:
			'When the monitor runs. Use natural language or a cron expression, matching the selected schedule type.',
		routing: {
			request: {
				body: {
					schedule:
						"={{ $parameter.scheduleType === 'cron' ? { cron: $value, timezone: $parameter.timezone } : { text: $value, timezone: $parameter.timezone } }}",
				},
			},
		},
		displayOptions,
	};
}

function createTimezoneProperty(): INodeProperties {
	return {
		displayName: 'Timezone',
		name: 'timezone',
		type: 'string',
		default: 'UTC',
		placeholder: 'e.g. America/New_York',
		description: 'IANA timezone the schedule is evaluated in',
		displayOptions,
	};
}

function createTargetTypeProperty(): INodeProperties {
	return {
		displayName: 'Target Type',
		name: 'targetType',
		type: 'options',
		default: 'scrape',
		description: 'What the monitor watches',
		options: [
			{
				name: 'Scrape URLs',
				value: 'scrape',
				description: 'Watch one or more specific pages',
			},
			{
				name: 'Crawl Site',
				value: 'crawl',
				description: 'Watch every page discovered from a starting URL',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Watch new search results for one or more queries (requires a goal)',
			},
		],
		routing: {
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
						const targetType = this.getNodeParameter('targetType') as string;

						if (targetType === 'scrape') {
							const urls = [...new Set(extractUrls(this.getNodeParameter('urls', '')))];
							if (urls.length === 0) {
								throw new NodeOperationError(this.getNode(), 'Provide at least one valid URL.');
							}
							body.targets = [{ type: 'scrape', urls }];
						} else if (targetType === 'crawl') {
							const [url] = extractUrls(this.getNodeParameter('crawlUrl', ''));
							if (!url) {
								throw new NodeOperationError(this.getNode(), 'Provide a valid URL to crawl.');
							}
							body.targets = [{ type: 'crawl', url }];
						} else {
							const queries = (this.getNodeParameter('queries', '') as string)
								.split('\n')
								.map((query) => query.trim())
								.filter(Boolean);
							if (queries.length === 0) {
								throw new NodeOperationError(this.getNode(), 'Provide at least one search query.');
							}
							body.targets = [{ type: 'search', queries }];
						}

						return requestOptions;
					},
				],
			},
		},
		displayOptions,
	};
}

function createUrlsProperty(): INodeProperties {
	return {
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: 'e.g. https://example.com/pricing',
		description:
			'Pages to monitor. Accepts a single URL, several URLs separated by commas or newlines, or a JSON array.',
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
				targetType: ['scrape'],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

function createCrawlUrlProperty(): INodeProperties {
	return {
		displayName: 'URL',
		name: 'crawlUrl',
		type: 'string',
		default: '',
		placeholder: 'e.g. https://example.com/blog',
		description: 'Starting URL. The monitor tracks every page discovered from it.',
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
				targetType: ['crawl'],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

function createQueriesProperty(): INodeProperties {
	return {
		displayName: 'Queries',
		name: 'queries',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: 'e.g. firecrawl alternatives',
		description: 'Search queries to monitor, one per line (up to 12)',
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
				targetType: ['search'],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

function createGoalProperty(): INodeProperties {
	return {
		displayName: 'Goal',
		name: 'goal',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		default: '',
		placeholder: 'e.g. Alert me when prices change',
		description:
			'Plain-language description of which changes matter, used to judge whether a change is meaningful (up to 2000 characters). Required for search targets.',
		routing: {
			request: {
				body: {
					goal: '={{ $value || undefined }}',
				},
			},
		},
		displayOptions,
	};
}

function createOptionsProperty(): INodeProperties {
	return {
		displayName: 'Options',
		name: 'monitorOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		description: 'Additional monitor settings',
		options: [
			{
				displayName: 'Email Recipients',
				name: 'emailRecipients',
				type: 'string',
				default: '',
				placeholder: 'e.g. alerts@example.com, team@example.com',
				description: 'Comma-separated email addresses to notify after each check (up to 25)',
			},
			{
				displayName: 'Retention Days',
				name: 'retentionDays',
				type: 'number',
				default: 30,
				typeOptions: {
					minValue: 1,
					maxValue: 365,
				},
				description: 'How many days check history is kept',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				placeholder: 'e.g. https://example.com/webhook',
				description: 'URL that receives monitor.page and monitor.check.completed events',
			},
		],
		routing: {
			request: {
				body: {
					retentionDays: '={{ $value.retentionDays }}',
					webhook: '={{ $value.webhookUrl || undefined }}',
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

						const { emailRecipients } = this.getNodeParameter('monitorOptions', {}) as IDataObject;
						const recipients = ((emailRecipients as string) || '')
							.split(',')
							.map((email) => email.trim())
							.filter(Boolean);
						if (recipients.length > 0) {
							(requestOptions.body as IDataObject).notification = {
								email: { enabled: true, recipients },
							};
						}

						return requestOptions;
					},
				],
			},
		},
		displayOptions,
	};
}

export async function setMonitorOrigin(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	if (typeof requestOptions.body !== 'object' || !requestOptions.body) {
		return requestOptions;
	}

	const body = requestOptions.body as IDataObject;
	delete body.integration;
	body.origin = 'n8n';

	return requestOptions;
}

function createMonitorCreateProperties(): INodeProperties[] {
	return [
		createNameProperty(),
		createScheduleTypeProperty(),
		createScheduleProperty(),
		createTimezoneProperty(),
		createTargetTypeProperty(),
		createUrlsProperty(),
		createCrawlUrlProperty(),
		createQueriesProperty(),
		createGoalProperty(),
		createOptionsProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createMonitorCreateProperties(),
);

options.routing = {
	request: {
		method: 'POST',
		url: '=/monitor',
	},
	send: {
		preSend: [setMonitorOrigin],
	},
};

export { options, properties };
