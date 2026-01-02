/**
 * Testes de integração para operações de Assinaturas
 */

import { SubscriptionsResource } from "../../nodes/MercadoPago/resources/SubscriptionsResource";
import { IExecuteFunctions } from "n8n-workflow";
import { apiRequest } from "../../nodes/MercadoPago/GenericFunctions";
import { mockSubscriptionResponse } from "../mocks/mercado-pago-mocks";
import { mockSubscriptionData } from "../mocks/fixtures";

// Mock do apiRequest
jest.mock("../../nodes/MercadoPago/GenericFunctions", () => ({
  apiRequest: jest.fn(),
  buildUrl: jest.fn(
    (template: string, params: Record<string, string | number>) => {
      let url = template;
      for (const [key, value] of Object.entries(params)) {
        url = url.replace(`:${key}`, String(value));
      }
      return url;
    }
  ),
}));

describe("SubscriptionsResource Integration Tests", () => {
  let resource: SubscriptionsResource;
  let mockExecuteFunctions: Partial<IExecuteFunctions>;

  beforeEach(() => {
    resource = new SubscriptionsResource();
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
    it("deve criar assinatura com sucesso", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: mockSubscriptionData.planId,
            payerEmail: mockSubscriptionData.payerEmail,
            payerDocument: mockSubscriptionData.payerDocument,
            startDate: mockSubscriptionData.startDate,
            trialPeriodDays: mockSubscriptionData.trialPeriodDays,
            cardTokenId: "test-token-123",
            subscriptionStatus: "authorized",
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockSubscriptionResponse);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "create",
        "subscriptions"
      );

      // Assert
      expect(result).toEqual(mockSubscriptionResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "preapproval",
        expect.objectContaining({
          preapproval_plan_id: mockSubscriptionData.planId,
          payer_email: mockSubscriptionData.payerEmail,
          card_token_id: "test-token-123",
          status: "authorized",
        })
      );
    });

    it("deve criar assinatura pendente sem token", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: mockSubscriptionData.planId,
            payerEmail: mockSubscriptionData.payerEmail,
            subscriptionStatus: "pending",
          };
          return params[name];
        }
      );

      const pendingResponse = {
        ...mockSubscriptionResponse,
        status: "pending",
        init_point:
          "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=123",
      };
      (apiRequest as jest.Mock).mockResolvedValue(pendingResponse);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "create",
        "subscriptions"
      );

      // Assert
      expect(result).toEqual(pendingResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "preapproval",
        expect.objectContaining({
          preapproval_plan_id: mockSubscriptionData.planId,
          payer_email: mockSubscriptionData.payerEmail,
        })
      );
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "preapproval",
        expect.not.objectContaining({
          card_token_id: expect.anything(),
          status: expect.anything(),
        })
      );
    });

    it("deve validar email inválido", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: "plan-123",
            payerEmail: "email-invalido",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "subscriptions"
        )
      ).rejects.toThrow("E-mail do pagador inválido");
    });

    it("deve validar CPF/CNPJ inválido", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: "plan-123",
            payerEmail: "teste@example.com",
            payerDocument: "123",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "subscriptions"
        )
      ).rejects.toThrow("CPF/CNPJ inválido");
    });

    it("deve exigir token para status authorized", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: "plan-123",
            payerEmail: "teste@example.com",
            subscriptionStatus: "authorized",
            cardTokenId: "",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "subscriptions"
        )
      ).rejects.toThrow("obrigatório fornecer um Token do Cartão");
    });

    it("deve validar token muito curto", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: "plan-123",
            payerEmail: "teste@example.com",
            subscriptionStatus: "authorized",
            cardTokenId: "123",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "subscriptions"
        )
      ).rejects.toThrow("Token do cartão inválido: token muito curto");
    });

    it("deve incluir reason e externalReference quando fornecidos", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: mockSubscriptionData.planId,
            payerEmail: mockSubscriptionData.payerEmail,
            reason: "Yoga classes",
            externalReference: "YG-1234",
            subscriptionStatus: "pending",
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockSubscriptionResponse);

      // Act
      await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "create",
        "subscriptions"
      );

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "preapproval",
        expect.objectContaining({
          reason: "Yoga classes",
          external_reference: "YG-1234",
        })
      );
    });
  });

  describe("get", () => {
    it("deve consultar assinatura existente", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "sub-123",
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockSubscriptionResponse);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "get",
        "subscriptions"
      );

      // Assert
      expect(result).toEqual(mockSubscriptionResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        "preapproval/sub-123",
      );
    });

    it("deve validar subscriptionId obrigatório", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "get",
          "subscriptions"
        )
      ).rejects.toThrow("ID da assinatura é obrigatório");
    });

    it("deve tratar erro 404", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "sub-123",
          };
          return params[name];
        }
      );

      const error: any = new Error("Not found");
      error.response = {
        status: 404,
        data: {
          message: "Subscription not found",
        },
      };
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "get",
          "subscriptions"
        )
      ).rejects.toThrow("Assinatura não encontrada");
    });
  });

  describe("pause", () => {
    it("deve pausar assinatura com sucesso", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "sub-123",
          };
          return params[name];
        }
      );

      const pausedSubscription = {
        ...mockSubscriptionResponse,
        status: "paused",
      };
      (apiRequest as jest.Mock).mockResolvedValue(pausedSubscription);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "pause",
        "subscriptions"
      );

      // Assert
      expect(result.status).toBe("paused");
      expect(apiRequest).toHaveBeenCalledWith(
        "PUT",
        "preapproval/sub-123",
        { status: "paused" }
      );
    });

    it("deve validar subscriptionId obrigatório", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "pause",
          "subscriptions"
        )
      ).rejects.toThrow("ID da assinatura é obrigatório para pausar");
    });
  });

  describe("resume", () => {
    it("deve retomar assinatura com sucesso", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "sub-123",
          };
          return params[name];
        }
      );

      const resumedSubscription = {
        ...mockSubscriptionResponse,
        status: "authorized",
      };
      (apiRequest as jest.Mock).mockResolvedValue(resumedSubscription);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "resume",
        "subscriptions"
      );

      // Assert
      expect(result.status).toBe("authorized");
      expect(apiRequest).toHaveBeenCalledWith(
        "PUT",
        "preapproval/sub-123",
        { status: "authorized" }
      );
    });

    it("deve validar subscriptionId obrigatório", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "resume",
          "subscriptions"
        )
      ).rejects.toThrow("ID da assinatura é obrigatório para retomar");
    });
  });

  describe("cancel", () => {
    it("deve cancelar assinatura com sucesso", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "sub-123",
          };
          return params[name];
        }
      );

      const cancelledSubscription = {
        ...mockSubscriptionResponse,
        status: "cancelled",
      };
      (apiRequest as jest.Mock).mockResolvedValue(cancelledSubscription);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "cancel",
        "subscriptions"
      );

      // Assert
      expect(result.status).toBe("cancelled");
      expect(apiRequest).toHaveBeenCalledWith(
        "PUT",
        "preapproval/sub-123",
        { status: "cancelled" }
      );
    });

    it("deve validar subscriptionId obrigatório", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            subscriptionId: "",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "cancel",
          "subscriptions"
        )
      ).rejects.toThrow("ID da assinatura é obrigatório para cancelar");
    });
  });

  describe("list", () => {
    it("deve listar assinaturas com sucesso", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (_name: string) => {
          return undefined;
        }
      );

      const listResponse = {
        results: [mockSubscriptionResponse],
        paging: { total: 1, limit: 10, offset: 0 },
      };

      (apiRequest as jest.Mock).mockResolvedValue(listResponse);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "list",
        "subscriptions"
      );

      // Assert
      expect(result).toEqual(listResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        "preapproval/search",
      );
    });
  });

  describe("error handling", () => {
    it("deve tratar erro CC_VAL_433 com mensagem específica", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: "plan-123",
            payerEmail: "teste@example.com",
            cardTokenId: "test-token-123",
            subscriptionStatus: "authorized",
          };
          return params[name];
        }
      );

      const error: any = new Error("Credit card validation has failed");
      error.response = {
        status: 400,
        data: {
          error: "CC_VAL_433",
          message: "Credit card validation has failed",
        },
      };
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "subscriptions"
        )
      ).rejects.toThrow("CC_VAL_433");
    });

    it('deve tratar erro "Card token service not found"', async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            planId: "plan-123",
            payerEmail: "teste@example.com",
            cardTokenId: "test-token-123",
            subscriptionStatus: "authorized",
          };
          return params[name];
        }
      );

      const error: any = new Error("Card token service not found");
      error.response = {
        status: 400,
        data: {
          message: "Card token service not found",
        },
      };
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "subscriptions"
        )
      ).rejects.toThrow("Token do cartão inválido para assinaturas");
    });
  });
});
