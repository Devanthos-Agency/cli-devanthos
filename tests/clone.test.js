import { describe, it, expect } from "vitest";
import { getAvailableTemplates } from "../src/utils/clone.js";

describe("getAvailableTemplates", () => {
    it("retorna los tres frameworks", () => {
        const templates = getAvailableTemplates();
        const frameworks = templates.map(t => t.framework);
        expect(frameworks).toContain("astro");
        expect(frameworks).toContain("next");
        expect(frameworks).toContain("expo");
    });

    it("cada template tiene los campos requeridos", () => {
        const templates = getAvailableTemplates();
        for (const template of templates) {
            expect(template).toHaveProperty("framework");
            expect(template).toHaveProperty("templatePath");
            expect(template).toHaveProperty("extrasPath");
            expect(template).toHaveProperty("description");
            expect(template).toHaveProperty("available");
            expect(typeof template.description).toBe("string");
            expect(typeof template.available).toBe("boolean");
        }
    });

    it("las plantillas locales están disponibles", () => {
        const templates = getAvailableTemplates();
        for (const template of templates) {
            expect(template.available).toBe(true);
        }
    });
});
