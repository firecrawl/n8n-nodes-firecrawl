import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

// Define the operation name and display name
export const name = 'getActiveCrawls';
export const displayName = 'Get Active Crawls';

export const operationName = 'getActiveCrawls';

function createGetActiveCrawlsProperties(): INodeProperties[] {
  return [createOperationNotice('Default', name, 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createGetActiveCrawlsProperties());

options.routing = {
  request: {
    method: 'GET',
    url: '=/crawl/active',
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
