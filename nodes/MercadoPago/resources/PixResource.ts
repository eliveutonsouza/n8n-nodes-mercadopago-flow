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

export class PixResource implements IResourceHandler {
	operations = ["create", "get", "refund"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createPixPayment(executeFunctions, itemIndex);
			case "get":
				return await this.getPixPayment(executeFunctions, itemIndex);
			case "refund":
				return await this.refundPixPayment(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação PIX "${operation}" não é suportada. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createPixPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Payment> {
		// Normaliza valores numéricos (converte vírgula para ponto)
		const amountRaw = executeFunctions.getNodeParameter("amount", itemIndex) as number | string;
		const amount = normalizeNumericValue(amountRaw);
		const description = executeFunctions.getNodeParameter("description", itemIndex) as string;
		const payerEmail = executeFunctions.getNodeParameter("payerEmail", itemIndex) as string;

		// Validações
		if (!validateEmail(payerEmail)) {
			throw new Error("E-mail do pagador inválido");
		}

		if (amount <= 0) {
			throw new Error("Valor do pagamento deve ser maior que zero");
		}

		// NOTA: A API do Mercado Pago espera transaction_amount em formato decimal (não centavos)
		// Exemplo: 49.90 (não 4990)
		const body: any = {
			transaction_amount: amount,
			description,
			payment_method_id: "pix",
			payer: {
				email: payerEmail,
			},
		};

		// Campos opcionais
		const payerDocument = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"payerDocument",
			itemIndex,
			""
		) as string;
		if (payerDocument) {
			const docType = getDocumentType(payerDocument);
			if (!docType) {
				throw new Error(
					"CPF/CNPJ inválido. Deve conter 11 ou 14 dígitos numéricos"
				);
			}
			body.payer.identification = {
				type: docType,
				number: cleanDocument(payerDocument),
			};
		}

		const payerName = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"payerName",
			itemIndex,
			""
		) as string;
		if (payerName) {
			const nameParts = payerName.trim().split(" ");
			body.payer.first_name = nameParts[0] || "";
			body.payer.last_name = nameParts.slice(1).join(" ") || "";
		}

		const expirationDate = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"expirationDate",
			itemIndex,
			""
		) as string;
		if (expirationDate) {
			body.date_of_expiration = new Date(expirationDate).toISOString();
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

		const idempotencyKey = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"idempotencyKey",
			itemIndex,
			`pix_${Date.now()}_${Math.random().toString(36).substring(7)}`
		) as string;

		const headers: Record<string, string> = {};
		if (idempotencyKey && idempotencyKey.trim() !== "") {
			headers["X-Idempotency-Key"] = idempotencyKey;
		}

		return await apiRequest.call(
			executeFunctions,
			"POST",
			"/v1/payments",
			body,
			undefined,
			Object.keys(headers).length > 0 ? headers : undefined
		);
	}

	private async getPixPayment(
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

	private async refundPixPayment(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const paymentId = executeFunctions.getNodeParameter("paymentId", itemIndex) as string;

		if (!paymentId) {
			throw new Error("ID do pagamento é obrigatório");
		}

		const refundAmount = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"refundAmount",
			itemIndex,
			0
		) as number | string;

		const body: any = {};

		// NOTA: A API do Mercado Pago espera amount em formato decimal (não centavos)
		if (refundAmount) {
			const amount = normalizeNumericValue(refundAmount);
			if (amount > 0) {
				body.amount = amount;
			}
		}

		const idempotencyKey = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"idempotencyKey",
			itemIndex,
			`refund_${Date.now()}_${Math.random().toString(36).substring(7)}`
		) as string;

		const headers: Record<string, string> = {
			"X-Idempotency-Key": idempotencyKey,
		};

		const url = buildUrl("/v1/payments/:paymentId/refunds", { paymentId });
		return await apiRequest.call(
			executeFunctions,
			"POST",
			url,
			Object.keys(body).length > 0 ? body : undefined,
			undefined,
			headers
		);
	}
}

