import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'browserCreate';
export const displayName = 'Create browser session';
export const operationName = 'browserCreate';
export const resourceName = 'Browser';

function createTtlProperty(): INodeProperties {
	return {
		displayName: 'TTL (Seconds)',
		name: 'ttl',
		type: 'number',
		default: 600,
		typeOptions: {
			minValue: 30,
			maxValue: 3600,
		},
		description:
			'Total session lifetime in seconds (30-3600). The browser session will be automatically destroyed after this duration, regardless of activity. Use shorter values for quick tasks and longer values for complex multi-step automations.',
		routing: {
			request: {
				body: {
					ttl: '={{ $value }}',
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

function createActivityTtlProperty(): INodeProperties {
	return {
		displayName: 'Activity TTL (Seconds)',
		name: 'activityTtl',
		type: 'number',
		default: 300,
		typeOptions: {
			minValue: 10,
			maxValue: 3600,
		},
		description:
			'Seconds of inactivity before the session is automatically destroyed (10-3600). If no code is executed or no interaction occurs within this window, the session ends early. Set higher for sessions where you may have long pauses between actions.',
		routing: {
			request: {
				body: {
					activityTtl: '={{ $value }}',
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

function createProfileProperty(): INodeProperties {
	return {
		displayName: 'Profile',
		name: 'profile',
		type: 'fixedCollection',
		default: {},
		description:
			'Enable persistent storage across browser sessions. Use profiles to maintain cookies, localStorage, and other browser state between sessions. Sessions with the same profile name share storage, allowing you to stay logged in or preserve settings across multiple runs.',
		options: [
			{
				displayName: 'Profile Settings',
				name: 'settings',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
						description:
							'A unique name for the profile (1-128 characters). Sessions with the same name share storage. Use descriptive names like "gmail-account" or "dashboard-session" to organize your profiles.',
					},
					{
						displayName: 'Save Changes',
						name: 'saveChanges',
						type: 'boolean',
						default: true,
						description:
							'Whether to save browser state (cookies, localStorage, etc.) back to the profile when the session closes. Set to false to load existing profile data without writing changes. Only one saving session per profile is allowed at a time.',
					},
				],
			},
		],
		routing: {
			request: {
				body: {
					profile:
						'={{$value.settings ? { name: $value.settings.name, saveChanges: $value.settings.saveChanges } : undefined}}',
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

function createBrowserCreateProperties(): INodeProperties[] {
	return [
		createOperationNotice(resourceName, name, 'POST'),
		createTtlProperty(),
		createActivityTtlProperty(),
		createProfileProperty(),
	];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	createBrowserCreateProperties(),
);

options.routing = {
	request: {
		method: 'POST',
		url: '=/browser',
	},
};

export { options, properties };
