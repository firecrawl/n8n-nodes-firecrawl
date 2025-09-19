import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'cancelCrawl';
export const displayName = 'Cancel Crawl';

export const operationName = 'cancelCrawl';

function createCrawlIdProperty(): INodeProperties {
  return {
    displayName: 'Crawl ID',
    name: 'crawlId',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the crawl job to cancel',
    placeholder: '1234abcd-5678-efgh-9012-ijklmnopqrst',
    routing: {
      request: {
        url: '=/crawl/{{$value}}',
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

function createCancelCrawlProperties(): INodeProperties[] {
  return [createOperationNotice('Default', name, 'DELETE'), createCrawlIdProperty()];
}

const { options, properties } = buildApiProperties(name, displayName, createCancelCrawlProperties());

options.routing = {
  request: {
    method: 'DELETE',
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

