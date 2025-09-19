import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'getTeamCreditUsage';
export const displayName = 'Get Team Credit Usage';
export const operationName = 'getTeamCreditUsage';

function createProps(): INodeProperties[] {
  return [createOperationNotice('Default', 'team/credit-usage', 'GET')];
}

const { options, properties } = buildApiProperties(name, displayName, createProps());

options.routing = {
  request: {
    method: 'GET',
    url: '=/team/credit-usage',
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

