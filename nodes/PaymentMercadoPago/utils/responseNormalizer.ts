import { NormalizedResponse } from "../types";

/**
 * Normaliza a resposta da API do Mercado Pago para um formato padronizado
 */
/**
 * Mapeia o resource do node para o type normalizado
 */
function getResourceType(resource: string): string {
  const typeMap: Record<string, string> = {
    pix: "payment",
    plans: "plan",
    subscriptions: "subscription",
    webhooks: "webhook",
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
      data.date_created || data.created_at || new Date().toISOString(),
    raw: data,
  };

  // Normalização específica por recurso
  switch (resource) {
    case "pix":
      // NOTA: A API do Mercado Pago retorna transaction_amount em formato decimal (não centavos)
      // Exemplo: 49.90 (não 4990), então não precisa dividir por 100
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
      // NOTA: Para planos, a API retorna transaction_amount em formato decimal (não centavos)
      // Exemplo: 10.9 (não 1090), então não precisa dividir por 100
      normalized.amount = data.auto_recurring?.transaction_amount;
      normalized.description = data.reason;
      break;

    case "subscriptions":
      normalized.planId = data.preapproval_plan_id;
      normalized.payerEmail = data.payer_email;
      normalized.startDate = data.start_date;
      normalized.endDate = data.end_date;
      normalized.statusDetail = data.status_detail;
      // Captura init_point se disponível (para checkout quando card_token_id não é fornecido)
      if (data.init_point || data.sandbox_init_point) {
        normalized.url = data.init_point || data.sandbox_init_point;
      }
      break;

    case "webhooks":
      normalized.url = data.url;
      normalized.events = data.events || [];
      normalized.description = data.description;
      break;
  }

  return normalized;
}

