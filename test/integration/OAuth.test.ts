/**
 * Testes de integração para operações de OAuth
 */

import { OAuthResource } from '../../nodes/MercadoPago/resources/OAuthResource';
import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../nodes/MercadoPago/GenericFunctions';

jest.mock('../../nodes/MercadoPago/GenericFunctions', () => ({
	apiRequest: jest.fn(),
}));

describe('OAuthResource Integration Tests', () => {
	let resource: OAuthResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	beforeEach(() => {
		resource = new OAuthResource();
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'TEST-TOKEN',
				baseUrl: 'https://api.mercadopago.com',
			}),
			helpers: { request: jest.fn() } as any,
		};
		jest.clearAllMocks();
	});

	it('deve autorizar com sucesso', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			const params: { [key: string]: any } = {
				clientId: 'app_id',
				clientSecret: 'secret',
				code: 'auth_code',
				redirectUri: 'https://example.com/callback',
			};
			return params[name];
		});

		(apiRequest as jest.Mock).mockResolvedValue({ access_token: 'token', refresh_token: 'refresh' });

		const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'authorize', 'oauth');

		expect(result).toHaveProperty('access_token');
		expect(apiRequest).toHaveBeenCalledWith(
			'POST', // Method (context not captured by mock)
			'oauth/token', // Endpoint
			expect.stringContaining('grant_type=authorization_code'), // Body
			undefined, // Query string
			expect.objectContaining({ 'Content-Type': 'application/x-www-form-urlencoded' }) // Headers
		);
	});

	it('deve renovar token com sucesso', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			return name === 'clientSecret' ? 'secret' : name === 'refreshToken' ? 'refresh_token' : undefined;
		});

		(apiRequest as jest.Mock).mockResolvedValue({ access_token: 'new_token' });

		const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'refresh_token', 'oauth');

		expect(result).toHaveProperty('access_token');
		expect(apiRequest).toHaveBeenCalledWith(
			'POST', // Method (context not captured by mock)
			'oauth/token', // Endpoint
			expect.stringContaining('grant_type=refresh_token'), // Body
			undefined, // Query string
			expect.objectContaining({ 'Content-Type': 'application/x-www-form-urlencoded' }) // Headers
		);
	});
});

