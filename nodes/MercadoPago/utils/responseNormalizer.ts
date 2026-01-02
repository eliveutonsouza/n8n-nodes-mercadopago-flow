import { NormalizedResponse } from "../types";

/**
 * Mapeia o resource do node para o type normalizado
 */
function getResourceType(resource: string): string {
	const typeMap: Record<string, string> = {
		pix: "payment",
		payments: "payment",
		plans: "plan",
		subscriptions: "subscription",
		webhooks: "webhook",
		customers: "customer",
		cards: "card",
		preferences: "preference",
		qrOrders: "order",
		pos: "pos",
		stores: "store",
		chargebacks: "chargeback",
		oauth: "oauth",
		paymentMethods: "payment_method",
		identificationTypes: "identification_type",
	};
	return typeMap[resource] || resource;
}

export function normalizeResponse(
	data: any,
	resource: string
): NormalizedResponse {
	const normalized: NormalizedResponse = {
		provider: "mercado_pago",
		type: getResourceType(resource),
		id: data.id || "",
		status: data.status || "",
		createdAt:
			data.date_created || data.created_at || data.created_date || new Date().toISOString(),
		raw: data,
	};

	// Normalização específica por recurso
	switch (resource) {
		case "pix":
		case "payments":
			normalized.amount = data.transaction_amount;
			normalized.currency = data.currency_id || "BRL";
			normalized.qrCode =
				data.point_of_interaction?.transaction_data?.qr_code;
			normalized.qrCodeBase64 =
				data.point_of_interaction?.transaction_data?.qr_code_base64;
			normalized.description = data.description;
			normalized.payerEmail = data.payer?.email;
			break;

		case "plans":
			normalized.planId = data.id;
			normalized.amount = data.auto_recurring?.transaction_amount;
			normalized.description = data.reason;
			break;

		case "subscriptions":
			normalized.planId = data.preapproval_plan_id;
			normalized.payerEmail = data.payer_email;
			normalized.startDate = data.start_date;
			normalized.endDate = data.end_date;
			normalized.statusDetail = data.status_detail;
			if (data.init_point || data.sandbox_init_point) {
				normalized.url = data.init_point || data.sandbox_init_point;
			}
			break;

		case "webhooks":
			normalized.url = data.url;
			normalized.events = data.events || [];
			normalized.description = data.description;
			break;

		case "customers":
			normalized.payerEmail = data.email;
			normalized.description = `${data.first_name || ""} ${data.last_name || ""}`.trim();
			break;

		case "cards":
			normalized.description = data.payment_method?.name || data.payment_method_id;
			break;

		case "preferences":
			normalized.url = data.init_point || data.sandbox_init_point;
			normalized.description = data.items?.[0]?.title || "";
			break;

		case "qrOrders":
			normalized.amount = data.total_amount;
			normalized.currency = data.currency;
			normalized.description = data.description;
			normalized.statusDetail = data.status_detail;
			break;

		case "pos":
			normalized.description = data.name;
			break;

		case "stores":
			normalized.description = data.name;
			break;

		case "chargebacks":
			normalized.amount = data.amount;
			normalized.currency = data.currency_id;
			normalized.statusDetail = data.status_detail;
			break;
	}

	return normalized;
}

