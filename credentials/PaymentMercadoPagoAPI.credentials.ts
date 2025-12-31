import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PaymentMercadoPagoAPI implements ICredentialType {
	name = 'paymentMercadoPagoAPI';
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
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'ID do cliente (opcional, usado para algumas operações)',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Secret do cliente (opcional, usado para algumas operações)',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
				{
					name: 'Production',
					value: 'production',
				},
			],
			default: 'sandbox',
			description: 'Ambiente de execução',
		},
	];
}

