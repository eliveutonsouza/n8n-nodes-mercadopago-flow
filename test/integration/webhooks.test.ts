/**
 * Testes de integração para operações de Webhooks
 */

import { WebhooksResource } from "../../nodes/MercadoPago/resources/WebhooksResource";
import { IExecuteFunctions } from "n8n-workflow";
import { apiRequest } from "../../nodes/MercadoPago/GenericFunctions";
import { mockWebhookResponse } from "../mocks/mercado-pago-mocks";
import { mockWebhookData } from "../mocks/fixtures";

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

describe("WebhooksResource Integration Tests", () => {
  let resource: WebhooksResource;
  let mockExecuteFunctions: Partial<IExecuteFunctions>;

  beforeEach(() => {
    resource = new WebhooksResource();
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

  describe("register", () => {
    it("deve registrar webhook com sucesso", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            url: mockWebhookData.url,
            events: mockWebhookData.events,
            description: mockWebhookData.description,
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockWebhookResponse);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "register",
        "webhooks"
      );

      // Assert
      expect(result).toEqual(mockWebhookResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "v1/webhooks",
        expect.objectContaining({
          url: mockWebhookData.url,
          events: mockWebhookData.events,
          description: mockWebhookData.description,
        })
      );
    });

    it("deve validar URL inválida", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            url: "invalid-url",
            events: ["payment"],
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "register",
          "webhooks"
        )
      ).rejects.toThrow("URL do webhook deve ser uma URL válida");
    });

    it("deve usar eventos padrão quando não fornecidos", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            url: "https://example.com/webhook",
            events: [],
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockWebhookResponse);

      // Act
      await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "register",
        "webhooks"
      );

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "v1/webhooks",
        expect.objectContaining({
          events: ["payment"],
          url: expect.anything(),
        })
      );
    });

    it("deve incluir description quando fornecida", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            url: "https://example.com/webhook",
            events: ["payment"],
            description: "Test webhook",
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockWebhookResponse);

      // Act
      await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "register",
        "webhooks"
      );

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "v1/webhooks",
        expect.objectContaining({
          description: "Test webhook",
          events: expect.anything(),
          url: expect.anything(),
        })
      );
    });
  });

  describe("get", () => {
    it("deve consultar webhook existente", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            webhookId: "123456",
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockWebhookResponse);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "get",
        "webhooks"
      );

      // Assert
      expect(result).toEqual(mockWebhookResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        "v1/webhooks/123456",
      );
    });

    it("deve validar webhookId obrigatório", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            webhookId: "",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "get",
          "webhooks"
        )
      ).rejects.toThrow("ID do webhook é obrigatório");
    });
  });

  describe("list", () => {
    it("deve listar webhooks com sucesso", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (_name: string) => {
          return undefined;
        }
      );

      const listResponse = {
        results: [mockWebhookResponse],
        paging: { total: 1, limit: 10, offset: 0 },
      };

      (apiRequest as jest.Mock).mockResolvedValue(listResponse);

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "list",
        "webhooks"
      );

      // Assert
      expect(result).toEqual(listResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        "/v1/webhooks"
      );
    });
  });

  describe("delete", () => {
    it("deve excluir webhook com sucesso", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            webhookId: "123456",
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue({});

      // Act
      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "delete",
        "webhooks"
      );

      // Assert
      expect(result).toEqual({});
      expect(apiRequest).toHaveBeenCalledWith(
        "DELETE",
        "v1/webhooks/123456",
      );
    });

    it("deve validar webhookId obrigatório", async () => {
      // Arrange
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            webhookId: "",
          };
          return params[name];
        }
      );

      // Act & Assert
      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "delete",
          "webhooks"
        )
      ).rejects.toThrow("ID do webhook é obrigatório para deletar");
    });
  });
});
