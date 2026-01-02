import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest } from "../GenericFunctions";
import { getNodeParameterSafe } from "../helpers";

export class OAuthResource implements IResourceHandler {
	operations = ["authorize", "refresh_token", "get_user_info"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "authorize":
				return await this.authorize(executeFunctions, itemIndex);
			case "refresh_token":
				return await this.refreshToken(executeFunctions, itemIndex);
			case "get_user_info":
				return await this.getUserInfo(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação de OAuth "${operation}" não é suportada. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async authorize(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const clientId = executeFunctions.getNodeParameter("clientId", itemIndex) as string;
		const clientSecret = executeFunctions.getNodeParameter("clientSecret", itemIndex) as string;
		const code = executeFunctions.getNodeParameter("code", itemIndex) as string;
		const redirectUri = executeFunctions.getNodeParameter("redirectUri", itemIndex) as string;

		if (!clientId || !clientSecret || !code || !redirectUri) {
			throw new Error("Campos obrigatórios: Client ID, Client Secret, Code e Redirect URI");
		}

		// OAuth usa application/x-www-form-urlencoded
		const body = new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			code: code,
			redirect_uri: redirectUri,
			grant_type: "authorization_code",
		});

		const testToken = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"testToken",
			itemIndex,
			false
		) as boolean;
		if (testToken) {
			body.append("test_token", "true");
		}

		// Para urlencoded, precisamos usar headers diferentes
		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
		};

		return await apiRequest.call(
			executeFunctions,
			"POST",
			"oauth/token",
			body.toString(),
			undefined,
			headers
		);
	}

	private async refreshToken(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const clientSecret = executeFunctions.getNodeParameter("clientSecret", itemIndex) as string;
		const refreshToken = executeFunctions.getNodeParameter("refreshToken", itemIndex) as string;

		if (!clientSecret || !refreshToken) {
			throw new Error("Client Secret e Refresh Token são obrigatórios");
		}

		const body = new URLSearchParams({
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		});

		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
		};

		return await apiRequest.call(
			executeFunctions,
			"POST",
			"oauth/token",
			body.toString(),
			undefined,
			headers
		);
	}

	private async getUserInfo(
		executeFunctions: IExecuteFunctions,
		_itemIndex: number
	): Promise<any> {
		// O endpoint de user info geralmente é /users/me ou similar
		// Vou usar um endpoint genérico que pode ser ajustado
		return await apiRequest.call(executeFunctions, "GET", "users/me");
	}
}

