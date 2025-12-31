import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

import { MercadoPagoCredentials } from "./types";
import { getBaseUrl, handleMercadoPagoError } from "./helpers";
import { normalizeResponse } from "./utils/responseNormalizer";
import { IResourceHandler } from "./resources/ResourceHandler";
import { PixResource } from "./resources/PixResource";
import { PlansResource } from "./resources/PlansResource";
import { SubscriptionsResource } from "./resources/SubscriptionsResource";
import { RecurringPaymentsResource } from "./resources/RecurringPaymentsResource";
import { WebhooksResource } from "./resources/WebhooksResource";
import { getNodeProperties } from "./nodeProperties";

export class PaymentMercadoPago implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Mercado Pago PIX e Assinaturas",
    name: "paymentMercadoPago",
    icon: "file:mercadopago.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description:
      "Processamento de pagamentos PIX, assinaturas e webhooks via Mercado Pago",
    defaults: {
      name: "Mercado Pago",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "paymentMercadoPagoAPI",
        required: true,
      },
    ],
    properties: getNodeProperties(),
  };

  private static getResourceHandler(
    resource: string
  ): IResourceHandler | undefined {
    const handlers: Map<string, IResourceHandler> = new Map<
      string,
      IResourceHandler
    >([
      ["pix", new PixResource()],
      ["plans", new PlansResource()],
      ["subscriptions", new SubscriptionsResource()],
      ["recurringPayments", new RecurringPaymentsResource()],
      ["webhooks", new WebhooksResource()],
    ]);
    return handlers.get(resource);
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "PaymentMercadoPago.node.ts:59",
        message: "execute: entry",
        data: { timestamp: Date.now() },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "PaymentMercadoPago.node.ts:63",
        message: "execute: items count",
        data: { itemsCount: items.length },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion

    const credentials = (await this.getCredentials(
      "paymentMercadoPagoAPI"
    )) as MercadoPagoCredentials;
    const baseUrl = getBaseUrl(credentials.environment);

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "PaymentMercadoPago.node.ts:66",
        message: "execute: credentials loaded",
        data: { environment: credentials.environment, baseUrl: baseUrl },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion

    for (let i = 0; i < items.length; i++) {
      try {
        let resource: string;
        let operation: string;

        try {
          resource = this.getNodeParameter("resource", i) as string;
          operation = this.getNodeParameter("operation", i) as string;
          // #region agent log
          fetch(
            "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "PaymentMercadoPago.node.ts:76",
                message: "execute: parameters retrieved",
                data: {
                  resource: resource,
                  operation: operation,
                  itemIndex: i,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "run1",
                hypothesisId: "B",
              }),
            }
          ).catch(() => {});
          // #endregion
        } catch (error: any) {
          // #region agent log
          fetch(
            "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "PaymentMercadoPago.node.ts:79",
                message: "execute: parameter error",
                data: { error: error?.message },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "run1",
                hypothesisId: "B",
              }),
            }
          ).catch(() => {});
          // #endregion
          if (error?.message?.includes("Could not get parameter")) {
            throw new Error(
              `Erro ao obter parâmetros do node. Verifique se os campos "Resource" e "Operation" estão preenchidos corretamente. ` +
                `Detalhes: ${error.message}`
            );
          }
          throw error;
        }

        const handler = PaymentMercadoPago.getResourceHandler(resource);
        // #region agent log
        fetch(
          "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "PaymentMercadoPago.node.ts:87",
              message: "execute: handler retrieved",
              data: { resource: resource, handlerFound: !!handler },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "A",
            }),
          }
        ).catch(() => {});
        // #endregion
        if (!handler) {
          throw new Error(`Resource "${resource}" não é suportado`);
        }

        let responseData: any;

        try {
          // #region agent log
          fetch(
            "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "PaymentMercadoPago.node.ts:94",
                message: "execute: calling handler",
                data: { resource: resource, operation: operation },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "run1",
                hypothesisId: "C",
              }),
            }
          ).catch(() => {});
          // #endregion
          responseData = await handler.handleOperation(
            this,
            operation,
            i,
            baseUrl,
            credentials
          );
          // #region agent log
          fetch(
            "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "PaymentMercadoPago.node.ts:101",
                message: "execute: handler response received",
                data: {
                  hasResponse: !!responseData,
                  responseId: responseData?.id,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "run1",
                hypothesisId: "C",
              }),
            }
          ).catch(() => {});
          // #endregion
        } catch (planError: any) {
          // #region agent log
          fetch(
            "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "PaymentMercadoPago.node.ts:105",
                message: "execute: handler error",
                data: { error: planError?.message, resource: resource },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "run1",
                hypothesisId: "E",
              }),
            }
          ).catch(() => {});
          // #endregion
          // Tratamento específico para erros de parâmetros em planos
          if (resource === "plans") {
            if (
              planError?.message?.includes("Could not get parameter") ||
              planError?.message?.toLowerCase().includes("parameter")
            ) {
              throw new Error(
                `Erro ao obter parâmetros para criar plano. ` +
                  `Verifique se todos os campos obrigatórios estão preenchidos: ` +
                  `Nome do Plano, Valor, Frequência, Tipo de Frequência, Moeda e URL de Retorno. ` +
                  `Detalhes: ${planError.message}`
              );
            }
          }
          throw planError;
        }

        // #region agent log
        fetch(
          "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "PaymentMercadoPago.node.ts:120",
              message: "execute: normalizing response",
              data: { resource: resource },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "D",
            }),
          }
        ).catch(() => {});
        // #endregion
        const normalized = normalizeResponse(responseData, resource);
        returnData.push({
          json: normalized,
        });
        // #region agent log
        fetch(
          "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "PaymentMercadoPago.node.ts:125",
              message: "execute: response normalized",
              data: { normalizedId: normalized.id },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "D",
            }),
          }
        ).catch(() => {});
        // #endregion
      } catch (error) {
        // #region agent log
        fetch(
          "http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "PaymentMercadoPago.node.ts:128",
              message: "execute: catch error",
              data: { error: (error as any)?.message },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "E",
            }),
          }
        ).catch(() => {});
        // #endregion
        const errorData = handleMercadoPagoError(error);
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: errorData.message,
              status: errorData.status,
              details: errorData,
            },
          });
        } else {
          throw new Error(errorData.message);
        }
      }
    }

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "PaymentMercadoPago.node.ts:141",
        message: "execute: exit",
        data: { returnDataCount: returnData.length },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    return [returnData];
  }
}
