# Payloads Exatos da API - Mercado Pago

Este documento especifica os payloads exatos por operação da API do Mercado Pago, sem interpretação livre. Cada payload é baseado na API v1 oficial do Mercado Pago.

## Headers Padrão

Todas as requisições devem incluir:

```http
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Nota**: O `ACCESS_TOKEN` é obtido nas credenciais do Mercado Pago (sandbox ou produção).

---

## 2.1 Criar PLANO (preapproval_plan)

### Endpoint

```http
POST https://api.mercadopago.com/preapproval_plan
```

### Payload Completo

```json
{
  "reason": "Plano Pro Mensal",
  "auto_recurring": {
    "frequency": 1,
    "frequency_type": "months",
    "transaction_amount": 49.90,
    "currency_id": "BRL",
    "repetitions": 0,
    "billing_day": 10,
    "billing_day_proportional": false,
    "free_trial": {
      "frequency": 7,
      "frequency_type": "days"
    }
  },
  "payment_methods_allowed": {
    "payment_types": [
      {
        "id": "credit_card"
      },
      {
        "id": "debit_card"
      }
    ],
    "payment_methods": [
      {
        "id": "visa"
      },
      {
        "id": "mastercard"
      }
    ]
  },
  "back_url": "https://www.mercadopago.com.br"
}
```

### Payload Mínimo Obrigatório

```json
{
  "reason": "Plano Pro Mensal",
  "auto_recurring": {
    "frequency": 1,
    "frequency_type": "months",
    "transaction_amount": 49.90,
    "currency_id": "BRL"
  }
}
```

### Retorno Importante

```json
{
  "id": "2c9380848f...",
  "status": "active",
  "reason": "Plano Pro Mensal",
  "auto_recurring": {
    "frequency": 1,
    "frequency_type": "months",
    "transaction_amount": 49.90,
    "currency_id": "BRL"
  },
  "init_point": "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c9380848f...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c9380848f..."
}
```

**Campo crítico**: `id` → Este é o `preapproval_plan_id` usado para criar assinaturas.

### Observações

- ✅ Executado **UMA vez**, não no checkout
- ✅ Define valor, frequência e moeda
- ✅ Não envolve usuário
- ✅ Não é criado no checkout

---

## 2.2 Criar ASSINATURA (cartão)

### Endpoint

```http
POST https://api.mercadopago.com/preapproval
```

### Payload Conceitual (Mínimo)

```json
{
  "preapproval_plan_id": "2c9380848f...",
  "payer_email": "cliente@email.com",
  "card_token_id": "CARD_TOKEN_GERADO_NO_FRONT"
}
```

### Payload Completo

```json
{
  "preapproval_plan_id": "2c9380848f...",
  "payer_email": "cliente@email.com",
  "card_token_id": "CARD_TOKEN_GERADO_NO_FRONT",
  "status": "authorized",
  "back_url": "https://seusite.com.br/retorno",
  "payer": {
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    }
  },
  "start_date": "2024-01-01T00:00:00.000-03:00",
  "trial_period_days": 7
}
```

### Payload Sem Cartão (Retorna init_point)

```json
{
  "preapproval_plan_id": "2c9380848f...",
  "payer_email": "cliente@email.com",
  "status": "pending",
  "back_url": "https://seusite.com.br/retorno"
}
```

**Nota**: Sem `card_token_id`, a assinatura é criada com status `pending` e retorna um `init_point` para checkout.

### Resposta Típica (Com Cartão)

```json
{
  "id": "2c9380849a...",
  "status": "authorized",
  "preapproval_plan_id": "2c9380848f...",
  "payer_email": "cliente@email.com",
  "card_token_id": "CARD_TOKEN_GERADO_NO_FRONT",
  "init_point": null,
  "sandbox_init_point": null,
  "created": "2024-01-01T12:00:00.000-03:00",
  "updated": "2024-01-01T12:00:00.000-03:00"
}
```

### Resposta Típica (Sem Cartão - Pending)

```json
{
  "id": "2c9380849a...",
  "status": "pending",
  "preapproval_plan_id": "2c9380848f...",
  "payer_email": "cliente@email.com",
  "init_point": "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=2c9380849a...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/subscriptions/checkout?preapproval_id=2c9380849a...",
  "created": "2024-01-01T12:00:00.000-03:00",
  "updated": "2024-01-01T12:00:00.000-03:00"
}
```

**Campo crítico**: `id` → Este é o `preapproval_id` usado para gerenciar a assinatura.

### O que NÃO existe neste fluxo

- ❌ `POST /payments` (isso é para PIX)
- ❌ PIX
- ❌ Payment ID (aqui usamos preapproval_id)

### Observações Críticas

- 🚨 **NÃO EXISTE payment aqui**
- ✅ A assinatura nasce neste endpoint
- ✅ Com `card_token_id`: status `authorized` (ativa imediatamente)
- ✅ Sem `card_token_id`: status `pending` (retorna `init_point`)

---

## 2.3 Criar PAGAMENTO PIX

### Endpoint

```http
POST https://api.mercadopago.com/v1/payments
```

### Payload Completo

```json
{
  "transaction_amount": 49.90,
  "description": "Plano Pro - Mensal",
  "payment_method_id": "pix",
  "payer": {
    "email": "cliente@email.com",
    "first_name": "João",
    "last_name": "Silva",
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    }
  },
  "date_of_expiration": "2024-01-01T23:59:59.000-03:00",
  "external_reference": "REF-12345",
  "metadata": {
    "custom_key": "custom_value"
  }
}
```

### Payload Mínimo Obrigatório

```json
{
  "transaction_amount": 49.90,
  "description": "Plano Pro - Mensal",
  "payment_method_id": "pix",
  "payer": {
    "email": "cliente@email.com"
  }
}
```

### Headers Opcionais (Idempotência)

```http
X-Idempotency-Key: unique-key-12345
```

**Nota**: Use este header para garantir que requisições duplicadas não criem pagamentos duplicados.

### Resposta Relevante

```json
{
  "id": 123456789,
  "status": "pending",
  "status_detail": "pending_waiting_transfer",
  "transaction_amount": 49.90,
  "currency_id": "BRL",
  "description": "Plano Pro - Mensal",
  "payment_method_id": "pix",
  "payer": {
    "email": "cliente@email.com",
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    }
  },
  "point_of_interaction": {
    "transaction_data": {
      "qr_code": "00020126360014BR.GOV.BCB.PIX0114+55119999999995204000053039865802BR5913FULANO DE TAL6008BRASILIA62070503***6304ABCD",
      "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  },
  "date_created": "2024-01-01T12:00:00.000-03:00",
  "date_of_expiration": "2024-01-01T23:59:59.000-03:00",
  "external_reference": "REF-12345"
}
```

**Campos críticos**:
- `id` → `payment_id` usado para consultar o pagamento
- `point_of_interaction.transaction_data.qr_code` → QR Code em texto
- `point_of_interaction.transaction_data.qr_code_base64` → QR Code em base64 (imagem)

### Observações

- ✅ Simples e direto
- ✅ Muito usado no Brasil
- ❌ Recorrência é manual (você controla)
- ❌ Sem preapproval (não há plano no Mercado Pago)

---

## 2.4 Webhook (Pagamento ou Assinatura)

### Estrutura de Evento Típico

#### Evento de Pagamento

```json
{
  "type": "payment",
  "data": {
    "id": "123456789"
  },
  "date_created": "2024-01-01T12:00:00.000-03:00",
  "id": 987654321,
  "live_mode": true,
  "user_id": "123456789"
}
```

#### Evento de Assinatura

```json
{
  "type": "preapproval",
  "data": {
    "id": "2c9380849a..."
  },
  "date_created": "2024-01-01T12:00:00.000-03:00",
  "id": 987654322,
  "live_mode": true,
  "user_id": "123456789"
}
```

### Processamento do Webhook

**⚠️ IMPORTANTE**: O webhook não traz dados completos. Você sempre deve consultar o recurso depois.

#### Fluxo Recomendado

1. **Receber webhook** → Identificar `type` e `data.id`
2. **Consultar recurso** → Fazer GET no endpoint correspondente
3. **Processar dados completos** → Usar os dados completos para atualizar seu sistema

#### Exemplo de Consulta Após Webhook

**Se `type === "payment"`**:
```http
GET https://api.mercadopago.com/v1/payments/123456789
```

**Se `type === "preapproval"`**:
```http
GET https://api.mercadopago.com/preapproval/2c9380849a...
```

### Eventos Disponíveis

#### Para Pagamentos

- `payment.created` - Pagamento criado
- `payment.updated` - Status do pagamento atualizado
- `payment.approved` - Pagamento aprovado
- `payment.rejected` - Pagamento rejeitado
- `payment.refunded` - Pagamento reembolsado
- `payment.cancelled` - Pagamento cancelado
- `payment.charged_back` - Pagamento estornado

#### Para Assinaturas

- `subscription.created` - Assinatura criada
- `subscription.updated` - Assinatura atualizada
- `subscription.cancelled` - Assinatura cancelada
- `subscription.paused` - Assinatura pausada
- `subscription.resumed` - Assinatura retomada

### Observações Críticas

- ⚠️ **O webhook não traz dados completos**
- ✅ Sempre consulte o recurso após receber o webhook
- ✅ Valide a origem do webhook (verificar assinatura se configurada)
- ✅ Implemente idempotência (não processe o mesmo evento duas vezes)

---

## Comparação de Payloads

### Tabela Comparativa

| Operação | Endpoint | Método | Campo ID Retornado | Usado Para |
|----------|----------|--------|-------------------|------------|
| **Criar Plano** | `/preapproval_plan` | POST | `id` (preapproval_plan_id) | Definir regras de cobrança |
| **Criar Assinatura** | `/preapproval` | POST | `id` (preapproval_id) | Assinatura recorrente (cartão) |
| **Criar Pagamento PIX** | `/v1/payments` | POST | `id` (payment_id) | Pagamento único PIX |
| **Consultar Pagamento** | `/v1/payments/{id}` | GET | `id` | Verificar status PIX |
| **Consultar Assinatura** | `/preapproval/{id}` | GET | `id` | Verificar status assinatura |

### Regras de Ouro

1. **Plano** → Criado uma vez, usado por múltiplas assinaturas
2. **Assinatura** → Usa `preapproval_plan_id`, retorna `preapproval_id`
3. **Pagamento PIX** → Não usa plano, retorna `payment_id`
4. **Webhook** → Sempre consultar o recurso após receber

---

## Erros Comuns e Soluções

### Erro: Tentar usar `POST /payments` para assinatura

**Errado**:
```json
{
  "transaction_amount": 49.90,
  "payment_method_id": "credit_card",
  "preapproval_plan_id": "2c9380848f..."  // ❌ Não existe aqui
}
```

**Correto**: Use `POST /preapproval` para assinaturas.

### Erro: Tentar usar `POST /preapproval` para PIX

**Errado**:
```json
{
  "preapproval_plan_id": "2c9380848f...",
  "payment_method_id": "pix"  // ❌ Não existe aqui
}
```

**Correto**: Use `POST /v1/payments` com `payment_method_id: "pix"` para PIX.

### Erro: Tentar criar plano no checkout

**Errado**: Criar plano toda vez que um usuário faz checkout.

**Correto**: Criar plano uma vez, reutilizar o `preapproval_plan_id`.

---

## Referências

- [API Reference - Preapproval Plan](https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_plan/post)
- [API Reference - Preapproval](https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post)
- [API Reference - Payments](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)
- [API Reference - Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)

