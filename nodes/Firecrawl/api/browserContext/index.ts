import {
	INodeProperties,
	IDataObject,
	INodeExecutionData,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
} from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'browserContext';
export const displayName = 'Browser context';
export const operationName = 'browserContext';
export const resourceName = 'Browser';

const BROWSER_CONTEXT = `# Firecrawl Browser Sandbox

You have access to a cloud browser sandbox. Each session runs in an isolated, disposable environment with Playwright and agent-browser pre-installed. No local setup required.

## Available Tools

### 1. Create Browser Session
- Launches a new sandboxed browser session
- Returns a session ID (needed for all other browser operations), CDP WebSocket URL, and live view URLs
- Configure TTL (total lifetime, 30-3600s, default 600s) and activity TTL (inactivity timeout, 10-3600s, default 300s)
- Optionally use a named profile to persist cookies, localStorage, and browser state across sessions

### 2. Execute Browser Code
- Runs code inside an active browser session
- Requires a session ID from "Create Browser Session"
- Supports three languages:
  - **Node (JavaScript)**: Playwright code with a pre-configured \`page\` object. Example: \`await page.goto("https://example.com"); const title = await page.title(); console.log(title);\`
  - **Python**: Playwright code with a pre-configured \`page\` object. Example: \`await page.goto("https://example.com")\\ntitle = await page.title()\\nprint(title)\`
  - **Bash**: agent-browser CLI commands for simple interactions. Example: \`agent-browser open https://example.com\`, \`agent-browser snapshot\`, \`agent-browser click @e5\`, \`agent-browser scrape\`
- The \`page\` object is pre-configured and ready to use — do NOT create a new browser or page
- Use \`console.log()\` (Node) or \`print()\` (Python) to return data — the output appears in the \`result\` field
- Configurable timeout (1-300 seconds)

### 3. List Browser Sessions
- Lists all browser sessions, optionally filtered by status (active or destroyed)
- Returns session IDs, status, CDP URLs, live view URLs, and timestamps
- Use this to find existing sessions before creating new ones

### 4. Delete Browser Session
- Destroys an active browser session and releases resources
- If using a profile with saveChanges=true, browser state is saved on close
- Always close sessions when done to avoid unnecessary credit usage

## Typical Workflow

1. **Create** a browser session (get the session ID)
2. **Execute** one or more code blocks in that session (navigate, interact, extract data)
3. **Delete** the session when finished

## Key Guidelines

- Always create a session before executing code
- Reuse the same session for multi-step workflows — the browser state persists between execute calls
- Use profiles when you need to maintain login state across separate sessions
- Choose the right language: Bash/agent-browser for simple navigation and clicks, Python or Node for complex Playwright automation
- Always delete sessions when done to save credits (2 credits per browser minute)
- For extracting content from a known URL without interaction, prefer the Scrape tool instead — it's simpler and cheaper
- Use Browser when you need to navigate pagination, fill forms, click through flows, or perform multi-step interactions`;

function createContextProperty(): INodeProperties {
	return {
		displayName: 'Context',
		name: 'browserContextText',
		type: 'string',
		typeOptions: {
			rows: 15,
		},
		noDataExpression: true,
		default: BROWSER_CONTEXT,
		description:
			'This tool MUST be called before using any other Browser tools. It provides context and instructions about the Firecrawl Browser Sandbox to the AI agent. Edit this to customize the instructions for your use case.',
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

function createBrowserContextProperties(): INodeProperties[] {
	return [createContextProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	createBrowserContextProperties(),
);

options.routing = {
	request: {
		method: 'GET',
		url: '=/browser',
	},
	output: {
		postReceive: [
			async function (
				this: IExecuteSingleFunctions,
				items: INodeExecutionData[],
				response: IN8nHttpFullResponse,
			): Promise<INodeExecutionData[]> {
				const contextText = this.getNodeParameter('browserContextText', BROWSER_CONTEXT) as string;
				const responseBody = response.body as IDataObject;
				const sessions = (responseBody.sessions as IDataObject[]) || [];
				const activeSessions = sessions.filter((s) => s.status === 'active');

				return [
					{
						json: {
							context: contextText,
							activeSessions: activeSessions.length,
							sessions: activeSessions.map((s) => ({
								id: s.id,
								status: s.status,
								createdAt: s.createdAt,
								lastActivity: s.lastActivity,
							})),
						},
					},
				];
			},
		],
	},
};

export { options, properties };
