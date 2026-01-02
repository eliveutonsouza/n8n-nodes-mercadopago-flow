# Guia de Contribuição

Obrigado por considerar contribuir para o `n8n-nodes-mercadopago-flow`! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Reportando Bugs](#reportando-bugs)
- [Propondo Novas Features](#propondo-novas-features)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Testes](#testes)
- [Documentação](#documentação)
- [Pull Requests](#pull-requests)

## 📜 Código de Conduta

Este projeto segue o [Código de Conduta do Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em manter este código.

## 🤝 Como Posso Contribuir?

### Reportando Bugs

Se você encontrou um bug:

1. **Verifique se já não foi reportado**: Procure nas [Issues](https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow/issues) existentes
2. **Crie uma nova issue**: Use o template de bug report
3. **Forneça informações detalhadas**:
   - Versão do n8n
   - Versão do node
   - Passos para reproduzir
   - Comportamento esperado vs. comportamento atual
   - Logs de erro (se houver)

### Propondo Novas Features

1. **Verifique se já não foi proposto**: Procure nas [Issues](https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow/issues)
2. **Crie uma issue de feature request**: Use o template apropriado
3. **Descreva claramente**:
   - O problema que resolve
   - Como funcionaria
   - Exemplos de uso
   - Benefícios

### Melhorando a Documentação

Documentação é tão importante quanto código! Você pode ajudar:

- Corrigindo erros de digitação
- Melhorando explicações
- Adicionando exemplos
- Traduzindo documentação
- Adicionando screenshots/diagramas

## 🛠️ Processo de Desenvolvimento

### Configuração do Ambiente

1. **Fork o repositório**

```bash
git clone https://github.com/SEU_USUARIO/n8n-nodes-mercadopago-flow.git
cd n8n-nodes-mercadopago-flow
```

2. **Instale as dependências**

```bash
npm install
```

3. **Compile o projeto**

```bash
npm run build
```

4. **Execute os testes**

```bash
npm test
```

### Estrutura do Projeto

```
n8n-nodes-mercadopago-flow/
├── nodes/              # Código dos nodes
│   └── MercadoPago/   # Node principal
├── credentials/        # Credenciais
├── test/              # Testes
├── docs/              # Documentação
├── exemplos/          # Exemplos de workflows
└── dist/              # Build output
```

### Workflow de Desenvolvimento

1. **Crie uma branch** a partir de `main`:

```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

2. **Faça suas alterações**

3. **Execute os testes**:

```bash
npm test
npm run lint
```

4. **Commit suas mudanças**:

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

**Convenções de commit** (seguindo [Conventional Commits](https://www.conventionalcommits.org/)):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula faltando, etc
- `refactor:` Refatoração de código
- `test:` Adicionar ou corrigir testes
- `chore:` Mudanças em build, dependências, etc

5. **Push para seu fork**:

```bash
git push origin feature/nome-da-feature
```

6. **Abra um Pull Request** no GitHub

## 📝 Padrões de Código

### TypeScript

- Use TypeScript estrito
- Siga as convenções do projeto
- Use interfaces para tipos
- Documente funções complexas com JSDoc

### Formatação

O projeto usa:

- **ESLint** para linting
- **Prettier** para formatação

Execute antes de commitar:

```bash
npm run lintfix
npm run format
```

### Estrutura de Arquivos

- Um recurso = um arquivo em `nodes/MercadoPago/resources/`
- Cada recurso implementa `IResourceHandler`
- Use `GenericFunctions.ts` para requisições HTTP
- Use `helpers.ts` para funções utilitárias

### Nomenclatura

- **Arquivos**: `PascalCase.ts` para classes, `camelCase.ts` para utilitários
- **Classes**: `PascalCase`
- **Funções/Variáveis**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Interfaces**: `I` prefix (ex: `IResourceHandler`)

## 🧪 Testes

### Estrutura de Testes

- **Unitários**: `test/unit/` - Testam funções isoladas
- **Integração**: `test/integration/` - Testam integração com API (mocks)
- **Locais**: `test/local/` - Testes manuais com API real

### Escrevendo Testes

1. **Crie o arquivo de teste**:

```typescript
// test/integration/NovoRecurso.test.ts
import { describe, it, expect } from '@jest/globals';

describe('NovoRecurso Integration Tests', () => {
  it('deve criar recurso com sucesso', async () => {
    // Teste aqui
  });
});
```

2. **Execute os testes**:

```bash
npm test                    # Todos os testes
npm run test:unit          # Apenas unitários
npm run test:integration   # Apenas integração
npm run test:coverage      # Com cobertura
```

### Cobertura de Testes

- Mantenha cobertura acima de 80%
- Teste casos de sucesso e erro
- Teste validações de entrada
- Teste edge cases

## 📚 Documentação

### Documentação de Código

- Use JSDoc para funções públicas
- Documente parâmetros e retornos
- Adicione exemplos quando útil

```typescript
/**
 * Cria um pagamento PIX
 * @param amount - Valor em reais (ex: 10.50)
 * @param description - Descrição do pagamento
 * @returns Promise com dados do pagamento
 */
async function createPixPayment(amount: number, description: string): Promise<Payment> {
  // ...
}
```

### Documentação de Usuário

- Atualize `README.md` se necessário
- Adicione exemplos em `docs/`
- Atualize `CHANGELOG.md` para mudanças significativas

## 🔀 Pull Requests

### Antes de Abrir um PR

- [ ] Código compila sem erros (`npm run build`)
- [ ] Todos os testes passam (`npm test`)
- [ ] Lint passa (`npm run lint`)
- [ ] Código está formatado (`npm run format`)
- [ ] Documentação atualizada (se necessário)
- [ ] CHANGELOG.md atualizado (se necessário)
- [ ] Commits seguem convenções

### Template de PR

Use este template ao criar um PR:

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
Passos para testar as mudanças

## Checklist
- [ ] Código compila
- [ ] Testes passam
- [ ] Lint passa
- [ ] Documentação atualizada
```

### Processo de Review

1. **Aguarde feedback** dos maintainers
2. **Responda aos comentários** e faça ajustes
3. **Mantenha o PR atualizado** com a branch main
4. **Aguarde aprovação** antes de fazer merge

## 🆕 Adicionando Novos Recursos

Para adicionar um novo recurso da API do Mercado Pago:

1. **Crie o arquivo do recurso** em `nodes/MercadoPago/resources/NovoRecursoResource.ts`
2. **Implemente `IResourceHandler`**
3. **Adicione propriedades** em `nodeProperties.ts`
4. **Registre o recurso** em `MercadoPago.node.ts`
5. **Crie testes** em `test/integration/`
6. **Atualize documentação**

Veja [docs/ADDING_NEW_RESOURCE.md](docs/ADDING_NEW_RESOURCE.md) para guia detalhado.

## ❓ Dúvidas?

- Abra uma [Issue](https://github.com/eliveutonsouza/n8n-nodes-mercadopago-flow/issues)
- Consulte a [documentação](docs/)
- Veja [exemplos](exemplos/)

## 🙏 Agradecimentos

Obrigado por contribuir! Cada contribuição, por menor que seja, faz diferença! 🎉

