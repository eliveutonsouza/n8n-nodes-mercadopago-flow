import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest } from "../GenericFunctions";
import { getNodeParameterSafe } from "../helpers";

export class POSResource implements IResourceHandler {
	operations = ["create", "get", "update", "delete", "list"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createPOS(executeFunctions, itemIndex);
			case "get":
				return await this.getPOS(executeFunctions, itemIndex);
			case "update":
				return await this.updatePOS(executeFunctions, itemIndex);
			case "delete":
				return await this.deletePOS(executeFunctions, itemIndex);
			case "list":
				return await this.listPOS(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação de POS "${operation}" não é suportada. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createPOS(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		// Campos obrigatórios
		const name = executeFunctions.getNodeParameter("name", itemIndex) as string;
		const category = executeFunctions.getNodeParameter("category", itemIndex) as number;
		const storeId = executeFunctions.getNodeParameter("storeId", itemIndex) as number | string;
		const fixedAmount = executeFunctions.getNodeParameter("fixedAmount", itemIndex) as boolean;

		if (!name || !category || !storeId || fixedAmount === undefined) {
			throw new Error(
				"Campos obrigatórios: Nome, Categoria, ID da Loja e Valor Fixo"
			);
		}

		const body: any = {
			name: name.trim(),
			category: category,
			store_id: typeof storeId === 'string' ? parseInt(storeId, 10) : storeId,
			fixed_amount: fixedAmount,
		};

		// Campos opcionais
		const externalId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalId",
			itemIndex,
			""
		) as string;
		if (externalId) {
			body.external_id = externalId.trim();
		}

		const externalStoreId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalStoreId",
			itemIndex,
			""
		) as string;
		if (externalStoreId) {
			body.external_store_id = externalStoreId.trim();
		}

		const response = await apiRequest.call(
			executeFunctions,
			"POST",
			"pos",
			body
		);

		return response;
	}

	private async getPOS(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const posId = executeFunctions.getNodeParameter("posId", itemIndex) as string;

		if (!posId || posId.trim() === "") {
			throw new Error(
				"ID do POS é obrigatório. " +
				"Forneça o ID do POS que deseja consultar."
			);
		}

		const response = await apiRequest.call(
			executeFunctions,
			"GET",
			`pos/${posId}`
		);

		return response;
	}

	private async updatePOS(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const posId = executeFunctions.getNodeParameter("posId", itemIndex) as string;

		if (!posId || posId.trim() === "") {
			throw new Error(
				"ID do POS é obrigatório para atualizar. " +
				"Forneça o ID do POS que deseja atualizar."
			);
		}

		const body: any = {};

		// Campos opcionais para atualização
		const name = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"name",
			itemIndex,
			""
		) as string;
		if (name) {
			body.name = name.trim();
		}

		const category = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"category",
			itemIndex,
			null
		) as number | null;
		if (category !== null) {
			body.category = category;
		}

		const fixedAmount = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"fixedAmount",
			itemIndex,
			null
		) as boolean | null;
		if (fixedAmount !== null) {
			body.fixed_amount = fixedAmount;
		}

		if (Object.keys(body).length === 0) {
			throw new Error(
				"Pelo menos um campo deve ser fornecido para atualização (nome, categoria ou valor fixo)."
			);
		}

		const response = await apiRequest.call(
			executeFunctions,
			"PUT",
			`pos/${posId}`,
			body
		);

		return response;
	}

	private async deletePOS(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const posId = executeFunctions.getNodeParameter("posId", itemIndex) as string;

		if (!posId || posId.trim() === "") {
			throw new Error(
				"ID do POS é obrigatório para deletar. " +
				"Forneça o ID do POS que deseja deletar."
			);
		}

		const response = await apiRequest.call(
			executeFunctions,
			"DELETE",
			`pos/${posId}`
		);

		return response;
	}

	private async listPOS(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number
	): Promise<any> {
		// Query parameters opcionais
		const externalId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalId",
			0,
			""
		) as string;
		const externalStoreId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalStoreId",
			0,
			""
		) as string;
		const storeId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"storeId",
			0,
			""
		) as string;

		const qs: any = {};
		if (externalId) {
			qs.external_id = externalId.trim();
		}
		if (externalStoreId) {
			qs.external_store_id = externalStoreId.trim();
		}
		if (storeId) {
			qs.store_id = storeId.trim();
		}

		const response = await apiRequest.call(
			executeFunctions,
			"GET",
			"pos",
			undefined,
			qs
		);

		return response;
	}
}

