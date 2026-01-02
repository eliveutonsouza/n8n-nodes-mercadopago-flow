# Compatibilidade de Ambiente - Mercado Pago

## ⚠️ Regra Fundamental

**PUBLIC_KEY e Access Token DEVEM estar no mesmo ambiente (sandbox ou produção).**

Tokens de cartão gerados com uma PUBLIC_KEY de um ambiente **NÃO funcionam** com Access Token de outro ambiente.

## Por Que Isso É Importante?

Quando você cria uma assinatura no Mercado Pago:

1. O **frontend** usa a **PUBLIC_KEY** para gerar o token do cartão via CardForm
2. O **backend/n8n** usa o **Access Token** para criar a assinatura na API
3. Se esses dois tokens estiverem em ambientes diferentes, a API retornará erro `CC_VAL_433`

## Como Identificar o Ambiente das Credenciais

### PUBLIC_KEY

A PUBLIC_KEY pode ser identificada no [Painel de Desenvolvedores](https://www.mercadopago.com.br/developers/panel/credentials):

- **Sandbox**: Geralmente contém "TEST" no nome ou está na seção "Credenciais de teste"
- **Produção**: Está na seção "Credenciais de produção"

**Nota**: Ambos os ambientes podem ter PUBLIC_KEYs que começam com `APP_USR-`, então a detecção automática pode não ser 100% precisa. Sempre verifique no painel.

### Access Token

O Access Token é configurado através da variável de ambiente `MP_ENVIRONMENT`:

- `MP_ENVIRONMENT=sandbox` → Ambiente de teste
- `MP_ENVIRONMENT=production` → Ambiente de produção

## Erro Comum: CC_VAL_433

Se você receber o erro:

```
CC_VAL_433 Credit card validation has failed
```

**Possíveis causas:**

1. ✅ **Token do cartão expirado ou já usado** (tokens são de uso único)
2. ⚠️ **INCOMPATIBILIDADE DE AMBIENTE** (mais comum):
   - PUBLIC_KEY está em sandbox, mas Access Token está em produção
   - Ou vice-versa
3. Access Token sem permissões adequadas
4. Token gerado via API em vez de frontend CardForm

## Como Verificar e Corrigir

### 1. Verificar Ambiente da PUBLIC_KEY

Execute o comando:

```bash
npm run frontend:config
```

O script mostrará:
- Se conseguiu detectar o ambiente da PUBLIC_KEY automaticamente
- Se há incompatibilidade com o Access Token

### 2. Verificar Ambiente do Access Token

No arquivo `.env`, verifique:

```bash
MP_ENVIRONMENT=sandbox  # ou production
MP_ACCESS_TOKEN=APP_USR-...
```

### 3. Garantir Compatibilidade

**Cenário 1: Desenvolvimento/Testes**
```bash
# .env
MP_ENVIRONMENT=sandbox
MP_ACCESS_TOKEN=APP_USR-...  # Access Token de sandbox
MERCADOPAGO_PUBLIC_KEY=APP_USR-...  # PUBLIC_KEY de sandbox
```

**Cenário 2: Produção**
```bash
# .env
MP_ENVIRONMENT=production
MP_ACCESS_TOKEN=APP_USR-...  # Access Token de produção
MERCADOPAGO_PUBLIC_KEY=APP_USR-...  # PUBLIC_KEY de produção
```

## Exemplo de Configuração Correta

### Sandbox (Desenvolvimento)

```bash
# .env
MP_ENVIRONMENT=sandbox
MP_ACCESS_TOKEN=APP_USR-1234567890-123456-abcdef...
MERCADOPAGO_PUBLIC_KEY=APP_USR-9876543210-987654-fedcba...
```

### Produção

```bash
# .env
MP_ENVIRONMENT=production
MP_ACCESS_TOKEN=APP_USR-1111111111-111111-aaaaaa...
MERCADOPAGO_PUBLIC_KEY=APP_USR-2222222222-222222-bbbbbb...
```

## Troubleshooting

### Erro: "CC_VAL_433 Credit card validation has failed"

**Passo 1**: Verifique o ambiente do Access Token
```bash
# No .env
MP_ENVIRONMENT=sandbox  # ou production?
```

**Passo 2**: Verifique o ambiente da PUBLIC_KEY
- Acesse: https://www.mercadopago.com.br/developers/panel/credentials
- Veja se a PUBLIC_KEY está em "Credenciais de teste" ou "Credenciais de produção"

**Passo 3**: Execute a validação
```bash
npm run frontend:config
```

**Passo 4**: Se houver incompatibilidade:
- Use PUBLIC_KEY e Access Token do mesmo ambiente
- Gere um novo token no frontend após corrigir
- Tente criar a assinatura novamente

### Erro: "User cards api internal server error"

Este erro também pode indicar incompatibilidade de ambiente. Siga os mesmos passos acima.

## Validação Automática

O script `npm run frontend:config` agora valida automaticamente a compatibilidade:

```bash
$ npm run frontend:config

✅ Arquivo de configuração gerado: test/frontend-config.js
📋 Configurações:
   Public Key: APP_USR-9bfc91e0-7266...
   Ambiente detectado da Public Key: sandbox
   
   ✅ Ambientes compatíveis: PUBLIC_KEY e Access Token estão ambos em "sandbox".
```

Ou, se houver incompatibilidade:

```bash
$ npm run frontend:config

✅ Arquivo de configuração gerado: test/frontend-config.js
📋 Configurações:
   Public Key: APP_USR-9bfc91e0-7266...
   Ambiente detectado da Public Key: sandbox
   
   ⚠️ INCOMPATIBILIDADE DE AMBIENTE DETECTADA: 
   PUBLIC_KEY está em ambiente "sandbox" mas Access Token está em "production".
   Tokens gerados com PUBLIC_KEY de um ambiente não funcionam com Access Token de outro ambiente.
   Certifique-se de usar PUBLIC_KEY e Access Token do mesmo ambiente.
   
   💡 SOLUÇÃO:
   - Use PUBLIC_KEY e Access Token do mesmo ambiente (sandbox ou produção)
   - Verifique suas credenciais no painel do Mercado Pago:
     https://www.mercadopago.com.br/developers/panel/credentials
```

## Referências

- [Painel de Credenciais do Mercado Pago](https://www.mercadopago.com.br/developers/panel/credentials)
- [Documentação de Assinaturas](https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post)
- [Fluxo de Assinatura com Frontend](docs/FLUXO_ASSINATURA_FRONTEND.md)

