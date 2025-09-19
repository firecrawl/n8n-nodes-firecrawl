import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'getTeamTokenUsage';
export const displayName = 'Get Team Token Usage';
export const operationName = 'getTeamTokenUsage';

function createProps(): INodeProperties[] {
  return [createOperationNotice('Default', 'team/token-usage', 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createProps());

options.routing = {
  request: {
    method: 'GET',
    url: '=/team/token-usage',
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

