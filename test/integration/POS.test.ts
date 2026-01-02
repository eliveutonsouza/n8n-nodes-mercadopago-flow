/**
 * Testes de integração para operações de POS
 */

import { POSResource } from '../../nodes/MercadoPago/resources/POSResource';
import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../nodes/MercadoPago/GenericFunctions';

// Mock do apiRequest
jest.mock('../../nodes/MercadoPago/GenericFunctions', () => ({
	apiRequest: jest.fn(),
	buildUrl: jest.fn(),
}));

describe('POSResource Integration Tests', () => {
	let resource: POSResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	const mockPOSResponse = {
		id: 96444399,
		name: 'First POS',
		fixed_amount: true,
		category: 621102,
		store_id: '60030440',
		external_id: 'SUC002POS001',
		status: 'active',
		date_created: '2024-02-09T12:47:05.000-04:00',
	};

	beforeEach(() => {
		resource = new POSResource();
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'TEST-TOKEN',
				baseUrl: 'https://api.mercadopago.com',
			}),
			helpers: {
				request: jest.fn(),
			} as any,
		};
		jest.clearAllMocks();
	});

	describe('create', () => {
		it('deve criar POS com sucesso', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					name: 'First POS',
					category: 621102,
					storeId: 60030440,
					fixedAmount: true,
					externalId: 'SUC002POS001',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockPOSResponse);

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'pos');

			expect(result).toEqual(mockPOSResponse);
			expect(apiRequest).toHaveBeenCalled();
			const callArgs = (apiRequest as jest.Mock).mock.calls[0];
			expect(callArgs[0]).toBe('POST');
			expect(callArgs[1]).toBe('pos');
			expect(callArgs[2]).toMatchObject({
				name: 'First POS',
				category: 621102,
				store_id: 60030440,
				fixed_amount: true,
			});
		});
	});

	describe('get', () => {
		it('deve consultar POS existente', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'posId' ? '96444399' : undefined;
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockPOSResponse);

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'pos');

			expect(result).toEqual(mockPOSResponse);
			expect(apiRequest).toHaveBeenCalledWith( 'GET', 'pos/96444399');
		});
	});

	describe('update', () => {
		it('deve atualizar POS com sucesso', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					posId: '96444399',
					name: 'Updated POS',
				};
				return params[name];
			});

			const updatedResponse = { ...mockPOSResponse, name: 'Updated POS' };
			(apiRequest as jest.Mock).mockResolvedValue(updatedResponse);

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'update', 'pos');

			expect(result.name).toBe('Updated POS');
			expect(apiRequest).toHaveBeenCalled();
			const callArgs = (apiRequest as jest.Mock).mock.calls[0];
			expect(callArgs[0]).toBe('PUT');
			expect(callArgs[1]).toBe('pos/96444399');
			expect(callArgs[2]).toMatchObject({ name: 'Updated POS' });
		});
	});

	describe('delete', () => {
		it('deve deletar POS com sucesso', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'posId' ? '96444399' : undefined;
			});

			(apiRequest as jest.Mock).mockResolvedValue({});

			await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'delete', 'pos');

			expect(apiRequest).toHaveBeenCalledWith( 'DELETE', 'pos/96444399');
		});
	});

	describe('list', () => {
		it('deve listar POS com sucesso', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => undefined);

			const listResponse = {
				results: [mockPOSResponse],
				paging: { total: 1, limit: 30, offset: 0 },
			};

			(apiRequest as jest.Mock).mockResolvedValue(listResponse);

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'pos');

			expect(result).toEqual(listResponse);
			expect(apiRequest).toHaveBeenCalledWith( 'GET', 'pos', undefined, {});
		});
	});
});

