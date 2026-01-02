import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MercadoPagoApi implements ICredentialType {
	name = 'mercadoPagoApi';
	displayName = 'Mercado Pago API';
	documentationUrl = 'https://www.mercadopago.com.br/developers/pt/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Token de acesso do Mercado Pago. Obtenha em: https://www.mercadopago.com.br/developers/panel/credentials',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.mercadopago.com',
			required: false,
			description: 'URL base da API do Mercado Pago (padrão: https://api.mercadopago.com). Deixe em branco para usar o padrão.',
		},
	];
}

