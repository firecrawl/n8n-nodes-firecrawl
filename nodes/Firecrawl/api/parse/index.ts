import {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { buildApiProperties } from '../common';

export const name = 'parse';
export const displayName = 'Parse File';
export const action = 'Parse file';
export const description =
	'Convert an uploaded file (PDF, Word, Excel, PowerPoint, HTML and more) into clean, LLM-ready data';
export const operationName = 'parse';
export const resourceName = 'Scraping';

function createBinaryPropertyNameProperty(): INodeProperties {
	return {
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		placeholder: 'e.g. data',
		description:
			'Name of the binary property on the incoming item that holds the file to parse. Up to 50 MB. Supported types: HTML, PDF, DOC/DOCX, ODT/ODS/ODP, RTF, XLS/XLSX, PPT/PPTX, EPUB and CSV. The file type is detected from the file name or MIME type.',
		routing: {
			send: {
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName') as string;
						const parseOptions = this.getNodeParameter('parseOptions', {}) as IDataObject;

						const binaryData = this.helpers.assertBinaryData(binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);
						if (buffer.length === 0) {
							throw new NodeOperationError(this.getNode(), 'The binary file is empty.');
						}

						const options: IDataObject = { integration: 'n8n' };
						const formats = parseOptions.formats as string[] | undefined;
						if (formats?.length) {
							options.formats = formats.map((type) => ({ type }));
						}
						for (const key of ['onlyMainContent', 'removeBase64Images', 'timeout']) {
							if (parseOptions[key] !== undefined) {
								options[key] = parseOptions[key];
							}
						}
						if (parseOptions.pdfMode || parseOptions.maxPages) {
							const parser: IDataObject = { type: 'pdf' };
							if (parseOptions.pdfMode) parser.mode = parseOptions.pdfMode;
							if (parseOptions.maxPages) parser.maxPages = parseOptions.maxPages;
							options.parsers = [parser];
						}

						const fileName = (binaryData.fileName || 'upload').replace(/[\r\n"]/g, '_');
						const mimeType = binaryData.mimeType || 'application/octet-stream';
						const boundary = `n8nFirecrawl${Date.now().toString(16)}${Math.random()
							.toString(16)
							.slice(2)}`;

						requestOptions.body = Buffer.concat([
							Buffer.from(
								`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: ${mimeType}\r\n\r\n`,
							),
							buffer,
							Buffer.from(
								`\r\n--${boundary}\r\nContent-Disposition: form-data; name="options"\r\n\r\n${JSON.stringify(
									options,
								)}\r\n--${boundary}--\r\n`,
							),
						]);
						requestOptions.headers = {
							...requestOptions.headers,
							'Content-Type': `multipart/form-data; boundary=${boundary}`,
						};

						return requestOptions;
					},
				],
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

function createParseOptionsProperty(): INodeProperties {
	return {
		displayName: 'Options',
		name: 'parseOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		description: 'Additional parse options sent with the uploaded file',
		options: [
			{
				displayName: 'Formats',
				name: 'formats',
				type: 'multiOptions',
				default: ['markdown'],
				description:
					'Output formats to return. Defaults to Markdown. Browser-rendering formats such as screenshots are not supported for uploaded files.',
				options: [
					{ name: 'HTML', value: 'html' },
					{ name: 'Images', value: 'images' },
					{ name: 'Links', value: 'links' },
					{ name: 'Markdown', value: 'markdown' },
					{ name: 'Raw HTML', value: 'rawHtml' },
					{ name: 'Summary', value: 'summary' },
				],
			},
			{
				displayName: 'Max Pages (PDF)',
				name: 'maxPages',
				type: 'number',
				default: 100,
				typeOptions: {
					minValue: 1,
					maxValue: 10000,
				},
				description: 'Maximum number of pages to parse from a PDF',
			},
			{
				displayName: 'Only Main Content',
				name: 'onlyMainContent',
				type: 'boolean',
				default: true,
				description:
					'Whether to remove navigation, headers, footers and other boilerplate from HTML files. Disable to keep the full document.',
			},
			{
				displayName: 'PDF Mode',
				name: 'pdfMode',
				type: 'options',
				default: 'auto',
				description: 'How PDFs are parsed',
				options: [
					{
						name: 'Auto',
						value: 'auto',
						description: 'Text extraction first, with OCR fallback',
					},
					{
						name: 'Fast',
						value: 'fast',
						description: 'Text-only extraction',
					},
					{
						name: 'OCR',
						value: 'ocr',
						description: 'Run OCR on every page',
					},
				],
			},
			{
				displayName: 'Remove Base64 Images',
				name: 'removeBase64Images',
				type: 'boolean',
				default: true,
				description:
					'Whether to strip embedded base64 images from the output while preserving alt text',
			},
			{
				displayName: 'Timeout (Ms)',
				name: 'timeout',
				type: 'number',
				default: 30000,
				typeOptions: {
					minValue: 1000,
					maxValue: 300000,
				},
				description:
					'Maximum time in milliseconds to wait for parsing. Maximum 300000 (5 minutes).',
			},
		],
		displayOptions: {
			show: {
				resource: [resourceName],
				operation: [operationName],
			},
		},
	};
}

function createParseProperties(): INodeProperties[] {
	return [createBinaryPropertyNameProperty(), createParseOptionsProperty()];
}

const { options, properties } = buildApiProperties(
	name,
	displayName,
	action,
	description,
	createParseProperties(),
);

options.routing = {
	request: {
		method: 'POST',
		url: '=/parse',
	},
};

export { options, properties };
