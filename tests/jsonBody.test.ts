import assert from 'node:assert/strict';
import test from 'node:test';

import { copyJsonBody, jsonBodyItem } from '../nodes/Firecrawl/api/jsonBody.ts';

test('a JSON object body is the item', () => {
	const item = jsonBodyItem({ success: true, id: 'job_1', status: 'completed' });
	assert.equal(item.json.id, 'job_1');
	assert.equal(item.json.status, 'completed');
	assert.equal('data' in item.json, false);
});

test('a missing or non-object body does not invent fields', () => {
	assert.deepEqual(jsonBodyItem(undefined).json, {});
	assert.deepEqual(jsonBodyItem('not-json').json, {});
	assert.deepEqual(jsonBodyItem(['https://example.test']).json, {});
});

test('copyJsonBody replaces every incoming item with that body', async () => {
	const response = { body: { id: 'crawl_1', status: 'scraping' } };
	const items = await copyJsonBody.call(
		{} as never,
		[{ json: { old: true } }, { json: { old: true } }] as never,
		response as never,
	);
	assert.equal(items.length, 2);
	assert.deepEqual(items[0].json, { id: 'crawl_1', status: 'scraping' });
	assert.deepEqual(items[1].json, { id: 'crawl_1', status: 'scraping' });
});

test('copyJsonBody still emits one item when the input list is empty', async () => {
	const items = await copyJsonBody.call({} as never, [] as never, {
		body: { id: 'batch_1' },
	} as never);
	assert.deepEqual(items, [{ json: { id: 'batch_1' } }]);
});
