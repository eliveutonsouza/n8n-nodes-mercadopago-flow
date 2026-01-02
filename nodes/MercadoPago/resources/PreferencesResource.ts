import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest, buildUrl } from "../GenericFunctions";
import {
	normalizeNumericValue,
	validateEmail,
	getNodeParameterSafe,
} from "../helpers";
import { Preference } from "../types";

export class PreferencesResource implements IResourceHandler {
	operations = ["create", "get", "update"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createPreference(executeFunctions, itemIndex);
			case "get":
				return await this.getPreference(executeFunctions, itemIndex);
			case "update":
				return await this.updatePreference(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação "${operation}" não é suportada para Preferences. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createPreference(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Preference> {
		// Items são obrigatórios
		const itemsJson = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"items",
			itemIndex,
			"[]"
		) as string;

		let items: any[] = [];
		try {
			items = JSON.parse(itemsJson);
		} catch (error) {
			throw new Error("Items deve ser um JSON válido. Exemplo: [{\"id\":\"1\",\"title\":\"Produto\",\"quantity\":1,\"unit_price\":100}]");
		}

		if (!Array.isArray(items) || items.length === 0) {
			throw new Error("Pelo menos um item é obrigatório");
		}

		const body: any = {
			items: items.map((item: any) => ({
				id: item.id || String(Date.now()),
				title: item.title || "Item",
				quantity: item.quantity || 1,
				unit_price: normalizeNumericValue(item.unit_price || 0),
				description: item.description || "",
				category_id: item.category_id || "retail",
			})),
		};

		// Auto return
		const autoReturn = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"autoReturn",
			itemIndex,
			""
		) as string;
		if (autoReturn) {
			body.auto_return = autoReturn;
		}

		// Back URLs
		const backUrlSuccess = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"backUrlSuccess",
			itemIndex,
			""
		) as string;
		const backUrlFailure = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"backUrlFailure",
			itemIndex,
			""
		) as string;
		const backUrlPending = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"backUrlPending",
			itemIndex,
			""
		) as string;

		if (backUrlSuccess || backUrlFailure || backUrlPending) {
			body.back_urls = {};
			if (backUrlSuccess) body.back_urls.success = backUrlSuccess;
			if (backUrlFailure) body.back_urls.failure = backUrlFailure;
			if (backUrlPending) body.back_urls.pending = backUrlPending;
		}

		// Statement descriptor
		const statementDescriptor = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"statementDescriptor",
			itemIndex,
			""
		) as string;
		if (statementDescriptor) {
			body.statement_descriptor = statementDescriptor;
		}

		// Binary mode
		const binaryMode = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"binaryMode",
			itemIndex,
			false
		) as boolean;
		body.binary_mode = binaryMode;

		// External reference
		const externalReference = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalReference",
			itemIndex,
			""
		) as string;
		if (externalReference) {
			body.external_reference = externalReference;
		}

		// Payer
		const payerEmail = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"payerEmail",
			itemIndex,
			""
		) as string;
		if (payerEmail) {
			if (!validateEmail(payerEmail)) {
				throw new Error("Email do pagador inválido");
			}
			body.payer = { email: payerEmail };

			const payerName = getNodeParameterSafe(
				executeFunctions.getNodeParameter.bind(executeFunctions),
				"payerName",
				itemIndex,
				""
			) as string;
			if (payerName) {
				body.payer.name = payerName;
			}

			const payerSurname = getNodeParameterSafe(
				executeFunctions.getNodeParameter.bind(executeFunctions),
				"payerSurname",
				itemIndex,
				""
			) as string;
			if (payerSurname) {
				body.payer.surname = payerSurname;
			}
		}

		// Payment methods
		const installments = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"installments",
			itemIndex,
			null
		) as number | null;
		if (installments !== null) {
			body.payment_methods = {
				installments,
			};
		}

		// Notification URL
		const notificationUrl = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"notificationUrl",
			itemIndex,
			""
		) as string;
		if (notificationUrl) {
			body.notification_url = notificationUrl;
		}

		// Expires
		const expires = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"expires",
			itemIndex,
			false
		) as boolean;
		if (expires) {
			body.expires = true;

			const expirationDateFrom = getNodeParameterSafe(
				executeFunctions.getNodeParameter.bind(executeFunctions),
				"expirationDateFrom",
				itemIndex,
				""
			) as string;
			if (expirationDateFrom) {
				body.expiration_date_from = expirationDateFrom;
			}

			const expirationDateTo = getNodeParameterSafe(
				executeFunctions.getNodeParameter.bind(executeFunctions),
				"expirationDateTo",
				itemIndex,
				""
			) as string;
			if (expirationDateTo) {
				body.expiration_date_to = expirationDateTo;
			}
		}

		return await apiRequest.call(executeFunctions, "POST", "/checkout/preferences", body);
	}

	private async getPreference(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Preference> {
		const preferenceId = executeFunctions.getNodeParameter("preferenceId", itemIndex) as string;

		if (!preferenceId) {
			throw new Error("ID da preferência é obrigatório");
		}

		const url = buildUrl("/checkout/preferences/:preferenceId", { preferenceId });
		return await apiRequest.call(executeFunctions, "GET", url);
	}

	private async updatePreference(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Preference> {
		const preferenceId = executeFunctions.getNodeParameter("preferenceId", itemIndex) as string;

		if (!preferenceId) {
			throw new Error("ID da preferência é obrigatório");
		}

		// Para update, podemos atualizar qualquer campo (mesma lógica do create, mas todos opcionais)
		const body: any = {};

		// Items
		const itemsJson = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"items",
			itemIndex,
			""
		) as string;
		if (itemsJson) {
			try {
				const items = JSON.parse(itemsJson);
				if (Array.isArray(items) && items.length > 0) {
					body.items = items.map((item: any) => ({
						id: item.id || String(Date.now()),
						title: item.title || "Item",
						quantity: item.quantity || 1,
						unit_price: normalizeNumericValue(item.unit_price || 0),
						description: item.description || "",
						category_id: item.category_id || "retail",
					}));
				}
			} catch (error) {
				// Ignora erro de parsing, items não será atualizado
			}
		}

		// Outros campos (mesma lógica do create)
		const autoReturn = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"autoReturn",
			itemIndex,
			""
		) as string;
		if (autoReturn) {
			body.auto_return = autoReturn;
		}

		const externalReference = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalReference",
			itemIndex,
			""
		) as string;
		if (externalReference) {
			body.external_reference = externalReference;
		}

		const notificationUrl = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"notificationUrl",
			itemIndex,
			""
		) as string;
		if (notificationUrl) {
			body.notification_url = notificationUrl;
		}

		const url = buildUrl("/checkout/preferences/:preferenceId", { preferenceId });
		return await apiRequest.call(executeFunctions, "PUT", url, body);
	}
}

