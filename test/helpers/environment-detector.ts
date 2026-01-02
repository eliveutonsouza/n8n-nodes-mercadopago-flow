/**
 * Helper para detectar o ambiente (sandbox ou produção) baseado na PUBLIC_KEY do Mercado Pago
 */

/**
 * Detecta o ambiente baseado na PUBLIC_KEY
 * 
 * Nota: PUBLIC_KEYs de sandbox e produção podem ter o mesmo prefixo (APP_USR-),
 * então a detecção automática pode não ser 100% precisa. O usuário deve verificar
 * manualmente no painel do Mercado Pago se houver dúvida.
 * 
 * @param publicKey - A PUBLIC_KEY do Mercado Pago
 * @returns 'sandbox' | 'production' | 'unknown'
 */
export function detectEnvironmentFromPublicKey(publicKey: string): 'sandbox' | 'production' | 'unknown' {
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
    // Não podemos determinar automaticamente - usuário precisa verificar manualmente
    return 'unknown';
  }
  
  return 'unknown';
}

/**
 * Valida se a PUBLIC_KEY e o Access Token estão no mesmo ambiente
 * 
 * @param publicKey - A PUBLIC_KEY do Mercado Pago
 * @param accessTokenEnvironment - O ambiente do Access Token ('sandbox' | 'production')
 * @returns Objeto com informações sobre compatibilidade
 */
export function validateEnvironmentCompatibility(
  publicKey: string,
  accessTokenEnvironment: 'sandbox' | 'production'
): {
  compatible: boolean;
  publicKeyEnvironment: 'sandbox' | 'production' | 'unknown';
  message: string;
} {
  const publicKeyEnv = detectEnvironmentFromPublicKey(publicKey);
  
  if (publicKeyEnv === 'unknown') {
    return {
      compatible: true, // Assumimos compatível se não conseguirmos detectar
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

