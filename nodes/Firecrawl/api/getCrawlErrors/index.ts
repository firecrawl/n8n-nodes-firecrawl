import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'getCrawlErrors';
export const displayName = 'Get Crawl Errors';

export const operationName = 'getCrawlErrors';

function createCrawlIdProperty(): INodeProperties {
  return {
    displayName: 'Crawl ID',
    name: 'crawlId',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the crawl job to get errors for',
    placeholder: '1234abcd-5678-efgh-9012-ijklmnopqrst',
    routing: {
      request: {
        url: '=/crawl/{{$value}}/errors',
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

function createGetCrawlErrorsProperties(): INodeProperties[] {
  return [createOperationNotice('Default', name, 'GET'), createCrawlIdProperty()];
}

const { options, properties } = buildApiProperties(name, displayName, createGetCrawlErrorsProperties());

options.routing = {
  request: {
    method: 'GET',
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

