/**
 * Testes de integração para operações de IdentificationTypes
 */

import { IdentificationTypesResource } from '../../nodes/MercadoPago/resources/IdentificationTypesResource';
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

describe('IdentificationTypesResource Integration Tests', () => {
	let resource: IdentificationTypesResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	const mockIdentificationTypes = [
		{
			id: 'CPF',
			name: 'CPF',
			type: 'number',
			min_length: 11,
			max_length: 11,
		},
		{
			id: 'CNPJ',
			name: 'CNPJ',
			type: 'number',
			min_length: 14,
			max_length: 14,
		},
		{
			id: 'DNI',
			name: 'DNI',
			type: 'number',
			min_length: 8,
			max_length: 8,
		},
	];

	beforeEach(() => {
		resource = new IdentificationTypesResource();
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
		it('deve listar tipos de identificação com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => '');

			(apiRequest as jest.Mock).mockResolvedValue(mockIdentificationTypes);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'identificationTypes');

			// Assert
			expect(result).toEqual(mockIdentificationTypes);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET', // Method (context not captured by mock)
				'/v1/identification_types', // Endpoint
				undefined, // Body
				{} // Query string
			);
		});

		it('deve listar tipos de identificação filtrados por site', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					siteId: 'MLB',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockIdentificationTypes);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'identificationTypes');

			// Assert
			expect(result).toEqual(mockIdentificationTypes);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET', // Method (context not captured by mock)
				'/v1/identification_types', // Endpoint
				undefined, // Body
				{ site_id: 'MLB' } // Query string
			);
		});
	});

	describe('error handling', () => {
		it('deve lançar erro para operação não suportada', async () => {
			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'invalid', 'identificationTypes')
			).rejects.toThrow('Operação "invalid" não é suportada');
		});
	});
});

