/**
 * Testes locais para Planos
 * Executa testes reais contra a API do Mercado Pago
 *
 * IMPORTANTE: Este teste usa o código COMPILADO de produção (dist/)
 * para garantir que estamos testando exatamente o que será publicado no npm
 */

import { PaymentMercadoPago } from "../../dist/nodes/PaymentMercadoPago/PaymentMercadoPago.node";
import { LocalExecuteFunctions } from "../helpers/local-execute-functions";
import {
  loadCredentialsFromEnv,
  displayCredentialsInfo,
} from "../helpers/env-loader";

async function testCreatePlan() {
  console.log("🧪 Teste: Criar Plano\n");
  console.log("📝 Testando com valores exatos do n8n:\n");

  const credentials = loadCredentialsFromEnv();
  displayCredentialsInfo(credentials);

  const node = new PaymentMercadoPago();
  const executeFunctions = new LocalExecuteFunctions(credentials);

  // Valores exatos fornecidos pelo usuário (simulando preenchimento no n8n)
  executeFunctions.setParams({
    resource: "plans",
    operation: "create",
    reason: "Plano Mensal Teste",
    amount: "10,9", // Valor com vírgula como seria digitado no n8n
    frequency: 1,
    frequencyType: "months",
    currencyId: "BRL",
    backUrl: "https://www.eliveutonsouza.com",
    repetitions: 0,
    billingDay: 0,
    billingDayProportional: false,
    freeTrialFrequency: 0,
    freeTrialFrequencyType: "months",
    paymentTypes: ["credit_card"],
    paymentMethods: ["visa", "mastercard", "amex", "bolbradesco"],
  });

  console.log("📋 Parâmetros configurados:");
  console.log("- Nome do Plano: Plano Mensal Teste");
  console.log("- Valor: 10,9 (será convertido para 10.9)");
  console.log("- Frequência: 1");
  console.log("- Tipo de Frequência: Meses");
  console.log("- Moeda: BRL");
  console.log("- URL de Retorno: https://www.eliveutonsouza.com");
  console.log("- Repetições: 0 (ilimitado)");
  console.log("- Dia de Cobrança: 0 (não configurado)");
  console.log("- Cobrança Proporcional: false");
  console.log("- Trial: 0 (sem trial)");
  console.log("- Tipos de Pagamento: Cartão de Crédito");
  console.log(
    "- Meios de Pagamento: Visa, Mastercard, American Express, Boleto"
  );
  console.log("");

  executeFunctions.setInputData([
    {
      json: {
        resource: "plans",
        operation: "create",
      },
    },
  ]);

  try {
    const result = await (node.execute as any).call(executeFunctions);
    console.log("✅ Plano criado com sucesso!");
    console.log("\n📋 Resultado:");
    console.log(JSON.stringify(result[0][0].json, null, 2));
    return result[0][0].json.id;
  } catch (error: any) {
    console.error("❌ Erro ao criar plano:");
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

async function testGetPlan(planId: string) {
  console.log("\n🧪 Teste: Consultar Plano\n");
  console.log(`📝 Plan ID: ${planId}\n`);

  const credentials = loadCredentialsFromEnv();
  const node = new PaymentMercadoPago();
  const executeFunctions = new LocalExecuteFunctions(credentials);

  executeFunctions.setParams({
    resource: "plans",
    operation: "get",
    planId,
  });

  executeFunctions.setInputData([
    {
      json: {
        resource: "plans",
        operation: "get",
      },
    },
  ]);

  try {
    const result = await (node.execute as any).call(executeFunctions);
    console.log("✅ Plano consultado com sucesso!");
    console.log("\n📋 Resultado:");
    console.log(JSON.stringify(result[0][0].json, null, 2));
  } catch (error: any) {
    console.error("❌ Erro ao consultar plano:");
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

async function testListPlans() {
  console.log("\n🧪 Teste: Listar Planos\n");

  const credentials = loadCredentialsFromEnv();
  const node = new PaymentMercadoPago();
  const executeFunctions = new LocalExecuteFunctions(credentials);

  executeFunctions.setParams({
    resource: "plans",
    operation: "list",
  });

  executeFunctions.setInputData([
    {
      json: {
        resource: "plans",
        operation: "list",
      },
    },
  ]);

  try {
    const result = await (node.execute as any).call(executeFunctions);
    console.log("✅ Planos listados com sucesso!");
    console.log("\n📋 Resultado:");
    console.log(JSON.stringify(result[0][0].json, null, 2));
  } catch (error: any) {
    console.error("❌ Erro ao listar planos:");
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

async function testUpdatePlan(planId: string) {
  console.log("\n🧪 Teste: Atualizar Plano\n");
  console.log(`📝 Plan ID: ${planId}\n`);

  const credentials = loadCredentialsFromEnv();
  const node = new PaymentMercadoPago();
  const executeFunctions = new LocalExecuteFunctions(credentials);

  executeFunctions.setParams({
    resource: "plans",
    operation: "update",
    planId,
    updateReason: `Plano Atualizado ${Date.now()}`,
    updateAmount: 149.99,
  });

  executeFunctions.setInputData([
    {
      json: {
        resource: "plans",
        operation: "update",
      },
    },
  ]);

  try {
    const result = await (node.execute as any).call(executeFunctions);
    console.log("✅ Plano atualizado com sucesso!");
    console.log("\n📋 Resultado:");
    console.log(JSON.stringify(result[0][0].json, null, 2));
  } catch (error: any) {
    console.error("❌ Erro ao atualizar plano:");
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

async function runTests() {
  try {
    console.log("🚀 Iniciando testes locais de Planos\n");
    console.log("=".repeat(50));

    // Teste 1: Criar plano
    const planId = await testCreatePlan();

    // Aguarda um pouco
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Teste 2: Consultar plano
    await testGetPlan(planId);

    // Teste 3: Listar planos
    await testListPlans();

    // Teste 4: Atualizar plano
    await testUpdatePlan(planId);

    console.log("\n" + "=".repeat(50));
    console.log("✨ Todos os testes concluídos!");
  } catch (error) {
    console.error("\n❌ Testes falharam:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

export { testCreatePlan, testGetPlan, testListPlans, testUpdatePlan };
