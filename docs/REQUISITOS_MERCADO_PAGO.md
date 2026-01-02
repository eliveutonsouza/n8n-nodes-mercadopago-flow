# Requisitos do Mercado Pago - Informações Críticas

Este documento centraliza todos os requisitos importantes para usar o node n8n do Mercado Pago corretamente.

## ⚠️ Requisitos Obrigatórios

### 1. Assinaturas Exigem Conta Checkout Pro

**IMPORTANTE**: Para criar assinaturas no n8n, você **DEVE** ter uma conta **Checkout Pro** no Mercado Pago.

- ✅ **Checkout Pro** → Assinaturas funcionam
- ❌ **Outros tipos de conta** → Assinaturas **NÃO funcionam**

O Checkout Pro é o único tipo de conta que suporta a criação de assinaturas recorrentes via API. Se você tentar criar uma assinatura sem ter uma conta Checkout Pro, a API retornará erro.

**Como verificar se você tem Checkout Pro:**
1. Acesse o [Painel de Desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel)
2. Verifique o tipo de conta nas configurações
3. Se não tiver Checkout Pro, entre em contato com o suporte do Mercado Pago para migrar

**Referência**: [Documentação Oficial - Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/subscriptions)

---

### 2. PIX Só Funciona com Credenciais de Produção

**IMPORTANTE**: Pagamentos PIX **SOMENTE** funcionam com credenciais de **produção**.

- ✅ **Credenciais de Produção** → PIX funciona
- ❌ **Credenciais de Sandbox** → PIX **NÃO funciona**

O Mercado Pago não oferece suporte a PIX no ambiente de testes (sandbox). Para testar PIX, você precisa usar credenciais de produção.

**Recomendações:**
- Use valores pequenos para testes em produção
- Monitore cuidadosamente os pagamentos de teste
- Considere criar uma conta de teste separada para desenvolvimento

**Alternativa para Desenvolvimento:**
- Use o ambiente sandbox para testar outras funcionalidades (planos, webhooks, etc.)
- Para PIX, use produção com valores mínimos

---

## 🔄 Compatibilidade de Ambientes

### Regra Fundamental

**PUBLIC_KEY e Access Token DEVEM estar no mesmo ambiente** (sandbox ou produção).

Tokens de cartão gerados com uma PUBLIC_KEY de um ambiente **NÃO funcionam** com Access Token de outro ambiente.

### Por Que Isso É Importante?

Quando você cria uma assinatura no Mercado Pago:

1. O **frontend** usa a **PUBLIC_KEY** para gerar o token do cartão via CardForm
2. O **backend/n8n** usa o **Access Token** para criar a assinatura na API
3. Se esses dois tokens estiverem em ambientes diferentes, a API retornará erro `CC_VAL_433`

### Como Verificar

1. **PUBLIC_KEY**: Verifique no [Painel de Desenvolvedores](https://www.mercadopago.com.br/developers/panel/credentials)
   - Sandbox: Geralmente na seção "Credenciais de teste"
   - Produção: Na seção "Credenciais de produção"

2. **Access Token**: Verifique a configuração no n8n
   - Ambiente configurado nas credenciais do node

### Configuração Correta

**Sandbox (Desenvolvimento):**
```bash
# .env ou configuração do n8n
MP_ENVIRONMENT=sandbox
MP_ACCESS_TOKEN=APP_USR-...  # Access Token de sandbox
MERCADOPAGO_PUBLIC_KEY=APP_USR-...  # PUBLIC_KEY de sandbox
```

**Produção:**
```bash
# .env ou configuração do n8n
MP_ENVIRONMENT=production
MP_ACCESS_TOKEN=APP_USR-...  # Access Token de produção
MERCADOPAGO_PUBLIC_KEY=APP_USR-...  # PUBLIC_KEY de produção
```

**⚠️ Exceção para PIX:**
- PIX sempre requer produção, mesmo para testes
- Use valores pequenos e monitore cuidadosamente

---

## 📋 Resumo Rápido

| Funcionalidade | Requisito | Ambiente |
|----------------|-----------|----------|
| **Assinaturas** | Conta Checkout Pro obrigatória | Sandbox ou Produção |
| **PIX** | Credenciais de produção obrigatórias | Apenas Produção |
| **Planos** | Nenhum requisito especial | Sandbox ou Produção |
| **Webhooks** | Nenhum requisito especial | Sandbox ou Produção |

---

## 🔗 Referências

- [Documentação Oficial - Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/subscriptions)
- [Documentação Oficial - PIX](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)
- [Painel de Credenciais](https://www.mercadopago.com.br/developers/panel/credentials)
- [Compatibilidade de Ambiente](./COMPATIBILIDADE_AMBIENTE.md)
- [Fluxo de Assinatura com Frontend](./FLUXO_ASSINATURA_FRONTEND.md)

