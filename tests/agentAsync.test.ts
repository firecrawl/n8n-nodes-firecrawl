import assert from 'node:assert/strict';
import test from 'node:test';

import { agentAsyncItem } from '../nodes/Firecrawl/api/agentAsync/response.ts';

test('an async agent start returns the job body', () => {
	const item = agentAsyncItem({ success: true, id: 'job_1' });
	assert.equal(item.json.id, 'job_1');
	assert.equal(item.json.success, true);
	assert.equal('data' in item.json, false);
});

test('a missing body does not invent a job', () => {
	assert.deepEqual(agentAsyncItem(undefined).json, {});
	assert.deepEqual(agentAsyncItem('not-json').json, {});
});
