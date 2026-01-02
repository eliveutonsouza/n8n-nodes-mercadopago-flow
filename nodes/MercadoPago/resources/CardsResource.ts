import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest, buildUrl } from "../GenericFunctions";
import { getNodeParameterSafe } from "../helpers";
import { Card } from "../types";

export class CardsResource implements IResourceHandler {
	operations = ["create", "get", "delete", "list"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createCard(executeFunctions, itemIndex);
			case "get":
				return await this.getCard(executeFunctions, itemIndex);
			case "delete":
				return await this.deleteCard(executeFunctions, itemIndex);
			case "list":
				return await this.listCards(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação "${operation}" não é suportada para Cards. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createCard(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Card> {
		const customerId = executeFunctions.getNodeParameter("customerId", itemIndex) as string;
		const token = executeFunctions.getNodeParameter("token", itemIndex) as string;

		if (!customerId) {
			throw new Error("ID do cliente é obrigatório");
		}

		if (!token) {
			throw new Error("Token do cartão é obrigatório");
		}

		const body: any = {
			token,
		};

		// Payment method ID (opcional, mas recomendado)
		const paymentMethodId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"paymentMethodId",
			itemIndex,
			""
		) as string;
		if (paymentMethodId) {
			body.payment_method_id = paymentMethodId;
		}

		const url = buildUrl("/v1/customers/:customerId/cards", { customerId });
		return await apiRequest.call(executeFunctions, "POST", url, body);
	}

	private async getCard(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Card> {
		const customerId = executeFunctions.getNodeParameter("customerId", itemIndex) as string;
		const cardId = executeFunctions.getNodeParameter("cardId", itemIndex) as string;

		if (!customerId) {
			throw new Error("ID do cliente é obrigatório");
		}

		if (!cardId) {
			throw new Error("ID do cartão é obrigatório");
		}

		const url = buildUrl("/v1/customers/:customerId/cards/:cardId", { customerId, cardId });
		return await apiRequest.call(executeFunctions, "GET", url);
	}

	private async deleteCard(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const customerId = executeFunctions.getNodeParameter("customerId", itemIndex) as string;
		const cardId = executeFunctions.getNodeParameter("cardId", itemIndex) as string;

		if (!customerId) {
			throw new Error("ID do cliente é obrigatório");
		}

		if (!cardId) {
			throw new Error("ID do cartão é obrigatório");
		}

		const url = buildUrl("/v1/customers/:customerId/cards/:cardId", { customerId, cardId });
		return await apiRequest.call(executeFunctions, "DELETE", url);
	}

	private async listCards(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const customerId = executeFunctions.getNodeParameter("customerId", itemIndex) as string;

		if (!customerId) {
			throw new Error("ID do cliente é obrigatório");
		}

		const url = buildUrl("/v1/customers/:customerId/cards", { customerId });
		return await apiRequest.call(executeFunctions, "GET", url);
	}
}

