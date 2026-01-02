# Guia de Desenvolvimento

Este documento fornece instruções detalhadas para configurar o ambiente de desenvolvimento e contribuir com o projeto.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Executando o Projeto](#executando-o-projeto)
- [Testes](#testes)
- [Padrões de Código](#padrões-de-código)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)

## 🔧 Pré-requisitos

- **Node.js**: >= 18.17.0
- **npm**: >= 9.0.0 (ou yarn)
- **n8n**: >= 2.0.3 (para testar o node)
- **Git**: Para controle de versão
- **TypeScript**: 5.3 (instalado via npm)

## 🚀 Configuração do Ambiente

### 1. Clonar o Repositório

```bash
git clone https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow.git
cd n8n-nodes-mercadopago-flow
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Compilar o Projeto

```bash
npm run build
```

Isso irá:
- Compilar TypeScript para JavaScript em `dist/`
- Copiar ícones e assets necessários

### 4. Configurar Variáveis de Ambiente (Opcional)

Para testes com API real, crie um arquivo `.env` na raiz:

```bash
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
MERCADOPAGO_ENVIRONMENT=sandbox  # ou production
MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook
```

## 📁 Estrutura do Projeto

```
n8n-nodes-mercadopago-flow/
├── nodes/
│   └── MercadoPago/
│       ├── MercadoPago.node.ts      # Node principal
│       ├── nodeProperties.ts        # Propriedades do node (campos)
│       ├── GenericFunctions.ts      # Funções HTTP centralizadas
│       ├── helpers.ts                # Funções utilitárias
│       ├── types.ts                  # Tipos TypeScript
│       ├── utils/
│       │   └── responseNormalizer.ts # Normalização de respostas
│       └── resources/               # Handlers de recursos
│           ├── ResourceHandler.ts   # Interface base
│           ├── PixResource.ts
│           ├── PlansResource.ts
│           ├── SubscriptionsResource.ts
│           └── ... (outros recursos)
├── credentials/
│   └── MercadoPagoApi.credentials.ts # Credenciais do n8n
├── test/
│   ├── unit/                        # Testes unitários
│   ├── integration/                 # Testes de integração (mocks)
│   ├── local/                       # Testes locais (API real)
│   ├── mocks/                       # Mocks para testes
│   └── helpers/                     # Helpers de teste
├── docs/                            # Documentação
├── exemplos/                        # Exemplos de workflows
├── dist/                            # Build output (gerado)
└── package.json
```

### Componentes Principais

#### 1. MercadoPago.node.ts

O arquivo principal do node. Responsável por:
- Definir a descrição do node
- Rotear requisições para os recursos corretos
- Normalizar respostas
- Tratar erros

#### 2. nodeProperties.ts

Define todos os campos do node no n8n:
- Seleção de recurso
- Seleção de operação
- Campos específicos por recurso/operação

#### 3. GenericFunctions.ts

Funções centralizadas para requisições HTTP:
- `apiRequest()` - Faz requisições à API do Mercado Pago
- `buildUrl()` - Constrói URLs com query parameters

#### 4. resources/

Cada recurso tem seu próprio arquivo que implementa `IResourceHandler`:
- `operations` - Lista de operações suportadas
- `execute()` - Executa a operação solicitada

#### 5. helpers.ts

Funções utilitárias:
- Validação de CPF/CNPJ
- Validação de e-mail
- Normalização de valores
- Limpeza de documentos

## 🏃 Executando o Projeto

### Modo Desenvolvimento (Watch)

```bash
npm run dev
```

Isso compila o TypeScript em modo watch, recompilando automaticamente quando arquivos mudam.

### Build de Produção

```bash
npm run build
```

### Testar no n8n

1. Compile o projeto: `npm run build`
2. No n8n, adicione o caminho para `dist/` como node customizado
3. Ou instale localmente: `npm link` e depois `npm link n8n-nodes-mercadopago-flow` no diretório do n8n

## 🧪 Testes

### Estrutura de Testes

- **Unitários** (`test/unit/`): Testam funções isoladas
- **Integração** (`test/integration/`): Testam integração com API (usando mocks)
- **Locais** (`test/local/`): Testes manuais com API real do Mercado Pago

### Executando Testes

```bash
# Todos os testes
npm test

# Apenas unitários
npm run test:unit

# Apenas integração
npm run test:integration

# Com cobertura
npm run test:coverage

# Modo watch
npm run test:watch

# Testes locais (requer .env)
npm run test:local
```

### Escrevendo Testes

#### Teste Unitário

```typescript
// test/unit/helpers.test.ts
import { describe, it, expect } from '@jest/globals';
import { validateCPF } from '../../nodes/MercadoPago/helpers';

describe('Helpers', () => {
  describe('validateCPF', () => {
    it('deve validar CPF válido', () => {
      expect(validateCPF('12345678909')).toBe(true);
    });
  });
});
```

#### Teste de Integração

```typescript
// test/integration/pix.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import { PixResource } from '../../nodes/MercadoPago/resources/PixResource';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';

describe('PixResource Integration Tests', () => {
  let pixResource: PixResource;
  let mockExecuteFunctions: any;

  beforeEach(() => {
    pixResource = new PixResource();
    mockExecuteFunctions = createMockExecuteFunctions();
  });

  it('deve criar pagamento PIX com sucesso', async () => {
    // Configurar mocks
    // Executar
    // Verificar
  });
});
```

### Cobertura de Testes

O projeto mantém:
- **Statements**: >= 85%
- **Lines**: >= 85%
- **Branches**: >= 65%
- **Functions**: >= 55%

Execute `npm run test:coverage` para ver o relatório.

## 📝 Padrões de Código

### TypeScript

- Use TypeScript estrito
- Sempre tipar parâmetros e retornos
- Use interfaces para tipos complexos
- Evite `any` - use `unknown` se necessário

### Formatação

O projeto usa:
- **ESLint** para linting
- **Prettier** para formatação

```bash
# Verificar lint
npm run lint

# Corrigir lint automaticamente
npm run lintfix

# Formatar código
npm run format
```

### Nomenclatura

- **Arquivos**: `PascalCase.ts` para classes, `camelCase.ts` para utilitários
- **Classes**: `PascalCase` (ex: `PixResource`)
- **Funções/Variáveis**: `camelCase` (ex: `createPixPayment`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `MAX_RETRIES`)
- **Interfaces**: `I` prefix (ex: `IResourceHandler`)

### Estrutura de Arquivos

#### Criar um Novo Recurso

1. Crie `nodes/MercadoPago/resources/NovoRecursoResource.ts`
2. Implemente `IResourceHandler`
3. Adicione propriedades em `nodeProperties.ts`
4. Registre em `MercadoPago.node.ts`
5. Crie testes

Veja [ADDING_NEW_RESOURCE.md](./ADDING_NEW_RESOURCE.md) para guia detalhado.

### Documentação de Código

Use JSDoc para funções públicas:

```typescript
/**
 * Cria um pagamento PIX
 * @param amount - Valor em reais (ex: 10.50)
 * @param description - Descrição do pagamento
 * @returns Promise com dados do pagamento
 */
async function createPixPayment(
  amount: number,
  description: string
): Promise<Payment> {
  // ...
}
```

## 🔄 Fluxo de Desenvolvimento

### 1. Criar Branch

```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 2. Desenvolver

- Faça suas alterações
- Execute testes: `npm test`
- Verifique lint: `npm run lint`
- Compile: `npm run build`

### 3. Commit

Siga [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: adiciona novo recurso X"
git commit -m "fix: corrige bug em Y"
git commit -m "docs: atualiza documentação"
```

### 4. Push e PR

```bash
git push origin feature/nome-da-feature
```

Depois abra um Pull Request no GitHub.

## 🐛 Debugging

### Logs

Para debug, use `console.log` temporariamente ou use o debugger do VS Code:

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Testar no n8n

1. Compile: `npm run build`
2. No n8n, adicione breakpoints
3. Execute o workflow
4. Inspecione variáveis e dados

## 📚 Recursos Adicionais

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guia completo de contribuição
- [ADDING_NEW_RESOURCE.md](./ADDING_NEW_RESOURCE.md) - Como adicionar novos recursos
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do projeto
- [Documentação do n8n](https://docs.n8n.io/integrations/creating-nodes/)
- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)

## ❓ Dúvidas?

- Abra uma [Issue](https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow/issues)
- Consulte a documentação
- Veja exemplos em `exemplos/`

