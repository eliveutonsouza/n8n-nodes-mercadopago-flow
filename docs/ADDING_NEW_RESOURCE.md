# Guia: Adicionando um Novo Recurso

Este guia passo a passo mostra como adicionar um novo recurso da API do Mercado Pago ao node n8n.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Passo a Passo](#passo-a-passo)
- [Exemplo Completo](#exemplo-completo)
- [Checklist](#checklist)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

Para adicionar um novo recurso, você precisa:

1. Criar o arquivo do recurso em `nodes/MercadoPago/resources/`
2. Implementar a interface `IResourceHandler`
3. Adicionar propriedades em `nodeProperties.ts`
4. Registrar o recurso em `MercadoPago.node.ts`
5. Criar testes

## 📝 Passo a Passo

### Passo 1: Criar o Arquivo do Recurso

Crie um novo arquivo em `nodes/MercadoPago/resources/NovoRecursoResource.ts`:

```typescript
import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest, buildUrl } from "../GenericFunctions";
import { getNodeParameterSafe } from "../helpers";

export class NovoRecursoResource implements IResourceHandler {
  operations = ["create", "get", "list"]; // Defina as operações suportadas

  async execute(
    executeFunctions: IExecuteFunctions,
    operation: string,
    _resource: string
  ): Promise<any> {
    const itemIndex = 0;

    switch (operation) {
      case "create":
      return await this.createNovoRecurso(executeFunctions, itemIndex);
      case "get":
      return await this.getNovoRecurso(executeFunctions, itemIndex);
      case "list":
      return await this.listNovoRecursos(executeFunctions, itemIndex);
      default:
      throw new Error(
        `Operação "${operation}" não é suportada para NovoRecurso. ` +
        `Operações disponíveis: ${this.operations.join(", ")}`
      );
    }
  }

  private async createNovoRecurso(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    // Implementação aqui
  }

  private async getNovoRecurso(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    // Implementação aqui
  }

  private async listNovoRecursos(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    // Implementação aqui
  }
}
```

### Passo 2: Implementar as Operações

Para cada operação, você precisa:

1. **Ler parâmetros** do n8n
2. **Validar campos obrigatórios**
3. **Preparar payload** para a API
4. **Fazer requisição** usando `apiRequest`
5. **Retornar resposta**

#### Exemplo: Operação Create

```typescript
private async createNovoRecurso(
  executeFunctions: IExecuteFunctions,
  itemIndex: number
): Promise<any> {
  // 1. Ler parâmetros obrigatórios
  const name = executeFunctions.getNodeParameter("name", itemIndex) as string;
  const amount = executeFunctions.getNodeParameter("amount", itemIndex) as number;

  // 2. Validar (se necessário)
  if (!name || name.trim() === "") {
    throw new Error("Nome é obrigatório");
  }

  if (amount <= 0) {
    throw new Error("Valor deve ser maior que zero");
  }

  // 3. Preparar payload
  const body: any = {
    name,
    amount,
  };

  // 4. Campos opcionais
  const description = getNodeParameterSafe(
    executeFunctions.getNodeParameter.bind(executeFunctions),
    "description",
    itemIndex,
    ""
  ) as string;
  if (description) {
    body.description = description;
  }

  // 5. Fazer requisição
  return await apiRequest.call(
    executeFunctions,
    "POST",
    "/v1/novo-recurso",
    body
  );
}
```

#### Exemplo: Operação Get

```typescript
private async getNovoRecurso(
  executeFunctions: IExecuteFunctions,
  itemIndex: number
): Promise<any> {
  // 1. Ler ID obrigatório
  const id = executeFunctions.getNodeParameter("id", itemIndex) as string;

  if (!id) {
    throw new Error("ID é obrigatório");
  }

  // 2. Fazer requisição
  return await apiRequest.call(
    executeFunctions,
    "GET",
    buildUrl("/v1/novo-recurso/:id", { id })
  );
}
```

#### Exemplo: Operação List

```typescript
private async listNovoRecursos(
  executeFunctions: IExecuteFunctions,
  itemIndex: number
): Promise<any> {
  // 1. Preparar query parameters (opcional)
  const qs: any = {};

  const limit = getNodeParameterSafe(
    executeFunctions.getNodeParameter.bind(executeFunctions),
    "limit",
    itemIndex,
    10
  ) as number;
  if (limit) {
    qs.limit = limit;
  }

  const offset = getNodeParameterSafe(
    executeFunctions.getNodeParameter.bind(executeFunctions),
    "offset",
    itemIndex,
    0
  ) as number;
  if (offset) {
    qs.offset = offset;
  }

  // 2. Fazer requisição
  return await apiRequest.call(
    executeFunctions,
    "GET",
    "/v1/novo-recurso",
    undefined,
    qs
  );
}
```

### Passo 3: Adicionar Propriedades em nodeProperties.ts

Adicione as propriedades do recurso em `nodes/MercadoPago/nodeProperties.ts`:

```typescript
// 1. Adicionar opção no dropdown de recursos
{
  displayName: "Resource",
  name: "resource",
  type: "options",
  options: [
    // ... recursos existentes
    {
      name: "Novo Recurso",
      value: "novoRecurso",
    },
  ],
}

// 2. Adicionar operações do recurso
{
  displayName: "Operation",
  name: "operation",
  type: "options",
  displayOptions: {
    show: {
      resource: ["novoRecurso"],
    },
  },
  options: [
    { name: "Criar", value: "create" },
    { name: "Consultar", value: "get" },
    { name: "Listar", value: "list" },
  ],
  default: "create",
}

// 3. Adicionar campos específicos por operação
// Exemplo: Campo "name" para operação "create"
{
  displayName: "Nome",
  name: "name",
  type: "string",
  required: true,
  displayOptions: {
    show: {
      resource: ["novoRecurso"],
      operation: ["create"],
    },
  },
  description: "Nome do recurso",
}

// Exemplo: Campo "id" para operação "get"
{
  displayName: "ID",
  name: "id",
  type: "string",
  required: true,
  displayOptions: {
    show: {
      resource: ["novoRecurso"],
      operation: ["get"],
    },
  },
  description: "ID do recurso",
}
```

### Passo 4: Registrar o Recurso em MercadoPago.node.ts

Importe e registre o recurso:

```typescript
// 1. Importar
import { NovoRecursoResource } from "./resources/NovoRecursoResource";

// 2. Adicionar ao objeto de handlers
const resourceHandlers: Record<string, IResourceHandler> = {
  // ... recursos existentes
  novoRecurso: new NovoRecursoResource(),
};
```

### Passo 5: Criar Testes

Crie arquivo de teste em `test/integration/NovoRecurso.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { NovoRecursoResource } from '../../nodes/MercadoPago/resources/NovoRecursoResource';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';

describe('NovoRecursoResource Integration Tests', () => {
  let novoRecursoResource: NovoRecursoResource;
  let mockExecuteFunctions: any;

  beforeEach(() => {
    novoRecursoResource = new NovoRecursoResource();
    mockExecuteFunctions = createMockExecuteFunctions();
  });

  describe('create', () => {
    it('deve criar recurso com sucesso', async () => {
      // Configurar mocks
      mockExecuteFunctions.getNodeParameter = jest.fn((name: string) => {
        if (name === 'name') return 'Teste';
        if (name === 'amount') return 100;
        return '';
      });

      // Mock da API
      mockExecuteFunctions.helpers.request = jest.fn().mockResolvedValue({
        id: '123',
        name: 'Teste',
        amount: 100,
      });

      // Executar
      const result = await novoRecursoResource.execute(
        mockExecuteFunctions,
        'create',
        'novoRecurso'
      );

      // Verificar
      expect(result).toBeDefined();
      expect(result.id).toBe('123');
    });

    it('deve validar campos obrigatórios', async () => {
      mockExecuteFunctions.getNodeParameter = jest.fn(() => '');

      await expect(
        novoRecursoResource.execute(
          mockExecuteFunctions,
          'create',
          'novoRecurso'
        )
      ).rejects.toThrow('Nome é obrigatório');
    });
  });

  // Adicione mais testes para outras operações
});
```

## 📚 Exemplo Completo

Vamos criar um recurso fictício "Products" como exemplo completo:

### 1. Arquivo do Recurso

```typescript
// nodes/MercadoPago/resources/ProductsResource.ts
import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest, buildUrl } from "../GenericFunctions";
import { getNodeParameterSafe, validateEmail } from "../helpers";

export class ProductsResource implements IResourceHandler {
  operations = ["create", "get", "update", "delete", "list"];

  async execute(
    executeFunctions: IExecuteFunctions,
    operation: string,
    _resource: string
  ): Promise<any> {
    const itemIndex = 0;

    switch (operation) {
      case "create":
        return await this.createProduct(executeFunctions, itemIndex);
      case "get":
        return await this.getProduct(executeFunctions, itemIndex);
      case "update":
        return await this.updateProduct(executeFunctions, itemIndex);
      case "delete":
        return await this.deleteProduct(executeFunctions, itemIndex);
      case "list":
        return await this.listProducts(executeFunctions, itemIndex);
      default:
        throw new Error(
          `Operação "${operation}" não é suportada para Products. ` +
          `Operações disponíveis: ${this.operations.join(", ")}`
        );
    }
  }

  private async createProduct(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    const title = executeFunctions.getNodeParameter("title", itemIndex) as string;
    const price = executeFunctions.getNodeParameter("price", itemIndex) as number;

    if (!title || title.trim() === "") {
      throw new Error("Título é obrigatório");
    }

    if (price <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    const body: any = {
      title,
      price,
    };

    const description = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "description",
      itemIndex,
      ""
    ) as string;
    if (description) {
      body.description = description;
    }

    return await apiRequest.call(
      executeFunctions,
      "POST",
      "/v1/products",
      body
    );
  }

  private async getProduct(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    const id = executeFunctions.getNodeParameter("id", itemIndex) as string;

    if (!id) {
      throw new Error("ID é obrigatório");
    }

    return await apiRequest.call(
      executeFunctions,
      "GET",
      buildUrl("/v1/products/:id", { id })
    );
  }

  private async updateProduct(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    const id = executeFunctions.getNodeParameter("id", itemIndex) as string;
    const title = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "title",
      itemIndex,
      ""
    ) as string;

    if (!id) {
      throw new Error("ID é obrigatório");
    }

    const body: any = {};
    if (title) {
      body.title = title;
    }

    return await apiRequest.call(
      executeFunctions,
      "PUT",
      buildUrl("/v1/products/:id", { id }),
      body
    );
  }

  private async deleteProduct(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    const id = executeFunctions.getNodeParameter("id", itemIndex) as string;

    if (!id) {
      throw new Error("ID é obrigatório");
    }

    return await apiRequest.call(
      executeFunctions,
      "DELETE",
      buildUrl("/v1/products/:id", { id })
    );
  }

  private async listProducts(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    const qs: any = {};

    const limit = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "limit",
      itemIndex,
      10
    ) as number;
    if (limit) {
      qs.limit = limit;
    }

    return await apiRequest.call(
      executeFunctions,
      "GET",
      "/v1/products",
      undefined,
      qs
    );
  }
}
```

## ✅ Checklist

Antes de submeter seu PR, verifique:

- [ ] Arquivo do recurso criado e implementado
- [ ] Todas as operações implementadas
- [ ] Propriedades adicionadas em `nodeProperties.ts`
- [ ] Recurso registrado em `MercadoPago.node.ts`
- [ ] Testes criados e passando
- [ ] Código compila sem erros (`npm run build`)
- [ ] Lint passa (`npm run lint`)
- [ ] Documentação atualizada (se necessário)
- [ ] Exemplos de uso criados (se aplicável)

## 🐛 Troubleshooting

### Erro: "Operação não é suportada"

**Causa**: Operação não está na lista `operations` ou não tem case no `switch`.

**Solução**: Adicione a operação em `operations` e crie o case correspondente.

### Erro: "Campo não encontrado"

**Causa**: Campo não foi adicionado em `nodeProperties.ts` ou `displayOptions` está incorreto.

**Solução**: Verifique se o campo está definido e se `displayOptions` mostra para o recurso/operação corretos.

### Erro: "Resource handler not found"

**Causa**: Recurso não foi registrado em `MercadoPago.node.ts`.

**Solução**: Adicione o recurso ao objeto `resourceHandlers`.

### Testes não passam

**Causa**: Mocks não estão configurados corretamente.

**Solução**: Verifique se os mocks retornam os dados esperados e se as funções estão sendo chamadas corretamente.

## 📚 Recursos Adicionais

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do projeto
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia de desenvolvimento
- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [Exemplos de Recursos Existentes](../nodes/MercadoPago/resources/)

## 💡 Dicas

1. **Use recursos existentes como referência**: Veja `PixResource.ts` ou `PlansResource.ts` como exemplos
2. **Siga os padrões**: Use as mesmas convenções de nomenclatura e estrutura
3. **Valide entradas**: Sempre valide campos obrigatórios
4. **Use helpers**: Aproveite funções em `helpers.ts` quando possível
5. **Teste bem**: Crie testes para casos de sucesso e erro

