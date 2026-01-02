import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest, buildUrl } from "../GenericFunctions";
import {
	normalizeNumericValue,
	cleanDocument,
	getDocumentType,
	validateEmail,
	getNodeParameterSafe,
} from "../helpers";
import { Payment } from "../types";

export class PaymentsResource implements IResourceHandler {
	operations = ["create", "get", "list", "search", "refund", "capture", "cancel"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createPayment(executeFunctions, itemIndex);
			case "get":
				return await this.getPayment(executeFunctions, itemIndex);
			case "list":
				return await this.listPayments(executeFunctions, itemIndex);
			case "search":
				return await this.searchPayments(executeFunctions, itemIndex);
			case "refund":
				return await this.refundPayment(executeFunctions, itemIndex);
			case "capture":
				return await this.capturePayment(executeFunctions, itemIndex);
			case "cancel":
				return await this.cancelPayment(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação "${operation}" não é suportada para Payments. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Payment> {
		const transactionAmount = normalizeNumericValue(
			executeFunctions.getNodeParameter("transactionAmount", itemIndex) as number | string
		);
		const paymentMethodId = executeFunctions.getNodeParameter("paymentMethodId", itemIndex) as string;
		const payerEmail = executeFunctions.getNodeParameter("payerEmail", itemIndex) as string;

		if (!validateEmail(payerEmail)) {
			throw new Error("Email do pagador inválido");
		}

		// Campos obrigatórios
		const body: any = {
			transaction_amount: transactionAmount,
			payment_method_id: paymentMethodId,
			payer: {
				email: payerEmail,
			},
		};

		// Campos opcionais
		const description = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"description",
			itemIndex,
			""
		) as string;
		if (description) {
			body.description = description;
		}

		const installments = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"installments",
			itemIndex,
			1
		) as number;
		if (installments) {
			body.installments = installments;
		}

		const capture = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"capture",
			itemIndex,
			true
		) as boolean;
		body.capture = capture;

		const binaryMode = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"binaryMode",
			itemIndex,
			false
		) as boolean;
		body.binary_mode = binaryMode;

		// Token do cartão (obrigatório para pagamentos com cartão)
		const token = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"token",
			itemIndex,
			""
		) as string;
		if (token) {
			body.token = token;
		}

		// Issuer ID
		const issuerId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"issuerId",
			itemIndex,
			""
		) as string;
		if (issuerId) {
			body.issuer_id = issuerId;
		}

		// Payer information
		const payerFirstName = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"payerFirstName",
			itemIndex,
			""
		) as string;
		const payerLastName = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"payerLastName",
			itemIndex,
			""
		) as string;
		const payerDocument = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"payerDocument",
			itemIndex,
			""
		) as string;

		if (payerFirstName) body.payer.first_name = payerFirstName;
		if (payerLastName) body.payer.last_name = payerLastName;
		if (payerDocument) {
			const cleanDoc = cleanDocument(payerDocument);
			const docType = getDocumentType(payerDocument);
			if (docType) {
				body.payer.identification = {
					type: docType,
					number: cleanDoc,
				};
			}
		}

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

		// Idempotency key (obrigatório)
		const idempotencyKey = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"idempotencyKey",
			itemIndex,
			`payment_${Date.now()}_${Math.random().toString(36).substring(7)}`
		) as string;

		const headers: Record<string, string> = {
			"X-Idempotency-Key": idempotencyKey,
		};

		return await apiRequest.call(
			executeFunctions,
			"POST",
			"/v1/payments",
			body,
			undefined,
			headers
		);
	}

	private async getPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Payment> {
		const paymentId = executeFunctions.getNodeParameter("paymentId", itemIndex) as string;

		if (!paymentId) {
			throw new Error("ID do pagamento é obrigatório");
		}

		const url = buildUrl("/v1/payments/:paymentId", { paymentId });
		return await apiRequest.call(executeFunctions, "GET", url);
	}

	private async listPayments(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const qs: any = {};

		// Filtros opcionais
		const status = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"status",
			itemIndex,
			""
		) as string;
		if (status) {
			qs.status = status;
		}

		const sort = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"sort",
			itemIndex,
			"date_created"
		) as string;
		qs.sort = sort;

		const criteria = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"criteria",
			itemIndex,
			"desc"
		) as string;
		qs.criteria = criteria;

		const offset = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"offset",
			itemIndex,
			0
		) as number;
		if (offset > 0) {
			qs.offset = offset;
		}

		const limit = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"limit",
			itemIndex,
			50
		) as number;
		if (limit) {
			qs.limit = limit;
		}

		return await apiRequest.call(executeFunctions, "GET", "/v1/payments", undefined, qs);
	}

	private async searchPayments(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const qs: any = {};

		// External reference
		const externalReference = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalReference",
			itemIndex,
			""
		) as string;
		if (externalReference) {
			qs.external_reference = externalReference;
		}

		// Status
		const status = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"status",
			itemIndex,
			""
		) as string;
		if (status) {
			qs.status = status;
		}

		// Range date created
		const dateCreatedFrom = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"dateCreatedFrom",
			itemIndex,
			""
		) as string;
		if (dateCreatedFrom) {
			qs["date_created.from"] = dateCreatedFrom;
		}

		const dateCreatedTo = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"dateCreatedTo",
			itemIndex,
			""
		) as string;
		if (dateCreatedTo) {
			qs["date_created.to"] = dateCreatedTo;
		}

		// Sort
		const sort = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"sort",
			itemIndex,
			"date_created"
		) as string;
		qs.sort = sort;

		// Criteria
		const criteria = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"criteria",
			itemIndex,
			"desc"
		) as string;
		qs.criteria = criteria;

		// Offset e limit
		const offset = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"offset",
			itemIndex,
			0
		) as number;
		if (offset > 0) {
			qs.offset = offset;
		}

		const limit = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"limit",
			itemIndex,
			50
		) as number;
		if (limit) {
			qs.limit = limit;
		}

		return await apiRequest.call(executeFunctions, "GET", "/v1/payments/search", undefined, qs);
	}

	private async refundPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const paymentId = executeFunctions.getNodeParameter("paymentId", itemIndex) as string;

		if (!paymentId) {
			throw new Error("ID do pagamento é obrigatório");
		}

		const refundType = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"refundType",
			itemIndex,
			"full"
		) as string;

		const body: any = {};
		const headers: Record<string, string> = {};

		// Idempotency key
		const idempotencyKey = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"idempotencyKey",
			itemIndex,
			`refund_${Date.now()}_${Math.random().toString(36).substring(7)}`
		) as string;
		headers["X-Idempotency-Key"] = idempotencyKey;

		// Se for refund parcial, precisa do amount
		if (refundType === "partial") {
			const amount = normalizeNumericValue(
				getNodeParameterSafe(
					executeFunctions.getNodeParameter.bind(executeFunctions),
					"refundAmount",
					itemIndex,
					0
				) as number | string
			);

			if (!amount || amount <= 0) {
				throw new Error("Valor do reembolso parcial é obrigatório e deve ser maior que zero");
			}

			body.amount = amount;
		}

		const url = buildUrl("/v1/payments/:paymentId/refunds", { paymentId });
		return await apiRequest.call(executeFunctions, "POST", url, body, undefined, headers);
	}

	private async capturePayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Payment> {
		const paymentId = executeFunctions.getNodeParameter("paymentId", itemIndex) as string;

		if (!paymentId) {
			throw new Error("ID do pagamento é obrigatório");
		}

		const captureAmount = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"captureAmount",
			itemIndex,
			null
		) as number | null;

		const body: any = {
			capture: true,
		};

		// Se for capture parcial, precisa do amount
		if (captureAmount !== null && captureAmount !== undefined) {
			const amount = normalizeNumericValue(captureAmount);
			if (amount > 0) {
				body.transaction_amount = amount;
			}
		}

		const headers: Record<string, string> = {};
		const idempotencyKey = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"idempotencyKey",
			itemIndex,
			`capture_${Date.now()}_${Math.random().toString(36).substring(7)}`
		) as string;
		headers["X-Idempotency-Key"] = idempotencyKey;

		const url = buildUrl("/v1/payments/:paymentId", { paymentId });
		return await apiRequest.call(executeFunctions, "PUT", url, body, undefined, headers);
	}

	private async cancelPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Payment> {
		const paymentId = executeFunctions.getNodeParameter("paymentId", itemIndex) as string;

		if (!paymentId) {
			throw new Error("ID do pagamento é obrigatório");
		}

		const body = {
			status: "cancelled",
		};

		const headers: Record<string, string> = {};
		const idempotencyKey = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"idempotencyKey",
			itemIndex,
			`cancel_${Date.now()}_${Math.random().toString(36).substring(7)}`
		) as string;
		headers["X-Idempotency-Key"] = idempotencyKey;

		const url = buildUrl("/v1/payments/:paymentId", { paymentId });
		return await apiRequest.call(executeFunctions, "PUT", url, body, undefined, headers);
	}
}

