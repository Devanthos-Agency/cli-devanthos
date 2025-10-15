import { ProjectConfig } from "../utils/config.js";

console.log("=== Test: Filtrado de presets por framework ===\n");

const allPresets = ProjectConfig.listPresets();
console.log(`Total de presets: ${allPresets.length}\n`);

const frameworks = ["astro", "next", "expo"];

frameworks.forEach(framework => {
    const filtered = allPresets.filter(p => p.framework === framework);
    console.log(`\n📦 Framework: ${framework.toUpperCase()}`);
    console.log(`Presets disponibles: ${filtered.length}`);
    filtered.forEach(preset => {
        console.log(`  - ${preset.id}: ${preset.name}`);
    });
});
