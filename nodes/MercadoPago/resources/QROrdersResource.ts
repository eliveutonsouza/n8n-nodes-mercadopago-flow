import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest } from "../GenericFunctions";
import { getNodeParameterSafe, normalizeNumericValue } from "../helpers";

export class QROrdersResource implements IResourceHandler {
	operations = ["create", "get", "list"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createOrder(executeFunctions, itemIndex);
			case "get":
				return await this.getOrder(executeFunctions, itemIndex);
			case "list":
				return await this.listOrders(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação de QR Order "${operation}" não é suportada. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createOrder(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		// Campos obrigatórios
		const totalAmountRaw = executeFunctions.getNodeParameter("totalAmount", itemIndex) as number | string;
		const description = executeFunctions.getNodeParameter("description", itemIndex) as string;
		const externalPosId = executeFunctions.getNodeParameter("externalPosId", itemIndex) as string;
		const qrMode = executeFunctions.getNodeParameter("qrMode", itemIndex) as string; // static, dynamic, hybrid

		if (!totalAmountRaw || !description || !externalPosId || !qrMode) {
			throw new Error(
				"Campos obrigatórios: Valor Total, Descrição, ID do POS Externo e Modo QR"
			);
		}

		const totalAmount = normalizeNumericValue(totalAmountRaw);

		const body: any = {
			type: "qr",
			total_amount: totalAmount.toString(),
			description: description.trim(),
			config: {
				qr: {
					external_pos_id: externalPosId.trim(),
					mode: qrMode,
				},
			},
		};

		// Campos opcionais
		const externalReference = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalReference",
			itemIndex,
			""
		) as string;
		if (externalReference) {
			body.external_reference = externalReference.trim();
		}

		const expirationTime = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"expirationTime",
			itemIndex,
			""
		) as string;
		if (expirationTime) {
			body.expiration_time = expirationTime.trim();
		}

		// Integration data
		const platformId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"platformId",
			itemIndex,
			""
		) as string;
		const integratorId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"integratorId",
			itemIndex,
			""
		) as string;
		if (platformId || integratorId) {
			body.integration_data = {};
			if (platformId) {
				body.integration_data.platform_id = platformId.trim();
			}
			if (integratorId) {
				body.integration_data.integrator_id = integratorId.trim();
			}
		}

		// Transactions
		const paymentAmountRaw = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"paymentAmount",
			itemIndex,
			totalAmount
		) as number | string;
		const paymentAmount = normalizeNumericValue(paymentAmountRaw);
		body.transactions = {
			payments: [
				{
					amount: paymentAmount.toString(),
				},
			],
		};

		// Items
		const items = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"items",
			itemIndex,
			[]
		) as any[];
		if (items && items.length > 0) {
			body.items = items.map((item: any) => ({
				title: item.title || description,
				unit_price: item.unit_price ? normalizeNumericValue(item.unit_price).toString() : totalAmount.toString(),
				quantity: item.quantity || 1,
				unit_measure: item.unit_measure || "",
				external_code: item.external_code || "",
			}));
		} else {
			// Item padrão se não fornecido
			body.items = [
				{
					title: description,
					unit_price: totalAmount.toString(),
					quantity: 1,
				},
			];
		}

		// Discounts (opcional)
		const discounts = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"discounts",
			itemIndex,
			[]
		) as any[];
		if (discounts && discounts.length > 0) {
			body.discounts = {
				payment_methods: discounts.map((discount: any) => ({
					type: discount.type || "account_money",
					new_total_amount: discount.new_total_amount ? normalizeNumericValue(discount.new_total_amount).toString() : undefined,
				})).filter((d: any) => d.new_total_amount !== undefined),
			};
		}

		// Idempotency Key
		const idempotencyKey = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"idempotencyKey",
			itemIndex,
			""
		) as string;

		const headers: Record<string, string> = {};
		if (idempotencyKey) {
			headers["X-Idempotency-Key"] = idempotencyKey.trim();
		}

		const response = await apiRequest.call(
			executeFunctions,
			"POST",
			"v1/orders",
			body,
			undefined,
			headers
		);

		return response;
	}

	private async getOrder(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const orderId = executeFunctions.getNodeParameter("orderId", itemIndex) as string;

		if (!orderId || orderId.trim() === "") {
			throw new Error(
				"ID do pedido é obrigatório. " +
				"Forneça o ID do pedido QR que deseja consultar."
			);
		}

		const response = await apiRequest.call(
			executeFunctions,
			"GET",
			`v1/orders/${orderId}`
		);

		return response;
	}

	private async listOrders(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number
	): Promise<any> {
		// Query parameters opcionais
		const externalReference = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalReference",
			0,
			""
		) as string;
		const status = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"status",
			0,
			""
		) as string;
		const limit = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"limit",
			0,
			10
		) as number;
		const offset = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"offset",
			0,
			0
		) as number;

		const qs: any = {};
		if (externalReference) {
			qs.external_reference = externalReference.trim();
		}
		if (status) {
			qs.status = status.trim();
		}
		if (limit) {
			qs.limit = limit;
		}
		if (offset) {
			qs.offset = offset;
		}

		const response = await apiRequest.call(
			executeFunctions,
			"GET",
			"v1/orders",
			undefined,
			qs
		);

		return response;
	}
}

