/**
 * Script para executar teste local usando dados do frontend-test.html
 * 
 * Este script recebe os dados do payload enviado pelo frontend e executa
 * o módulo n8n localmente para criar a assinatura usando o token real
 * gerado pelo CardForm do Mercado Pago.
 * 
 * Uso:
 *   npm run test:frontend
 *   npm run test:frontend -- '{"planId":"...","payerEmail":"...","mercadoPagoData":{"token":"..."}}'
 *   npm run test:frontend -- --file payload.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { testCreateSubscriptionWithSpecificData } from './subscriptions.test';

interface FrontendPayload {
  resource: string;
  operation: string;
  planId: string;
  payerEmail: string;
  payerDocument?: string;
  startDate?: string;
  trialDays?: number;
  subscriptionStatus?: string;
  backUrl?: string;
  reason?: string;
  externalReference?: string;
  mercadoPagoData?: {
    token?: string;
    paymentMethodId?: string;
    issuerId?: string;
    cardholderEmail?: string;
    installments?: string;
    identificationNumber?: string;
    identificationType?: string;
  };
}

/**
 * Dados padrão baseados no console do navegador
 */
const DEFAULT_PAYLOAD: FrontendPayload = {
  resource: 'subscriptions',
  operation: 'create',
  planId: '72ec31318ecd45f296033d94bafab4dd',
  payerEmail: 'eliveuton3m@hotmail.com',
  payerDocument: '12345678909',
  startDate: new Date().toISOString(),
  subscriptionStatus: 'authorized',
  trialDays: 0,
  mercadoPagoData: {
    token: '819cd5f4bb03d298f9d30cf2ca42d7a5',
    paymentMethodId: 'master',
    issuerId: '24',
    cardholderEmail: 'eliveuton3m@hotmail.com',
    installments: '1',
    identificationNumber: '12345678909',
    identificationType: 'CPF',
  },
};

/**
 * Processa os dados do frontend e mapeia para os parâmetros do node
 */
function processFrontendPayload(payload: FrontendPayload) {
  console.log('\n📋 Processando dados do frontend...\n');
  console.log('Dados recebidos:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('');

  // Extrai cardTokenId do mercadoPagoData
  const cardTokenId = payload.mercadoPagoData?.token || '';

  if (!cardTokenId) {
    throw new Error(
      'Token do cartão não encontrado em mercadoPagoData.token. ' +
      'Certifique-se de que o frontend enviou o token corretamente.'
    );
  }

  // Mapeia campos do payload do frontend para os parâmetros esperados pelo node
  const params = {
    planId: payload.planId,
    payerEmail: payload.payerEmail,
    payerDocument: payload.payerDocument || '',
    startDate: payload.startDate || new Date().toISOString(),
    trialPeriodDays: payload.trialDays ?? 0,
    cardTokenId: cardTokenId,
    subscriptionStatus: payload.subscriptionStatus || 'authorized',
    backUrl: payload.backUrl || '',
  };

  console.log('📤 Parâmetros mapeados para o node:');
  console.log(`   Plan ID: ${params.planId}`);
  console.log(`   Payer Email: ${params.payerEmail}`);
  console.log(`   Payer Document: ${params.payerDocument || 'não fornecido'}`);
  console.log(`   Start Date: ${params.startDate}`);
  console.log(`   Trial Period Days: ${params.trialPeriodDays}`);
  console.log(`   Card Token ID: ${params.cardTokenId.substring(0, 20)}...`);
  console.log(`   Subscription Status: ${params.subscriptionStatus}`);
  console.log(`   Back URL: ${params.backUrl || 'não fornecido'}`);
  console.log('');

  return params;
}

/**
 * Carrega payload de um arquivo JSON
 */
function loadPayloadFromFile(filePath: string): FrontendPayload {
  try {
    const fullPath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Arquivo não encontrado: ${fullPath}`);
    }

    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const payload = JSON.parse(fileContent) as FrontendPayload;

    if (!payload.planId || !payload.payerEmail) {
      throw new Error(
        'Payload inválido: planId e payerEmail são obrigatórios'
      );
    }

    return payload;
  } catch (error: any) {
    throw new Error(`Erro ao carregar arquivo: ${error.message}`);
  }
}

/**
 * Parse argumentos da linha de comando
 */
function parseArguments(): FrontendPayload {
  const args = process.argv.slice(2);

  // Opção 1: --file payload.json
  const fileIndex = args.indexOf('--file');
  if (fileIndex !== -1) {
    const filePath = args[fileIndex + 1];
    if (!filePath) {
      throw new Error('--file requer um caminho de arquivo');
    }
    return loadPayloadFromFile(filePath);
  }

  // Opção 2: JSON string como argumento
  if (args.length > 0) {
    try {
      const jsonString = args.join(' ');
      const payload = JSON.parse(jsonString) as FrontendPayload;
      
      if (!payload.planId || !payload.payerEmail) {
        throw new Error(
          'Payload inválido: planId e payerEmail são obrigatórios'
        );
      }

      return payload;
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `Erro ao parsear JSON: ${error.message}\n` +
          `Use: npm run test:frontend -- '{"planId":"...","payerEmail":"..."}'`
        );
      }
      throw error;
    }
  }

  // Opção 3: Usar dados padrão
  console.log('⚠️  Nenhum argumento fornecido. Usando dados padrão do console.\n');
  return DEFAULT_PAYLOAD;
}

/**
 * Função principal
 */
async function main() {
  try {
    console.log('='.repeat(60));
    console.log('🧪 Teste Local com Dados do Frontend');
    console.log('='.repeat(60));
    console.log('');

    // Parse argumentos
    const payload = parseArguments();

    // Processa payload
    const params = processFrontendPayload(payload);

    // Executa teste
    console.log('🚀 Executando teste de criação de assinatura...\n');
    const subscriptionId = await testCreateSubscriptionWithSpecificData(params);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Teste concluído com sucesso!');
    console.log('='.repeat(60));
    console.log(`\n📝 Subscription ID: ${subscriptionId}`);
    console.log('\n💡 Este token foi gerado no frontend usando CardForm do Mercado Pago.');
    console.log('   Diferente dos tokens gerados via API, este token funciona para assinaturas.\n');
  } catch (error: any) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ Erro ao executar teste');
    console.error('='.repeat(60));
    console.error('');
    console.error('💬 Mensagem:', error.message);
    
    if (error.stack) {
      console.error('\n📚 Stack trace:');
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

// Executa se for chamado diretamente
if (require.main === module) {
  main();
}

export { processFrontendPayload, parseArguments, FrontendPayload };

