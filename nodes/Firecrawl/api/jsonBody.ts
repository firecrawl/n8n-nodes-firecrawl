import type {
	IExecuteSingleFunctions,
	INodeExecutionData,
	IN8nHttpFullResponse,
} from 'n8n-workflow';

/**
 * n8n's `setKeyValue` output action replaces the item with only the keys it
 * sets, and resolving `={{$response.body}}` drops an object body, so the node
 * emitted `{}`. Hand the API body through as the item.
 */
export function jsonBodyItem(body: unknown): { json: Record<string, unknown> } {
	if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
		return { json: { ...(body as Record<string, unknown>) } };
	}
	return { json: {} };
}

export async function copyJsonBody(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const item = jsonBodyItem(response.body) as INodeExecutionData;
	return items.length === 0 ? [item] : items.map(() => item);
}
