import { IExecuteFunctions } from "n8n-workflow";
import { IResourceHandler } from "./ResourceHandler";
import { apiRequest, buildUrl } from "../GenericFunctions";
import { getNodeParameterSafe, normalizeNumericValue } from "../helpers";
import { Plan } from "../types";

export class PlansResource implements IResourceHandler {
	operations = ["create", "get", "list", "update"];

	async execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		_resource: string
	): Promise<any> {
		const itemIndex = 0;

		switch (operation) {
			case "create":
				return await this.createPlan(executeFunctions, itemIndex);
			case "get":
				return await this.getPlan(executeFunctions, itemIndex);
			case "list":
				return await this.listPlans(executeFunctions, itemIndex);
			case "update":
				return await this.updatePlan(executeFunctions, itemIndex);
			default:
				throw new Error(`Operação de plano "${operation}" não é suportada. Operações disponíveis: ${this.operations.join(", ")}`);
		}
	}

	private async createPlan(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Plan> {
		// Campos obrigatórios
		const reason = executeFunctions.getNodeParameter("reason", itemIndex) as string;
		const amountRaw = executeFunctions.getNodeParameter("amount", itemIndex) as number | string;
		const frequencyRaw = executeFunctions.getNodeParameter("frequency", itemIndex) as number | string;
		const frequencyType = executeFunctions.getNodeParameter("frequencyType", itemIndex) as string;
		const currencyId = executeFunctions.getNodeParameter("currencyId", itemIndex) as string;
		const backUrl = executeFunctions.getNodeParameter("backUrl", itemIndex) as string;

		if (!reason || !amountRaw || !frequencyRaw || !frequencyType || !currencyId || !backUrl) {
			throw new Error(
				"Campos obrigatórios: Nome do Plano, Valor, Frequência, Tipo de Frequência, Moeda e URL de Retorno"
			);
		}

		const amount = normalizeNumericValue(amountRaw);
		const frequency = normalizeNumericValue(frequencyRaw);

		if (amount <= 0) {
			throw new Error("Valor do plano deve ser maior que zero");
		}

		const body: any = {
			reason,
			auto_recurring: {
				frequency: Math.round(frequency),
				frequency_type: frequencyType,
				transaction_amount: amount,
				currency_id: currencyId,
			},
			back_url: backUrl,
		};

		// Campos opcionais
		const repetitionsRaw = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"repetitions",
			itemIndex,
			null
		) as number | string | null;
		if (repetitionsRaw !== null) {
			const repetitions = normalizeNumericValue(repetitionsRaw);
			if (repetitions > 0) {
				body.auto_recurring.repetitions = Math.round(repetitions);
			}
		}

		const billingDayRaw = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"billingDay",
			itemIndex,
			null
		) as number | string | null;
		if (billingDayRaw !== null) {
			const billingDay = normalizeNumericValue(billingDayRaw);
			if (billingDay > 0) {
				body.auto_recurring.billing_day = Math.round(billingDay);
			}
		}

		const billingDayProportional = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"billingDayProportional",
			itemIndex,
			false
		) as boolean;
		if (billingDayProportional) {
			body.auto_recurring.billing_day_proportional = true;
		}

		const freeTrialFrequencyRaw = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"freeTrialFrequency",
			itemIndex,
			null
		) as number | string | null;
		const freeTrialFrequencyType = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"freeTrialFrequencyType",
			itemIndex,
			""
		) as string;
		if (freeTrialFrequencyRaw !== null && freeTrialFrequencyType) {
			const freeTrialFrequency = normalizeNumericValue(freeTrialFrequencyRaw);
			if (freeTrialFrequency > 0) {
				body.auto_recurring.free_trial = {
					frequency: Math.round(freeTrialFrequency),
					frequency_type: freeTrialFrequencyType,
				};
			}
		}

		// Payment types e methods
		const paymentTypes = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"paymentTypes",
			itemIndex,
			""
		) as string;
		const paymentMethods = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"paymentMethods",
			itemIndex,
			""
		) as string;

		if (paymentTypes || paymentMethods) {
			body.payment_methods_allowed = {};
			if (paymentTypes) {
				try {
					const types = JSON.parse(paymentTypes);
					if (Array.isArray(types)) {
						body.payment_methods_allowed.payment_types = types.map((type: string) => ({ id: type }));
					}
				} catch (error) {
					// Ignora erro de parsing
				}
			}
			if (paymentMethods) {
				try {
					const methods = JSON.parse(paymentMethods);
					if (Array.isArray(methods)) {
						body.payment_methods_allowed.payment_methods = methods.map((method: string) => ({ id: method }));
					}
				} catch (error) {
					// Ignora erro de parsing
				}
			}
		}

		return await apiRequest.call(executeFunctions, "POST", "/preapproval_plan", body);
	}

	private async getPlan(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Plan> {
		const planId = executeFunctions.getNodeParameter("planId", itemIndex) as string;

		if (!planId) {
			throw new Error("ID do plano é obrigatório");
		}

		const url = buildUrl("/preapproval_plan/:planId", { planId });
		return await apiRequest.call(executeFunctions, "GET", url);
	}

	private async listPlans(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<any> {
		const qs: any = {};

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

		return await apiRequest.call(executeFunctions, "GET", "/preapproval_plan/search", undefined, qs);
	}

	private async updatePlan(
		executeFunctions: IExecuteFunctions,
		itemIndex: number
	): Promise<Plan> {
		const planId = executeFunctions.getNodeParameter("planId", itemIndex) as string;

		if (!planId) {
			throw new Error("ID do plano é obrigatório");
		}

		const body: any = {};

		// Campos opcionais para update
		const reason = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"reason",
			itemIndex,
			""
		) as string;
		if (reason) {
			body.reason = reason;
		}

		const status = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"status",
			itemIndex,
			""
		) as string;
		if (status) {
			body.status = status;
		}

		// Auto recurring
		const amountRaw = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"amount",
			itemIndex,
			null
		) as number | string | null;
		const frequencyRaw = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"frequency",
			itemIndex,
			null
		) as number | string | null;
		const frequencyType = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"frequencyType",
			itemIndex,
			""
		) as string;
		const currencyId = getNodeParameterSafe(
			executeFunctions.getNodeParameter.bind(executeFunctions),
			"currencyId",
			itemIndex,
			""
		) as string;

		if (amountRaw !== null || frequencyRaw !== null || frequencyType || currencyId) {
			body.auto_recurring = {};
			if (amountRaw !== null) {
				body.auto_recurring.transaction_amount = normalizeNumericValue(amountRaw);
			}
			if (frequencyRaw !== null) {
				body.auto_recurring.frequency = Math.round(normalizeNumericValue(frequencyRaw));
			}
			if (frequencyType) {
				body.auto_recurring.frequency_type = frequencyType;
			}
			if (currencyId) {
				body.auto_recurring.currency_id = currencyId;
			}
		}

		const url = buildUrl("/preapproval_plan/:planId", { planId });
		return await apiRequest.call(executeFunctions, "PUT", url, body);
	}
}

