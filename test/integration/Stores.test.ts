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

	describe('create', () => {
		it('deve criar store com sucesso', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'name' ? 'Test Store' : name === 'userId' ? '123456789' : undefined;
			});

			(apiRequest as jest.Mock).mockResolvedValue({ id: '60030440', name: 'Test Store' });

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'stores');

			expect(result.name).toBe('Test Store');
			expect(apiRequest).toHaveBeenCalled();
		});

		it('deve criar store com externalId', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					name: 'Test Store',
					userId: '123456789',
					externalId: 'EXT-123',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue({ id: '60030440', name: 'Test Store', external_id: 'EXT-123' });

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'stores');

			expect(result.external_id).toBe('EXT-123');
		});

		it('deve criar store com location', async () => {
			const location = { latitude: -23.5505, longitude: -46.6333 };
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					name: 'Test Store',
					userId: '123456789',
					location: location,
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue({ id: '60030440', name: 'Test Store', location });

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'stores');

			expect(result.location).toEqual(location);
		});

		it('deve lançar erro quando name não é fornecido', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'userId' ? '123456789' : undefined;
			});

			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'stores')
			).rejects.toThrow('Campos obrigatórios');
		});

		it('deve lançar erro quando userId não é fornecido', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'name' ? 'Test Store' : undefined;
			});

			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'stores')
			).rejects.toThrow('Campos obrigatórios');
		});
	});

	describe('get', () => {
		it('deve consultar store existente', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'storeId' ? '60030440' : undefined;
			});

			(apiRequest as jest.Mock).mockResolvedValue({ id: '60030440', name: 'Test Store' });

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'stores');

			expect(result.id).toBe('60030440');
			expect(apiRequest).toHaveBeenCalled();
		});

		it('deve lançar erro quando storeId não é fornecido', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => undefined);

			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'stores')
			).rejects.toThrow('ID da loja é obrigatório');
		});
	});

	describe('update', () => {
		it('deve atualizar store com sucesso', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					storeId: '60030440',
					name: 'Updated Store Name',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue({ id: '60030440', name: 'Updated Store Name' });

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'update', 'stores');

			expect(result.name).toBe('Updated Store Name');
			expect(apiRequest).toHaveBeenCalled();
		});

		it('deve atualizar store com location', async () => {
			const location = { latitude: -23.5505, longitude: -46.6333 };
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					storeId: '60030440',
					location: location,
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue({ id: '60030440', location });

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'update', 'stores');

			expect(result.location).toEqual(location);
		});

		it('deve lançar erro quando storeId não é fornecido', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => undefined);

			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'update', 'stores')
			).rejects.toThrow('ID da loja é obrigatório');
		});

		it('deve lançar erro quando nenhum campo é fornecido para atualização', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'storeId' ? '60030440' : undefined;
			});

			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'update', 'stores')
			).rejects.toThrow('Pelo menos um campo deve ser fornecido');
		});
	});

	describe('delete', () => {
		it('deve deletar store com sucesso', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					storeId: '60030440',
					userId: '123456789',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue({});

			await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'delete', 'stores');

			expect(apiRequest).toHaveBeenCalled();
		});

		it('deve lançar erro quando storeId não é fornecido', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'userId' ? '123456789' : undefined;
			});

			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'delete', 'stores')
			).rejects.toThrow('ID da loja e ID do usuário são obrigatórios');
		});

		it('deve lançar erro quando userId não é fornecido', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'storeId' ? '60030440' : undefined;
			});

			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'delete', 'stores')
			).rejects.toThrow('ID da loja e ID do usuário são obrigatórios');
		});
	});

	describe('list', () => {
		it('deve listar stores com sucesso', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				return name === 'userId' ? '123456789' : undefined;
			});

			(apiRequest as jest.Mock).mockResolvedValue([
				{ id: '60030440', name: 'Store 1' },
				{ id: '60030441', name: 'Store 2' },
			]);

			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'stores');

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2);
			expect(apiRequest).toHaveBeenCalled();
		});

		it('deve lançar erro quando userId não é fornecido', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => undefined);

			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'stores')
			).rejects.toThrow('ID do usuário é obrigatório');
		});
	});

	describe('error handling', () => {
		it('deve lançar erro para operação não suportada', async () => {
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'invalid', 'stores')
			).rejects.toThrow('não é suportada');
		});
	});
});

