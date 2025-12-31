import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials, Subscription } from "../types";
import { IResourceHandler } from "./ResourceHandler";
import {
  cleanDocument,
  getDocumentType,
  validateEmail,
  getNodeParameterSafe,
} from "../helpers";
import { makeAuthenticatedRequest } from "../utils/requestHelper";

export class SubscriptionsResource implements IResourceHandler {
  async handleOperation(
    executeFunctions: IExecuteFunctions,
    operation: string,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    switch (operation) {
      case "create":
        return await this.createSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "get":
        return await this.getSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "pause":
        return await this.pauseSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "resume":
        return await this.resumeSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "cancel":
        return await this.cancelSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "list":
        return await this.listSubscriptions(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      default:
        throw new Error(
          `Operação de assinatura "${operation}" não é suportada`
        );
    }
  }

  private async createSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:70",
        message: "createSubscription: entry",
        data: { baseUrl: baseUrl },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion
    const planId = executeFunctions.getNodeParameter(
      "planId",
      itemIndex
    ) as string;
    const payerEmail = executeFunctions.getNodeParameter(
      "payerEmail",
      itemIndex
    ) as string;

    // Usar getNodeParameterSafe para campos opcionais
    const payerDocument = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "payerDocument",
      itemIndex,
      ""
    ) as string;
    const startDate = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "startDate",
      itemIndex,
      ""
    ) as string;
    const trialPeriodDays = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "trialPeriodDays",
      itemIndex,
      0
    ) as number;
    const cardTokenId = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "cardTokenId",
      itemIndex,
      ""
    ) as string;

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:120",
        message: "createSubscription: parameters retrieved",
        data: {
          planId: planId,
          payerEmail: payerEmail,
          payerDocument: payerDocument,
          startDate: startDate,
          trialPeriodDays: trialPeriodDays,
          cardTokenId: cardTokenId ? "provided" : "not provided",
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion

    if (!validateEmail(payerEmail)) {
      throw new Error("E-mail do pagador inválido");
    }

    const body: any = {
      preapproval_plan_id: planId,
      payer_email: payerEmail,
    };

    // card_token_id é obrigatório para criar assinatura
    // Se não fornecido, a API pode retornar erro ou init_point para checkout
    if (cardTokenId && cardTokenId.trim() !== "") {
      body.card_token_id = cardTokenId.trim();
    }

    if (payerDocument && payerDocument.trim() !== "") {
      const docType = getDocumentType(payerDocument);
      if (!docType) {
        throw new Error("CPF/CNPJ inválido");
      }
      body.payer = {
        identification: {
          type: docType,
          number: cleanDocument(payerDocument),
        },
      };
    }

    if (startDate && startDate.trim() !== "") {
      body.start_date = new Date(startDate).toISOString();
    }

    if (trialPeriodDays && trialPeriodDays > 0) {
      body.trial_period_days = trialPeriodDays;
    }

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:186",
        message: "createSubscription: body prepared",
        data: { body: JSON.stringify(body), hasCardToken: !!body.card_token_id },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion

    try {
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "POST",
          url: `${baseUrl}/preapproval`,
          body,
        }
      );
      // #region agent log
      fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "SubscriptionsResource.ts:202",
          message: "createSubscription: response received",
          data: {
            responseId: response?.id,
            hasInitPoint: !!(response?.init_point || response?.sandbox_init_point),
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "C",
        }),
      }).catch(() => {});
      // #endregion
      return response as Subscription;
    } catch (error: any) {
      // #region agent log
      fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "SubscriptionsResource.ts:216",
          message: "createSubscription: error caught",
          data: {
            error: error?.message,
            errorData: error?.response?.data,
            hasCardToken: !!body.card_token_id,
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "E",
        }),
      }).catch(() => {});
      // #endregion

      // Se o erro for sobre card_token_id e não foi fornecido, fornecer mensagem mais clara
      if (
        error?.response?.data?.message?.includes("card_token_id") &&
        !body.card_token_id
      ) {
        throw new Error(
          `Para criar uma assinatura, é necessário fornecer um Token do Cartão (card_token_id). ` +
            `O token pode ser obtido através do Mercado Pago Checkout. ` +
            `Erro da API: ${error.response.data.message}`
        );
      }
      throw error;
    }
  }

  private async getSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    const subscriptionId = executeFunctions.getNodeParameter(
      "subscriptionId",
      itemIndex
    ) as string;

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/preapproval/${subscriptionId}`,
      }
    );

    return response as Subscription;
  }

  private async pauseSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    const subscriptionId = executeFunctions.getNodeParameter(
      "subscriptionId",
      itemIndex
    ) as string;

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "PUT",
        url: `${baseUrl}/preapproval/${subscriptionId}`,
        body: {
          status: "paused",
        },
      }
    );

    return response as Subscription;
  }

  private async resumeSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    const subscriptionId = executeFunctions.getNodeParameter(
      "subscriptionId",
      itemIndex
    ) as string;

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "PUT",
        url: `${baseUrl}/preapproval/${subscriptionId}`,
        body: {
          status: "authorized",
        },
      }
    );

    return response as Subscription;
  }

  private async cancelSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    const subscriptionId = executeFunctions.getNodeParameter(
      "subscriptionId",
      itemIndex
    ) as string;

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "PUT",
        url: `${baseUrl}/preapproval/${subscriptionId}`,
        body: {
          status: "cancelled",
        },
      }
    );

    return response as Subscription;
  }

  private async listSubscriptions(
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
        url: `${baseUrl}/preapproval/search`,
      }
    );

    return response;
  }
}

