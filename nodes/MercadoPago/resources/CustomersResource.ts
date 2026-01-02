import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest, buildUrl } from "../GenericFunctions";
import {
	cleanDocument,
	getDocumentType,
	validateEmail,
	getNodeParameterSafe,
} from "../helpers";
import { Customer } from "../types";

export class CustomersResource implements IResourceHandler {
	operations = ["create", "get", "update", "delete", "list", "search"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createCustomer(executeFunctions, itemIndex);
			case "get":
				return await this.getCustomer(executeFunctions, itemIndex);
			case "update":
				return await this.updateCustomer(executeFunctions, itemIndex);
			case "delete":
				return await this.deleteCustomer(executeFunctions, itemIndex);
			case "list":
				return await this.listCustomers(executeFunctions, itemIndex);
			case "search":
				return await this.searchCustomers(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação "${operation}" não é suportada para Customers. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createCustomer(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Customer> {
		const email = executeFunctions.getNodeParameter("email", itemIndex) as string;

		if (!validateEmail(email)) {
			throw new Error("Email inválido");
		}

		const body: any = {
			email,
		};

		// Campos opcionais
		const firstName = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"firstName",
			itemIndex,
			""
		) as string;
		if (firstName) {
			body.first_name = firstName;
		}

		const lastName = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"lastName",
			itemIndex,
			""
		) as string;
		if (lastName) {
			body.last_name = lastName;
		}

		// Phone
		const phoneAreaCode = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"phoneAreaCode",
			itemIndex,
			""
		) as string;
		const phoneNumber = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"phoneNumber",
			itemIndex,
			""
		) as string;
		if (phoneAreaCode || phoneNumber) {
			body.phone = {};
			if (phoneAreaCode) body.phone.area_code = phoneAreaCode;
			if (phoneNumber) body.phone.number = phoneNumber;
		}

		// Identification
		const identificationType = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"identificationType",
			itemIndex,
			""
		) as string;
		const identificationNumber = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"identificationNumber",
			itemIndex,
			""
		) as string;
		if (identificationNumber) {
			const cleanDoc = cleanDocument(identificationNumber);
			const docType = identificationType || getDocumentType(identificationNumber);
			if (docType) {
				body.identification = {
					type: docType,
					number: cleanDoc,
				};
			} else if (identificationType) {
				body.identification = {
					type: identificationType,
					number: cleanDoc,
				};
			}
		}

		// Address
		const addressZipCode = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"addressZipCode",
			itemIndex,
			""
		) as string;
		const addressStreetName = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"addressStreetName",
			itemIndex,
			""
		) as string;
		const addressStreetNumber = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"addressStreetNumber",
			itemIndex,
			null
		) as number | null;
		const addressCity = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"addressCity",
			itemIndex,
			""
		) as string;

		if (addressZipCode || addressStreetName || addressStreetNumber || addressCity) {
			body.address = {};
			if (addressZipCode) body.address.zip_code = addressZipCode;
			if (addressStreetName) body.address.street_name = addressStreetName;
			if (addressStreetNumber !== null) body.address.street_number = addressStreetNumber;
			if (addressCity) body.address.city = { name: addressCity };
		}

		// Default address
		const defaultAddress = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"defaultAddress",
			itemIndex,
			""
		) as string;
		if (defaultAddress) {
			body.default_address = defaultAddress;
		}

		// Date registered
		const dateRegistered = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"dateRegistered",
			itemIndex,
			""
		) as string;
		if (dateRegistered) {
			body.date_registered = dateRegistered;
		}

		// Description
		const description = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"description",
			itemIndex,
			""
		) as string;
		if (description) {
			body.description = description;
		}

		return await apiRequest.call(executeFunctions, "POST", "/v1/customers", body);
	}

	private async getCustomer(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Customer> {
		const customerId = executeFunctions.getNodeParameter("customerId", itemIndex) as string;

		if (!customerId) {
			throw new Error("ID do cliente é obrigatório");
		}

		const url = buildUrl("/v1/customers/:customerId", { customerId });
		return await apiRequest.call(executeFunctions, "GET", url);
	}

	private async updateCustomer(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Customer> {
		const customerId = executeFunctions.getNodeParameter("customerId", itemIndex) as string;

		if (!customerId) {
			throw new Error("ID do cliente é obrigatório");
		}

		const body: any = {};

		// Campos opcionais (mesmos do create)
		const email = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"email",
			itemIndex,
			""
		) as string;
		if (email) {
			if (!validateEmail(email)) {
				throw new Error("Email inválido");
			}
			body.email = email;
		}

		const firstName = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"firstName",
			itemIndex,
			""
		) as string;
		if (firstName) {
			body.first_name = firstName;
		}

		const lastName = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"lastName",
			itemIndex,
			""
		) as string;
		if (lastName) {
			body.last_name = lastName;
		}

		// Phone
		const phoneAreaCode = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"phoneAreaCode",
			itemIndex,
			""
		) as string;
		const phoneNumber = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"phoneNumber",
			itemIndex,
			""
		) as string;
		if (phoneAreaCode || phoneNumber) {
			body.phone = {};
			if (phoneAreaCode) body.phone.area_code = phoneAreaCode;
			if (phoneNumber) body.phone.number = phoneNumber;
		}

		// Identification
		const identificationType = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"identificationType",
			itemIndex,
			""
		) as string;
		const identificationNumber = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"identificationNumber",
			itemIndex,
			""
		) as string;
		if (identificationNumber) {
			const cleanDoc = cleanDocument(identificationNumber);
			const docType = identificationType || getDocumentType(identificationNumber);
			if (docType) {
				body.identification = {
					type: docType,
					number: cleanDoc,
				};
			} else if (identificationType) {
				body.identification = {
					type: identificationType,
					number: cleanDoc,
				};
			}
		}

		// Description
		const description = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"description",
			itemIndex,
			""
		) as string;
		if (description) {
			body.description = description;
		}

		const url = buildUrl("/v1/customers/:customerId", { customerId });
		return await apiRequest.call(executeFunctions, "PUT", url, body);
	}

	private async deleteCustomer(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const customerId = executeFunctions.getNodeParameter("customerId", itemIndex) as string;

		if (!customerId) {
			throw new Error("ID do cliente é obrigatório");
		}

		const url = buildUrl("/v1/customers/:customerId", { customerId });
		return await apiRequest.call(executeFunctions, "DELETE", url);
	}

	private async listCustomers(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const qs: any = {};

		const email = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"email",
			itemIndex,
			""
		) as string;
		if (email) {
			qs.email = email;
		}

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

		return await apiRequest.call(executeFunctions, "GET", "/v1/customers/search", undefined, qs);
	}

	private async searchCustomers(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const qs: any = {};

		const email = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"email",
			itemIndex,
			""
		) as string;
		if (email) {
			qs.email = email;
		}

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

		return await apiRequest.call(executeFunctions, "GET", "/v1/customers/search", undefined, qs);
	}
}

