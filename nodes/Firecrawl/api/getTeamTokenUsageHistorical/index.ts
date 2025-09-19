import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'getTeamTokenUsageHistorical';
export const displayName = 'Get Team Token Usage Historical';
export const operationName = 'getTeamTokenUsageHistorical';

function createProps(): INodeProperties[] {
  return [createOperationNotice('Default', 'team/token-usage/historical', 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createProps());

options.routing = {
  request: {
    method: 'GET',
    url: '=/team/token-usage/historical',
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

