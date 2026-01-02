import { IExecuteFunctions } from "n8n-workflow";
import { MercadoPagoCredentials } from "../types";

/**
 * Interface comum para handlers de recursos
 */
export interface IResourceHandler {
  handleOperation(
    executeFunctions: IExecuteFunctions,
    operation: string,
    itemIndex: number,
    baseUrl: string,
    credentials: MercadoPagoCredentials
  ): Promise<any>;
}

