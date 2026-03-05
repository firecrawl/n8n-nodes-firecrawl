import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'browserExecute';
export const displayName = 'Execute browser code';
export const operationName = 'browserExecute';
export const resourceName = 'Browser';

function createSessionIdProperty(): INodeProperties {
	return {
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		default: '',
		description:
			'The unique identifier of the browser session to execute code in. Obtain this from the "Create browser session" operation. The session must be active (not expired or destroyed).',
		placeholder: '550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/browser/{{$value}}/execute',
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

function createCodeProperty(): INodeProperties {
	return {
		displayName: 'Code',
		name: 'code',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		required: true,
		default: '',
		description:
			'The code to execute in the sandboxed browser environment (1-100,000 characters). A Playwright "page" object is pre-configured and available. Use it to navigate, click, type, extract data, or automate any browser interaction. Example (Python): await page.goto("https://example.com")\\ntitle = await page.title()\\nprint(title). Example (Node): await page.goto("https://example.com"); const title = await page.title(); console.log(title);',
		placeholder:
			'await page.goto("https://example.com")\ntitle = await page.title()\nprint(title)',
		routing: {
			request: {
				body: {
					code: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

function createLanguageProperty(): INodeProperties {
	return {
		displayName: 'Language',
		name: 'language',
		type: 'options',
		default: 'node',
		description:
			'The programming language of the code to execute. "Node" runs JavaScript with Node.js. "Python" runs Python with Playwright. "Bash" runs shell commands via the agent-browser CLI for system-level operations.',
		options: [
			{
				name: 'Node (JavaScript)',
				value: 'node',
				description: 'Execute JavaScript code with Node.js and Playwright',
			},
			{
				name: 'Python',
				value: 'python',
				description: 'Execute Python code with Playwright',
			},
			{
				name: 'Bash',
				value: 'bash',
				description: 'Execute shell commands via the agent-browser CLI',
			},
		],
		routing: {
			request: {
				body: {
					language: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

function createTimeoutProperty(): INodeProperties {
	return {
		displayName: 'Timeout (Seconds)',
		name: 'timeout',
		type: 'number',
		default: 30,
		typeOptions: {
			minValue: 1,
			maxValue: 300,
		},
		description:
			'Maximum execution time in seconds (1-300). If the code takes longer than this, the process is killed and the response will have killed=true. Increase for long-running automations like page loads with heavy JavaScript or multi-step form submissions.',
		routing: {
			request: {
				body: {
					timeout: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

function createBrowserExecuteProperties(): INodeProperties[] {
	return [
		createOperationNotice(resourceName, name, 'POST'),
		createSessionIdProperty(),
		createCodeProperty(),
		createLanguageProperty(),
		createTimeoutProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	createBrowserExecuteProperties(),
);

options.routing = {
	request: {
		method: 'POST',
	},
};

export { options, properties };
