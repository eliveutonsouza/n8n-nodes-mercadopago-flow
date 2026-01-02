# Resolver Conflito de Instalação do Node n8n

## Problema

Ao tentar instalar o pacote `n8n-nodes-mercadopago-pix-assinatura` via `npm install`, o n8n reporta o erro:

```
Error installing new package
There is already an entry with this name
```

## Causa

Este erro ocorre quando:
1. O node antigo (`paymentMercadoPago`) ainda está instalado no n8n
2. O cache do n8n ainda contém referências ao node antigo
3. Há conflito de nomes entre nodes instalados

## Solução

### Passo 1: Parar o n8n

Antes de fazer qualquer alteração, **pare o n8n completamente**:

```bash
# Se estiver usando Docker
docker stop n8n

# Se estiver usando PM2
pm2 stop n8n

# Se estiver usando systemd
sudo systemctl stop n8n

# Se estiver rodando diretamente
# Pressione Ctrl+C no terminal onde o n8n está rodando
```

### Passo 2: Desinstalar o Pacote Antigo

No diretório onde o n8n está instalado, desinstale o pacote antigo:

```bash
cd /caminho/do/seu/n8n
npm uninstall n8n-nodes-mercadopago-pix-assinatura
```

### Passo 3: Limpar Cache do n8n

O n8n mantém cache de nodes instalados. Limpe o cache:

#### Windows:
```powershell
# Localização padrão do cache do n8n no Windows
Remove-Item -Recurse -Force "$env:APPDATA\n8n\cache" -ErrorAction SilentlyContinue
```

#### Linux/Mac:
```bash
# Localização padrão do cache do n8n no Linux/Mac
rm -rf ~/.n8n/cache
```

#### Docker:
Se estiver usando Docker, você pode precisar acessar o container:

```bash
docker exec -it n8n sh
rm -rf /home/node/.n8n/cache
exit
```

### Passo 4: Limpar Cache do npm

Limpe o cache do npm para garantir uma instalação limpa:

```bash
npm cache clean --force
```

### Passo 5: Verificar Diretório de Nodes Customizados

Verifique se há arquivos antigos no diretório de nodes customizados do n8n:

#### Windows:
```powershell
# Verificar se há nodes antigos
Get-ChildItem "$env:APPDATA\n8n\nodes" -Recurse -Filter "*PaymentMercadoPago*" -ErrorAction SilentlyContinue
```

#### Linux/Mac:
```bash
# Verificar se há nodes antigos
find ~/.n8n/nodes -name "*PaymentMercadoPago*" 2>/dev/null
```

Se encontrar arquivos, remova-os:

#### Windows:
```powershell
Remove-Item -Recurse -Force "$env:APPDATA\n8n\nodes\*PaymentMercadoPago*" -ErrorAction SilentlyContinue
```

#### Linux/Mac:
```bash
rm -rf ~/.n8n/nodes/*PaymentMercadoPago*
```

### Passo 6: Reinstalar o Pacote

No diretório onde o n8n está instalado, instale a versão mais recente:

```bash
cd /caminho/do/seu/n8n
npm install n8n-nodes-mercadopago-pix-assinatura@latest
```

### Passo 7: Reiniciar o n8n

Reinicie o n8n para carregar o novo node:

```bash
# Docker
docker start n8n

# PM2
pm2 restart n8n

# systemd
sudo systemctl start n8n

# Diretamente
npm start
```

### Passo 8: Verificar Instalação

1. Acesse a interface do n8n
2. Crie um novo workflow
3. Procure por "Mercado Pago" na lista de nodes
4. O node deve aparecer com o nome "Mercado Pago" (não "Mercado Pago PIX e Assinaturas")

## Verificação Adicional

Se o problema persistir, verifique:

### 1. Versão do Pacote Instalado

```bash
npm list n8n-nodes-mercadopago-pix-assinatura
```

Deve mostrar a versão `1.3.0` ou superior.

### 2. Arquivos no Pacote

Verifique se o pacote contém apenas o node novo:

```bash
npm pack n8n-nodes-mercadopago-pix-assinatura
tar -tzf n8n-nodes-mercadopago-pix-assinatura-*.tgz | grep -E "nodes|credentials"
```

Você deve ver apenas:
- `dist/nodes/MercadoPago/MercadoPago.node.js`
- `dist/credentials/MercadoPagoApi.credentials.js`

**NÃO** deve aparecer:
- `dist/nodes/PaymentMercadoPago/`
- `dist/credentials/PaymentMercadoPagoAPI.credentials.js`

### 3. Logs do n8n

Verifique os logs do n8n ao iniciar para ver se há erros de carregamento:

```bash
# Docker
docker logs n8n

# PM2
pm2 logs n8n

# Diretamente
# Os logs aparecerão no terminal
```

Procure por mensagens como:
- "Loading node: mercadoPago"
- "Error loading node"
- "Duplicate node name"

## Solução Alternativa: Instalação Manual

Se a instalação via npm continuar falhando, você pode instalar manualmente:

1. Clone o repositório:
```bash
git clone https://github.com/eliveutonsouza/n8n-nodes-mercadopago-pix-assinatura.git
cd n8n-nodes-mercadopago-pix-assinatura
```

2. Instale as dependências e compile:
```bash
npm install
npm run build
```

3. Copie os arquivos para o diretório de nodes do n8n:

#### Windows:
```powershell
Copy-Item -Recurse "dist\nodes\MercadoPago" "$env:APPDATA\n8n\nodes\MercadoPago"
Copy-Item -Recurse "dist\credentials\MercadoPagoApi.credentials.js" "$env:APPDATA\n8n\credentials\MercadoPagoApi.credentials.js"
```

#### Linux/Mac:
```bash
cp -r dist/nodes/MercadoPago ~/.n8n/nodes/
cp dist/credentials/MercadoPagoApi.credentials.js ~/.n8n/credentials/
```

4. Reinicie o n8n

## Troubleshooting

### Erro: "Cannot find module"

Se você receber este erro após a instalação:

1. Verifique se o build foi executado corretamente:
```bash
cd n8n-nodes-mercadopago-pix-assinatura
npm run build
```

2. Verifique se os arquivos estão no lugar correto:
```bash
ls -la dist/nodes/MercadoPago/MercadoPago.node.js
ls -la dist/credentials/MercadoPagoApi.credentials.js
```

### Erro: "Node not found"

Se o node não aparecer na interface do n8n:

1. Verifique se o n8n está configurado para carregar nodes customizados
2. Verifique os logs do n8n para erros de carregamento
3. Certifique-se de que reiniciou o n8n após a instalação

### Conflito com Outro Node

Se você tiver outro node do Mercado Pago instalado:

1. Desinstale todos os nodes relacionados ao Mercado Pago
2. Limpe o cache do n8n
3. Instale apenas o `n8n-nodes-mercadopago-pix-assinatura`

## Informações do Node

- **Nome do Node**: `mercadoPago`
- **Display Name**: "Mercado Pago"
- **Credencial**: `mercadoPagoApi`
- **Versão do Pacote**: 1.3.0+

## Suporte

Se o problema persistir após seguir todos os passos:

1. Abra uma issue no GitHub: https://github.com/eliveutonsouza/n8n-nodes-mercadopago-pix-assinatura/issues
2. Inclua:
   - Versão do n8n
   - Versão do Node.js
   - Sistema operacional
   - Logs do n8n
   - Passos que você seguiu

