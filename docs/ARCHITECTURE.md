# Arquitetura do Projeto

Este documento descreve a arquitetura do node n8n para Mercado Pago, incluindo estrutura de código, fluxo de dados e decisões de design.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Fluxo de Execução](#fluxo-de-execução)
- [Sistema de Recursos](#sistema-de-recursos)
- [Componentes Principais](#componentes-principais)
- [Fluxo de Dados](#fluxo-de-dados)
- [Decisões de Design](#decisões-de-design)

## 🎯 Visão Geral

O projeto segue uma arquitetura modular baseada em recursos, onde cada recurso da API do Mercado Pago é implementado como um handler separado. Isso facilita manutenção, testes e extensibilidade.

### Princípios Arquiteturais

1. **Modularidade**: Cada recurso é independente
2. **Reutilização**: Funções comuns centralizadas
3. **Testabilidade**: Código facilmente testável
4. **Extensibilidade**: Fácil adicionar novos recursos
5. **Type Safety**: TypeScript estrito em todo o código

## 📁 Estrutura de Pastas

```
n8n-nodes-mercadopago-flow/
├── nodes/
│   └── MercadoPago/
│       ├── MercadoPago.node.ts          # Entry point do node
│       ├── nodeProperties.ts            # Definição de campos do n8n
│       ├── GenericFunctions.ts          # Requisições HTTP centralizadas
│       ├── helpers.ts                   # Funções utilitárias
│       ├── types.ts                     # Tipos TypeScript
│       ├── utils/
│       │   └── responseNormalizer.ts   # Normalização de respostas
│       └── resources/                  # Handlers de recursos
│           ├── ResourceHandler.ts      # Interface base
│           ├── PixResource.ts
│           ├── PlansResource.ts
│           ├── SubscriptionsResource.ts
│           └── ... (15 recursos no total)
├── credentials/
│   └── MercadoPagoApi.credentials.ts   # Definição de credenciais
├── test/                                # Testes
│   ├── unit/                           # Testes unitários
│   ├── integration/                    # Testes de integração
│   ├── local/                          # Testes locais
│   └── mocks/                          # Mocks
└── dist/                               # Build output
```

## 🔄 Fluxo de Execução

### 1. Inicialização do Node

```mermaid
flowchart TD
    N8N[n8n Workflow]
    NODE[MercadoPago.node.ts]
    PROPS[nodeProperties.ts]
    CRED[Credentials]

    N8N -->|1. Carrega node| NODE
    NODE -->|2. Define propriedades| PROPS
    NODE -->|3. Solicita credenciais| CRED
    CRED -->|4. Valida token| NODE
```

### 2. Execução de Operação

```mermaid
flowchart TD
    USER[Usuário no n8n]
    NODE[MercadoPago.node.ts]
    PROPS[nodeProperties.ts]
    ROUTER[Router de Recursos]
    RESOURCE[Resource Handler]
    GENERIC[GenericFunctions]
    API[API Mercado Pago]
    NORMALIZER[responseNormalizer]

    USER -->|1. Seleciona recurso/operação| NODE
    NODE -->|2. Lê propriedades| PROPS
    NODE -->|3. Roteia para handler| ROUTER
    ROUTER -->|4. Instancia handler| RESOURCE
    RESOURCE -->|5. Prepara dados| RESOURCE
    RESOURCE -->|6. Chama apiRequest| GENERIC
    GENERIC -->|7. Faz requisição HTTP| API
    API -->|8. Retorna resposta| GENERIC
    GENERIC -->|9. Retorna dados| RESOURCE
    RESOURCE -->|10. Retorna dados| NODE
    NODE -->|11. Normaliza resposta| NORMALIZER
    NORMALIZER -->|12. Retorna formatado| USER
```

## 🧩 Sistema de Recursos

### Interface Base

Todos os recursos implementam `IResourceHandler`:

```typescript
interface IResourceHandler {
  operations: string[]; // Lista de operações suportadas
  execute(
    executeFunctions: IExecuteFunctions,
    operation: string,
    resource: string
  ): Promise<any>;
}
```

### Exemplo de Recurso

```typescript
export class PixResource implements IResourceHandler {
  operations = ["create", "get", "refund"];

  async execute(
    executeFunctions: IExecuteFunctions,
    operation: string,
    _resource: string
  ): Promise<any> {
    switch (operation) {
      case "create":
        return await this.createPixPayment(executeFunctions, 0);
      case "get":
        return await this.getPixPayment(executeFunctions, 0);
      case "refund":
        return await this.refundPixPayment(executeFunctions, 0);
      default:
        throw new Error(`Operação "${operation}" não suportada`);
    }
  }

  private async createPixPayment(...) {
    // Implementação
  }
}
```

### Registro de Recursos

Os recursos são registrados em `MercadoPago.node.ts`:

```typescript
const resourceHandlers: Record<string, IResourceHandler> = {
  pix: new PixResource(),
  plans: new PlansResource(),
  subscriptions: new SubscriptionsResource(),
  // ... outros recursos
};
```

## 🔧 Componentes Principais

### 1. MercadoPago.node.ts

**Responsabilidades:**

- Definir descrição do node
- Rotear requisições para recursos corretos
- Normalizar respostas
- Tratar erros

**Fluxo:**

1. Recebe execução do n8n
2. Lê parâmetros (recurso, operação)
3. Busca handler do recurso
4. Executa operação
5. Normaliza resposta
6. Retorna para n8n

### 2. GenericFunctions.ts

**Funções:**

- `apiRequest()`: Requisições HTTP centralizadas
- `buildUrl()`: Construção de URLs com path parameters

**Características:**

- Tratamento de erros unificado
- Headers automáticos (Authorization, Content-Type)
- Suporte a query parameters
- Suporte a body JSON

### 3. helpers.ts

**Funções Utilitárias:**

- `validateCPF()` / `validateCNPJ()`: Validação de documentos
- `validateEmail()`: Validação de e-mail
- `normalizeAmount()`: Conversão de valores
- `cleanDocument()`: Limpeza de documentos
- `getDocumentType()`: Identificação de tipo de documento
- `handleMercadoPagoError()`: Tratamento de erros da API

### 4. responseNormalizer.ts

**Responsabilidade:**
Normalizar respostas da API para formato consistente.

**Formato Normalizado:**

```typescript
{
  id: string;
  status: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
  provider: "mercado_pago";
  type: "payment" | "plan" | "subscription" | "webhook";
  raw: any;  // Resposta completa da API
}
```

### 5. nodeProperties.ts

**Responsabilidade:**
Definir todos os campos do node no n8n.

**Estrutura:**

- Seleção de recurso (dropdown)
- Seleção de operação (dinâmico baseado no recurso)
- Campos específicos por recurso/operação

## 📊 Fluxo de Dados

### Criação de Pagamento PIX

```mermaid
sequenceDiagram
    participant U as Usuário n8n
    participant N as MercadoPago.node.ts
    participant P as PixResource
    participant G as GenericFunctions
    participant API as API Mercado Pago
    participant R as responseNormalizer

    U->>N: Executa workflow
    N->>N: Lê parâmetros (resource: pix, operation: create)
    N->>P: execute(executeFunctions, "create", "pix")
    P->>P: Lê campos (amount, description, payerEmail)
    P->>P: Valida campos obrigatórios
    P->>P: Prepara payload
    P->>G: apiRequest("POST", "/v1/payments", payload)
    G->>G: Adiciona headers (Authorization, Content-Type)
    G->>API: POST /v1/payments
    API->>G: Resposta JSON
    G->>P: Dados do pagamento
    P->>N: Retorna dados
    N->>R: normalizeResponse(data, "payment")
    R->>N: Dados normalizados
    N->>U: Retorna resultado
```

### Tratamento de Erros

```mermaid
flowchart TD
    START[Requisição]
    API[API Mercado Pago]
    ERROR{Erro?}
    HANDLER[handleMercadoPagoError]
    TYPE{Tipo de Erro}
    VALIDATION[Erro de Validação]
    AUTH[Erro de Autenticação]
    API_ERROR[Erro da API]
    USER[Usuário]

    START --> API
    API --> ERROR
    ERROR -->|Sim| HANDLER
    ERROR -->|Não| USER
    HANDLER --> TYPE
    TYPE -->|400| VALIDATION
    TYPE -->|401/403| AUTH
    TYPE -->|Outros| API_ERROR
    VALIDATION --> USER
    AUTH --> USER
    API_ERROR --> USER
```

## 🎨 Decisões de Design

### 1. Arquitetura Modular

**Decisão**: Cada recurso é um handler separado.

**Razão**:

- Facilita manutenção
- Permite testes isolados
- Facilita adicionar novos recursos
- Reduz acoplamento

### 2. Funções Centralizadas

**Decisão**: `GenericFunctions.ts` centraliza requisições HTTP.

**Razão**:

- Evita duplicação de código
- Tratamento de erros unificado
- Facilita mudanças futuras (ex: retry, logging)

### 3. Normalização de Respostas

**Decisão**: Todas as respostas são normalizadas.

**Razão**:

- Formato consistente no n8n
- Facilita uso em workflows
- Mantém dados completos em `raw`

### 4. TypeScript Estrito

**Decisão**: TypeScript com strict mode.

**Razão**:

- Detecção de erros em tempo de compilação
- Melhor autocomplete
- Documentação implícita via tipos
- Refatoração mais segura

### 5. Testes em Camadas

**Decisão**: Testes unitários, integração e locais.

**Razão**:

- Testes unitários: rápidos, testam lógica isolada
- Testes de integração: testam fluxo completo com mocks
- Testes locais: validação com API real

## 🔐 Segurança

### Credenciais

- Credenciais nunca são logadas
- Armazenadas de forma segura pelo n8n
- Validação de token antes de requisições

### Validação de Entrada

- Validação de CPF/CNPJ
- Validação de e-mail
- Validação de valores monetários
- Sanitização de documentos

### Tratamento de Erros

- Erros não expõem informações sensíveis
- Mensagens de erro claras para usuário
- Logs detalhados para debugging (sem dados sensíveis)

## 📈 Extensibilidade

### Adicionar Novo Recurso

1. Criar `NovoRecursoResource.ts` em `resources/`
2. Implementar `IResourceHandler`
3. Adicionar propriedades em `nodeProperties.ts`
4. Registrar em `MercadoPago.node.ts`
5. Criar testes

Veja [ADDING_NEW_RESOURCE.md](./ADDING_NEW_RESOURCE.md) para guia detalhado.

### Adicionar Nova Operação

1. Adicionar operação em `operations` do recurso
2. Adicionar case no `switch` do `execute()`
3. Implementar método privado
4. Adicionar campos em `nodeProperties.ts`
5. Criar testes

## 🔗 Referências

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia de desenvolvimento
- [ADDING_NEW_RESOURCE.md](./ADDING_NEW_RESOURCE.md) - Como adicionar recursos
- [Documentação do n8n](https://docs.n8n.io/integrations/creating-nodes/)
- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
