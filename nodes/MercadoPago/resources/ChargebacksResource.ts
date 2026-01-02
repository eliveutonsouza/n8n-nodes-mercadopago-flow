import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest } from "../GenericFunctions";
import { getNodeParameterSafe } from "../helpers";

export class ChargebacksResource implements IResourceHandler {
	operations = ["get", "list", "upload_documentation"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "get":
				return await this.getChargeback(executeFunctions, itemIndex);
			case "list":
				return await this.listChargebacks(executeFunctions, itemIndex);
			case "upload_documentation":
				return await this.uploadDocumentation(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação de Chargeback "${operation}" não é suportada. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async getChargeback(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const chargebackId = executeFunctions.getNodeParameter("chargebackId", itemIndex) as string;
		if (!chargebackId) {
			throw new Error("ID do chargeback é obrigatório");
		}
		return await apiRequest.call(executeFunctions, "GET", `v1/chargebacks/${chargebackId}`);
	}

	private async listChargebacks(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number
	): Promise<any> {
		const paymentId = getNodeParameterSafe(executeFunctions.getNodeParameter.bind(executeFunctions), "paymentId", 0, "") as string;
		const qs: any = {};
		if (paymentId) {
			qs.payment_id = paymentId;
		}
		return await apiRequest.call(executeFunctions, "GET", "v1/chargebacks", undefined, qs);
	}

	private async uploadDocumentation(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const chargebackId = executeFunctions.getNodeParameter("chargebackId", itemIndex) as string;
		const files = executeFunctions.getNodeParameter("files", itemIndex) as any[];
		if (!chargebackId || !files || files.length === 0) {
			throw new Error("ID do chargeback e arquivos são obrigatórios");
		}
		// Para upload de arquivos, precisaríamos usar multipart/form-data
		// Por enquanto, retornamos um erro informando que precisa ser implementado
		throw new Error("Upload de documentação requer multipart/form-data. Implementação pendente.");
	}
}

