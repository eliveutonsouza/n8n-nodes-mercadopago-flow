# n8n-nodes-mercadopago-flow

[![npm version](https://img.shields.io/npm/v/n8n-nodes-mercadopago-flow.svg)](https://www.npmjs.com/package/n8n-nodes-mercadopago-flow)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-mercadopago-flow.svg)](https://www.npmjs.com/package/n8n-nodes-mercadopago-flow)
[![CI](https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow/workflows/CI/badge.svg)](https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

Node customizado do n8n para integração completa com a API do Mercado Pago, oferecendo suporte a **15 recursos** diferentes para processamento de pagamentos, gestão de clientes, assinaturas recorrentes e muito mais.

## 🎯 Recursos Disponíveis

Este node oferece integração completa com a API do Mercado Pago através de **15 recursos** diferentes. Veja a tabela completa abaixo:

| Recurso                     | Operações Disponíveis                                            | Documentação                                                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 💰 **PIX**                  | Criar, Consultar, Reembolsar                                     | [Guia PIX](./docs/GUIA_CAMPOS.md#pix)                                                                                                                         |
| 📋 **Planos**               | Criar, Consultar, Listar, Atualizar                              | [Guia Planos](./docs/GUIA_CAMPOS.md#planos)                                                                                                                   |
| 🔄 **Assinaturas**          | Criar, Pausar, Retomar, Cancelar, Consultar, Listar              | [Guia Assinaturas](./docs/GUIA_CAMPOS.md#assinaturas)                                                                                                         |
| 🔔 **Webhooks**             | Registrar, Consultar, Listar, Excluir                            | [Guia Webhooks](./docs/WEBHOOKS_ASSINATURAS.md)                                                                                                               |
| 💳 **Payments**             | Criar, Consultar, Listar, Buscar, Reembolsar, Capturar, Cancelar | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)                                                            |
| 👥 **Customers**            | Criar, Consultar, Atualizar, Deletar, Listar, Buscar             | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/customers/_customers/post)                                                          |
| 🎴 **Cards**                | Criar, Consultar, Deletar, Listar                                | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/cards/_customers_customer_id_cards/post)                                            |
| ⚙️ **Preferences**          | Criar, Consultar, Atualizar                                      | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/preferences/_checkout_preferences/post)                                             |
| 📱 **QR Orders**            | Criar, Consultar, Listar                                         | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/qr_orders/_instore_orders_qr_seller_collectors_user_id_pos_external_id_orders/post) |
| 🏪 **POS**                  | Criar, Consultar, Atualizar, Deletar, Listar                     | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/pos/_instore_orders_qr_seller_collectors_user_id_pos/post)                          |
| 🏬 **Stores**               | Criar, Consultar, Atualizar, Deletar, Listar                     | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/stores/_users_user_id_stores/post)                                                  |
| ⚠️ **Chargebacks**          | Consultar, Listar, Enviar Documentação                           | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/chargebacks/_chargebacks_id/get)                                                    |
| 🔐 **OAuth**                | Autorizar, Renovar Token, Obter Info do Usuário                  | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/oauth/_oauth_token/post)                                                            |
| 💳 **Payment Methods**      | Listar                                                           | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/payment_methods/_payment_methods/get)                                               |
| 🆔 **Identification Types** | Listar                                                           | [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/identification_types/_identification_types/get)                                     |

> **Nota**: Este projeto tem foco especial em **PIX** e **Assinaturas**, com documentação detalhada para esses recursos. Para informações sobre os outros recursos, consulte a [documentação oficial do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs) ou o [Guia de Referência de Campos](./docs/GUIA_CAMPOS.md).

## 📋 Requisitos

- n8n >= 2.0.3
- Node.js >= 18.17.0
- Credenciais do Mercado Pago (Access Token)

## 🚀 Quick Start

### Instalação Rápida (n8n Self-Hosted)

```bash
# No diretório do seu n8n
npm install n8n-nodes-mercadopago-flow

# Reinicie o n8n
docker restart n8n  # Se usar Docker
# ou reinicie o processo do n8n
```

### Primeiros Passos

1. **Configure as credenciais** no n8n:

   - Vá em **Credentials** → **Add Credential**
   - Selecione **Mercado Pago API**
   - Adicione seu **Access Token** do Mercado Pago

2. **Crie seu primeiro workflow**:

   - Adicione o node **Mercado Pago**
   - Selecione o recurso (ex: PIX)
   - Selecione a operação (ex: Criar)
   - Configure os campos obrigatórios
   - Execute o workflow

3. **Veja exemplos prontos**:
   - Importe workflows de exemplo de `exemplos/`
   - Veja [Guia de Referência de Campos](./docs/GUIA_CAMPOS.md) para detalhes

## 📦 Instalação Detalhada

### Instalação no n8n Self-Hosted (via NPM) - Recomendado

**Recomendado**: Instale via npm para facilitar atualizações.

1. No diretório do seu n8n self-hosted, instale o pacote:

```bash
npm install n8n-nodes-mercadopago-flow
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

1. Clone o repositório e compile:

```bash
git clone https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow.git
cd n8n-nodes-mercadopago-flow
npm install
npm run build
```

2. Copie a pasta `dist` para o diretório de nodes customizados do n8n
3. Reinicie o n8n
4. O node aparecerá na lista de nodes disponíveis

### Instalação Local (Desenvolvimento)

Para contribuir ou desenvolver:

1. Clone o repositório:

```bash
git clone https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow.git
cd n8n-nodes-mercadopago-flow
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

5. Execute os testes:

```bash
npm test
```

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para mais detalhes sobre desenvolvimento.

## ⚠️ Requisitos Importantes

Antes de começar, certifique-se de conhecer os requisitos críticos:

### 1. Assinaturas Exigem Conta Checkout Pro

**IMPORTANTE**: Para criar assinaturas no n8n, você **DEVE** ter uma conta **Checkout Pro** no Mercado Pago.

- ✅ **Checkout Pro** → Assinaturas funcionam
- ❌ **Outros tipos de conta** → Assinaturas **NÃO funcionam**

O Checkout Pro é o único tipo de conta que suporta a criação de assinaturas recorrentes via API.

### 2. PIX Só Funciona com Credenciais de Produção

**IMPORTANTE**: Pagamentos PIX **SOMENTE** funcionam com credenciais de **produção**.

- ✅ **Credenciais de Produção** → PIX funciona
- ❌ **Credenciais de Sandbox** → PIX **NÃO funciona**

O Mercado Pago não oferece suporte a PIX no ambiente de testes (sandbox).

Para mais detalhes, consulte [Requisitos do Mercado Pago](./docs/REQUISITOS_MERCADO_PAGO.md).

---

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

**Nota**: Para PIX, use sempre Production. Para assinaturas, certifique-se de ter conta Checkout Pro.

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

> 💡 **Outros Recursos**: Este README foca nos recursos principais (PIX e Assinaturas). Para usar os outros recursos (Payments, Customers, Cards, etc.), selecione o recurso desejado no node e configure os campos conforme necessário. Consulte a [documentação oficial do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs) para detalhes sobre cada recurso.

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

---

## 🔧 Outros Recursos Disponíveis

Além dos recursos principais documentados acima, o node também suporta:

- **Payments**: Para criar pagamentos genéricos (cartão de crédito, débito, etc.)
- **Customers**: Para gerenciar clientes e seus dados
- **Cards**: Para gerenciar cartões de crédito dos clientes
- **Preferences**: Para criar preferências de checkout personalizadas
- **QR Orders**: Para criar pedidos via QR Code
- **POS**: Para gerenciar pontos de venda físicos
- **Stores**: Para gerenciar lojas e estabelecimentos
- **Chargebacks**: Para consultar e gerenciar chargebacks
- **OAuth**: Para autenticação OAuth e renovação de tokens
- **Payment Methods**: Para listar métodos de pagamento disponíveis
- **Identification Types**: Para listar tipos de identificação aceitos

Para usar esses recursos, selecione o recurso desejado no node n8n e configure os campos conforme necessário. Consulte a [documentação oficial do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs) para detalhes sobre cada recurso e seus campos.

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

### Documentação Essencial

- [Requisitos do Mercado Pago](./docs/REQUISITOS_MERCADO_PAGO.md) - **LEIA PRIMEIRO**: Informações críticas sobre requisitos (Checkout Pro, PIX em produção)
- [Fluxo de Assinatura com Frontend](./docs/FLUXO_ASSINATURA_FRONTEND.md) - Guia completo sobre por que frontend é obrigatório e como implementar
- [Guia de Referência de Campos](./docs/GUIA_CAMPOS.md) - Exemplos detalhados de preenchimento de todos os campos
- [Como Obter card_token_id](./docs/COMO_OBTER_CARD_TOKEN.md) - Guia passo a passo para obter token do cartão
- [Webhooks de Assinaturas](./docs/WEBHOOKS_ASSINATURAS.md) - Configuração e processamento de webhooks
- [Compatibilidade de Ambiente](./docs/COMPATIBILIDADE_AMBIENTE.md) - Compatibilidade entre ambientes (sandbox/produção)
- [Diagramas de Arquitetura](./docs/DIAGRAMAS_ARQUITETURA.md) - Diagramas visuais dos fluxos principais

### Documentação Oficial do Mercado Pago

- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [API de Pagamentos](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)
- [API de Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/subscriptions)
- [API de Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [Painel de Credenciais](https://www.mercadopago.com.br/developers/panel/credentials)

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Este projeto segue o [Código de Conduta do Contributor Covenant](https://www.contributor-covenant.org/).

### Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Guias de Contribuição

- 📖 [CONTRIBUTING.md](./CONTRIBUTING.md) - Guia completo de contribuição
- 🏗️ [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Guia de desenvolvimento local
- ➕ [docs/ADDING_NEW_RESOURCE.md](./docs/ADDING_NEW_RESOURCE.md) - Como adicionar novos recursos

### Tipos de Contribuição

- 🐛 Reportar bugs
- ✨ Propor novas features
- 📚 Melhorar documentação
- 🧪 Adicionar testes
- 🔧 Melhorar código existente

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👤 Autor

Eliveuton Souza - eliveuton3m@hotmail.com

**GitHub**: [@eliveutonsouza](https://github.com/eliveutonsouza)  
**NPM**: [n8n-nodes-mercadopago-flow](https://www.npmjs.com/package/n8n-nodes-mercadopago-flow)

## 🙏 Agradecimentos

- Equipe do n8n pela excelente plataforma
- Mercado Pago pela API robusta e documentação completa
