import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials } from "../types";
import { IResourceHandler } from "./ResourceHandler";
import { getNodeParameterSafe } from "../helpers";
import { makeAuthenticatedRequest } from "../utils/requestHelper";

export class RecurringPaymentsResource implements IResourceHandler {
  async handleOperation(
    executeFunctions: IExecuteFunctions,
    operation: string,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    switch (operation) {
      case "create":
        return await this.createRecurringPayment(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "get":
        return await this.getRecurringPayment(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "list":
        return await this.listRecurringPayments(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "cancel":
        return await this.cancelRecurringPayment(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      default:
        throw new Error(
          `Operação de pagamento recorrente "${operation}" não é suportada`
        );
    }
  }

  private async createRecurringPayment(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    const planId = executeFunctions.getNodeParameter(
      "planId",
      itemIndex
    ) as string;

    // Para pagamentos recorrentes, geralmente criamos via assinatura
    // Esta é uma implementação simplificada
    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/preapproval/${planId}`,
      }
    );

    return response;
  }

  private async getRecurringPayment(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    const recurringPaymentId = executeFunctions.getNodeParameter(
      "recurringPaymentId",
      itemIndex
    ) as string;

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/preapproval/${recurringPaymentId}`,
      }
    );

    return response;
  }

  private async listRecurringPayments(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    // Usar getNodeParameterSafe para campo opcional
    const customerId = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "customerId",
      itemIndex,
      ""
    ) as string;

    let url = `${baseUrl}/preapproval/search`;
    if (customerId) {
      url += `?payer_id=${customerId}`;
    }

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url,
      }
    );

    return response;
  }

  private async cancelRecurringPayment(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    const recurringPaymentId = executeFunctions.getNodeParameter(
      "recurringPaymentId",
      itemIndex
    ) as string;

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "PUT",
        url: `${baseUrl}/preapproval/${recurringPaymentId}`,
        body: {
          status: "cancelled",
        },
      }
    );

    return response;
  }
}

