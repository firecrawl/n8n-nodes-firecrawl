import { INodeProperties } from 'n8n-workflow';
import {
  buildApiProperties,
  createOperationNotice,
  createUrlProperty,
  createScrapeOptionsProperty,
  createAdditionalFieldsProperty,
} from '../common';

// Define the operation name and display name
export const name = 'previewCrawlParams';
export const displayName = 'Preview Crawl Params';

export const operationName = 'previewCrawlParams';

function createPreviewCrawlParamsProperties(): INodeProperties[] {
  return [
    createOperationNotice('Default', name),
    createUrlProperty(operationName, 'https://firecrawl.dev'),
    // Reuse scrape options to allow shaping what will be previewed
    createScrapeOptionsProperty(operationName),
    // Prompt
    createPromptProperty(operationName),
    // Limit / Delay / Max Concurrency
    createLimitProperty(operationName),
    createDelayProperty(operationName),
    createMaxConcurrencyProperty(operationName),
    // Include/Exclude paths
    createExcludePathsProperty(operationName),
    createIncludePathsProperty(operationName),
    // Crawl options (subset)
    createCrawlOptionsProperty(operationName),
  ];
}

const { options, properties } = buildApiProperties(name, displayName, createPreviewCrawlParamsProperties());

options.routing = {
  request: {
    method: 'POST',
    url: '=/crawl/params-preview',
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

// Allow additional custom JSON when Use Custom Body is enabled
properties.push(createAdditionalFieldsProperty(name));

/** Below are helpers modeled after the Crawl operation to match parity **/

function createPromptProperty(operationName: string): INodeProperties {
  return {
    displayName: 'Prompt',
    name: 'prompt',
    type: 'string',
    default: '',
    description: 'Prompt to use for the crawl',
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
        resource: ['Default'],
        operation: [operationName],
      },
    },
  };
}

function createLimitProperty(operationName: string): INodeProperties {
  return {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    // eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
    default: 500,
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

function createDelayProperty(operationName: string): INodeProperties {
  return {
    displayName: 'Delay',
    name: 'delay',
    type: 'number',
    typeOptions: { minValue: 0 },
    default: 0,
    description: 'Delay between requests in milliseconds',
    routing: {
      request: {
        body: {
          delay: '={{ $value }}',
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
    typeOptions: { minValue: 1 },
    default: 100,
    description:
      "Maximum number of concurrent scrapes. If not specified, adheres to team's concurrency limit.",
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

function createExcludePathsProperty(operationName: string): INodeProperties {
  return {
    displayName: 'Exclude Paths',
    name: 'excludePaths',
    type: 'fixedCollection',
    default: [],
    typeOptions: { multipleValues: true },
    description:
      'URL path patterns to exclude (e.g., blog/* excludes /blog/article-1)',
    placeholder: 'Add path to exclude',
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
            placeholder: 'blog/*',
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

function createIncludePathsProperty(operationName: string): INodeProperties {
  return {
    displayName: 'Include Paths',
    name: 'includePaths',
    type: 'fixedCollection',
    default: [],
    typeOptions: { multipleValues: true },
    description:
      'URL path patterns to include (e.g., blog/* includes paths like /blog/article-1)',
    placeholder: 'Add path to include',
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
            placeholder: 'blog/*',
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

function createCrawlOptionsProperty(operationName: string): INodeProperties {
  return {
    displayName: 'Crawl Options',
    name: 'crawlOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    options: [
      {
        displayName: 'Ignore Sitemap',
        name: 'ignoreSitemap',
        type: 'boolean',
        default: false,
        routing: { request: { body: { ignoreSitemap: '={{ $value }}' } } },
      },
      {
        displayName: 'Ignore Query Params',
        name: 'ignoreQueryParameters',
        type: 'boolean',
        default: false,
        routing: { request: { body: { ignoreQueryParameters: '={{ $value }}' } } },
      },
      {
        displayName: 'Allow External Links',
        name: 'allowExternalLinks',
        type: 'boolean',
        default: false,
        routing: { request: { body: { allowExternalLinks: '={{ $value }}' } } },
      },
      {
        displayName: 'Allow Subdomains',
        name: 'allowSubdomains',
        type: 'boolean',
        default: false,
        routing: { request: { body: { allowSubdomains: '={{ $value }}' } } },
      },
    ],
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
