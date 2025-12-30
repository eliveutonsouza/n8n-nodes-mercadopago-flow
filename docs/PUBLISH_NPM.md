# 📦 Guia de Publicação no NPM

## Status Atual

✅ **Pacote preparado e pronto para publicação**

- Nome do pacote: `n8n-nodes-mercadopago-pix-assinatura`
- Versão: `1.0.0`
- Nome disponível no npm: ✅ Sim

## Arquivos Incluídos no Pacote

O pacote incluirá apenas:

- `dist/` - Arquivos compilados (JS, SVG, tipos)
- `package.json` - Configuração do pacote
- `README.md` - Documentação

## Passos para Publicar

### 1. Fazer Login no NPM

```bash
npm login
```

Você precisará fornecer:

- Username
- Password
- Email
- OTP (se tiver 2FA habilitado)

### 2. Verificar Login

```bash
npm whoami
```

Deve retornar seu username do npm.

### 3. Publicar o Pacote

```bash
npm publish
```

**Nota**: O script `prepublishOnly` executará automaticamente:

- `npm run build` - Compila o TypeScript e copia ícones

### 4. Verificar Publicação

Após a publicação, verifique em:
https://www.npmjs.com/package/n8n-nodes-mercadopago-pix-assinatura

## Instalação no n8n Self-Hosted

Após a publicação, os usuários poderão instalar via:

```bash
npm install n8n-nodes-mercadopago-pix-assinatura
```

E reiniciar o n8n para que o node apareça na interface.

## Atualizações Futuras

Para publicar uma nova versão:

1. Atualize a versão no `package.json`:

   ```bash
   npm version patch  # para 1.0.1
   npm version minor  # para 1.1.0
   npm version major  # para 2.0.0
   ```

2. Faça commit e push:

   ```bash
   git push && git push --tags
   ```

3. Publique:
   ```bash
   npm publish
   ```

## Verificações Finais

Antes de publicar, certifique-se de:

- ✅ Build executado com sucesso
- ✅ Testes passando (69/72 testes)
- ✅ Nome do pacote disponível
- ✅ `.npmignore` configurado
- ✅ `package.json` com todas as informações corretas
- ✅ README atualizado com instruções de instalação

## Troubleshooting

### Erro: "Package name already exists"

- O nome pode estar em uso. Considere usar um nome alternativo ou scoped package (`@seu-usuario/n8n-nodes-mercadopago-pix-assinatura`)

### Erro: "You must verify your email"

- Verifique seu email no npm antes de publicar

### Erro: "Insufficient permissions"

- Certifique-se de estar logado com a conta correta
- Verifique se você tem permissão para publicar pacotes não-scoped
