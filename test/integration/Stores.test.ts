/**
 * Testes de integração para operações de Stores
 */

import { StoresResource } from '../../nodes/MercadoPago/resources/StoresResource';
import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../nodes/MercadoPago/GenericFunctions';

jest.mock('../../nodes/MercadoPago/GenericFunctions', () => ({
	apiRequest: jest.fn(),
}));

describe('StoresResource Integration Tests', () => {
	let resource: StoresResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	beforeEach(() => {
		resource = new StoresResource();
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

	it('deve criar store com sucesso', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			return name === 'name' ? 'Test Store' : name === 'userId' ? '123456789' : undefined;
		});

		(apiRequest as jest.Mock).mockResolvedValue({ id: '60030440', name: 'Test Store' });

		const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'stores');

		expect(result.name).toBe('Test Store');
		expect(apiRequest).toHaveBeenCalledWith(
			'POST', // Method (context not captured by mock)
			'users/123456789/stores', // Endpoint
			expect.objectContaining({ name: 'Test Store' }) // Body
		);
	});

	it('deve consultar store existente', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			return name === 'storeId' ? '60030440' : undefined;
		});

		(apiRequest as jest.Mock).mockResolvedValue({ id: '60030440', name: 'Test Store' });

		const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'stores');

		expect(result.id).toBe('60030440');
		expect(apiRequest).toHaveBeenCalledWith(
			'GET', // Method (context not captured by mock)
			'stores/60030440' // Endpoint
		);
	});
});

