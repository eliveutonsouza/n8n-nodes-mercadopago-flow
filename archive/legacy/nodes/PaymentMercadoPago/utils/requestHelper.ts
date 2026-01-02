import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials } from "../types";

export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  body?: any;
  headers?: Record<string, string>;
  json?: boolean;
}

/**
 * Faz uma requisição autenticada para a API do Mercado Pago
 */
export async function makeAuthenticatedRequest(
  executeFunctions: IExecuteFunctions,
  credentials: MercadoPagoCredentials,
  options: RequestOptions
): Promise<any> {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'requestHelper.ts:15',message:'makeAuthenticatedRequest: entry',data:{method:options.method,url:options.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  const defaultHeaders: Record<string, string> = {
    Authorization: `Bearer ${credentials.accessToken}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'requestHelper.ts:26',message:'makeAuthenticatedRequest: before call',data:{hasBody:!!options.body,bodyKeys:options.body?Object.keys(options.body):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  try {
    const response = await executeFunctions.helpers.requestWithAuthentication.call(
      executeFunctions,
      "paymentMercadoPagoAPI",
      {
        ...options,
        headers: defaultHeaders,
        json: options.json !== false,
      }
    );
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'requestHelper.ts:35',message:'makeAuthenticatedRequest: response received',data:{hasResponse:!!response,responseId:response?.id,responseStatus:response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return response;
  } catch (error: any) {
    // #region agent log
    fetch("http://127.0.0.1:7244/ingest/4b5afbeb-1407-4570-82cb-60bfdb0848f9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "requestHelper.ts:40",
        message: "makeAuthenticatedRequest: error",
        data: {
          error: error?.message,
          statusCode: error?.response?.status,
          errorData: error?.response?.data,
          errorDetails: JSON.stringify(error?.response?.data || {}),
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "E",
      }),
    }).catch(() => {});
    // #endregion
    throw error;
  }
}

