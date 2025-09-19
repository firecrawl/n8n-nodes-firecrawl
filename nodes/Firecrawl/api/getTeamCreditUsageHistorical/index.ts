import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'getTeamCreditUsageHistorical';
export const displayName = 'Get Team Credit Usage Historical';
export const operationName = 'getTeamCreditUsageHistorical';

function createProps(): INodeProperties[] {
  return [createOperationNotice('Default', 'team/credit-usage/historical', 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createProps());

options.routing = {
  request: {
    method: 'GET',
    url: '=/team/credit-usage/historical',
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

