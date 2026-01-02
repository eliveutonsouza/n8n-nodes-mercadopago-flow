import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest } from "../GenericFunctions";
import { getNodeParameterSafe } from "../helpers";
import { Webhook } from "../types";

export class WebhooksResource implements IResourceHandler {
  operations = ["register", "get", "list", "delete"];

  async execute(
    executeFunctions: IExecuteFunctions,
    operation: string,
    _resource: string
  ): Promise<any> {
    const itemIndex = 0;

    switch (operation) {
      case "register":
        return await this.registerWebhook(executeFunctions, itemIndex);
      case "get":
        return await this.getWebhook(executeFunctions, itemIndex);
      case "list":
        return await this.listWebhooks(executeFunctions, itemIndex);
      case "delete":
        return await this.deleteWebhook(executeFunctions, itemIndex);
      default:
        throw new Error(
          `Operação de webhook "${operation}" não é suportada. Operações disponíveis: ${this.operations.join(
            ", "
          )}`
        );
    }
  }

  private async registerWebhook(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
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

    const response = await apiRequest.call(
      executeFunctions,
      "POST",
      "v1/webhooks",
      body
    );

    return response as Webhook;
  }

  private async getWebhook(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<Webhook> {
    const webhookId = executeFunctions.getNodeParameter(
      "webhookId",
      itemIndex
    ) as string;

    if (!webhookId || webhookId.trim() === "") {
      throw new Error(
        "ID do webhook é obrigatório. " +
          "Forneça o ID do webhook que deseja consultar."
      );
    }

    const response = await apiRequest.call(
      executeFunctions,
      "GET",
      `v1/webhooks/${webhookId}`
    );

    return response as Webhook;
  }

  private async listWebhooks(
    executeFunctions: IExecuteFunctions,
    _itemIndex: number
  ): Promise<any> {
    const response = await apiRequest.call(
      executeFunctions,
      "GET",
      "/v1/webhooks"
    );

    return response;
  }

  private async deleteWebhook(
    executeFunctions: IExecuteFunctions,
    itemIndex: number
  ): Promise<any> {
    const webhookId = executeFunctions.getNodeParameter(
      "webhookId",
      itemIndex
    ) as string;

    if (!webhookId || webhookId.trim() === "") {
      throw new Error(
        "ID do webhook é obrigatório para deletar. " +
          "Forneça o ID do webhook que deseja deletar."
      );
    }

    const response = await apiRequest.call(
      executeFunctions,
      "DELETE",
      `v1/webhooks/${webhookId}`
    );

    return response;
  }
}
