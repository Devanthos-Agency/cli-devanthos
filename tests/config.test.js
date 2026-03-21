import { describe, it, expect } from "vitest";
import { ProjectConfig, PRESETS, DEFAULT_CONFIG } from "../src/utils/config.js";

describe("PRESETS", () => {
    it("contiene los presets esperados", () => {
        const presetIds = Object.keys(PRESETS);
        expect(presetIds).toContain("landing-page");
        expect(presetIds).toContain("dashboard");
        expect(presetIds).toContain("blog");
        expect(presetIds).toContain("ecommerce");
        expect(presetIds).toContain("portfolio");
        expect(presetIds).toContain("mobile-app");
        expect(presetIds).toContain("minimal");
    });

    it("cada preset tiene los campos requeridos", () => {
        for (const [id, preset] of Object.entries(PRESETS)) {
            expect(preset).toHaveProperty("name");
            expect(preset).toHaveProperty("description");
            expect(preset).toHaveProperty("features");
            expect(preset).toHaveProperty("plugins");
            expect(preset).toHaveProperty("dependencies");
            expect(typeof preset.name).toBe("string");
            expect(typeof preset.description).toBe("string");
        }
    });

    it("los presets con framework usan valores válidos", () => {
        const validFrameworks = ["astro", "next", "expo", null];
        for (const preset of Object.values(PRESETS)) {
            expect(validFrameworks).toContain(preset.framework);
        }
    });
});

describe("DEFAULT_CONFIG", () => {
    it("tiene estructura correcta", () => {
        expect(DEFAULT_CONFIG).toHaveProperty("packageManager", "auto");
        expect(DEFAULT_CONFIG).toHaveProperty("git");
        expect(DEFAULT_CONFIG.git).toHaveProperty("enabled", true);
        expect(DEFAULT_CONFIG.git).toHaveProperty("branch", "main");
        expect(DEFAULT_CONFIG).toHaveProperty("install");
        expect(DEFAULT_CONFIG).toHaveProperty("features");
    });
});

describe("ProjectConfig", () => {
    describe("listPresets", () => {
        it("retorna todos los presets con metadata", () => {
            const list = ProjectConfig.listPresets();
            expect(list.length).toBe(Object.keys(PRESETS).length);
            for (const item of list) {
                expect(item).toHaveProperty("id");
                expect(item).toHaveProperty("name");
                expect(item).toHaveProperty("description");
                expect(item).toHaveProperty("framework");
            }
        });
    });

    describe("getPreset", () => {
        it("retorna el preset correcto", () => {
            const preset = ProjectConfig.getPreset("dashboard");
            expect(preset).not.toBeNull();
            expect(preset.name).toBe("Dashboard/Admin");
            expect(preset.framework).toBe("next");
        });

        it("retorna null para preset inexistente", () => {
            expect(ProjectConfig.getPreset("no-existe")).toBeNull();
        });
    });

    describe("applyPreset", () => {
        it("aplica un preset correctamente", () => {
            const config = ProjectConfig.applyPreset("landing-page");
            expect(config.framework).toBe("astro");
            expect(config.preset).toBe("landing-page");
        });

        it("lanza error para preset inexistente", () => {
            expect(() => ProjectConfig.applyPreset("inventado")).toThrow();
        });
    });

    describe("merge", () => {
        it("hace merge profundo correctamente", () => {
            const target = { a: 1, b: { c: 2, d: 3 } };
            const source = { b: { c: 10 }, e: 5 };
            const result = ProjectConfig.merge(target, source);
            expect(result).toEqual({ a: 1, b: { c: 10, d: 3 }, e: 5 });
        });

        it("no modifica los objetos originales", () => {
            const target = { a: { b: 1 } };
            const source = { a: { c: 2 } };
            ProjectConfig.merge(target, source);
            expect(target).toEqual({ a: { b: 1 } });
        });
    });

    describe("validate", () => {
        it("valida una configuración correcta", () => {
            const result = ProjectConfig.validate(DEFAULT_CONFIG);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it("detecta packageManager inválido", () => {
            const config = { ...DEFAULT_CONFIG, packageManager: "invalid" };
            const result = ProjectConfig.validate(config);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it("detecta framework inválido", () => {
            const config = { ...DEFAULT_CONFIG, framework: "angular" };
            const result = ProjectConfig.validate(config);
            expect(result.valid).toBe(false);
        });
    });
});
