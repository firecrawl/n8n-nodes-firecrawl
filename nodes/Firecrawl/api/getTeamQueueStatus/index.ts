import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'getTeamQueueStatus';
export const displayName = 'Get Team Queue Status';
export const operationName = 'getTeamQueueStatus';

function createProps(): INodeProperties[] {
  return [createOperationNotice('Default', 'team/queue-status', 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createProps());

options.routing = {
  request: {
    method: 'GET',
    url: '=/team/queue-status',
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

