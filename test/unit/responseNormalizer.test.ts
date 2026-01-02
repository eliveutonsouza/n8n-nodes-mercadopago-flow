/**
 * Testes unitários para o normalizador de resposta
 */

import { normalizeResponse } from '../../nodes/MercadoPago/utils/responseNormalizer';

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

	describe('Webhooks', () => {
		it('deve normalizar webhook com url, events e description', () => {
			const mockData = {
				id: 'webhook-123',
				url: 'https://example.com/webhook',
				events: ['payment', 'subscription'],
				description: 'Webhook de teste',
			};
			const normalized = normalizeResponse(mockData, 'webhooks');

			expect(normalized.url).toBe('https://example.com/webhook');
			expect(normalized.events).toEqual(['payment', 'subscription']);
			expect(normalized.description).toBe('Webhook de teste');
		});
	});

	describe('Customers', () => {
		it('deve normalizar customer com email e nome completo', () => {
			const mockData = {
				id: '123456789',
				email: 'test@example.com',
				first_name: 'João',
				last_name: 'Silva',
				date_created: '2024-01-01T12:00:00.000Z',
			};
			const normalized = normalizeResponse(mockData, 'customers');

			expect(normalized.payerEmail).toBe('test@example.com');
			expect(normalized.description).toBe('João Silva');
		});

		it('deve normalizar customer sem sobrenome', () => {
			const mockData = {
				id: '123456789',
				email: 'test@example.com',
				first_name: 'João',
				date_created: '2024-01-01T12:00:00.000Z',
			};
			const normalized = normalizeResponse(mockData, 'customers');

			expect(normalized.description).toBe('João');
		});
	});

	describe('Cards', () => {
		it('deve normalizar card com payment_method name', () => {
			const mockData = {
				id: 'card-123',
				payment_method: {
					name: 'Visa',
					id: 'visa',
				},
			};
			const normalized = normalizeResponse(mockData, 'cards');

			expect(normalized.description).toBe('Visa');
		});

		it('deve normalizar card com payment_method_id quando name não disponível', () => {
			const mockData = {
				id: 'card-123',
				payment_method_id: 'visa',
			};
			const normalized = normalizeResponse(mockData, 'cards');

			expect(normalized.description).toBe('visa');
		});
	});

	describe('Preferences', () => {
		it('deve normalizar preference com init_point', () => {
			const mockData = {
				id: 'pref-123',
				init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-123',
				items: [{ title: 'Produto Teste' }],
			};
			const normalized = normalizeResponse(mockData, 'preferences');

			expect(normalized.url).toBe('https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-123');
			expect(normalized.description).toBe('Produto Teste');
		});

		it('deve normalizar preference com sandbox_init_point', () => {
			const mockData = {
				id: 'pref-123',
				sandbox_init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-123',
				items: [],
			};
			const normalized = normalizeResponse(mockData, 'preferences');

			expect(normalized.url).toBe('https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-123');
		});
	});

	describe('QR Orders', () => {
		it('deve normalizar QR order com todos os campos', () => {
			const mockData = {
				id: 'qr-order-123',
				total_amount: 50.00,
				currency: 'BRL',
				description: 'Pedido QR Code',
				status_detail: 'pending',
			};
			const normalized = normalizeResponse(mockData, 'qrOrders');

			expect(normalized.amount).toBe(50.00);
			expect(normalized.currency).toBe('BRL');
			expect(normalized.description).toBe('Pedido QR Code');
			expect(normalized.statusDetail).toBe('pending');
		});
	});

	describe('POS', () => {
		it('deve normalizar POS com name', () => {
			const mockData = {
				id: 'pos-123',
				name: 'Loja Principal',
			};
			const normalized = normalizeResponse(mockData, 'pos');

			expect(normalized.description).toBe('Loja Principal');
		});
	});

	describe('Stores', () => {
		it('deve normalizar store com name', () => {
			const mockData = {
				id: 'store-123',
				name: 'Minha Loja',
			};
			const normalized = normalizeResponse(mockData, 'stores');

			expect(normalized.description).toBe('Minha Loja');
		});
	});

	describe('Chargebacks', () => {
		it('deve normalizar chargeback com amount, currency e statusDetail', () => {
			const mockData = {
				id: 'chargeback-123',
				amount: 100.00,
				currency_id: 'BRL',
				status_detail: 'contested',
			};
			const normalized = normalizeResponse(mockData, 'chargebacks');

			expect(normalized.amount).toBe(100.00);
			expect(normalized.currency).toBe('BRL');
			expect(normalized.statusDetail).toBe('contested');
		});
	});

	describe('Payments', () => {
		it('deve normalizar payment (não PIX) corretamente', () => {
			const mockData = {
				id: 'payment-123',
				status: 'approved',
				transaction_amount: 25.50,
				currency_id: 'BRL',
				description: 'Pagamento com cartão',
				payer: { email: 'payer@example.com' },
				date_created: '2024-01-01T12:00:00.000-03:00',
			};
			const normalized = normalizeResponse(mockData, 'payments');

			expect(normalized.type).toBe('payment');
			expect(normalized.amount).toBe(25.50);
			expect(normalized.currency).toBe('BRL');
			expect(normalized.description).toBe('Pagamento com cartão');
			expect(normalized.payerEmail).toBe('payer@example.com');
		});
	});

	describe('Subscriptions - Campos Adicionais', () => {
		it('deve normalizar assinatura com init_point (não sandbox)', () => {
			const mockData = {
				id: 'sub-123',
				status: 'pending',
				preapproval_plan_id: 'plan-123',
				payer_email: 'test@example.com',
				init_point: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=sub-123',
				start_date: '2024-01-01',
				end_date: '2024-12-31',
				status_detail: 'pending',
			};
			const normalized = normalizeResponse(mockData, 'subscriptions');

			expect(normalized.url).toBe('https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=sub-123');
			expect(normalized.startDate).toBe('2024-01-01');
			expect(normalized.endDate).toBe('2024-12-31');
			expect(normalized.statusDetail).toBe('pending');
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

