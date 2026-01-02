/**
 * Testes unitários para o normalizador de resposta
 */

import { normalizeResponse } from '../../archive/legacy/nodes/PaymentMercadoPago/utils/responseNormalizer';

describe('Response Normalizer', () => {
	describe('Provider e Type', () => {
		it('deve incluir provider "mercado_pago" em todas as respostas', () => {
			const mockData = { id: '123', status: 'active' };
			const normalized = normalizeResponse(mockData, 'pix');

			expect(normalized.provider).toBe('mercado_pago');
		});

		it('deve mapear resource "pix" para type "payment"', () => {
			const mockData = { id: '123', status: 'pending' };
			const normalized = normalizeResponse(mockData, 'pix');

			expect(normalized.type).toBe('payment');
		});

		it('deve mapear resource "plans" para type "plan"', () => {
			const mockData = { id: 'plan-123', status: 'active' };
			const normalized = normalizeResponse(mockData, 'plans');

			expect(normalized.type).toBe('plan');
		});

		it('deve mapear resource "subscriptions" para type "subscription"', () => {
			const mockData = { id: 'sub-123', status: 'authorized' };
			const normalized = normalizeResponse(mockData, 'subscriptions');

			expect(normalized.type).toBe('subscription');
		});

		it('deve mapear resource "webhooks" para type "webhook"', () => {
			const mockData = { id: 'webhook-123', url: 'https://example.com' };
			const normalized = normalizeResponse(mockData, 'webhooks');

			expect(normalized.type).toBe('webhook');
		});
	});

	describe('PIX - Formato Decimal', () => {
		it('deve manter transaction_amount em formato decimal (não centavos)', () => {
			const mockData = {
				id: '123',
				status: 'pending',
				transaction_amount: 49.90,
				currency_id: 'BRL',
			};
			const normalized = normalizeResponse(mockData, 'pix');

			// NOTA: A API retorna em decimal, não precisa dividir por 100
			expect(normalized.amount).toBe(49.90);
		});

		it('deve normalizar PIX com qrCode e qrCodeBase64', () => {
			const mockData = {
				id: '123',
				status: 'pending',
				transaction_amount: 10.50,
				point_of_interaction: {
					transaction_data: {
						qr_code: '00020126...',
						qr_code_base64: 'iVBORw0KGgo...',
					},
				},
			};
			const normalized = normalizeResponse(mockData, 'pix');

			expect(normalized.qrCode).toBe('00020126...');
			expect(normalized.qrCodeBase64).toBe('iVBORw0KGgo...');
		});
	});

	describe('Plans - Formato Decimal', () => {
		it('deve manter transaction_amount em formato decimal para planos', () => {
			const mockData = {
				id: 'plan-123',
				status: 'active',
				reason: 'Plano Pro',
				auto_recurring: {
					transaction_amount: 99.99,
					frequency: 1,
					frequency_type: 'months',
					currency_id: 'BRL',
				},
			};
			const normalized = normalizeResponse(mockData, 'plans');

			// NOTA: Planos também usam formato decimal
			expect(normalized.amount).toBe(99.99);
		});
	});

	describe('Subscriptions', () => {
		it('deve normalizar assinatura com init_point quando disponível', () => {
			const mockData = {
				id: 'sub-123',
				status: 'pending',
				preapproval_plan_id: 'plan-123',
				payer_email: 'test@example.com',
				sandbox_init_point: 'https://sandbox.mercadopago.com.br/subscriptions/checkout?preapproval_id=sub-123',
			};
			const normalized = normalizeResponse(mockData, 'subscriptions');

			expect(normalized.url).toBe('https://sandbox.mercadopago.com.br/subscriptions/checkout?preapproval_id=sub-123');
		});
	});

	describe('Raw Data', () => {
		it('deve incluir dados completos no campo raw', () => {
			const mockData = {
				id: '123',
				status: 'active',
				customField: 'customValue',
			};
			const normalized = normalizeResponse(mockData, 'pix');

			expect(normalized.raw).toEqual(mockData);
		});
	});
});

