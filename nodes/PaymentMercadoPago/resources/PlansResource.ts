import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials, Plan } from "../types";
import { IResourceHandler } from "./ResourceHandler";
import { getNodeParameterSafe, normalizeNumericValue } from "../helpers";
import { makeAuthenticatedRequest } from "../utils/requestHelper";

export class PlansResource implements IResourceHandler {
  async handleOperation(
    executeFunctions: IExecuteFunctions,
    operation: string,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    switch (operation) {
      case "create":
        return await this.createPlan(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "get":
        return await this.getPlan(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "list":
        return await this.listPlans(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "update":
        return await this.updatePlan(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      default:
        throw new Error(`Operação de plano "${operation}" não é suportada`);
    }
  }

  private async createPlan(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Plan> {
    // Campos obrigatórios - usando getNodeParameterSafe para todos para evitar erros
    // mesmo que o campo não esteja visível no momento
    let reason: string;
    let amountRaw: number | string;
    let frequencyRaw: number | string;
    let frequencyType: string;
    let currencyId: string;
    let backUrl: string;

    try {
      reason = getNodeParameterSafe(
        executeFunctions.getNodeParameter.bind(executeFunctions),
        "reason",
        itemIndex,
        ""
      ) as string;
      amountRaw = getNodeParameterSafe(
        executeFunctions.getNodeParameter.bind(executeFunctions),
        "amount",
        itemIndex,
        0
      ) as number | string;
      frequencyRaw = getNodeParameterSafe(
        executeFunctions.getNodeParameter.bind(executeFunctions),
        "frequency",
        itemIndex,
        1
      ) as number | string;
      frequencyType = getNodeParameterSafe(
        executeFunctions.getNodeParameter.bind(executeFunctions),
        "frequencyType",
        itemIndex,
        "months"
      ) as string;
      currencyId = getNodeParameterSafe(
        executeFunctions.getNodeParameter.bind(executeFunctions),
        "currencyId",
        itemIndex,
        "BRL"
      ) as string;
      backUrl = getNodeParameterSafe(
        executeFunctions.getNodeParameter.bind(executeFunctions),
        "backUrl",
        itemIndex,
        "https://www.mercadopago.com.br"
      ) as string;
    } catch (error: any) {
      // Captura erros de parâmetros e fornece mensagem mais clara
      if (
        error?.message?.toLowerCase().includes("parameter") ||
        error?.message?.toLowerCase().includes("could not get")
      ) {
        throw new Error(
          `Erro ao acessar parâmetros do plano. ` +
            `Certifique-se de que todos os campos obrigatórios estão preenchidos: ` +
            `Nome do Plano, Valor, Frequência, Tipo de Frequência, Moeda e URL de Retorno. ` +
            `Erro original: ${error.message}`
        );
      }
      throw error;
    }

    // Campos opcionais
    const repetitionsRaw = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "repetitions",
      itemIndex,
      0
    ) as number | string | undefined;
    const billingDayRaw = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "billingDay",
      itemIndex,
      0
    ) as number | string | undefined;
    const billingDayProportional = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "billingDayProportional",
      itemIndex,
      false
    ) as boolean;
    const freeTrialFrequencyRaw = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "freeTrialFrequency",
      itemIndex,
      0
    ) as number | string | undefined;
    const freeTrialFrequencyType = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "freeTrialFrequencyType",
      itemIndex,
      "months"
    ) as string;
    const paymentTypes = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "paymentTypes",
      itemIndex,
      ["credit_card"]
    ) as string[];
    const paymentMethods = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "paymentMethods",
      itemIndex,
      []
    ) as string[];

    // Normaliza valores numéricos (converte vírgula para ponto)
    const amount = normalizeNumericValue(amountRaw);
    const frequency = normalizeNumericValue(frequencyRaw);
    const repetitions = repetitionsRaw
      ? normalizeNumericValue(repetitionsRaw)
      : undefined;
    const billingDay = billingDayRaw
      ? normalizeNumericValue(billingDayRaw)
      : undefined;
    const freeTrialFrequency = freeTrialFrequencyRaw
      ? normalizeNumericValue(freeTrialFrequencyRaw)
      : undefined;

    // Validações
    if (!reason || reason.trim() === "") {
      throw new Error("Nome do plano é obrigatório");
    }

    if (amount <= 0) {
      throw new Error("Valor do plano deve ser maior que zero");
    }

    if (frequency <= 0) {
      throw new Error("Frequência deve ser maior que zero");
    }

    if (frequencyType !== "days" && frequencyType !== "months") {
      throw new Error('Tipo de frequência deve ser "days" ou "months"');
    }

    if (billingDay !== undefined && (billingDay < 1 || billingDay > 28)) {
      throw new Error("Dia de cobrança deve estar entre 1 e 28");
    }

    // Construir auto_recurring
    // NOTA: Para planos, a API do Mercado Pago espera transaction_amount em formato decimal (não centavos)
    // Exemplo: 10.9 (não 1090)
    const autoRecurring: any = {
      frequency,
      frequency_type: frequencyType,
      transaction_amount: amount, // Valor já está em formato decimal após normalizeNumericValue
      currency_id: currencyId,
    };

    if (repetitions && repetitions > 0) {
      autoRecurring.repetitions = repetitions;
    }

    if (billingDay && billingDay >= 1 && billingDay <= 28) {
      autoRecurring.billing_day = billingDay;
      autoRecurring.billing_day_proportional = billingDayProportional;
    }

    if (freeTrialFrequency && freeTrialFrequency > 0) {
      autoRecurring.free_trial = {
        frequency: freeTrialFrequency,
        frequency_type: freeTrialFrequencyType,
      };
    }

    // Construir payment_methods_allowed
    const paymentMethodsAllowed: any = {
      payment_types: paymentTypes.map((id) => ({ id })),
    };

    if (paymentMethods.length > 0) {
      paymentMethodsAllowed.payment_methods = paymentMethods.map((id) => ({
        id,
      }));
    }

    // Body final
    const body: any = {
      reason,
      auto_recurring: autoRecurring,
      payment_methods_allowed: paymentMethodsAllowed,
      back_url: backUrl,
    };

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "POST",
        url: `${baseUrl}/preapproval_plan`,
        body,
      }
    );

    return response as Plan;
  }

  private async getPlan(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Plan> {
    const planId = executeFunctions.getNodeParameter(
      "planId",
      itemIndex
    ) as string;

    if (!planId || planId.trim() === "") {
      throw new Error("ID do plano é obrigatório");
    }

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/preapproval_plan/${planId}`,
      }
    );

    return response as Plan;
  }

  private async listPlans(
    executeFunctions: IExecuteFunctions,
    _itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/preapproval_plan/search`,
      }
    );

    return response;
  }

  private async updatePlan(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Plan> {
    const planId = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "planId",
      itemIndex,
      ""
    ) as string;
    const reason = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "updateReason",
      itemIndex,
      ""
    ) as string;
    const amountRaw = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "updateAmount",
      itemIndex,
      0
    ) as number | string;

    if (!planId || planId.trim() === "") {
      throw new Error("ID do plano é obrigatório");
    }

    // Normaliza valor numérico (converte vírgula para ponto)
    const amount = normalizeNumericValue(amountRaw);

    const body: any = {};

    if (reason && reason.trim() !== "") {
      body.reason = reason;
    }

    if (amount && amount > 0) {
      // NOTA: Para planos, a API do Mercado Pago espera transaction_amount em formato decimal (não centavos)
      body.auto_recurring = {
        transaction_amount: amount, // Valor já está em formato decimal após normalizeNumericValue
      };
    }

    if (Object.keys(body).length === 0) {
      throw new Error(
        "É necessário fornecer pelo menos um campo para atualizar (nome ou valor)"
      );
    }

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "PUT",
        url: `${baseUrl}/preapproval_plan/${planId}`,
        body,
      }
    );

    return response as Plan;
  }
}

