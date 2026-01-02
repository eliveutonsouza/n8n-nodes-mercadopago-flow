/**
 * Servidor HTTP com captura de payload e teste automático
 * 
 * Este servidor:
 * 1. Serve o arquivo frontend-test.html
 * 2. Aguarda o usuário preencher o formulário manualmente
 * 3. Captura o payload quando o formulário é enviado
 * 4. Executa automaticamente o teste local de criação de assinatura
 * 5. Exibe o resultado no console
 * 
 * Uso:
 *   npm run test:server
 *   Abra http://localhost:3000 no navegador
 *   Preencha o formulário e clique em "Criar Assinatura"
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';
import { testCreateSubscriptionWithSpecificData } from './subscriptions.test';
import { processFrontendPayload, FrontendPayload } from './test-with-frontend-data';

const PORT = 3000;
const FRONTEND_FILE = path.join(__dirname, '../frontend-test.html');
const CONFIG_FILE = path.join(__dirname, '../frontend-config.js');

/**
 * Servir arquivo estático
 */
function serveFile(filePath: string, res: http.ServerResponse, contentType: string) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(content);
}

/**
 * Processar requisição POST do webhook
 */
async function handleWebhook(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      console.log('\n' + '='.repeat(60));
      console.log('📥 Payload recebido do frontend');
      console.log('='.repeat(60));
      
      const payload: FrontendPayload = JSON.parse(body);
      console.log('\n📋 Dados recebidos:');
      console.log(JSON.stringify(payload, null, 2));
      console.log('');

      // Validar payload
      if (!payload.planId || !payload.payerEmail) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Payload inválido: planId e payerEmail são obrigatórios'
        }));
        return;
      }

      // Processar payload e executar teste
      console.log('🚀 Executando teste local com dados do frontend...\n');
      
      const params = processFrontendPayload(payload);
      
      try {
        const subscriptionId = await testCreateSubscriptionWithSpecificData(params);
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ Teste concluído com sucesso!');
        console.log('='.repeat(60));
        console.log(`\n📝 Subscription ID: ${subscriptionId}`);
        console.log('\n💡 Este token foi gerado no frontend usando CardForm do Mercado Pago.');
        console.log('   Diferente dos tokens gerados via API, este token funciona para assinaturas.\n');

        // Retornar sucesso para o frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          subscriptionId: subscriptionId,
          message: 'Assinatura criada com sucesso!'
        }));

      } catch (testError: any) {
        console.error('\n' + '='.repeat(60));
        console.error('❌ Erro ao executar teste');
        console.error('='.repeat(60));
        console.error('');
        console.error('💬 Mensagem:', testError.message);
        
        if (testError.response?.data) {
          console.error('\n📄 Detalhes do erro da API:');
          console.error(JSON.stringify(testError.response.data, null, 2));
        }

        // Retornar erro para o frontend
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: testError.message,
          details: testError.response?.data || null
        }));
      }

    } catch (error: any) {
      console.error('\n❌ Erro ao processar payload:');
      console.error(error.message);
      
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message || 'Erro ao processar payload'
      }));
    }
  });

  req.on('error', (error) => {
    console.error('Erro na requisição:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Erro ao processar requisição'
    }));
  });
}

/**
 * Criar e iniciar servidor HTTP
 */
function createServer() {
  const server = http.createServer((req, res) => {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Tratar OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Rota: POST /webhook
    if (pathname === '/webhook' && req.method === 'POST') {
      handleWebhook(req, res);
      return;
    }

    // Rota: GET /frontend-config.js
    if (pathname === '/frontend-config.js') {
      if (fs.existsSync(CONFIG_FILE)) {
        serveFile(CONFIG_FILE, res, 'application/javascript');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('frontend-config.js not found');
      }
      return;
    }

    // Rota: GET / (servir frontend-test.html)
    if (pathname === '/' || pathname === '/index.html') {
      serveFile(FRONTEND_FILE, res, 'text/html');
      return;
    }

    // 404 para outras rotas
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  });

  server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Servidor HTTP iniciado');
    console.log('='.repeat(60));
    console.log(`\n📍 URL: http://localhost:${PORT}`);
    console.log('\n📝 Instruções:');
    console.log('   1. Abra http://localhost:' + PORT + ' no navegador');
    console.log('   2. Preencha o formulário manualmente');
    console.log('   3. Clique em "Criar Assinatura"');
    console.log('   4. O servidor capturará o payload e executará o teste automaticamente');
    console.log('\n⏳ Aguardando envio do formulário...\n');
  });

  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ Erro: Porta ${PORT} já está em uso.`);
      console.error('   Tente fechar outros servidores ou altere a porta no código.\n');
    } else {
      console.error('\n❌ Erro ao iniciar servidor:', error.message);
    }
    process.exit(1);
  });
}

// Executar se for chamado diretamente
if (require.main === module) {
  // Verificar se arquivo frontend existe
  if (!fs.existsSync(FRONTEND_FILE)) {
    console.error(`\n❌ Erro: Arquivo não encontrado: ${FRONTEND_FILE}`);
    process.exit(1);
  }

  createServer();
}

export { createServer, PORT };

