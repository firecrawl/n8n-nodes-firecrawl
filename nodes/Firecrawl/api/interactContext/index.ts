import {
	INodeProperties,
	IDataObject,
	INodeExecutionData,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
} from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'interactContext';
export const displayName = 'Interact context';
export const operationName = 'interactContext';
export const resourceName = 'Interact';

const INTERACT_CONTEXT = `# Firecrawl Interact

You have access to the Firecrawl Interact API. Interact lets you scrape a page first, then continue working with it — clicking buttons, filling forms, extracting dynamic content, or navigating deeper. The browser session resumes at the exact state it was in after the scrape.

## Workflow

1. **Scrape** a URL using the Scrape tool (resource: Scraping, operation: /scrape). The response includes a \`scrapeId\` in \`data.metadata.scrapeId\`.
2. **Interact** with the page using the Execute Interaction tool. Pass the \`scrapeId\` and either a natural language prompt or code to execute depending on the selected Mode.
3. **Stop** the session when done using the Stop Interaction tool to release resources and stop billing.

## Execute Interaction — Modes

This tool has a **Mode** toggle. You MUST respect the selected mode and provide the correct type of content for that mode.

### Prompt Mode (Mode = "Prompt")
Use the Prompt field to describe what you want in natural language. The AI agent handles clicks, typing, scrolling, and extraction automatically. Keep prompts small and focused on a single task.

Examples of valid prompts:
- "Click the Sign In button"
- "Type test@example.com into the email field and click Submit"
- "What are the prices listed on this page?"
- "Scroll down and find the FAQ section"

NEVER put code, CLI commands, or anything other than natural language in the Prompt field.

### Code Mode (Mode = "Code")
Use the Code field to execute code in the browser sandbox. The content you write in the Code field MUST be valid code for the selected Language. NEVER put natural language, descriptions, or plain English instructions in the Code field.

**Language = Node (JavaScript)**
Write valid JavaScript using the Playwright API. A \`page\` object is pre-configured and connected to the browser. Do NOT create a new browser or page. Use \`console.log()\` to return data.

Examples:
\`\`\`
await page.click('#next-page');
await page.waitForLoadState('networkidle');
const title = await page.title();
console.log(title);
\`\`\`
\`\`\`
const content = await page.$eval('.article-body', el => el.textContent);
JSON.stringify({ content });
\`\`\`

**Language = Python**
Write valid Python using the Playwright async API. A \`page\` object is pre-configured. Use \`print()\` to return data.

Examples:
\`\`\`
await page.click('#load-more')
await page.wait_for_load_state('networkidle')
items = await page.query_selector_all('.item')
data = [await i.text_content() for i in items]
print(json.dumps(data))
\`\`\`

**Language = Bash**
Write agent-browser CLI commands. Every command MUST be prefixed with \`agent-browser\`. Chain multiple commands with \`&&\`. The CLI provides an accessibility tree with element references (\`@e1\`, \`@e2\`, ...).

Examples:
\`\`\`
agent-browser snapshot -i
\`\`\`
\`\`\`
agent-browser fill @e1 "search query" && agent-browser click @e2
\`\`\`
\`\`\`
agent-browser find text "See More" click
\`\`\`

Available agent-browser commands:
| Command | Description |
|---------|-------------|
| \`agent-browser snapshot\` | Full accessibility tree with element refs |
| \`agent-browser snapshot -i\` | Interactive elements only |
| \`agent-browser click @e1\` | Click element by ref |
| \`agent-browser fill @e1 "text"\` | Clear field and type text |
| \`agent-browser type @e1 "text"\` | Type without clearing |
| \`agent-browser press Enter\` | Press a keyboard key |
| \`agent-browser scroll down 500\` | Scroll down by pixels |
| \`agent-browser get text @e1\` | Get text content |
| \`agent-browser get url\` | Get current URL |
| \`agent-browser wait @e1\` | Wait for element |
| \`agent-browser wait --load networkidle\` | Wait for network idle |
| \`agent-browser find text "X" click\` | Find element by text and click |
| \`agent-browser eval "js code"\` | Run JavaScript in page |

## Stop Interaction
Destroys the interactive session and releases all resources. Always stop sessions when done to avoid unnecessary billing.

## Session Behavior

- The first interact call creates a sandboxed browser session at the same page state as the scrape
- Subsequent calls reuse the same session — browser state persists between interactions
- Sessions expire after 10 minutes or 5 minutes of inactivity
- Credits: 2 credits per session minute, prorated by the second
- Always call Stop Interaction when finished

## Persistent Profiles

To maintain login state across scrapes, pass a \`profile\` when scraping:
- \`profile.name\`: Identifier for the profile. Scrapes with the same name share browser state (cookies, localStorage).
- \`profile.saveChanges\`: When true (default), state is saved when the session stops. Set to false for read-only access.

## Key Guidelines

- Always scrape a URL first to get a \`scrapeId\` before interacting
- Reuse the same \`scrapeId\` for multi-step interactions — state persists between calls
- CRITICAL: Match your content to the selected Mode. Prompt mode = natural language only. Code mode = valid code only for the selected Language.
- When using Code mode with Bash, always prefix commands with \`agent-browser\`
- When using Code mode with Node/Python, write valid Playwright code — never plain English
- Keep prompts small and focused on one task per call
- Always stop the session when done to save credits
- For simple content extraction without interaction, prefer the Scrape tool — it's simpler and cheaper`;

function createContextProperty(): INodeProperties {
	return {
		displayName: 'Context',
		name: 'interactContextText',
		type: 'string',
		typeOptions: {
			rows: 15,
		},
		noDataExpression: true,
		default: INTERACT_CONTEXT,
		description:
			'This tool MUST be called before using any other Interact tools. It provides context and instructions about the Firecrawl Interact API to the AI agent. Edit this to customize the instructions for your use case.',
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

function createInteractContextProperties(): INodeProperties[] {
	return [createContextProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	createInteractContextProperties(),
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
				const contextText = this.getNodeParameter('interactContextText', INTERACT_CONTEXT) as string;
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
