import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest } from "../GenericFunctions";
import {
	cleanDocument,
	getDocumentType,
	validateEmail,
	getNodeParameterSafe,
} from "../helpers";
import { Subscription } from "../types";

export class SubscriptionsResource implements IResourceHandler {
	operations = ["create", "get", "pause", "resume", "cancel", "list"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createSubscription(executeFunctions, itemIndex);
			case "get":
				return await this.getSubscription(executeFunctions, itemIndex);
			case "pause":
				return await this.pauseSubscription(executeFunctions, itemIndex);
			case "resume":
				return await this.resumeSubscription(executeFunctions, itemIndex);
			case "cancel":
				return await this.cancelSubscription(executeFunctions, itemIndex);
			case "list":
				return await this.listSubscriptions(executeFunctions, itemIndex);
			default:
				throw new Error(
					`Operação de assinatura "${operation}" não é suportada. ` +
					`Operações disponíveis: ${this.operations.join(", ")}. ` +
					`Consulte a documentação: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/`
				);
		}
	}

	private async createSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Subscription> {
		// Campos obrigatórios
		let planId: string;
		let payerEmail: string;

		try {
			planId = executeFunctions.getNodeParameter("planId", itemIndex) as string;
		} catch (error: any) {
			const errorMessage = error?.message?.toLowerCase() || '';
			if (
				errorMessage.includes("not found") ||
				errorMessage.includes("required") ||
				errorMessage.includes("obrigatório")
			) {
				throw new Error(
					"ID do Plano (planId) é obrigatório para criar uma assinatura. " +
					"Configure o campo 'ID do Plano' no n8n. " +
					"Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post"
				);
			}
			throw error;
		}

		try {
			payerEmail = executeFunctions.getNodeParameter("payerEmail", itemIndex) as string;
		} catch (error: any) {
			const errorMessage = error?.message?.toLowerCase() || '';
			if (
				errorMessage.includes("not found") ||
				errorMessage.includes("required") ||
				errorMessage.includes("obrigatório")
			) {
				throw new Error(
					"E-mail do Pagador (payerEmail) é obrigatório para criar uma assinatura. " +
					"Configure o campo 'E-mail do Pagador' no n8n. " +
					"Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post"
				);
			}
			throw error;
		}

		if (!planId || planId.trim() === "") {
			throw new Error(
				"ID do Plano (planId) é obrigatório. " +
				"Forneça o ID do plano que deseja associar à assinatura. " +
				"Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post"
			);
		}

		// Campos opcionais
		const payerDocument = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"payerDocument",
			itemIndex,
			""
		) as string;

		const startDate = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"startDate",
			itemIndex,
			""
		) as string;

		const trialPeriodDays = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"trialPeriodDays",
			itemIndex,
			0
		) as number;

		const cardTokenId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"cardTokenId",
			itemIndex,
			""
		) as string;

		const subscriptionStatus = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"subscriptionStatus",
			itemIndex,
			"pending"
		) as string;

		const backUrl = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"backUrl",
			itemIndex,
			""
		) as string;

		const reason = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"reason",
			itemIndex,
			""
		) as string;

		const externalReference = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"externalReference",
			itemIndex,
			""
		) as string;

		if (!validateEmail(payerEmail)) {
			throw new Error(
				"E-mail do pagador inválido. " +
				"O campo 'payer_email' é obrigatório conforme a documentação oficial do Mercado Pago. " +
				"Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post"
			);
		}

		const body: any = {
			preapproval_plan_id: planId,
			payer_email: payerEmail,
		};

		if (reason && reason.trim() !== "") {
			body.reason = reason.trim();
		}

		if (externalReference && externalReference.trim() !== "") {
			body.external_reference = externalReference.trim();
		}

		if (backUrl && backUrl.trim() !== "") {
			body.back_url = backUrl.trim();
		}

		// Validação: Se status é "authorized", card_token_id é obrigatório
		if (subscriptionStatus === "authorized" && (!cardTokenId || cardTokenId.trim() === "")) {
			throw new Error(
				"Para criar uma assinatura com status 'authorized', é obrigatório fornecer um Token do Cartão (card_token_id). " +
				"⚠️ IMPORTANTE: O token DEVE ser gerado no FRONTEND usando CardForm do Mercado Pago. " +
				"Tokens gerados via API (/v1/card_tokens) NÃO funcionam para assinaturas. " +
				"Veja: docs/FLUXO_ASSINATURA_FRONTEND.md para implementação completa. " +
				"Alternativamente, crie a assinatura com status 'pending' (sem card_token_id) e receberá um init_point para checkout. " +
				"Referência oficial: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post"
			);
		}

		// Se card_token_id foi fornecido, usar status "authorized"
		// Se não foi fornecido, NÃO enviar status (deixa API decidir) ou usar "pending"
		if (cardTokenId && cardTokenId.trim() !== "") {
			// Validação básica do token
			const trimmedToken = cardTokenId.trim();
			if (trimmedToken.length < 10) {
				throw new Error(
					"Token do cartão inválido: token muito curto. " +
					"O token deve ter pelo menos 10 caracteres. " +
					"Certifique-se de que o token foi gerado corretamente no frontend usando CardForm do Mercado Pago."
				);
			}

			body.card_token_id = trimmedToken;
			body.status = "authorized";
		} else {
			// Sem card_token_id, não enviar status explicitamente
			// A API criará automaticamente com status "pending" e retornará init_point
			// Só envia status se explicitamente solicitado como "pending"
			if (subscriptionStatus === "pending") {
				// Não enviar status, deixar API decidir
				// body.status não é definido quando não há token
			}
		}

		if (payerDocument && payerDocument.trim() !== "") {
			const docType = getDocumentType(payerDocument);
			if (!docType) {
				throw new Error(
					"CPF/CNPJ inválido. " +
					"Forneça um CPF (11 dígitos) ou CNPJ (14 dígitos) válido, apenas com números. " +
					"Exemplo: CPF '12345678909' ou CNPJ '12345678000190'"
				);
			}
			body.payer = {
				identification: {
					type: docType,
					number: cleanDocument(payerDocument),
				},
			};
		}

		if (startDate && startDate.trim() !== "") {
			body.start_date = new Date(startDate).toISOString();
		}

		if (trialPeriodDays && trialPeriodDays > 0) {
			body.trial_period_days = trialPeriodDays;
		}

		try {
			const response = await apiRequest.call(
				executeFunctions,
				"POST",
				"preapproval",
				body
			);
			return response as Subscription;
		} catch (error: any) {
			// Tratamento de erros específicos com mensagens melhoradas
			const errorData = error?.response?.data || {};
			const errorCode = errorData.error || '';
			const errorMessage = errorData.message || error?.message || "Erro desconhecido";
			const errorStatus = error?.response?.status;
			const errorContext = `[Criar Assinatura | PlanId: ${planId} | PayerEmail: ${payerEmail} | Status: ${body.status || subscriptionStatus} | HTTP: ${errorStatus || 'N/A'}]`;

			// Tratamento específico para CC_VAL_433 (validação de cartão falhou)
			if (
				errorCode === 'CC_VAL_433' ||
				errorMessage.includes('CC_VAL_433') ||
				errorMessage.includes('Credit card validation has failed')
			) {
				throw new Error(
					`${errorContext} Erro de validação de cartão (CC_VAL_433): ${errorMessage}. ` +
					`Possíveis causas: ` +
					`1. Token do cartão expirado ou já usado (tokens são de uso único e têm validade curta). ` +
					`2. ⚠️ INCOMPATIBILIDADE DE AMBIENTE: Token gerado com PUBLIC_KEY de um ambiente (sandbox/produção) ` +
					`   mas Access Token está em ambiente diferente. ` +
					`   Verifique: PUBLIC_KEY e Access Token DEVEM estar no mesmo ambiente. ` +
					`3. Access Token sem permissões adequadas ou incorreto. ` +
					`4. Token não válido para assinaturas (gerado via API em vez de frontend CardForm). ` +
					`Solução: ` +
					`- Verifique se a PUBLIC_KEY usada no frontend está no mesmo ambiente do Access Token. ` +
					`- Gere um novo token no frontend usando CardForm do Mercado Pago. ` +
					`- Certifique-se de que PUBLIC_KEY e Access Token estão no mesmo ambiente. ` +
					`Veja: docs/FLUXO_ASSINATURA_FRONTEND.md. ` +
					`Erro da API: ${errorMessage} (Status HTTP: ${errorStatus || 'N/A'})`
				);
			}

			// Tratamento específico para "User cards api internal server error"
			if (
				errorMessage.includes('User cards api internal server error') ||
				errorMessage.includes('internal server error')
			) {
				throw new Error(
					`${errorContext} Erro interno da API de cartões do Mercado Pago: ${errorMessage}. ` +
					`Possíveis causas: ` +
					`1. Token do cartão expirado ou inválido. ` +
					`2. Problemas temporários na API do Mercado Pago. ` +
					`3. Token gerado em ambiente diferente do Access Token. ` +
					`Solução: Gere um novo token no frontend e tente novamente. ` +
					`Erro da API: ${errorMessage} (Status HTTP: ${errorStatus || 'N/A'})`
				);
			}

			// Erro sobre card_token_id - especialmente "Card token service not found"
			if (errorMessage.includes("Card token service not found") || errorMessage.includes("card token service")) {
				throw new Error(
					`${errorContext} Erro ao criar assinatura: Token do cartão inválido para assinaturas. ` +
					`Tokens gerados via API (/v1/card_tokens) NÃO funcionam para assinaturas e são sempre recusados. ` +
					`O token DEVE ser gerado no FRONTEND usando CardForm do Mercado Pago (Checkout Transparente). ` +
					`Veja: docs/FLUXO_ASSINATURA_FRONTEND.md para implementação completa. ` +
					`Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post ` +
					`Erro da API: ${errorMessage} (Status HTTP: ${errorStatus || 'N/A'})`
				);
			}

			// Erro sobre card_token_id (outros casos)
			if (errorMessage.includes("card_token_id") || errorMessage.includes("card token")) {
				throw new Error(
					`${errorContext} Erro ao criar assinatura: Token do Cartão (card_token_id) é obrigatório para status "authorized". ` +
					`O token DEVE ser obtido no FRONTEND usando CardForm do Mercado Pago (Checkout Transparente). ` +
					`Tokens gerados via API não funcionam. Veja: docs/FLUXO_ASSINATURA_FRONTEND.md ` +
					`Alternativa: Crie a assinatura com status "pending" (sem card_token_id) para receber um init_point. ` +
					`Erro da API: ${errorMessage} (Status HTTP: ${errorStatus || 'N/A'})`
				);
			}

			// Erro sobre campos obrigatórios
			if (errorMessage.includes("payer_email") || errorMessage.includes("email")) {
				throw new Error(
					`${errorContext} Erro ao criar assinatura: E-mail do pagador (payer_email) é obrigatório. ` +
					`Forneça um e-mail válido. ` +
					`Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post ` +
					`Erro da API: ${errorMessage}`
				);
			}

			// Erro sobre plano
			if (errorMessage.includes("plan") || errorMessage.includes("preapproval_plan_id")) {
				throw new Error(
					`${errorContext} Erro ao criar assinatura: ID do plano inválido ou não encontrado. ` +
					`Verifique se o planId (${planId}) está correto e se o plano existe. ` +
					`Erro da API: ${errorMessage}`
				);
			}

			// Erro de autenticação (após verificar que não é erro de validação de cartão)
			if ((errorStatus === 401 || errorStatus === 403) && !errorCode.includes('CC_VAL') && !errorMessage.includes('CC_VAL')) {
				throw new Error(
					`${errorContext} Erro de autenticação: Verifique suas credenciais do Mercado Pago (Access Token). ` +
					`Certifique-se de estar usando o token correto. ` +
					`Nota: Se você está usando um token de cartão, verifique se ele foi gerado no mesmo ambiente. ` +
					`Erro da API (${errorStatus}): ${errorMessage}`
				);
			}

			// Adiciona detalhes de causas se disponíveis
			const causeDetails = error?.response?.data?.cause && Array.isArray(error.response.data.cause) && error.response.data.cause.length > 0
				? ` | Causas: ${error.response.data.cause.map((c: any) => c.description || c.message || c.code).join('; ')}`
				: '';

			// Erro genérico com referência à documentação
			throw new Error(
				`${errorContext} Erro ao criar assinatura: ${errorMessage}${causeDetails}. ` +
				`Consulte a documentação oficial: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post`
			);
		}
	}

	private async getSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Subscription> {
		const subscriptionId = executeFunctions.getNodeParameter(
			"subscriptionId",
			itemIndex
		) as string;

		if (!subscriptionId || subscriptionId.trim() === "") {
			throw new Error(
				"ID da assinatura é obrigatório. " +
				"Forneça o ID da assinatura que deseja consultar. " +
				"Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/get"
			);
		}

		try {
			const response = await apiRequest.call(
				executeFunctions,
				"GET",
				`preapproval/${subscriptionId}`
			);
			return response as Subscription;
		} catch (error: any) {
			const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
			const errorStatus = error?.response?.status;

			if (errorStatus === 404) {
				throw new Error(
					`Assinatura não encontrada. Verifique se o ID "${subscriptionId}" está correto. ` +
					`Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/get`
				);
			}

			throw new Error(
				`Erro ao consultar assinatura: ${errorMessage} ` +
				`(Status HTTP: ${errorStatus || 'N/A'}). ` +
				`Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/get`
			);
		}
	}

	private async pauseSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Subscription> {
		const subscriptionId = executeFunctions.getNodeParameter(
			"subscriptionId",
			itemIndex
		) as string;

		if (!subscriptionId || subscriptionId.trim() === "") {
			throw new Error(
				"ID da assinatura é obrigatório para pausar. " +
				"Forneça o ID da assinatura que deseja pausar."
			);
		}

		try {
			const response = await apiRequest.call(
				executeFunctions,
				"PUT",
				`preapproval/${subscriptionId}`,
				{
					status: "paused",
				}
			);
			return response as Subscription;
		} catch (error: any) {
			const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
			throw new Error(
				`Erro ao pausar assinatura: ${errorMessage}. ` +
				`Verifique se a assinatura existe e está em um status que permite pausa. ` +
				`Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/put`
			);
		}
	}

	private async resumeSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Subscription> {
		const subscriptionId = executeFunctions.getNodeParameter(
			"subscriptionId",
			itemIndex
		) as string;

		if (!subscriptionId || subscriptionId.trim() === "") {
			throw new Error(
				"ID da assinatura é obrigatório para retomar. " +
				"Forneça o ID da assinatura que deseja retomar."
			);
		}

		try {
			const response = await apiRequest.call(
				executeFunctions,
				"PUT",
				`preapproval/${subscriptionId}`,
				{
					status: "authorized",
				}
			);
			return response as Subscription;
		} catch (error: any) {
			const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
			throw new Error(
				`Erro ao retomar assinatura: ${errorMessage}. ` +
				`Verifique se a assinatura existe e está pausada. ` +
				`Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/put`
			);
		}
	}

	private async cancelSubscription(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Subscription> {
		const subscriptionId = executeFunctions.getNodeParameter(
			"subscriptionId",
			itemIndex
		) as string;

		if (!subscriptionId || subscriptionId.trim() === "") {
			throw new Error(
				"ID da assinatura é obrigatório para cancelar. " +
				"Forneça o ID da assinatura que deseja cancelar. " +
				"⚠️ Atenção: O cancelamento é irreversível."
			);
		}

		try {
			const response = await apiRequest.call(
				executeFunctions,
				"PUT",
				`preapproval/${subscriptionId}`,
				{
					status: "cancelled",
				}
			);
			return response as Subscription;
		} catch (error: any) {
			const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido";
			throw new Error(
				`Erro ao cancelar assinatura: ${errorMessage}. ` +
				`Verifique se a assinatura existe e pode ser cancelada. ` +
				`⚠️ Atenção: O cancelamento é irreversível. ` +
				`Referência: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval_id/put`
			);
		}
	}

	private async listSubscriptions(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number
	): Promise<any> {
		const response = await apiRequest.call(
			executeFunctions,
			"GET",
			"preapproval/search"
		);
		return response;
	}
}

