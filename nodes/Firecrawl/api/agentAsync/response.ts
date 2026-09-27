/**
 * The async agent call returns the created job. n8n's `setKeyValue` output
 * action replaces the item with only the keys it sets, and resolving
 * `={{$response.body}}` drops an object body, so the node emitted `{}`.
 * Hand the API body through as the item.
 */
export function agentAsyncItem(body: unknown): { json: Record<string, unknown> } {
	if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
		return { json: { ...(body as Record<string, unknown>) } };
	}
	return { json: {} };
}
