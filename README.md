# n8n-nodes-mercadopago-pix-assinatura

[![npm version](https://img.shields.io/npm/v/n8n-nodes-mercadopago-pix-assinatura.svg)](https://www.npmjs.com/package/n8n-nodes-mercadopago-pix-assinatura)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-mercadopago-pix-assinatura.svg)](https://www.npmjs.com/package/n8n-nodes-mercadopago-pix-assinatura)

Node customizado do n8n para processamento de pagamentos via Mercado Pago, com suporte completo a:

- 💰 **Pagamentos PIX** (criação, consulta, reembolso)
- 📋 **Planos** (criar, consultar, listar, atualizar)
- 🔄 **Assinaturas** (criar, pausar, retomar, cancelar, consultar, listar)
- 🔔 **Webhooks** (registro, listagem, exclusão, consulta)

## 📋 Requisitos

- n8n >= 2.0.3
- Node.js >= 18.17.0
- Credenciais do Mercado Pago (Access Token)

## 🚀 Instalação

### Instalação Local (Desenvolvimento)

1. Clone o repositório:

```bash
git clone https://github.com/eliveutonsouza/n8n-nodes-mercadopago-pix-assinatura.git
cd n8n-nodes-mercadopago-pix-assinatura
```

2. Instale as dependências:

```bash
npm install
```

3. Compile o projeto:

```bash
npm run build
```

4. Para desenvolvimento com watch mode:

```bash
npm run dev
```

### Instalação no n8n Self-Hosted (via NPM)

**Recomendado**: Instale via npm para facilitar atualizações.

1. No diretório do seu n8n self-hosted, instale o pacote:

```bash
npm install n8n-nodes-mercadopago-pix-assinatura
```

2. Reinicie o n8n:

```bash
# Se estiver usando Docker
docker restart n8n

# Se estiver usando npm diretamente
# Reinicie o processo do n8n
```

3. O node aparecerá na lista de nodes disponíveis no n8n

### Instalação Manual no n8n

1. Copie a pasta `dist` para o diretório de nodes customizados do n8n
2. Reinicie o n8n
3. O node aparecerá na lista de nodes disponíveis

## ⚙️ Configuração de Credenciais

1. Acesse o [Painel de Desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel/credentials)
2. Obtenha seu **Access Token** (produção ou sandbox)
3. No n8n, vá em **Credentials** → **Add Credential**
4. Selecione **Mercado Pago API**
5. Preencha:
   - **Access Token**: Seu token de acesso
   - **Client ID**: (Opcional)
   - **Client Secret**: (Opcional)
   - **Environment**: Sandbox ou Production

## ⚠️ Limitação Importante: Assinaturas Exigem Frontend

**IMPORTANTE**: Para criar assinaturas (preapproval) no Mercado Pago, o token do cartão (`card_token_id`) **DEVE ser gerado no frontend** usando o CardForm oficial do Mercado Pago.

### Por que isso é necessário?

O Mercado Pago exige **prova de consentimento do pagador** para assinaturas recorrentes. Essa prova só existe quando:
- O cartão é digitado pelo usuário no navegador
- Usando o CardForm oficial do Mercado Pago
- Com fingerprint do dispositivo embutido

### O que NÃO funciona

❌ Tokens gerados via API (`/v1/card_tokens`)
❌ Tokens gerados no backend
❌ Tokens gerados via n8n
❌ Automação 100% server-side

Todos esses tokens são **sempre recusados** pela API para assinaturas.

### O que FUNCIONA

✅ Token gerado no frontend via CardForm
✅ Fluxo: Frontend → Webhook n8n → Criar Assinatura
✅ Arquitetura mínima com página HTML + n8n

### Documentação Completa

Para entender o fluxo completo e ver exemplos de código, consulte:
- **[Fluxo de Assinatura com Frontend](./docs/FLUXO_ASSINATURA_FRONTEND.md)** - Guia completo com exemplos

## 📖 Uso

> 📋 **Guia Completo de Campos**: Para exemplos detalhados de preenchimento de todos os campos de todas as operações, consulte o [Guia de Referência de Campos](./docs/GUIA_CAMPOS.md).

### PIX - Criar Pagamento

Cria um novo pagamento PIX e retorna o QR Code para pagamento.

**Campos obrigatórios:**

- Valor (em reais, ex: 10.50)
- Descrição
- E-mail do Pagador

**Campos opcionais:**

- CPF/CNPJ do Pagador
- Nome do Pagador
- Data de Expiração
- Referência Externa
- Chave de Idempotência

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

### PIX - Consultar Pagamento

Consulta o status de um pagamento PIX existente.

**Campos obrigatórios:**

- ID do Pagamento

**Resposta:**

```json
{
  "id": "123456789",
  "status": "approved",
  "amount": 10.50,
  "currency": "BRL",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "raw": { ... }
}
```

### PIX - Reembolsar Pagamento

Reembolsa total ou parcialmente um pagamento PIX.

**Campos obrigatórios:**

- ID do Pagamento

**Campos opcionais:**

- Valor do Reembolso (deixe vazio para reembolso total)

### Assinaturas - Criar

Cria uma nova assinatura baseada em um plano existente.

**⚠️ IMPORTANTE**: O token do cartão (`cardTokenId`) **deve ser gerado no frontend** usando CardForm. Tokens gerados via API não funcionam. Veja [Fluxo de Assinatura com Frontend](./docs/FLUXO_ASSINATURA_FRONTEND.md).

**Campos obrigatórios:**

- ID do Plano
- E-mail do Pagador

**Campos opcionais:**

- CPF/CNPJ do Pagador
- Token do Cartão (gerado no frontend via CardForm)
- Status da Assinatura ("pending" ou "authorized")
- Data de Início
- Período de Trial (dias)
- Descrição da Assinatura
- Referência Externa

### Assinaturas - Pausar/Retomar/Cancelar

Gerencia o status de uma assinatura existente.

**Campos obrigatórios:**

- ID da Assinatura

### Assinaturas - Consultar/Listar

Consulta uma assinatura específica ou lista todas as assinaturas.

### Webhooks - Registrar

Registra um novo webhook para receber notificações de eventos.

**Campos obrigatórios:**

- URL (deve ser acessível publicamente)

**Campos opcionais:**

- Eventos (payment, subscription)
- Descrição

**Eventos disponíveis:**

- `payment` - Notificações de pagamentos
- `subscription` - Notificações de assinaturas

### Webhooks - Listar/Consultar/Excluir

Gerencia webhooks registrados.

## 🔒 Segurança

- ✅ Tokens nunca são logados
- ✅ Suporte a idempotência via `X-Idempotency-Key`
- ✅ Validação de campos obrigatórios
- ✅ Validação de CPF/CNPJ e e-mails
- ✅ Suporte a ambientes sandbox e produção

## 🧪 Testes

Para testar localmente:

1. Configure credenciais sandbox do Mercado Pago
2. Execute o n8n em modo desenvolvimento:

```bash
npm run dev
```

3. Crie um workflow de teste no n8n
4. Teste cada operação com dados de exemplo

## 📝 Estrutura de Respostas

Todas as respostas seguem um formato padronizado:

```json
{
  "id": "string",
  "status": "string",
  "amount": 0.0,
  "currency": "BRL",
  "createdAt": "ISO8601",
  "raw": {
    /* Dados completos da API */
  }
}
```

O campo `raw` contém a resposta completa da API do Mercado Pago para acesso a todos os dados disponíveis.

## 🐛 Troubleshooting

### Erro: "Credenciais não encontradas"

- Verifique se as credenciais foram configuradas corretamente no n8n
- Certifique-se de que o Access Token está válido

### Erro: "E-mail do pagador inválido"

- Verifique o formato do e-mail (deve conter @ e domínio válido)

### Erro: "CPF/CNPJ inválido"

- CPF deve conter 11 dígitos numéricos
- CNPJ deve conter 14 dígitos numéricos
- Caracteres especiais são removidos automaticamente

### Erro: "Valor do pagamento deve ser maior que zero"

- Verifique se o valor está correto
- Valores são convertidos automaticamente para centavos

### Webhook não recebe notificações

- Verifique se a URL é acessível publicamente
- Certifique-se de que o servidor está rodando e acessível
- Verifique os logs do Mercado Pago no painel de desenvolvedores

## 📚 Documentação Adicional

### Documentação Técnica do Node

- [Diagramas de Arquitetura](./docs/DIAGRAMAS_ARQUITETURA.md) - Visão completa dos fluxos de Assinatura (cartão) e PIX (recorrência manual) com diagramas Mermaid
- [Payloads Exatos da API](./docs/PAYLOADS_API.md) - Especificação técnica completa de todos os payloads por operação
- [Schema do Node n8n](./docs/SCHEMA_NODE.md) - Modelagem completa do schema, campos por operação e output normalizado

### Documentação de Uso

- [Fluxo de Assinatura com Frontend](./docs/FLUXO_ASSINATURA_FRONTEND.md) - **LEIA PRIMEIRO**: Guia completo sobre por que frontend é obrigatório e como implementar
- [Guia de Referência de Campos](./docs/GUIA_CAMPOS.md) - Exemplos detalhados de preenchimento de todos os campos
- [Webhooks de Assinaturas](./docs/WEBHOOKS_ASSINATURAS.md) - Configuração e processamento de webhooks

### Documentação Oficial do Mercado Pago

- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [API de Pagamentos](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)
- [API de Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/subscriptions)
- [API de Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👤 Autor

Eliveuton Souza - eliveuton3m@hotmail.com

**GitHub**: [@eliveutonsouza](https://github.com/eliveutonsouza)  
**NPM**: [n8n-nodes-mercadopago-pix-assinatura](https://www.npmjs.com/package/n8n-nodes-mercadopago-pix-assinatura)

## 🙏 Agradecimentos

- Equipe do n8n pela excelente plataforma
- Mercado Pago pela API robusta e documentação completa
