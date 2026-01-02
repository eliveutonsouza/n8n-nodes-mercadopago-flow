import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest } from "../GenericFunctions";
import { getNodeParameterSafe } from "../helpers";

export class StoresResource implements IResourceHandler {
	operations = ["create", "get", "update", "delete", "list"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createStore(executeFunctions, itemIndex);
			case "get":
				return await this.getStore(executeFunctions, itemIndex);
			case "update":
				return await this.updateStore(executeFunctions, itemIndex);
			case "delete":
				return await this.deleteStore(executeFunctions, itemIndex);
			case "list":
				return await this.listStores(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação de Store "${operation}" não é suportada. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createStore(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const name = executeFunctions.getNodeParameter("name", itemIndex) as string;
		const userId = executeFunctions.getNodeParameter("userId", itemIndex) as string;

		if (!name || !userId) {
			throw new Error("Campos obrigatórios: Nome e ID do Usuário");
		}

		const body: any = { name: name.trim() };

		const externalId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalId",
			itemIndex,
			""
		) as string;
		if (externalId) {
			body.external_id = externalId.trim();
		}

		const location = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"location",
			itemIndex,
			null
		) as any;
		if (location) {
			body.location = location;
		}

		const businessHours = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"businessHours",
			itemIndex,
			null
		) as any;
		if (businessHours) {
			body.business_hours = businessHours;
		}

		return await apiRequest.call(executeFunctions, "POST", `users/${userId}/stores`, body);
	}

	private async getStore(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const storeId = executeFunctions.getNodeParameter("storeId", itemIndex) as string;
		if (!storeId) {
			throw new Error("ID da loja é obrigatório");
		}
		return await apiRequest.call(executeFunctions, "GET", `stores/${storeId}`);
	}

	private async updateStore(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const storeId = executeFunctions.getNodeParameter("storeId", itemIndex) as string;
		if (!storeId) {
			throw new Error("ID da loja é obrigatório");
		}

		const body: any = {};
		const name = getNodeParameterSafe(executeFunctions.getNodeParameter.bind(executeFunctions), "name", itemIndex, "") as string;
		if (name) body.name = name.trim();

		const location = getNodeParameterSafe(executeFunctions.getNodeParameter.bind(executeFunctions), "location", itemIndex, null) as any;
		if (location) body.location = location;

		const businessHours = getNodeParameterSafe(executeFunctions.getNodeParameter.bind(executeFunctions), "businessHours", itemIndex, null) as any;
		if (businessHours) body.business_hours = businessHours;

		if (Object.keys(body).length === 0) {
			throw new Error("Pelo menos um campo deve ser fornecido para atualização");
		}

		return await apiRequest.call(executeFunctions, "PUT", `stores/${storeId}`, body);
	}

	private async deleteStore(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const storeId = executeFunctions.getNodeParameter("storeId", itemIndex) as string;
		const userId = executeFunctions.getNodeParameter("userId", itemIndex) as string;
		if (!storeId || !userId) {
			throw new Error("ID da loja e ID do usuário são obrigatórios");
		}
		return await apiRequest.call(executeFunctions, "DELETE", `users/${userId}/stores/${storeId}`);
	}

	private async listStores(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number
	): Promise<any> {
		const userId = getNodeParameterSafe(executeFunctions.getNodeParameter.bind(executeFunctions), "userId", 0, "") as string;
		if (!userId) {
			throw new Error("ID do usuário é obrigatório para listar lojas");
		}
		return await apiRequest.call(executeFunctions, "GET", `users/${userId}/stores`);
	}
}

