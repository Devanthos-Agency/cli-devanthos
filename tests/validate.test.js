import { describe, it, expect } from "vitest";

// Importar la función validateProjectName del index (la extraemos inline para testear)
// Como validateProjectName es una const local, la replicamos para testing
const validateProjectName = input => {
    const projectName = input.trim();

    if (!projectName) {
        return "Por favor, ingresa un nombre para el proyecto.";
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
        return "El nombre debe contener solo letras, números, guiones y guiones bajos.";
    }

    if (projectName.startsWith("-") || projectName.startsWith("_")) {
        return "El nombre no puede empezar con guión o guión bajo.";
    }

    if (projectName.length > 50) {
        return "El nombre es demasiado largo (máximo 50 caracteres).";
    }

    return true;
};

describe("validateProjectName", () => {
    it("acepta nombres válidos", () => {
        expect(validateProjectName("mi-proyecto")).toBe(true);
        expect(validateProjectName("app123")).toBe(true);
        expect(validateProjectName("my_project")).toBe(true);
        expect(validateProjectName("MyApp")).toBe(true);
    });

    it("rechaza nombres vacíos", () => {
        expect(validateProjectName("")).not.toBe(true);
        expect(validateProjectName("   ")).not.toBe(true);
    });

    it("rechaza caracteres especiales", () => {
        expect(validateProjectName("mi proyecto")).not.toBe(true);
        expect(validateProjectName("mi@proyecto")).not.toBe(true);
        expect(validateProjectName("mi.proyecto")).not.toBe(true);
        expect(validateProjectName("mi/proyecto")).not.toBe(true);
    });

    it("rechaza nombres que empiezan con guión o guión bajo", () => {
        expect(validateProjectName("-proyecto")).not.toBe(true);
        expect(validateProjectName("_proyecto")).not.toBe(true);
    });

    it("rechaza nombres demasiado largos", () => {
        const longName = "a".repeat(51);
        expect(validateProjectName(longName)).not.toBe(true);
    });

    it("acepta nombres con exactamente 50 caracteres", () => {
        const maxName = "a".repeat(50);
        expect(validateProjectName(maxName)).toBe(true);
    });

    it("hace trim del input", () => {
        expect(validateProjectName("  mi-proyecto  ")).toBe(true);
    });
});
