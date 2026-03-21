import { describe, it, expect } from "vitest";
import {
    resolveIntegrationAlias,
    parseIntegrations,
    validateIntegrations,
    listIntegrations,
    getAvailableIntegrations,
    hasIntegrationsForFramework,
    INTEGRATIONS,
    INTEGRATION_ALIASES
} from "../src/utils/integrations.js";

describe("resolveIntegrationAlias", () => {
    it("resuelve aliases conocidos", () => {
        expect(resolveIntegrationAlias("mp")).toBe("mercadopago");
        expect(resolveIntegrationAlias("mercado")).toBe("mercadopago");
        expect(resolveIntegrationAlias("pago")).toBe("mercadopago");
        expect(resolveIntegrationAlias("login")).toBe("auth");
        expect(resolveIntegrationAlias("nextauth")).toBe("auth");
        expect(resolveIntegrationAlias("mongo")).toBe("mongodb");
        expect(resolveIntegrationAlias("db")).toBe("mongodb");
        expect(resolveIntegrationAlias("database")).toBe("mongodb");
    });

    it("retorna el input si no hay alias", () => {
        expect(resolveIntegrationAlias("mercadopago")).toBe("mercadopago");
        expect(resolveIntegrationAlias("auth")).toBe("auth");
        expect(resolveIntegrationAlias("mongodb")).toBe("mongodb");
    });

    it("normaliza a minúsculas y hace trim", () => {
        expect(resolveIntegrationAlias("  MP  ")).toBe("mercadopago");
        expect(resolveIntegrationAlias("DB")).toBe("mongodb");
    });
});

describe("parseIntegrations", () => {
    it("parsea integraciones separadas por coma", () => {
        expect(parseIntegrations("mercadopago,auth")).toEqual(["mercadopago", "auth"]);
    });

    it("parsea integraciones separadas por espacio", () => {
        expect(parseIntegrations("mercadopago auth")).toEqual(["mercadopago", "auth"]);
    });

    it("resuelve aliases al parsear", () => {
        expect(parseIntegrations("mp,login,db")).toEqual(["mercadopago", "auth", "mongodb"]);
    });

    it("elimina duplicados", () => {
        expect(parseIntegrations("mp,mercadopago,pago")).toEqual(["mercadopago"]);
    });

    it("retorna array vacío para input vacío", () => {
        expect(parseIntegrations(null)).toEqual([]);
        expect(parseIntegrations(undefined)).toEqual([]);
        expect(parseIntegrations("")).toEqual([]);
    });
});

describe("validateIntegrations", () => {
    it("valida integraciones correctas para next", () => {
        const result = validateIntegrations(["mercadopago", "auth", "mongodb"], "next");
        expect(result.valid).toHaveLength(3);
        expect(result.errors).toHaveLength(0);
    });

    it("detecta integraciones no disponibles para un framework", () => {
        const result = validateIntegrations(["mercadopago"], "astro");
        expect(result.valid).toHaveLength(0);
        expect(result.errors).toHaveLength(1);
    });

    it("detecta integraciones inexistentes", () => {
        const result = validateIntegrations(["no-existe"], "next");
        expect(result.valid).toHaveLength(0);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].error).toContain("no encontrada");
    });

    it("separa válidas e inválidas correctamente", () => {
        const result = validateIntegrations(["auth", "no-existe", "mongodb"], "next");
        expect(result.valid).toHaveLength(2);
        expect(result.errors).toHaveLength(1);
    });
});

describe("listIntegrations", () => {
    it("lista todas las integraciones sin filtro", () => {
        const list = listIntegrations();
        expect(list.length).toBe(Object.keys(INTEGRATIONS).length);
    });

    it("filtra por framework", () => {
        const list = listIntegrations("next");
        expect(list.length).toBeGreaterThan(0);
        for (const item of list) {
            expect(item.frameworks).toContain("next");
        }
    });

    it("retorna array vacío para framework sin integraciones", () => {
        const list = listIntegrations("astro");
        expect(list).toHaveLength(0);
    });
});

describe("getAvailableIntegrations", () => {
    it("retorna integraciones de next", () => {
        const result = getAvailableIntegrations("next");
        expect(result.length).toBeGreaterThan(0);
    });

    it("retorna vacío para framework sin integraciones", () => {
        const result = getAvailableIntegrations("astro");
        expect(result).toHaveLength(0);
    });
});

describe("hasIntegrationsForFramework", () => {
    it("retorna true para next", () => {
        expect(hasIntegrationsForFramework("next")).toBe(true);
    });

    it("retorna false para astro", () => {
        expect(hasIntegrationsForFramework("astro")).toBe(false);
    });
});

describe("INTEGRATIONS", () => {
    it("cada integración tiene estructura correcta", () => {
        for (const [id, integration] of Object.entries(INTEGRATIONS)) {
            expect(integration).toHaveProperty("id", id);
            expect(integration).toHaveProperty("name");
            expect(integration).toHaveProperty("description");
            expect(integration).toHaveProperty("frameworks");
            expect(integration).toHaveProperty("dependencies");
            expect(integration).toHaveProperty("envVars");
            expect(integration).toHaveProperty("files");
            expect(Array.isArray(integration.frameworks)).toBe(true);
            expect(Array.isArray(integration.dependencies)).toBe(true);
            expect(Array.isArray(integration.envVars)).toBe(true);
            expect(Array.isArray(integration.files)).toBe(true);
        }
    });
});
