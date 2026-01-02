import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { handleMercadoPagoError } from './helpers';
import { MercadoPagoApiCredentials } from './types';

/**
 * Função genérica para fazer requisições à API do Mercado Pago
 * 
 * @param this - Contexto do n8n (IExecuteFunctions)
 * @param method - Método HTTP (GET, POST, PUT, DELETE, PATCH)
 * @param endpoint - Endpoint da API (ex: '/v1/payments')
 * @param body - Corpo da requisição (opcional)
 * @param qs - Query string parameters (opcional)
 * @param headers - Headers customizados (opcional)
 * @returns Promise com a resposta da API
 */
export async function apiRequest(
	this: IExecuteFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	endpoint: string,
	body?: any,
	qs?: any,
	headers?: Record<string, string>
): Promise<any> {
	const credentials = (await this.getCredentials('mercadoPagoApi')) as MercadoPagoApiCredentials;

	if (!credentials?.accessToken) {
		throw new Error('Access Token é obrigatório. Configure as credenciais do Mercado Pago.');
	}

	const baseUrl = credentials.baseUrl || 'https://api.mercadopago.com';
	
	// Remove leading slash from endpoint if present
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	const url = `${baseUrl}/${cleanEndpoint}`;

	const requestOptions: IHttpRequestOptions = {
		method,
		url,
		headers: {
			'Authorization': `Bearer ${credentials.accessToken}`,
			'Content-Type': 'application/json',
			...headers,
		},
		json: true,
	};

	if (body) {
		requestOptions.body = body;
	}

	if (qs) {
		requestOptions.qs = qs;
	}

	try {
		const response = await this.helpers.request(requestOptions);
		return response;
	} catch (error: any) {
		const mercadoPagoError = handleMercadoPagoError(error);
		throw new Error(mercadoPagoError.message);
	}
}

/**
 * Helper para construir URLs com path parameters
 * 
 * @param template - Template da URL (ex: '/v1/payments/:id')
 * @param params - Objeto com os parâmetros (ex: { id: '123' })
 * @returns URL com parâmetros substituídos
 */
export function buildUrl(template: string, params: Record<string, string | number>): string {
	let url = template;
	
	for (const [key, value] of Object.entries(params)) {
		url = url.replace(`:${key}`, String(value));
	}
	
	return url;
}

/**
 * Helper para construir query string a partir de objeto
 * 
 * @param params - Objeto com parâmetros de query
 * @returns String de query formatada
 */
export function buildQueryString(params: Record<string, any>): string {
	const queryParams: string[] = [];
	
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			if (Array.isArray(value)) {
				value.forEach((item) => {
					queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
				});
			} else {
				queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
			}
		}
	}
	
	return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
}

