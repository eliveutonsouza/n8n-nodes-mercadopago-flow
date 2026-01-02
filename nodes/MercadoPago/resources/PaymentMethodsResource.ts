import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest } from "../GenericFunctions";
import { getNodeParameterSafe } from "../helpers";

export class PaymentMethodsResource implements IResourceHandler {
	operations = ["list"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "list":
				return await this.listPaymentMethods(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação "${operation}" não é suportada para PaymentMethods. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async listPaymentMethods(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const qs: any = {};

		// Site ID (opcional, filtra por país)
		const siteId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"siteId",
			itemIndex,
			""
		) as string;
		if (siteId) {
			qs.site_id = siteId;
		}

		return await apiRequest.call(executeFunctions, "GET", "/v1/payment_methods", undefined, qs);
	}
}

