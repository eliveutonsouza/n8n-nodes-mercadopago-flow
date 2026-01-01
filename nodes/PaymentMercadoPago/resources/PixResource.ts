import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials, Payment } from "../types";
import { IResourceHandler } from "./ResourceHandler";
import {
  normalizeNumericValue,
  cleanDocument,
  getDocumentType,
  validateEmail,
  getNodeParameterSafe,
} from "../helpers";
import { makeAuthenticatedRequest } from "../utils/requestHelper";

export class PixResource implements IResourceHandler {
  async handleOperation(
    executeFunctions: IExecuteFunctions,
    operation: string,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PixResource.ts:14',message:'handleOperation: entry',data:{operation:operation,baseUrl:baseUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    switch (operation) {
      case "create":
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PixResource.ts:23',message:'handleOperation: calling createPixPayment',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        return await this.createPixPayment(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "get":
        return await this.getPixPayment(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      case "refund":
        return await this.refundPixPayment(
          executeFunctions,
          itemIndex,
          baseUrl,
          credentials
        );
      default:
        throw new Error(`Operação PIX "${operation}" não é suportada`);
    }
  }

  private async createPixPayment(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Payment> {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PixResource.ts:54',message:'createPixPayment: entry',data:{baseUrl:baseUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    // Normaliza valores numéricos (converte vírgula para ponto)
    const amountRaw = executeFunctions.getNodeParameter(
      "amount",
      itemIndex
    ) as number | string;
    const amount = normalizeNumericValue(amountRaw);
    const description = executeFunctions.getNodeParameter(
      "description",
      itemIndex
    ) as string;
    const payerEmail = executeFunctions.getNodeParameter(
      "payerEmail",
      itemIndex
    ) as string;
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PixResource.ts:72',message:'createPixPayment: parameters retrieved',data:{amount:amount,description:description,payerEmail:payerEmail},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    // Usar getNodeParameterSafe para campos opcionais
    const payerDocument = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "payerDocument",
      itemIndex,
      ""
    ) as string;
    const payerName = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "payerName",
      itemIndex,
      ""
    ) as string;
    const expirationDate = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "expirationDate",
      itemIndex,
      ""
    ) as string;
    const externalReference = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "externalReference",
      itemIndex,
      ""
    ) as string;
    const idempotencyKey = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "idempotencyKey",
      itemIndex,
      ""
    ) as string;

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

    if (payerName) {
      const nameParts = payerName.trim().split(" ");
      body.payer.first_name = nameParts[0] || "";
      body.payer.last_name = nameParts.slice(1).join(" ") || "";
    }

    if (expirationDate) {
      body.date_of_expiration = new Date(expirationDate).toISOString();
    }

    if (externalReference) {
      body.external_reference = externalReference;
    }

    const headers: any = {};

    if (idempotencyKey && idempotencyKey.trim() !== "") {
      headers["X-Idempotency-Key"] = idempotencyKey;
    }

    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PixResource.ts:162',message:'createPixPayment: before request',data:{url:`${baseUrl}/v1/payments`,bodyKeys:Object.keys(body)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "POST",
        url: `${baseUrl}/v1/payments`,
        body,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      }
    );
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PixResource.ts:173',message:'createPixPayment: response received',data:{responseId:response?.id,responseStatus:response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    return response as Payment;
  }

  private async getPixPayment(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<Payment> {
    const paymentId = executeFunctions.getNodeParameter(
      "paymentId",
      itemIndex
    ) as string;

    if (!paymentId) {
      throw new Error("ID do pagamento é obrigatório");
    }

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "GET",
        url: `${baseUrl}/v1/payments/${paymentId}`,
      }
    );

    return response as Payment;
  }

  private async refundPixPayment(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any> {
    const paymentId = executeFunctions.getNodeParameter(
      "paymentId",
      itemIndex
    ) as string;

    // Usar getNodeParameterSafe para campo opcional
    const refundAmount = getNodeParameterSafe(
      executeFunctions.getNodeParameter.bind(executeFunctions),
      "refundAmount",
      itemIndex,
      0
    ) as number;

    if (!paymentId) {
      throw new Error("ID do pagamento é obrigatório");
    }

    const body: any = {};

    // NOTA: A API do Mercado Pago espera amount em formato decimal (não centavos)
    if (refundAmount && refundAmount > 0) {
      body.amount = normalizeNumericValue(refundAmount);
    }

    const response = await makeAuthenticatedRequest(
      executeFunctions,
      credentials,
      {
        method: "POST",
        url: `${baseUrl}/v1/payments/${paymentId}/refunds`,
        body: Object.keys(body).length > 0 ? body : undefined,
      }
    );

    return response;
  }
}

