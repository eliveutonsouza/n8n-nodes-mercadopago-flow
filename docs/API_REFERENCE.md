# Referência da API

Esta é uma referência completa de todos os recursos, operações e parâmetros disponíveis no node n8n para Mercado Pago.

## 📋 Índice

- [Recursos Principais](#recursos-principais)
- [Recursos Adicionais](#recursos-adicionais)
- [Formato de Resposta](#formato-de-resposta)
- [Tratamento de Erros](#tratamento-de-erros)

## 🎯 Recursos Principais

### PIX

**Operações**: `create`, `get`, `refund`

#### create - Criar Pagamento PIX

**Parâmetros Obrigatórios:**
- `amount` (number): Valor em reais (ex: 10.50)
- `description` (string): Descrição do pagamento
- `payerEmail` (string): E-mail do pagador

**Parâmetros Opcionais:**
- `payerDocument` (string): CPF/CNPJ do pagador (11 ou 14 dígitos)
- `payerName` (string): Nome do pagador
- `expirationDate` (string): Data de expiração (ISO 8601)
- `externalReference` (string): Referência externa
- `idempotencyKey` (string): Chave de idempotência

**Resposta:**
```json
{
  "id": "123456789",
  "status": "pending",
  "amount": 10.50,
  "currency": "BRL",
  "qrCode": "00020126...",
  "qrCodeBase64": "data:image/png;base64,...",
  "description": "Pagamento de teste",
  "payerEmail": "cliente@example.com",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "raw": { ... }
}
```

#### get - Consultar Pagamento PIX

**Parâmetros Obrigatórios:**
- `paymentId` (string): ID do pagamento

#### refund - Reembolsar Pagamento PIX

**Parâmetros Obrigatórios:**
- `paymentId` (string): ID do pagamento

**Parâmetros Opcionais:**
- `amount` (number): Valor do reembolso (deixe vazio para reembolso total)

---

### Planos

**Operações**: `create`, `get`, `list`, `update`

#### create - Criar Plano

**Parâmetros Obrigatórios:**
- `name` (string): Nome do plano
- `amount` (number): Valor em reais
- `frequency` (number): Frequência (1 = mensal, 12 = anual)
- `frequencyType` (string): Tipo de frequência (`months` ou `days`)

**Parâmetros Opcionais:**
- `currencyId` (string): Moeda (padrão: BRL)
- `repetitions` (number): Número de repetições
- `trialPeriodDays` (number): Período de trial em dias
- `backUrl` (string): URL de retorno

#### get - Consultar Plano

**Parâmetros Obrigatórios:**
- `planId` (string): ID do plano

#### list - Listar Planos

**Parâmetros Opcionais:**
- `limit` (number): Limite de resultados
- `offset` (number): Offset para paginação

#### update - Atualizar Plano

**Parâmetros Obrigatórios:**
- `planId` (string): ID do plano

**Parâmetros Opcionais:**
- `name` (string): Novo nome
- `status` (string): Novo status (`active` ou `paused`)

---

### Assinaturas

**Operações**: `create`, `get`, `pause`, `resume`, `cancel`, `list`

#### create - Criar Assinatura

**Parâmetros Obrigatórios:**
- `planId` (string): ID do plano
- `payerEmail` (string): E-mail do pagador

**Parâmetros Opcionais:**
- `payerDocument` (string): CPF/CNPJ do pagador
- `cardTokenId` (string): Token do cartão (gerado no frontend)
- `subscriptionStatus` (string): Status inicial (`pending` ou `authorized`)
- `startDate` (string): Data de início (ISO 8601)
- `trialPeriodDays` (number): Período de trial em dias
- `reason` (string): Descrição da assinatura
- `externalReference` (string): Referência externa
- `backUrl` (string): URL de retorno

**⚠️ IMPORTANTE**: `cardTokenId` deve ser gerado no frontend usando CardForm.

#### get - Consultar Assinatura

**Parâmetros Obrigatórios:**
- `subscriptionId` (string): ID da assinatura

#### pause - Pausar Assinatura

**Parâmetros Obrigatórios:**
- `subscriptionId` (string): ID da assinatura

#### resume - Retomar Assinatura

**Parâmetros Obrigatórios:**
- `subscriptionId` (string): ID da assinatura

#### cancel - Cancelar Assinatura

**Parâmetros Obrigatórios:**
- `subscriptionId` (string): ID da assinatura

#### list - Listar Assinaturas

**Parâmetros Opcionais:**
- `limit` (number): Limite de resultados
- `offset` (number): Offset para paginação

---

### Webhooks

**Operações**: `create`, `get`, `list`, `delete`

#### create - Registrar Webhook

**Parâmetros Obrigatórios:**
- `url` (string): URL do webhook (deve ser acessível publicamente)

**Parâmetros Opcionais:**
- `events` (string): Eventos separados por vírgula (`payment`, `subscription`, `plan`)
- `description` (string): Descrição do webhook

#### get - Consultar Webhook

**Parâmetros Obrigatórios:**
- `webhookId` (string): ID do webhook

#### list - Listar Webhooks

**Parâmetros Opcionais:**
- `limit` (number): Limite de resultados
- `offset` (number): Offset para paginação

#### delete - Excluir Webhook

**Parâmetros Obrigatórios:**
- `webhookId` (string): ID do webhook

---

## 🔧 Recursos Adicionais

### Payments

**Operações**: `create`, `get`, `list`, `search`, `refund`, `capture`, `cancel`

Pagamentos genéricos (cartão de crédito, débito, etc.). Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post) para parâmetros detalhados.

### Customers

**Operações**: `create`, `get`, `update`, `delete`, `list`, `search`

Gestão de clientes. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/customers/_customers/post) para parâmetros detalhados.

### Cards

**Operações**: `create`, `get`, `delete`, `list`

Gestão de cartões de crédito. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/cards/_customers_customer_id_cards/post) para parâmetros detalhados.

### Preferences

**Operações**: `create`, `get`, `update`

Preferências de checkout. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/preferences/_checkout_preferences/post) para parâmetros detalhados.

### QR Orders

**Operações**: `create`, `get`, `list`

Pedidos via QR Code. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/qr_orders/_instore_orders_qr_seller_collectors_user_id_pos_external_id_orders/post) para parâmetros detalhados.

### POS

**Operações**: `create`, `get`, `update`, `delete`, `list`

Pontos de venda. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/pos/_instore_orders_qr_seller_collectors_user_id_pos/post) para parâmetros detalhados.

### Stores

**Operações**: `create`, `get`, `update`, `delete`, `list`

Gestão de lojas. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/stores/_users_user_id_stores/post) para parâmetros detalhados.

### Chargebacks

**Operações**: `get`, `list`, `submitDocumentation`

Gestão de chargebacks. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/chargebacks/_chargebacks_id/get) para parâmetros detalhados.

### OAuth

**Operações**: `authorize`, `refreshToken`, `getUserInfo`

Autenticação OAuth. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/oauth/_oauth_token/post) para parâmetros detalhados.

### Payment Methods

**Operações**: `list`

Lista métodos de pagamento disponíveis. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/payment_methods/_payment_methods/get) para parâmetros detalhados.

### Identification Types

**Operações**: `list`

Lista tipos de identificação aceitos. Consulte a [documentação oficial](https://www.mercadopago.com.br/developers/pt/reference/identification_types/_identification_types/get) para parâmetros detalhados.

---

## 📤 Formato de Resposta

Todas as respostas seguem um formato padronizado:

```typescript
{
  id: string;                    // ID do recurso
  status?: string;               // Status (quando aplicável)
  amount?: number;               // Valor (quando aplicável)
  currency?: string;             // Moeda (padrão: BRL)
  createdAt?: string;            // Data de criação (ISO 8601)
  provider: "mercado_pago";      // Sempre "mercado_pago"
  type: string;                  // Tipo: "payment", "plan", "subscription", "webhook", etc.
  raw: any;                      // Resposta completa da API do Mercado Pago
}
```

### Exemplo de Resposta Normalizada

```json
{
  "id": "123456789",
  "status": "approved",
  "amount": 10.50,
  "currency": "BRL",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "provider": "mercado_pago",
  "type": "payment",
  "raw": {
    "id": 123456789,
    "status": "approved",
    "status_detail": "accredited",
    "transaction_amount": 10.50,
    "currency_id": "BRL",
    "date_created": "2024-01-01T12:00:00.000Z",
    // ... todos os campos da API
  }
}
```

---

## ⚠️ Tratamento de Erros

### Erros Comuns

#### Erro de Validação (400)

```json
{
  "error": "validation_error",
  "message": "Campo obrigatório não fornecido",
  "details": [
    {
      "field": "amount",
      "message": "Valor deve ser maior que zero"
    }
  ]
}
```

#### Erro de Autenticação (401/403)

```json
{
  "error": "unauthorized",
  "message": "Token de acesso inválido ou expirado"
}
```

#### Erro da API (500+)

```json
{
  "error": "internal_error",
  "message": "Erro interno do servidor"
}
```

### Tratamento no n8n

Erros são automaticamente tratados e retornam mensagens claras:

- **Validação**: Mensagem específica sobre o campo inválido
- **Autenticação**: Instruções para verificar credenciais
- **API**: Mensagem genérica com código de status HTTP

---

## 📚 Referências

- [Guia de Referência de Campos](./GUIA_CAMPOS.md) - Exemplos detalhados de todos os campos
- [Documentação Oficial do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [API Reference do Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference)

---

## 💡 Dicas

1. **Use expressões n8n**: Campos aceitam expressões como `={{ $json.field }}`
2. **Valores monetários**: Use formato decimal (10.50, não 1050)
3. **Datas**: Use formato ISO 8601 (2024-01-01T12:00:00.000Z)
4. **Documentos**: CPF/CNPJ podem ter ou não formatação (será limpo automaticamente)
5. **Idempotência**: Use `idempotencyKey` para evitar duplicações

---

**Última atualização**: 2025-01-02

