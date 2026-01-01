/**
 * Testes unitários para helpers.ts
 */

import {
	getBaseUrl,
	normalizeAmount,
	validateCPF,
	validateCNPJ,
	cleanDocument,
	getDocumentType,
	validateEmail,
	formatDate,
	handleMercadoPagoError,
} from '../../nodes/PaymentMercadoPago/helpers';
import {
	mockErrorResponse,
	mockNetworkError,
	mockUnauthorizedError,
	mockNotFoundError,
} from '../mocks/mercado-pago-mocks';
import { validCPF, validCNPJ, invalidDocument, validEmail, invalidEmail } from '../mocks/fixtures';

describe('Helpers', () => {
	describe('getBaseUrl', () => {
		it('deve retornar URL correta para sandbox', () => {
			const url = getBaseUrl('sandbox');
			expect(url).toBe('https://api.mercadopago.com');
		});

		it('deve retornar URL correta para production', () => {
			const url = getBaseUrl('production');
			expect(url).toBe('https://api.mercadopago.com');
		});
	});

	describe('normalizeAmount', () => {
		it('deve converter valor decimal para centavos', () => {
			expect(normalizeAmount(10.50)).toBe(1050);
			expect(normalizeAmount(100.99)).toBe(10099);
			expect(normalizeAmount(0.01)).toBe(1);
		});

		it('deve arredondar valores corretamente', () => {
			expect(normalizeAmount(10.555)).toBe(1056);
			expect(normalizeAmount(10.444)).toBe(1044);
		});

		it('deve lidar com valores inteiros', () => {
			expect(normalizeAmount(10)).toBe(1000);
			expect(normalizeAmount(0)).toBe(0);
		});
	});

	describe('validateCPF', () => {
		it('deve validar CPF válido', () => {
			expect(validateCPF(validCPF)).toBe(true);
			expect(validateCPF('123.456.789-01')).toBe(true);
		});

		it('deve rejeitar CPF inválido', () => {
			expect(validateCPF('123')).toBe(false);
			expect(validateCPF('123456789012')).toBe(false);
			expect(validateCPF('')).toBe(false);
		});
	});

	describe('validateCNPJ', () => {
		it('deve validar CNPJ válido', () => {
			expect(validateCNPJ(validCNPJ)).toBe(true);
			expect(validateCNPJ('12.345.678/0001-90')).toBe(true);
		});

		it('deve rejeitar CNPJ inválido', () => {
			expect(validateCNPJ('123')).toBe(false);
			expect(validateCNPJ('123456789012345')).toBe(false);
			expect(validateCNPJ('')).toBe(false);
		});
	});

	describe('cleanDocument', () => {
		it('deve remover caracteres não numéricos', () => {
			expect(cleanDocument('123.456.789-01')).toBe('12345678901');
			expect(cleanDocument('12.345.678/0001-90')).toBe('12345678000190');
			expect(cleanDocument('123 456 789 01')).toBe('12345678901');
		});

		it('deve retornar string vazia para entrada vazia', () => {
			expect(cleanDocument('')).toBe('');
		});
	});

	describe('getDocumentType', () => {
		it('deve identificar CPF corretamente', () => {
			expect(getDocumentType(validCPF)).toBe('CPF');
			expect(getDocumentType('123.456.789-01')).toBe('CPF');
		});

		it('deve identificar CNPJ corretamente', () => {
			expect(getDocumentType(validCNPJ)).toBe('CNPJ');
			expect(getDocumentType('12.345.678/0001-90')).toBe('CNPJ');
		});

		it('deve retornar null para documento inválido', () => {
			expect(getDocumentType(invalidDocument)).toBe(null);
			expect(getDocumentType('')).toBe(null);
		});
	});

	describe('validateEmail', () => {
		it('deve validar email válido', () => {
			expect(validateEmail(validEmail)).toBe(true);
			expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
		});

		it('deve rejeitar email inválido', () => {
			expect(validateEmail(invalidEmail)).toBe(false);
			expect(validateEmail('@example.com')).toBe(false);
			expect(validateEmail('user@')).toBe(false);
			expect(validateEmail('user@example')).toBe(false);
			expect(validateEmail('')).toBe(false);
		});
	});

	describe('formatDate', () => {
		it('deve formatar Date para ISO8601', () => {
			const date = new Date('2024-01-01T12:00:00.000Z');
			const formatted = formatDate(date);
			expect(formatted).toBe('2024-01-01T12:00:00.000Z');
		});

		it('deve formatar string para ISO8601', () => {
			const formatted = formatDate('2024-01-01T12:00:00.000Z');
			expect(formatted).toBe('2024-01-01T12:00:00.000Z');
		});
	});

	describe('handleMercadoPagoError', () => {
		it('deve normalizar erro HTTP com resposta', () => {
			const error = handleMercadoPagoError({
				response: {
					status: 400,
					data: mockErrorResponse,
				},
			});
			expect(error.message).toContain('Invalid request');
			expect(error.status).toBe(400);
			expect(error.error).toBe('bad_request');
		});

		it('deve normalizar erro de rede', () => {
			const error = handleMercadoPagoError(mockNetworkError);
			expect(error.message).toContain('conexão');
			expect(error.status).toBe(0);
		});

		it('deve normalizar erro 401 (Unauthorized)', () => {
			const error = handleMercadoPagoError(mockUnauthorizedError);
			expect(error.status).toBe(401);
			expect(error.error).toBe('unauthorized');
		});

		it('deve normalizar erro 404 (Not Found)', () => {
			const error = handleMercadoPagoError(mockNotFoundError);
			expect(error.status).toBe(404);
			expect(error.error).toBe('not_found');
		});

		it('deve normalizar erro genérico', () => {
			const genericError = { message: 'Erro genérico', statusCode: 500 };
			const error = handleMercadoPagoError(genericError);
			expect(error.message).toBe('Erro genérico (Status HTTP: 500)');
			expect(error.status).toBe(500);
		});

		it('deve lidar com erro sem mensagem', () => {
			const errorWithoutMessage = {};
			const error = handleMercadoPagoError(errorWithoutMessage);
			expect(error.message).toBe('Erro desconhecido (Status HTTP: 500)');
			expect(error.status).toBe(500);
		});
	});
});

