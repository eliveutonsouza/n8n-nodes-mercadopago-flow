/**
 * Testes de integração para operações PIX
 */

import { PixResource } from "../../nodes/MercadoPago/resources/PixResource";
import { IExecuteFunctions } from "n8n-workflow";
import { apiRequest } from "../../nodes/MercadoPago/GenericFunctions";
import {
  mockPixPaymentResponse,
  mockPixPaymentApproved,
  mockRefundResponse,
} from "../mocks/mercado-pago-mocks";
import { mockPixPaymentData } from "../mocks/fixtures";

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

describe("PixResource Integration Tests", () => {
  let resource: PixResource;
  let mockExecuteFunctions: Partial<IExecuteFunctions>;

  beforeEach(() => {
    resource = new PixResource();
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
    it("deve criar pagamento PIX com sucesso", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            amount: mockPixPaymentData.amount,
            description: mockPixPaymentData.description,
            payerEmail: mockPixPaymentData.payerEmail,
            payerDocument: mockPixPaymentData.payerDocument,
            payerName: mockPixPaymentData.payerName,
            expirationDate: mockPixPaymentData.expirationDate,
            externalReference: mockPixPaymentData.externalReference,
            idempotencyKey: mockPixPaymentData.idempotencyKey,
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockPixPaymentResponse);

      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "create",
        "pix"
      );

      expect(result).toEqual(mockPixPaymentResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "/v1/payments",
        expect.objectContaining({
          transaction_amount: mockPixPaymentData.amount,
          description: mockPixPaymentData.description,
          payer: expect.objectContaining({
            email: mockPixPaymentData.payerEmail,
          }),
          payment_method_id: "pix",
        }),
        undefined,
        expect.objectContaining({
          "X-Idempotency-Key": mockPixPaymentData.idempotencyKey,
        })
      );
    });

    it("deve validar email inválido", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            amount: 10.5,
            description: "Teste",
            payerEmail: "email-invalido",
          };
          return params[name];
        }
      );

      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "pix"
        )
      ).rejects.toThrow("E-mail do pagador inválido");
    });

    it("deve validar valor menor ou igual a zero", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            amount: 0,
            description: "Teste",
            payerEmail: "teste@example.com",
          };
          return params[name];
        }
      );

      await expect(
        resource.execute(
          mockExecuteFunctions as IExecuteFunctions,
          "create",
          "pix"
        )
      ).rejects.toThrow("Valor do pagamento deve ser maior que zero");
    });
  });

  describe("get", () => {
    it("deve consultar pagamento PIX existente", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          return name === "paymentId" ? "123456789" : undefined;
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockPixPaymentApproved);

      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "get",
        "pix"
      );

      expect(result).toEqual(mockPixPaymentApproved);
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        "/v1/payments/123456789"
      );
    });
  });

  describe("refund", () => {
    it("deve reembolsar pagamento PIX com sucesso", async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (name: string) => {
          const params: { [key: string]: any } = {
            paymentId: "123456789",
            refundAmount: 10.5,
          };
          return params[name];
        }
      );

      (apiRequest as jest.Mock).mockResolvedValue(mockRefundResponse);

      const result = await resource.execute(
        mockExecuteFunctions as IExecuteFunctions,
        "refund",
        "pix"
      );

      expect(result).toEqual(mockRefundResponse);
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        "/v1/payments/123456789/refunds",
        expect.objectContaining({
          amount: 10.5,
        }),
        undefined,
        expect.anything()
      );
    });
  });
});
