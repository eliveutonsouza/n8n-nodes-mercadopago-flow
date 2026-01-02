/**
 * Testes de integração para operações de Planos
 */

import { PlansResource } from "../../nodes/MercadoPago/resources/PlansResource";
import { IExecuteFunctions } from "n8n-workflow";
import { apiRequest } from "../../nodes/MercadoPago/GenericFunctions";
import {
  mockPlanResponse,
  mockPlanListResponse,
} from "../mocks/mercado-pago-mocks";
import { mockPlanData } from "../mocks/fixtures";

// Mock do apiRequest
jest.mock("../../nodes/MercadoPago/GenericFunctions", () => ({
  apiRequest: jest.fn(),
  buildUrl: jest.fn((template: string, params: Record<string, string | number>) => {
    let url = template;
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
    return url;
  }),
}));

describe("PlansResource Integration Tests", () => {
  let resource: PlansResource;
  let mockExecuteFunctions: Partial<IExecuteFunctions>;

  beforeEach(() => {
    resource = new PlansResource();
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: "TEST-TOKEN",
        baseUrl: "https://api.mercadopago.com",
      }),
      helpers: {
        request: jest.fn(),
      } as any,
    };
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar plano com sucesso", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            reason: mockPlanData.reason,
            amount: mockPlanData.amount,
            frequency: mockPlanData.frequency,
            frequencyType: mockPlanData.frequencyType,
            currencyId: "BRL",
            backUrl: "https://www.mercadopago.com.br",
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockPlanResponse);

      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "create",
        "plans"
      );

      expect(result).toEqual(mockPlanResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "/preapproval_plan",
        expect.objectContaining({
          reason: mockPlanData.reason,
          auto_recurring: expect.objectContaining({
            frequency: mockPlanData.frequency,
            frequency_type: mockPlanData.frequencyType,
            transaction_amount: mockPlanData.amount,
            currency_id: "BRL",
          }),
        })
      );
    });

    it("deve validar valor menor ou igual a zero", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            reason: mockPlanData.reason,
            amount: "0", // Passando como string para não ser falsy
            frequency: mockPlanData.frequency,
            frequencyType: mockPlanData.frequencyType,
            currencyId: "BRL",
            backUrl: "https://www.mercadopago.com.br",
          };
          return params[name];
        }
      );

      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "plans"
        )
      ).rejects.toThrow("Valor do plano deve ser maior que zero");
    });
  });

  describe("get", () => {
    it("deve consultar plano existente", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          return name === "planId" ? "plan-123" : undefined;
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockPlanResponse);

      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "get",
        "plans"
      );

      expect(result).toEqual(mockPlanResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        "/preapproval_plan/plan-123"
      );
    });
  });

  describe("list", () => {
    it("deve listar planos com sucesso", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        () => undefined
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockPlanListResponse);

      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "list",
        "plans"
      );

      expect(result).toEqual(mockPlanListResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        "/preapproval_plan/search",
        undefined,
        {}
      );
    });
  });

  describe("update", () => {
    it("deve atualizar plano com sucesso", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: "plan-123",
            reason: "Plano Atualizado",
          };
          return params[name];
        }
      );

      const updatedPlan = { ...mockPlanResponse, reason: "Plano Atualizado" };
      (apiRequest as jest.Mock).mockResolvedValue(updatedPlan);

      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "update",
        "plans"
      );

      expect(result.reason).toBe("Plano Atualizado");
      expect(apiRequest).toHaveBeenCalledWith(
        "PUT",
        "/preapproval_plan/plan-123",
        expect.objectContaining({
          reason: "Plano Atualizado",
        })
      );
    });
  });
});
