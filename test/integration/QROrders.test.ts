/**
 * Testes de integração para operações de QR Orders
 */

import { QROrdersResource } from '../../nodes/MercadoPago/resources/QROrdersResource';
import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../nodes/MercadoPago/GenericFunctions';

// Mock do apiRequest
jest.mock('../../nodes/MercadoPago/GenericFunctions', () => ({
	apiRequest: jest.fn(),
	buildUrl: jest.fn((template: string, params: Record<string, string | number>) => {
		let url = template;
		for (const [key, value] of Object.entries(params)) {
			url = url.replace(`:${key}`, String(value));
		}
		return url;
	}),
}));

describe('QROrdersResource Integration Tests', () => {
	let resource: QROrdersResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	const mockOrderResponse = {
		id: 'ORDTST01K0EPV4K8S54GADYVVA8WBV8B',
		type: 'qr',
		processing_mode: 'automatic',
		external_reference: 'ext_ref_test',
		description: 'Smartphone',
		total_amount: '50.00',
		status: 'created',
		currency: 'ARS',
		created_date: '2025-07-18T12:06:17.66Z',
		config: {
			qr: {
				external_pos_id: 'SUC003POS001',
				mode: 'static',
			},
		},
		items: [
			{
				title: 'Smartphone',
				unit_price: '50.00',
				quantity: 1,
			},
		],
	};

	beforeEach(() => {
		resource = new QROrdersResource();
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
		it('deve criar QR order com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					totalAmount: 50.00,
					description: 'Smartphone',
					externalPosId: 'SUC003POS001',
					qrMode: 'static',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockOrderResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'qrOrders');

			// Assert
			expect(result).toEqual(mockOrderResponse);
			expect(apiRequest).toHaveBeenCalled();
			const callArgs = (apiRequest as jest.Mock).mock.calls[0];
			expect(callArgs[0]).toBe('POST');
			expect(callArgs[1]).toBe('v1/orders');
			expect(callArgs[2]).toMatchObject({
				type: 'qr',
				total_amount: '50',
				description: 'Smartphone',
				config: {
					qr: {
						external_pos_id: 'SUC003POS001',
						mode: 'static',
					},
				},
			});
		});

		it('deve validar campos obrigatórios', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					totalAmount: 50.00,
					// description faltando
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'qrOrders')
			).rejects.toThrow('Campos obrigatórios');
		});

		it('deve incluir campos opcionais quando fornecidos', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					totalAmount: 50.00,
					description: 'Smartphone',
					externalPosId: 'SUC003POS001',
					qrMode: 'static',
					externalReference: 'ext_ref_test',
					expirationTime: 'PT16M',
					platformId: 'dev_1234567890',
					integratorId: 'dev_1234',
					idempotencyKey: 'idempotency-key-123',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockOrderResponse);

			// Act
			await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'qrOrders');

			// Assert
			expect(apiRequest).toHaveBeenCalledWith(
				'POST',
				'v1/orders',
				expect.objectContaining({
					external_reference: 'ext_ref_test',
					expiration_time: 'PT16M',
					integration_data: {
						platform_id: 'dev_1234567890',
						integrator_id: 'dev_1234',
					},
				}),
				undefined,
				expect.objectContaining({
					'X-Idempotency-Key': 'idempotency-key-123',
				})
			);
		});
	});

	describe('get', () => {
		it('deve consultar QR order existente', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					orderId: 'ORDTST01K0EPV4K8S54GADYVVA8WBV8B',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockOrderResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'qrOrders');

			// Assert
			expect(result).toEqual(mockOrderResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'v1/orders/ORDTST01K0EPV4K8S54GADYVVA8WBV8B'
			);
		});

		it('deve validar orderId obrigatório', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					orderId: '',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'qrOrders')
			).rejects.toThrow('ID do pedido é obrigatório');
		});
	});

	describe('list', () => {
		it('deve listar QR orders com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => {
				return undefined;
			});

			const listResponse = {
				results: [mockOrderResponse],
				paging: { total: 1, limit: 10, offset: 0 },
			};

			(apiRequest as jest.Mock).mockResolvedValue(listResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'qrOrders');

			// Assert
			expect(result).toEqual(listResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'v1/orders',
				undefined,
				{}
			);
		});

		it('deve incluir query parameters quando fornecidos', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					externalReference: 'ext_ref_test',
					status: 'created',
					limit: 20,
					offset: 10,
				};
				return params[name];
			});

			const listResponse = {
				results: [mockOrderResponse],
				paging: { total: 1, limit: 20, offset: 10 },
			};

			(apiRequest as jest.Mock).mockResolvedValue(listResponse);

			// Act
			await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'qrOrders');

			// Assert
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'v1/orders',
				undefined,
				expect.objectContaining({
					external_reference: 'ext_ref_test',
					status: 'created',
					limit: 20,
					offset: 10,
				})
			);
		});
	});
});

