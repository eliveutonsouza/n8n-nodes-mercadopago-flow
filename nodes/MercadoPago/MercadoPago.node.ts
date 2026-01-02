import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from "n8n-workflow";

import { normalizeResponse } from "./utils/responseNormalizer";
import { IResourceHandler } from "./resources/ResourceHandler";
import { PaymentsResource } from "./resources/PaymentsResource";
import { CustomersResource } from "./resources/CustomersResource";
import { CardsResource } from "./resources/CardsResource";
import { PreferencesResource } from "./resources/PreferencesResource";
import { QROrdersResource } from "./resources/QROrdersResource";
import { POSResource } from "./resources/POSResource";
import { StoresResource } from "./resources/StoresResource";
import { ChargebacksResource } from "./resources/ChargebacksResource";
import { OAuthResource } from "./resources/OAuthResource";
import { PaymentMethodsResource } from "./resources/PaymentMethodsResource";
import { IdentificationTypesResource } from "./resources/IdentificationTypesResource";
import { PixResource } from "./resources/PixResource";
import { PlansResource } from "./resources/PlansResource";
import { SubscriptionsResource } from "./resources/SubscriptionsResource";
import { WebhooksResource } from "./resources/WebhooksResource";
import { getNodeProperties } from "./nodeProperties";
import { handleMercadoPagoError } from "./helpers";

export class MercadoPago implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Mercado Pago",
		name: "mercadoPago",
		icon: "file:mercadopago.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: "Integração completa com a API do Mercado Pago - Pagamentos, Assinaturas, PIX, QR Code, Clientes, Cartões e muito mais",
		defaults: {
			name: "Mercado Pago",
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "mercadoPagoApi",
				required: true,
			},
		],
		properties: getNodeProperties(),
	};

	private static getResourceHandler(resource: string): IResourceHandler | undefined {
		const handlers: Map<string, IResourceHandler> = new Map<string, IResourceHandler>([
			["payments", new PaymentsResource()],
			["customers", new CustomersResource()],
			["cards", new CardsResource()],
			["preferences", new PreferencesResource()],
			["qrOrders", new QROrdersResource()],
			["pos", new POSResource()],
			["stores", new StoresResource()],
			["chargebacks", new ChargebacksResource()],
			["oauth", new OAuthResource()],
			["paymentMethods", new PaymentMethodsResource()],
			["identificationTypes", new IdentificationTypesResource()],
			["pix", new PixResource()],
			["plans", new PlansResource()],
			["subscriptions", new SubscriptionsResource()],
			["webhooks", new WebhooksResource()],
		]);
		return handlers.get(resource);
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				let resource: string;
				let operation: string;

				try {
					resource = this.getNodeParameter("resource", i) as string;
					operation = this.getNodeParameter("operation", i) as string;
				} catch (error: any) {
					if (error?.message?.includes("Could not get parameter")) {
						throw new Error(
							`Erro ao obter parâmetros do node. Verifique se os campos "Resource" e "Operation" estão preenchidos corretamente. ` +
							`Detalhes: ${error.message}`
						);
					}
					throw error;
				}

				const handler = MercadoPago.getResourceHandler(resource);
				if (!handler) {
					throw new Error(`Resource "${resource}" não é suportado. Recursos disponíveis: payments, customers, cards, preferences, qrOrders, pos, stores, chargebacks, oauth, paymentMethods, identificationTypes, pix, plans, subscriptions, webhooks`);
				}

				let responseData: any;

				try {
					responseData = await handler.execute(this, operation, resource);
				} catch (handlerError: any) {
					const errorStatus = handlerError?.response?.status || handlerError?.statusCode || 'N/A';
					const errorResponseData = handlerError?.response?.data || {};
					const errorContext = `[Resource: ${resource}, Operation: ${operation}, Item: ${i}, HTTP Status: ${errorStatus}]`;
					
					const errorMessageLower = handlerError?.message?.toLowerCase() || '';
					if (
						errorMessageLower.includes("could not get parameter") ||
						errorMessageLower.includes("bad request") ||
						errorMessageLower.includes("parameter") ||
						handlerError?.message?.includes("obrigatório") ||
						handlerError?.message?.includes("é obrigatório")
					) {
						throw new Error(
							`${errorContext} Erro ao obter parâmetros. ` +
							`Verifique se todos os campos obrigatórios estão preenchidos corretamente. ` +
							`Se estiver usando expressões, verifique se os valores estão sendo resolvidos corretamente. ` +
							`Detalhes: ${handlerError.message}`
						);
					}
					
					const enhancedErrorMessage = handlerError?.message || "Erro desconhecido";
					const apiErrorDetails = errorResponseData.message ? ` | API: ${errorResponseData.message}` : '';
					const causeDetails = errorResponseData.cause && Array.isArray(errorResponseData.cause) && errorResponseData.cause.length > 0
						? ` | Causas: ${errorResponseData.cause.map((c: any) => c.description || c.message || c.code).join('; ')}`
						: '';
					
					throw new Error(
						`${errorContext} ${enhancedErrorMessage}${apiErrorDetails}${causeDetails}`
					);
				}

				const normalized = normalizeResponse(responseData, resource);
				returnData.push({
					json: normalized,
				});
			} catch (error) {
				const errorData = handleMercadoPagoError(error);
				let errorMessage = errorData?.message || (error as any)?.message || "Erro desconhecido";
				
				try {
					const resourceParam = (() => { try { return this.getNodeParameter("resource", i) as string; } catch { return "unknown"; } })();
					const operationParam = (() => { try { return this.getNodeParameter("operation", i) as string; } catch { return "unknown"; } })();
					
					if (resourceParam !== "unknown" || operationParam !== "unknown") {
						const errorContext = `[Resource: ${resourceParam}, Operation: ${operationParam}, Item: ${i}]`;
						if (!errorMessage.includes(errorContext)) {
							errorMessage = `${errorContext} ${errorMessage}`;
						}
					}
				} catch {
					// Ignora erros ao tentar obter contexto adicional
				}
				
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							status: errorData?.status || 500,
							details: errorData || error,
						},
					});
				} else {
					throw new Error(errorMessage);
				}
			}
		}

		return [returnData];
	}
}

