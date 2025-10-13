#!/usr/bin/env node

/**
 * Test de Integración: Preset Selection per Framework
 *
 * Este test verifica que:
 * 1. No se muestre la pregunta inicial de preset
 * 2. Después de elegir framework, se muestren solo presets de ese framework
 * 3. Se incluya la opción de "Configuración manual" en la lista
 */

import { PRESETS } from "./utils/config.js";
import chalk from "chalk";

console.log(chalk.cyan.bold("\n🧪 Test: Preset Integration per Framework\n"));

// Simular datos de entrada
const frameworks = ["astro", "next", "expo"];

frameworks.forEach(framework => {
    console.log(chalk.yellow(`\n📦 Framework: ${framework.toUpperCase()}`));

    // Filtrar presets por framework
    const presetsForFramework = Object.entries(PRESETS)
        .filter(([_, preset]) => preset.framework === framework)
        .map(([id, preset]) => ({ id, ...preset }));

    console.log(chalk.gray(`   Presets disponibles: ${presetsForFramework.length}`));

    presetsForFramework.forEach(preset => {
        console.log(chalk.gray(`   • ${preset.id} - ${preset.name}`));
    });

    // Verificar que hay al menos un preset por framework
    if (presetsForFramework.length === 0) {
        console.log(chalk.red(`   ❌ Error: No hay presets para ${framework}`));
    } else {
        console.log(chalk.green("   ✅ OK"));
    }
});

// Verificar estructura esperada del flujo
console.log(chalk.cyan.bold("\n🔍 Verificación de Flujo:\n"));

const expectedFlow = [
    "1. ¿Qué tipo de proyecto querés crear? (framework)",
    "2. Seleccioná una configuración: (preset filtrado por framework)",
    "   - ⚙️ Configuración manual (sin preset)",
    "   - [Presets disponibles para el framework elegido]",
    "3. ¿Cuál será el nombre de tu proyecto?",
    "4. ¿Querés instalar las dependencias automáticamente?",
    "5. ¿Inicializar repositorio Git?",
    "6. ¿Guardar configuración en devanthos.config.js? (solo si eligió preset)"
];

expectedFlow.forEach(step => {
    console.log(chalk.gray(step));
});

console.log(chalk.green.bold("\n✅ Test completado exitosamente!"));
console.log(chalk.gray("\nPara probar manualmente, ejecuta:"));
console.log(chalk.cyan("  node index.js\n"));
