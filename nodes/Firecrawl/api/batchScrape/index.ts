import { INodeProperties } from 'n8n-workflow';
import {
    buildApiProperties,
    createOperationNotice,
    createScrapeOptionsProperty,
    createAdditionalFieldsProperty,
} from '../common';

// Define the operation name and display name
export const name = 'batchScrape';
export const displayName = 'Batch scrape multiple URLs';
export const operationName = 'batchScrape';

/**
 * Creates the URLs property
 * @returns The URLs property
 */
function createUrlsProperty(): INodeProperties {
    return {
        displayName: 'URLs',
        name: 'urls',
        type: 'fixedCollection',
        default: {},
        typeOptions: {
            multipleValues: true,
        },
        description: 'The URLs to scrape in a single batch request',
        placeholder: 'Add URL',
        options: [
            {
                displayName: 'Items',
                name: 'items',
                values: [
                    {
                        displayName: 'URL',
                        name: 'url',
                        type: 'string',
                        default: '',
                        placeholder: 'https://example.com/page-1',
                        description: 'URL to scrape',
                    },
                ],
            },
        ],
        routing: {
            request: {
                body: {
                    urls: '={{$value.items ? $value.items.map(item => item.url) : []}}',
                },
            },
        },
        displayOptions: {
            show: {
                resource: ['Default'],
                operation: [operationName],
            },
        },
    };
}

/**
 * Creates the parsers property (e.g. pdf handling)
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
            },
        ],
        default: [],
        description:
            'Controls how PDF files are processed. When PDF is enabled, pages are extracted to markdown (1 credit per page). When disabled, PDF is returned base64-encoded (flat 1 credit).',
        routing: {
            request: {
                body: {
                    parsers: '={{ $value }}',
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

function createIgnoreInvalidUrlsProperty(operationName: string): INodeProperties {
    return {
        displayName: 'Ignore Invalid URLs',
        name: 'ignoreInvalidURLs',
        type: 'boolean',
        default: true,
        description:
            'Whether to ignore invalid URLs and return them under invalidURLs instead of failing the whole request',
        routing: {
            request: {
                body: {
                    ignoreInvalidURLs: '={{ $value }}',
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

function createMaxConcurrencyProperty(operationName: string): INodeProperties {
    return {
        displayName: 'Max Concurrency',
        name: 'maxConcurrency',
        type: 'number',
        typeOptions: {
            minValue: 1,
        },
        default: 100,
        description:
            "Maximum number of concurrent scrapes. If not set, defaults to team concurrency limit.",
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
                resource: ['Default'],
                operation: [operationName],
            },
        },
    };
}

function createWebhookProperty(operationName: string): INodeProperties {
    return {
        displayName: 'Webhook',
        name: 'webhook',
        type: 'fixedCollection',
        default: {},
        description: 'Webhook to notify on job events',
        options: [
            {
                displayName: 'Settings',
                name: 'settings',
                values: [
                    {
                        displayName: 'URL',
                        name: 'url',
                        type: 'string',
                        default: '',
                        placeholder: 'https://example.com/webhook',
                        description: 'Webhook URL to call',
                    },
                    {
                        displayName: 'Headers',
                        name: 'headers',
                        type: 'fixedCollection',
                        default: {},
                        description: 'Optional headers to send with the webhook call',
                        typeOptions: { multipleValues: true },
                        options: [
                            {
                                displayName: 'Header',
                                name: 'header',
                                values: [
                                    {
                                        displayName: 'Key',
                                        name: 'key',
                                        type: 'string',
                                        default: '',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        default: '',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
        routing: {
            request: {
                body: {
                    webhook:
                        "={{ $value.settings ? { url: $value.settings.url, headers: ($value.settings.headers && $value.settings.headers.header) ? Object.fromEntries(($value.settings.headers.header || []).map(h => [h.key, h.value])) : undefined } : undefined }}",
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
 * Create the properties for the batch scrape operation
 */
function createBatchScrapeProperties(): INodeProperties[] {
    return [
        // Operation notice
        createOperationNotice('Default', 'batch/scrape'),

        // URLs input
        createUrlsProperty(),

        // Parsers
        createParsersProperty(operationName),

        // Concurrency and validation behavior
        createMaxConcurrencyProperty(operationName),
        createIgnoreInvalidUrlsProperty(operationName),

        // Webhook
        createWebhookProperty(operationName),

        // Scrape options (same as scrape/crawl/extract)
        createScrapeOptionsProperty(operationName, false),
    ];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(name, displayName, createBatchScrapeProperties());

// Override endpoint to point to the batch scrape route
options.routing = {
    request: {
        url: '=/batch/scrape',
        method: 'POST',
    },
};

// Add the additional fields property separately so it appears only when custom body is enabled
properties.push(createAdditionalFieldsProperty(name));

export { options, properties };
