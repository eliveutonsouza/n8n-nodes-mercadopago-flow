/**
 * Script para gerar arquivo de configuração JavaScript a partir do .env
 * Isso permite que o frontend HTML acesse variáveis de ambiente
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Detecta o ambiente baseado na PUBLIC_KEY
 */
function detectEnvironmentFromPublicKey(publicKey) {
  if (!publicKey || publicKey.trim() === '') {
    return 'unknown';
  }
  
  const trimmedKey = publicKey.trim();
  
  // PUBLIC_KEY de sandbox pode começar com TEST- ou conter indicadores de teste
  if (trimmedKey.includes('TEST') || trimmedKey.includes('test') || trimmedKey.startsWith('TEST-')) {
    return 'sandbox';
  }
  
  // PUBLIC_KEY de produção geralmente começa com APP_USR-
  // Mas PUBLIC_KEY de sandbox também pode começar com APP_USR-
  // Então, se começa com APP_USR-, não podemos determinar automaticamente
  if (trimmedKey.startsWith('APP_USR-')) {
    return 'unknown';
  }
  
  return 'unknown';
}

/**
 * Valida se a PUBLIC_KEY e o Access Token estão no mesmo ambiente
 */
function validateEnvironmentCompatibility(publicKey, accessTokenEnvironment) {
  const publicKeyEnv = detectEnvironmentFromPublicKey(publicKey);
  
  if (publicKeyEnv === 'unknown') {
    return {
      compatible: true,
      publicKeyEnvironment: 'unknown',
      message: 'Não foi possível detectar automaticamente o ambiente da PUBLIC_KEY. ' +
               'Verifique manualmente se a PUBLIC_KEY e o Access Token estão no mesmo ambiente (sandbox ou produção).'
    };
  }
  
  const compatible = publicKeyEnv === accessTokenEnvironment;
  
  if (!compatible) {
    return {
      compatible: false,
      publicKeyEnvironment: publicKeyEnv,
      message: `⚠️ INCOMPATIBILIDADE DE AMBIENTE DETECTADA: ` +
               `PUBLIC_KEY está em ambiente "${publicKeyEnv}" mas Access Token está em "${accessTokenEnvironment}". ` +
               `Tokens gerados com PUBLIC_KEY de um ambiente não funcionam com Access Token de outro ambiente. ` +
               `Certifique-se de usar PUBLIC_KEY e Access Token do mesmo ambiente.`
    };
  }
  
  return {
    compatible: true,
    publicKeyEnvironment: publicKeyEnv,
    message: `✅ Ambientes compatíveis: PUBLIC_KEY e Access Token estão ambos em "${publicKeyEnv}".`
  };
}

// Tentar várias variações de nomes de variáveis
const config = {
  MERCADOPAGO_PUBLIC_KEY: 
    process.env.MERCADOPAGO_PUBLIC_KEY || 
    process.env.MP_PUBLIC_KEY || 
    process.env.MP_PUBLIC_KEY_TEST ||
    process.env.PUBLIC_KEY ||
    '',
  N8N_WEBHOOK_URL: 
    process.env.N8N_WEBHOOK_URL || 
    process.env.WEBHOOK_URL || 
    process.env.N8N_WEBHOOK ||
    '',
};

const configPath = path.join(__dirname, 'frontend-config.js');

const configContent = `// Arquivo gerado automaticamente - NÃO editar manualmente
// Execute: node test/generate-config.js para regenerar

window.FRONTEND_CONFIG = ${JSON.stringify(config, null, 2)};
`;

fs.writeFileSync(configPath, configContent, 'utf8');

console.log('✅ Arquivo de configuração gerado:', configPath);
console.log('📋 Configurações:');
console.log('   Public Key:', config.MERCADOPAGO_PUBLIC_KEY ? config.MERCADOPAGO_PUBLIC_KEY.substring(0, 20) + '...' : 'NÃO CONFIGURADA');
console.log('   Webhook URL:', config.N8N_WEBHOOK_URL || 'NÃO CONFIGURADA');

if (!config.MERCADOPAGO_PUBLIC_KEY) {
  console.warn('\n⚠️  AVISO: MERCADOPAGO_PUBLIC_KEY não encontrada no .env');
  console.warn('   Adicione no .env: MERCADOPAGO_PUBLIC_KEY=APP_USR-...');
} else {
  // Detectar ambiente da PUBLIC_KEY
  const detectedEnv = detectEnvironmentFromPublicKey(config.MERCADOPAGO_PUBLIC_KEY);
  if (detectedEnv !== 'unknown') {
    console.log(`   Ambiente detectado da Public Key: ${detectedEnv}`);
  } else {
    console.warn('   ⚠️  Não foi possível detectar o ambiente da Public Key automaticamente.');
    console.warn('   Verifique manualmente se está usando sandbox ou produção.');
  }
  
  // Verificar compatibilidade com Access Token se disponível
  const accessTokenEnv = process.env.MP_ENVIRONMENT;
  if (accessTokenEnv && (accessTokenEnv === 'sandbox' || accessTokenEnv === 'production')) {
    const validation = validateEnvironmentCompatibility(config.MERCADOPAGO_PUBLIC_KEY, accessTokenEnv);
    console.log('');
    if (validation.compatible) {
      console.log(`   ${validation.message}`);
    } else {
      console.error(`   ${validation.message}`);
      console.error('');
      console.error('   💡 SOLUÇÃO:');
      console.error('   - Use PUBLIC_KEY e Access Token do mesmo ambiente (sandbox ou produção)');
      console.error('   - Verifique suas credenciais no painel do Mercado Pago:');
      console.error('     https://www.mercadopago.com.br/developers/panel/credentials');
    }
  }
}

