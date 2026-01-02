/**
 * Testes de integração para operações de Preferences
 */

import { PreferencesResource } from '../../nodes/MercadoPago/resources/PreferencesResource';
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

describe('PreferencesResource Integration Tests', () => {
	let resource: PreferencesResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	const mockPreference = {
		id: '1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d',
		items: [
			{
				id: '010983098',
				title: 'My Product',
				quantity: 1,
				unit_price: 2000,
				description: 'Description of my product',
				category_id: 'retail',
			},
		],
		auto_return: 'approved',
		back_urls: {
			success: 'https://example.com/success',
			failure: 'https://example.com/failure',
			pending: 'https://example.com/pending',
		},
		init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d',
		date_created: '2024-02-05T08:18:54.471-04:00',
	};

	beforeEach(() => {
		resource = new PreferencesResource();
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
		it('deve criar preferência com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					items: JSON.stringify([
						{
							id: '010983098',
							title: 'My Product',
							quantity: 1,
							unit_price: 2000,
							description: 'Description of my product',
							category_id: 'retail',
						},
					]),
					autoReturn: 'approved',
					backUrlSuccess: 'https://example.com/success',
					externalReference: 'REF-123',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockPreference);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'preferences');

			// Assert
			expect(result).toEqual(mockPreference);
			expect(apiRequest).toHaveBeenCalledWith(
				'POST',
				'/checkout/preferences',
				expect.objectContaining({
					items: expect.arrayContaining([
						expect.objectContaining({
							title: 'My Product',
							unit_price: 2000,
						}),
					]),
				})
			);
		});

		it('deve lançar erro quando items não é fornecido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => '[]');

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'preferences')
			).rejects.toThrow('Pelo menos um item é obrigatório');
		});

		it('deve validar email do pagador quando fornecido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					items: JSON.stringify([{ id: '1', title: 'Product', quantity: 1, unit_price: 100 }]),
					payerEmail: 'invalid-email',
				};
				return params[name] ?? '';
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'preferences')
			).rejects.toThrow('Email do pagador inválido');
		});
	});

	describe('get', () => {
		it('deve buscar preferência por ID com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					preferenceId: '1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockPreference);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'preferences');

			// Assert
			expect(result).toEqual(mockPreference);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/checkout/preferences/1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d'
			);
		});

		it('deve lançar erro quando preferenceId não é fornecido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => '');

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'preferences')
			).rejects.toThrow('ID da preferência é obrigatório');
		});
	});

	describe('update', () => {
		it('deve atualizar preferência com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					preferenceId: '1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d',
					externalReference: 'REF-UPDATED',
					notificationUrl: 'https://example.com/webhook',
				};
				return params[name] ?? '';
			});

			const updatedPreference = { ...mockPreference, external_reference: 'REF-UPDATED' };
			(apiRequest as jest.Mock).mockResolvedValue(updatedPreference);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'update', 'preferences');

			// Assert
			expect(result).toEqual(updatedPreference);
			expect(apiRequest).toHaveBeenCalledWith(
				'PUT',
				'/checkout/preferences/1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d',
				expect.objectContaining({
					external_reference: 'REF-UPDATED',
				})
			);
		});
	});

	describe('error handling', () => {
		it('deve lançar erro para operação não suportada', async () => {
			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'invalid', 'preferences')
			).rejects.toThrow('Operação "invalid" não é suportada');
		});
	});
});

