import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'interact';
export const displayName = 'Execute interaction';
export const operationName = 'interact';
export const resourceName = 'Interact';

function createScrapeIdProperty(): INodeProperties {
	return {
		displayName: 'Scrape ID',
		name: 'scrapeId',
		type: 'string',
		required: true,
		default: '',
		description:
			'The scrape job ID from a previous Scrape operation. Found in the response at data.metadata.scrapeId. The interact session resumes the browser at the exact page state from the scrape.',
		placeholder: '550e8400-e29b-41d4-a716-446655440000',
		routing: {
			request: {
				url: '=/scrape/{{$value}}/interact',
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

function createModeProperty(): INodeProperties {
	return {
		displayName: 'Mode',
		name: 'interactMode',
		type: 'options',
		default: 'prompt',
		description:
			'How to interact with the page. "Prompt" uses natural language — describe what you want and the AI agent handles it. "Code" lets you execute Playwright or agent-browser code directly.',
		options: [
			{
				name: 'Prompt (Natural Language)',
				value: 'prompt',
				description: 'Describe the interaction in plain English — the AI agent handles clicks, typing, scrolling, and extraction automatically',
			},
			{
				name: 'Code (Playwright / Bash)',
				value: 'code',
				description: 'Execute Playwright code (Node.js/Python) or agent-browser CLI commands directly in the browser sandbox',
			},
		],
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

function createPromptProperty(): INodeProperties {
	return {
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		description:
			'Natural language instruction for the AI agent (max 10,000 characters). Describe a single, focused task. The agent handles clicking, typing, scrolling, and data extraction automatically. Examples: "Click the Sign In button", "Type test@example.com into the email field", "What are the prices listed on this page?".',
		placeholder: 'Click the Sign In button and wait for the login form to appear',
		routing: {
			request: {
				body: {
					prompt: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
				interactMode: ['prompt'],
			},
			hide: {
				useCustomBody: [true],
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
			'Valid code to execute in the browser sandbox (max 100,000 characters). MUST match the selected Language. Node: write JavaScript Playwright code using the pre-configured "page" object (do NOT create a new browser). Python: write async Playwright Python code using the pre-configured "page" object. Bash: write agent-browser CLI commands prefixed with "agent-browser" (e.g. "agent-browser snapshot -i", "agent-browser click @e1"). NEVER put natural language or plain English here — only valid code.',
		placeholder:
			'await page.click(\'#next-page\');\nawait page.waitForLoadState(\'networkidle\');\nconst title = await page.title();\nconsole.log(title);',
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
				interactMode: ['code'],
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
			'The programming language for code execution. "Node" runs JavaScript with Playwright. "Python" runs Python with Playwright. "Bash" runs agent-browser CLI commands with 60+ built-in commands and element references (@e1, @e2, etc.).',
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
				description: 'Execute agent-browser CLI commands for simple interactions',
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
				interactMode: ['code'],
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
			'Maximum execution time in seconds (1-300). If the interaction takes longer than this, the process is killed and the response will have killed=true. Increase for long-running automations like multi-step form submissions or page loads with heavy JavaScript.',
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

function createInteractProperties(): INodeProperties[] {
	return [
		createOperationNotice(resourceName, name, 'POST'),
		createScrapeIdProperty(),
		createModeProperty(),
		createPromptProperty(),
		createCodeProperty(),
		createLanguageProperty(),
		createTimeoutProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	createInteractProperties(),
);

options.routing = {
	request: {
		method: 'POST',
	},
};

export { options, properties };
