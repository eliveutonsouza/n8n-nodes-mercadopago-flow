# Frontend de Teste - Assinatura Mercado Pago + n8n

Este frontend demonstra o fluxo correto de criação de assinaturas usando CardForm do Mercado Pago e integração com n8n.

## 🎯 Objetivo

Demonstrar que:

- ✅ Tokens gerados no frontend via CardForm **funcionam** para assinaturas
- ❌ Tokens gerados via API não funcionam (este frontend prova o correto)

## 🚀 Como Usar

### 1. Configurar Variáveis de Ambiente (Opcional mas Recomendado)

**Adicione no seu arquivo `.env` na raiz do projeto:**

```bash
MERCADOPAGO_PUBLIC_KEY=APP_USR-...
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/assinatura
```

**Depois, gere o arquivo de configuração:**

```bash
npm run frontend:config
```

Ou diretamente:

```bash
node test/generate-config.js
```

Isso criará o arquivo `test/frontend-config.js` que será carregado automaticamente pelo HTML.

**Nota:** O script procura por várias variações de nomes de variáveis:

- `MERCADOPAGO_PUBLIC_KEY`, `MP_PUBLIC_KEY`, `MP_PUBLIC_KEY_TEST`, `PUBLIC_KEY`
- `N8N_WEBHOOK_URL`, `WEBHOOK_URL`, `N8N_WEBHOOK`

Se a Public Key estiver configurada, o frontend irá:

- ✅ Preencher automaticamente o campo "Public Key"
- ✅ Preencher automaticamente o campo "Webhook URL" (se configurado)
- ✅ Inicializar o CardForm automaticamente

### 2. Abrir o Frontend

Abra o arquivo `frontend-test.html` no seu navegador:

```bash
# Opção 1: Abrir diretamente
open test/frontend-test.html

# Opção 2: Usar servidor local (recomendado para evitar CORS)
cd test
python -m http.server 8000
# Acesse: http://localhost:8000/frontend-test.html
```

### 2. Preencher Configuração

1. **Public Key do Mercado Pago**

   - Obtenha no [Painel de Desenvolvedores](https://www.mercadopago.com.br/developers/panel/credentials)
   - Use a **PUBLIC_KEY** (não o Access Token)
   - Formato: `APP_USR-...`

2. **URL do Webhook n8n**

   - URL do seu webhook configurado no n8n
   - Exemplo: `https://seu-n8n.com/webhook/assinatura`
   - Ou: `http://localhost:5678/webhook/assinatura` (se local)

3. **ID do Plano**

   - ID do plano criado no Mercado Pago
   - Você pode criar um plano usando o node n8n primeiro

4. **E-mail do Pagador**

   - E-mail válido do cliente

5. **CPF/CNPJ** (opcional)
   - Apenas números

### 3. Preencher Dados do Cartão

Use um **cartão de teste** do Mercado Pago (ambiente sandbox):

- **Número**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Vencimento**: `11/30`
- **Nome**: `APRO` (para aprovação automática)

Outros cartões de teste:

- `5031 4332 1540 6351` - Mastercard (APRO - Aprovado)
- `5031 4332 1540 6351` - Mastercard (CONT - Contesta)
- `5031 4332 1540 6351` - Mastercard (CALL - Liga)

### 4. Criar Assinatura

Clique em "🚀 Criar Assinatura" e aguarde:

1. Token será gerado no frontend
2. Token será enviado para o webhook do n8n
3. n8n criará a assinatura no Mercado Pago
4. Resultado será exibido

## ⚙️ Configurar Webhook no n8n

### Workflow Básico

Crie um workflow no n8n com:

1. **Webhook Node** (Trigger)

   - Método: `POST`
   - Path: `/assinatura`
   - Response Mode: `Last Node`

2. **Mercado Pago Node** (Subscription > Create)

   - Resource: `Assinatura`
   - Operation: `Criar`
   - Plan ID: `{{ $json.body.plan_id }}`
   - Payer Email: `{{ $json.body.payer_email }}`
   - Card Token ID: `{{ $json.body.card_token_id }}`
   - Payer Document: `{{ $json.body.payer_document }}`
   - Subscription Status: `authorized`

3. **Respond to Webhook Node** (Opcional)
   - Retorna sucesso ou erro

### Exemplo de Workflow JSON

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "assinatura",
        "responseMode": "lastNode"
      }
    },
    {
      "name": "Mercado Pago - Criar Assinatura",
      "type": "n8n-nodes-mercadopago-pix-assinatura.PaymentMercadoPago",
      "parameters": {
        "resource": "subscriptions",
        "operation": "create",
        "planId": "={{ $json.body.plan_id }}",
        "payerEmail": "={{ $json.body.payer_email }}",
        "cardTokenId": "={{ $json.body.card_token_id }}",
        "payerDocument": "={{ $json.body.payer_document }}",
        "subscriptionStatus": "authorized"
      }
    }
  ]
}
```

## 📤 Payload Enviado

O frontend envia o seguinte payload para o webhook:

```json
{
  "card_token_id": "abc123def456...",
  "plan_id": "2c9380848f...",
  "payer_email": "cliente@email.com",
  "payer_document": "12345678909"
}
```

## ✅ Resultado Esperado

### Sucesso

Se tudo funcionar, você verá:

```
✅ Sucesso
Assinatura criada com sucesso!

{
  "id": "2c9380849a...",
  "status": "authorized",
  "planId": "2c9380848f...",
  "payerEmail": "cliente@email.com",
  ...
}
```

### Erro

Se houver erro, você verá a mensagem específica:

```
❌ Erro
[Mensagem de erro detalhada]

{
  "error": "...",
  "message": "..."
}
```

## 🔍 Troubleshooting

### Erro: "Mercado Pago não foi inicializado"

**Causa**: Public Key não foi preenchida ou é inválida.

**Solução**:

1. Preencha a Public Key (deve começar com `APP_USR-`)
2. Saia do campo (blur) para inicializar
3. Aguarde alguns segundos

### Erro: "Token não foi gerado"

**Causa**: Dados do cartão inválidos ou CardForm não está funcionando.

**Solução**:

1. Verifique se está usando cartão de teste válido
2. Verifique se todos os campos do cartão estão preenchidos
3. Abra o console do navegador (F12) para ver erros detalhados

### Erro: "Failed to fetch" ou CORS

**Causa**: Problema de CORS ao chamar o webhook.

**Solução**:

1. Use um servidor local (não abra o arquivo diretamente)
2. Configure CORS no n8n (se necessário)
3. Use HTTPS se o webhook for HTTPS

### Erro: "Card token service not found"

**Causa**: Isso NÃO deve acontecer com este frontend, pois o token é gerado corretamente.

**Se acontecer**:

1. Verifique se está usando a PUBLIC_KEY correta
2. Verifique se está no ambiente sandbox (para testes)
3. Verifique se o token está sendo gerado (console do navegador)

### Webhook não recebe requisição

**Causa**: URL do webhook incorreta ou n8n não está rodando.

**Solução**:

1. Verifique se a URL está correta
2. Verifique se o webhook está ativo no n8n
3. Teste a URL manualmente com curl:
   ```bash
   curl -X POST https://seu-n8n.com/webhook/assinatura \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

## 📚 Referências

- [Documentação do CardForm](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-cardform)
- [Cartões de Teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)
- [Fluxo de Assinatura com Frontend](../docs/FLUXO_ASSINATURA_FRONTEND.md)

## 🎓 Aprendizado

Este frontend demonstra:

1. **Por que frontend é obrigatório**: O token gerado aqui funciona porque:

   - É gerado no navegador do usuário
   - Tem fingerprint do dispositivo
   - Tem prova de consentimento do pagador

2. **Por que tokens via API não funcionam**: Eles não têm essas características de segurança.

3. **Fluxo correto**: Frontend → Token → n8n → Mercado Pago → ✅

## 🔒 Segurança

- ⚠️ Este é um frontend de **teste/demonstração**
- ⚠️ Não use em produção sem:
  - Validação de dados no backend
  - Autenticação/autorização
  - Proteção CSRF
  - Rate limiting
  - Logs e monitoramento

Para produção, integre o CardForm no seu frontend real (React, Vue, etc.) seguindo as mesmas práticas.
