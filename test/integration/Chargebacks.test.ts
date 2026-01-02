/**
 * Testes de integração para operações de Chargebacks
 */

import { ChargebacksResource } from '../../nodes/MercadoPago/resources/ChargebacksResource';
import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../nodes/MercadoPago/GenericFunctions';

jest.mock('../../nodes/MercadoPago/GenericFunctions', () => ({
	apiRequest: jest.fn(),
}));

describe('ChargebacksResource Integration Tests', () => {
	let resource: ChargebacksResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	beforeEach(() => {
		resource = new ChargebacksResource();
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

	it('deve consultar chargeback existente', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			return name === 'chargebackId' ? '123456' : undefined;
		});

		(apiRequest as jest.Mock).mockResolvedValue({ id: '123456', status: 'pending' });

		const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'chargebacks');

		expect(result.id).toBe('123456');
		expect(apiRequest).toHaveBeenCalled();
		const callArgs = (apiRequest as jest.Mock).mock.calls[0];
		expect(callArgs[0]).toBe('GET');
		expect(callArgs[1]).toBe('v1/chargebacks/123456');
	});

	it('deve listar chargebacks', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => undefined);

		(apiRequest as jest.Mock).mockResolvedValue({ results: [], paging: { total: 0 } });

		const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'chargebacks');

		expect(result).toHaveProperty('results');
		expect(apiRequest).toHaveBeenCalled();
		const callArgs = (apiRequest as jest.Mock).mock.calls[0];
		expect(callArgs[0]).toBe('GET');
		expect(callArgs[1]).toBe('v1/chargebacks');
	});
});

