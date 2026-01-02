import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials, Subscription } from "../types";
import { IResourceHandler } from "./ResourceHandler";
import {
  cleanDocument,
  getDocumentType,
  validateEmail,
  getNodeParameterSafe,
} from "../helpers";
import { makeAuthenticatedRequest } from "../utils/requestHelper";

export class SubscriptionsResource implements IResourceHandler {
  async handleOperation(
    executeFunctions: IExecuteFunctions,
    operation: string,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    switch (operation) {
      case "create":
        return await this.createSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "get":
        return await this.getSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "pause":
        return await this.pauseSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "resume":
        return await this.resumeSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "cancel":
        return await this.cancelSubscription(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "list":
        return await this.listSubscriptions(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      default:
        throw new Error(
          `Operação de assinatura "${operation}" não é suportada. ` +
          `Operações disponíveis: create, get, pause, resume, cancel, list. ` +
          `Consulte a documentação: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/`
        );
    }
  }

  private async createSubscription(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Subscription> {
    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:70",
        message: "createSubscription: entry",
        data: { baseUrl: baseUrl },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion
    let planId: string;
    let payerEmail: string;

    try {
      planId = executeFunctions.getNodeParameter("planId", itemIndex) as string;
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || '';
      if (
        errorMessage.includes('could not get parameter') ||
        errorMessage.includes('bad request') ||
        errorMessage.includes('parameter') ||
        errorMessage.includes('not found')
      ) {
        throw new Error(
          "ID do Plano (planId) é obrigatório. " +
          "Verifique se o campo 'ID do Plano' está preenchido corretamente no nó. " +
          "Se estiver usando expressões como {{ $json.body.planId }}, verifique se o valor está sendo resolvido corretamente. " +
          "Detalhes: " + (error?.message || 'Parâmetro não encontrado')
        );
      }
      throw error;
    }

    try {
      payerEmail = executeFunctions.getNodeParameter("payerEmail", itemIndex) as string;
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || '';
      if (
        errorMessage.includes('could not get parameter') ||
        errorMessage.includes('bad request') ||
        errorMessage.includes('parameter') ||
        errorMessage.includes('not found')
      ) {
        throw new Error(
          "E-mail do Pagador (payerEmail) é obrigatório. " +
          "Verifique se o campo 'E-mail do Pagador' está preenchido corretamente no nó. " +
          "Se estiver usando expressões como {{ $json.body.payerEmail }}, verifique se o valor está sendo resolvido corretamente. " +
          "Detalhes: " + (error?.message || 'Parâmetro não encontrado')
        );
      }
      throw error;
    }

    // Validação explícita de campos obrigatórios
    if (!planId || (typeof planId === 'string' && planId.trim() === '')) {
      throw new Error(
        "ID do Plano (planId) é obrigatório e não pode estar vazio. " +
        "Verifique se o campo 'ID do Plano' está preenchido corretamente no nó ou se a expressão {{ $json.body.planId }} está retornando um valor válido."
      );
    }

    if (!payerEmail || (typeof payerEmail === 'string' && payerEmail.trim() === '')) {
      throw new Error(
        "E-mail do Pagador (payerEmail) é obrigatório e não pode estar vazio. " +
        "Verifique se o campo 'E-mail do Pagador' está preenchido corretamente no nó ou se a expressão {{ $json.body.payerEmail }} está retornando um valor válido."
      );
    }

    // Usar getNodeParameterSafe para campos opcionais
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

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:120",
        message: "createSubscription: parameters retrieved",
        data: {
          planId: planId,
          payerEmail: payerEmail,
          payerDocument: payerDocument,
          startDate: startDate,
          trialPeriodDays: trialPeriodDays,
          cardTokenId: cardTokenId ? "provided" : "not provided",
          subscriptionStatus: subscriptionStatus,
          backUrl: backUrl || "not provided",
          reason: reason || "not provided",
          externalReference: externalReference || "not provided",
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion

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
      
      // Log de debug (sem expor token completo)
      // #region agent log
      fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "SubscriptionsResource.ts:267",
          message: "createSubscription: token validated",
          data: {
            tokenLength: trimmedToken.length,
            tokenPreview: trimmedToken.substring(0, 10) + "...",
            environment: baseUrl.includes("sandbox") ? "sandbox" : "production",
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "D",
        }),
      }).catch(() => {});
      // #endregion
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

    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:186",
        message: "createSubscription: body prepared",
        data: { 
          body: JSON.stringify(body), 
          hasCardToken: !!body.card_token_id,
          status: body.status,
          hasBackUrl: !!body.back_url,
          bodyKeys: Object.keys(body),
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion

    // Log de ambiente antes de fazer a requisição
    // #region agent log
    const accessTokenEnvironment = baseUrl.includes("sandbox") ? "sandbox" : "production";
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "SubscriptionsResource.ts:336",
        message: "createSubscription: environment check",
        data: {
          accessTokenEnvironment: accessTokenEnvironment,
          baseUrl: baseUrl,
          hasCardToken: !!body.card_token_id,
          tokenPreview: body.card_token_id ? body.card_token_id.substring(0, 10) + "..." : "none",
          planId: planId,
          payerEmail: payerEmail,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "D",
      }),
    }).catch(() => {});
    // #endregion

    try {
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "POST",
          url: `${baseUrl}/preapproval`,
          body,
        }
      );
      // #region agent log
      fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "SubscriptionsResource.ts:202",
          message: "createSubscription: response received",
          data: {
            responseId: response?.id,
            hasInitPoint: !!(response?.init_point || response?.sandbox_init_point),
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "C",
        }),
      }).catch(() => {});
      // #endregion
      return response as Subscription;
    } catch (error: any) {
      // #region agent log
      fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "SubscriptionsResource.ts:216",
          message: "createSubscription: error caught",
          data: {
            error: error?.message,
            errorData: error?.response?.data,
            hasCardToken: !!body.card_token_id,
            errorStatus: error?.response?.status,
            bodyRequested: JSON.stringify(body),
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "E",
        }),
      }).catch(() => {});
      // #endregion

      // Tratamento de erros específicos com mensagens melhoradas
      const errorData = error?.response?.data || {};
      const errorCode = errorData.error || '';
      const errorMessage = errorData.message || error?.message || "Erro desconhecido";
      const errorStatus = error?.response?.status;
      const errorContext = `[Criar Assinatura | PlanId: ${planId} | PayerEmail: ${payerEmail} | Status: ${body.status || subscriptionStatus} | HTTP: ${errorStatus || 'N/A'}]`;

      // Log de debug com detalhes completos do erro
      // #region agent log
      fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "SubscriptionsResource.ts:379",
          message: "createSubscription: error details",
          data: {
            errorCode: errorCode,
            errorMessage: errorMessage,
            errorStatus: errorStatus,
            hasCardToken: !!body.card_token_id,
            environment: baseUrl.includes("sandbox") ? "sandbox" : "production",
            errorDataKeys: Object.keys(errorData),
            fullErrorData: errorData,
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "E",
        }),
      }).catch(() => {});
      // #endregion

      // Tratamento específico para CC_VAL_433 (validação de cartão falhou)
      if (
        errorCode === 'CC_VAL_433' || 
        errorMessage.includes('CC_VAL_433') || 
        errorMessage.includes('Credit card validation has failed')
      ) {
        const currentEnvironment = baseUrl.includes("sandbox") ? "sandbox" : "produção";
        throw new Error(
          `${errorContext} Erro de validação de cartão (CC_VAL_433): ${errorMessage}. ` +
          `Possíveis causas: ` +
          `1. Token do cartão expirado ou já usado (tokens são de uso único e têm validade curta). ` +
          `2. ⚠️ INCOMPATIBILIDADE DE AMBIENTE: Token gerado com PUBLIC_KEY de um ambiente (sandbox/produção) ` +
          `   mas Access Token está em ambiente diferente. ` +
          `   Verifique: PUBLIC_KEY e Access Token DEVEM estar no mesmo ambiente. ` +
          `   Ambiente atual do Access Token: ${currentEnvironment}. ` +
          `3. Access Token sem permissões adequadas ou incorreto. ` +
          `4. Token não válido para assinaturas (gerado via API em vez de frontend CardForm). ` +
          `Solução: ` +
          `- Verifique se a PUBLIC_KEY usada no frontend está no mesmo ambiente do Access Token. ` +
          `- Gere um novo token no frontend usando CardForm do Mercado Pago. ` +
          `- Certifique-se de que PUBLIC_KEY e Access Token estão ambos em "${currentEnvironment}". ` +
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
      // Verificar se o erro 401/403 é realmente de autenticação ou se é um erro de validação mascarado
      if ((errorStatus === 401 || errorStatus === 403) && !errorCode.includes('CC_VAL') && !errorMessage.includes('CC_VAL')) {
        // Verificar se há informações sobre ambiente no erro
        const environment = baseUrl.includes("sandbox") ? "sandbox" : "produção";
        const environmentMismatch = 
          (errorMessage.includes("sandbox") && environment === "produção") ||
          (errorMessage.includes("production") && environment === "sandbox");
        
        let authErrorMessage = `${errorContext} Erro de autenticação: Verifique suas credenciais do Mercado Pago (Access Token). `;
        
        if (environmentMismatch) {
          authErrorMessage += `⚠️ Possível incompatibilidade de ambiente: Access Token pode estar em ambiente diferente do esperado. `;
        }
        
        authErrorMessage += `Certifique-se de estar usando o token correto para o ambiente (${environment}). `;
        
        // Verificar se o token do cartão foi fornecido e pode estar causando o problema
        if (body.card_token_id) {
          authErrorMessage += `Nota: Se você está usando um token de cartão, verifique se ele foi gerado no mesmo ambiente (${environment}). `;
        }
        
        authErrorMessage += `Erro da API (${errorStatus}): ${errorMessage}`;
        
        throw new Error(authErrorMessage);
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
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
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
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "GET",
          url: `${baseUrl}/preapproval/${subscriptionId}`,
        }
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
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
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
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "PUT",
          url: `${baseUrl}/preapproval/${subscriptionId}`,
          body: {
            status: "paused",
          },
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
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
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
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "PUT",
          url: `${baseUrl}/preapproval/${subscriptionId}`,
          body: {
            status: "authorized",
          },
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
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
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
      const response = await makeAuthenticatedRequest(
        executeFunctions,
        credentials,
        {
          method: "PUT",
          url: `${baseUrl}/preapproval/${subscriptionId}`,
          body: {
            status: "cancelled",
          },
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
    _itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/preapproval/search`,
      }
    );

    return response;
  }
}

