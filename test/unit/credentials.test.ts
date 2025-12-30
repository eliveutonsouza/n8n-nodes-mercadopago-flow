/**
 * Testes unitários para credentials
 */

import { PixPaymentApi } from '../../credentials/PixPaymentApi.credentials';

describe('PixPaymentApi Credentials', () => {
	let credentials: PixPaymentApi;

	beforeEach(() => {
		credentials = new PixPaymentApi();
	});

	describe('Estrutura', () => {
		it('deve ter nome correto', () => {
			expect(credentials.name).toBe('pixPaymentApi');
		});

		it('deve ter displayName correto', () => {
			expect(credentials.displayName).toBe('Mercado Pago API');
		});

		it('deve ter documentationUrl', () => {
			expect(credentials.documentationUrl).toBeDefined();
			expect(credentials.documentationUrl).toContain('mercadopago.com');
		});

		it('deve ter propriedades definidas', () => {
			expect(credentials.properties).toBeDefined();
			expect(Array.isArray(credentials.properties)).toBe(true);
			expect(credentials.properties.length).toBeGreaterThan(0);
		});
	});

	describe('Campos', () => {
		it('deve ter campo accessToken obrigatório', () => {
			const accessTokenField = credentials.properties.find(
				(p) => p.name === 'accessToken',
			);
			expect(accessTokenField).toBeDefined();
			expect(accessTokenField?.required).toBe(true);
			expect(accessTokenField?.type).toBe('string');
			expect(accessTokenField?.typeOptions?.password).toBe(true);
		});

		it('deve ter campo environment com opções', () => {
			const environmentField = credentials.properties.find(
				(p) => p.name === 'environment',
			);
			expect(environmentField).toBeDefined();
			expect(environmentField?.type).toBe('options');
			expect(environmentField?.options).toBeDefined();
			expect(environmentField?.options?.length).toBe(2);
		});

		it('deve ter opções sandbox e production', () => {
			const environmentField = credentials.properties.find(
				(p) => p.name === 'environment',
			);
			const options = environmentField?.options || [];
			const values = options.map((opt: any) => opt.value);
			expect(values).toContain('sandbox');
			expect(values).toContain('production');
		});

		it('deve ter clientId opcional', () => {
			const clientIdField = credentials.properties.find(
				(p) => p.name === 'clientId',
			);
			expect(clientIdField).toBeDefined();
			expect(clientIdField?.required).toBeFalsy();
		});

		it('deve ter clientSecret opcional e secreto', () => {
			const clientSecretField = credentials.properties.find(
				(p) => p.name === 'clientSecret',
			);
			expect(clientSecretField).toBeDefined();
			expect(clientSecretField?.required).toBeFalsy();
			expect(clientSecretField?.typeOptions?.password).toBe(true);
		});
	});
});

