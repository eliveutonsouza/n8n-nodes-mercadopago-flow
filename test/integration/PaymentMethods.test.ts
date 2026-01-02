/**
 * Testes de integração para operações de PaymentMethods
 */

import { PaymentMethodsResource } from '../../nodes/MercadoPago/resources/PaymentMethodsResource';
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

describe('PaymentMethodsResource Integration Tests', () => {
	let resource: PaymentMethodsResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	const mockPaymentMethods = [
		{
			id: 'visa',
			name: 'Visa',
			payment_type_id: 'credit_card',
		},
		{
			id: 'master',
			name: 'Mastercard',
			payment_type_id: 'credit_card',
		},
		{
			id: 'pix',
			name: 'PIX',
			payment_type_id: 'bank_transfer',
		},
	];

	beforeEach(() => {
		resource = new PaymentMethodsResource();
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

	describe('list', () => {
		it('deve listar métodos de pagamento com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => '');

			(apiRequest as jest.Mock).mockResolvedValue(mockPaymentMethods);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'paymentMethods');

			// Assert
			expect(result).toEqual(mockPaymentMethods);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET', // Method (context not captured by mock)
				'/v1/payment_methods', // Endpoint
				undefined, // Body
				{} // Query string
			);
		});

		it('deve listar métodos de pagamento filtrados por site', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					siteId: 'MLB',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockPaymentMethods);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'paymentMethods');

			// Assert
			expect(result).toEqual(mockPaymentMethods);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET', // Method (context not captured by mock)
				'/v1/payment_methods', // Endpoint
				undefined, // Body
				{ site_id: 'MLB' } // Query string
			);
		});
	});

	describe('error handling', () => {
		it('deve lançar erro para operação não suportada', async () => {
			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'invalid', 'paymentMethods')
			).rejects.toThrow('Operação "invalid" não é suportada');
		});
	});
});

