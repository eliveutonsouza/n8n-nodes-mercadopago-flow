/**
 * Testes unitários para MercadoPagoApi credentials
 */

import { MercadoPagoApi } from "../../credentials/MercadoPagoApi.credentials";

describe("MercadoPagoApi Credentials", () => {
  let credentials: MercadoPagoApi;

  beforeEach(() => {
    credentials = new MercadoPagoApi();
  });

  describe("Estrutura", () => {
    it("deve ter nome correto", () => {
      expect(credentials.name).toBe("mercadoPagoApi");
    });

    it("deve ter displayName correto", () => {
      expect(credentials.displayName).toBe("Mercado Pago API");
    });

    it("deve ter documentationUrl", () => {
      expect(credentials.documentationUrl).toBeDefined();
      expect(credentials.documentationUrl).toContain("mercadopago.com");
    });

    it("deve ter propriedades definidas", () => {
      expect(credentials.properties).toBeDefined();
      expect(Array.isArray(credentials.properties)).toBe(true);
      expect(credentials.properties.length).toBeGreaterThan(0);
    });
  });

  describe("Campos", () => {
    it("deve ter campo accessToken obrigatório", () => {
      const accessTokenField = credentials.properties.find(
        (p) => p.name === "accessToken"
      );
      expect(accessTokenField).toBeDefined();
      expect(accessTokenField?.required).toBe(true);
      expect(accessTokenField?.type).toBe("string");
      expect(accessTokenField?.typeOptions?.password).toBe(true);
    });

    it("deve ter campo baseUrl opcional", () => {
      const baseUrlField = credentials.properties.find(
        (p) => p.name === "baseUrl"
      );
      expect(baseUrlField).toBeDefined();
      expect(baseUrlField?.required).toBeFalsy();
      expect(baseUrlField?.type).toBe("string");
      expect(baseUrlField?.default).toBe("https://api.mercadopago.com");
    });

    it("deve ter baseUrl com valor padrão correto", () => {
      const baseUrlField = credentials.properties.find(
        (p) => p.name === "baseUrl"
      );
      expect(baseUrlField?.default).toBe("https://api.mercadopago.com");
    });

    it("não deve ter campo environment", () => {
      const environmentField = credentials.properties.find(
        (p) => p.name === "environment"
      );
      expect(environmentField).toBeUndefined();
    });

    it("não deve ter campo clientId", () => {
      const clientIdField = credentials.properties.find(
        (p) => p.name === "clientId"
      );
      expect(clientIdField).toBeUndefined();
    });

    it("não deve ter campo clientSecret", () => {
      const clientSecretField = credentials.properties.find(
        (p) => p.name === "clientSecret"
      );
      expect(clientSecretField).toBeUndefined();
    });
  });

  describe("Validação", () => {
    it("deve ter apenas 2 campos (accessToken e baseUrl)", () => {
      expect(credentials.properties.length).toBe(2);
    });

    it("deve ter accessToken como único campo obrigatório", () => {
      const requiredFields = credentials.properties.filter((p) => p.required);
      expect(requiredFields.length).toBe(1);
      expect(requiredFields[0].name).toBe("accessToken");
    });
  });
});
