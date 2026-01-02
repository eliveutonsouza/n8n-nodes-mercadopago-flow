import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials, Webhook } from "../types";
import { IResourceHandler } from "./ResourceHandler";
import { getNodeParameterSafe } from "../helpers";
import { makeAuthenticatedRequest } from "../utils/requestHelper";

export class WebhooksResource implements IResourceHandler {
  async handleOperation(
    executeFunctions: IExecuteFunctions,
    operation: string,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    switch (operation) {
      case "register":
        return await this.registerWebhook(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "get":
        return await this.getWebhook(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "list":
        return await this.listWebhooks(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "delete":
        return await this.deleteWebhook(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      default:
        throw new Error(`Operação de webhook "${operation}" não é suportada`);
    }
  }

  private async registerWebhook(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Webhook> {
    const url = executeFunctions.getNodeParameter("url", itemIndex) as string;

    // Usar getNodeParameterSafe para campos opcionais
    const events = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "events",
      itemIndex,
      []
    ) as string[];
    const description = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "description",
      itemIndex,
      ""
    ) as string;

    if (!url || !url.startsWith("http")) {
      throw new Error(
        "URL do webhook deve ser uma URL válida (http:// ou https://)"
      );
    }

    const body: any = {
      url,
      events: events.length > 0 ? events : ["payment"],
    };

    if (description) {
      body.description = description;
    }

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "POST",
        url: `${baseUrl}/v1/webhooks`,
        body,
      }
    );

    return response as Webhook;
  }

  private async getWebhook(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Webhook> {
    const webhookId = executeFunctions.getNodeParameter(
      "webhookId",
      itemIndex
    ) as string;

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/v1/webhooks/${webhookId}`,
      }
    );

    return response as Webhook;
  }

  private async listWebhooks(
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
        url: `${baseUrl}/v1/webhooks`,
      }
    );

    return response;
  }

  private async deleteWebhook(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    const webhookId = executeFunctions.getNodeParameter(
      "webhookId",
      itemIndex
    ) as string;

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "DELETE",
        url: `${baseUrl}/v1/webhooks/${webhookId}`,
      }
    );

    return response;
  }
}

