# 🔌 Ejemplos de Plugins para Devanthos CLI

Esta carpeta contiene ejemplos de plugins que puedes usar como referencia para crear tus propios plugins personalizados.

## Plugin de Actualización de Dependencias

El plugin `dependency-updater.plugin.js` (incluido en `utils/`) actualiza automáticamente las dependencias de los proyectos creados a las últimas versiones compatibles.

### ✨ Características

- ✅ Actualiza dependencias principales según el framework (Astro, Next.js, Expo)
- ✅ Actualiza tanto dependencies como devDependencies
- ✅ Consulta npm registry para obtener las últimas versiones
- ✅ Preserva la compatibilidad usando prefijo `^`
- ✅ Muestra resumen de actualizaciones realizadas
- ✅ Auditoría de seguridad opcional con npm audit

### 🎯 Variables de entorno

```bash
# Desactivar actualización automática de dependencias
export DEVANTHOS_UPDATE_DEPS=false

# Habilitar auditoría de seguridad después de instalar
export DEVANTHOS_AUDIT=true

# Mostrar detalles de las actualizaciones
export DEVANTHOS_VERBOSE=true
```

### 📦 Dependencias actualizadas por framework

**Astro:**

- `astro`
- `@astrojs/tailwind`
- `tailwindcss`
- `typescript`

**Next.js:**

- `next`
- `react`
- `react-dom`
- `@types/react`
- `@types/node`
- `typescript`
- `tailwindcss`

**Expo:**

- `expo`
- `react`
- `react-native`
- `@types/react`
- `typescript`

## 🛠️ Crear un Plugin Personalizado

### Estructura básica

```javascript
export default {
    name: "mi-plugin",
    version: "1.0.0",
    description: "Descripción de mi plugin",
    author: "Tu Nombre",
    priority: 100, // Menor = ejecuta primero

    // Hook: antes de clonar la plantilla
    async beforeClone(context) {
        const { framework, projectName } = context;
        console.log(`Creando proyecto ${projectName} con ${framework}`);
        return context;
    },

    // Hook: después de clonar la plantilla
    async afterClone(context) {
        const { framework, projectName } = context;
        // Tu lógica aquí
        return context;
    },

    // Hook: antes de instalar dependencias
    async beforeInstall(context) {
        const { projectName } = context;
        // Tu lógica aquí
        return context;
    },

    // Hook: después de instalar dependencias
    async afterInstall(context) {
        const { projectName } = context;
        // Tu lógica aquí
        return context;
    },

    // Hook: cuando ocurre un error
    async onError(context) {
        const { error, stage } = context;
        // Tu lógica de manejo de errores
        return context;
    },

    // Hook: cuando todo se completa exitosamente
    async onComplete(context) {
        const { framework, projectName, installDependencies } = context;
        // Tu lógica final
        return context;
    }
};
```

### Hooks disponibles

| Hook            | Cuándo se ejecuta                | Contexto disponible                               |
| --------------- | -------------------------------- | ------------------------------------------------- |
| `beforeClone`   | Antes de clonar la plantilla     | `{ framework, projectName }`                      |
| `afterClone`    | Después de clonar la plantilla   | `{ framework, projectName }`                      |
| `beforeInstall` | Antes de instalar dependencias   | `{ projectName }`                                 |
| `afterInstall`  | Después de instalar dependencias | `{ projectName }`                                 |
| `onError`       | Cuando ocurre un error           | `{ error, stage, ...contextData }`                |
| `onComplete`    | Cuando todo se completa          | `{ framework, projectName, installDependencies }` |

### Ubicaciones de plugins

Los plugins se cargan automáticamente desde:

1. `./devanthos.plugins.js` (directorio actual)
2. `./.devanthos/plugins/` (directorio del proyecto)
3. `~/.devanthos/plugins/` (directorio del usuario)

### Ejemplo: Plugin de Git Init

```javascript
// git-init.plugin.js
import { execSync } from "child_process";
import path from "path";
import chalk from "chalk";

export default {
    name: "git-init",
    version: "1.0.0",
    description: "Inicializa un repositorio Git automáticamente",
    author: "Devanthos",
    priority: 200,

    async afterClone(context) {
        const { projectName } = context;
        const projectPath = path.resolve(process.cwd(), projectName);

        try {
            // Inicializar repositorio Git
            execSync("git init", { cwd: projectPath, stdio: "ignore" });

            // Crear primer commit
            execSync("git add .", { cwd: projectPath, stdio: "ignore" });
            execSync('git commit -m "Initial commit from Devanthos CLI"', {
                cwd: projectPath,
                stdio: "ignore"
            });

            console.log(chalk.green("   ✅ Repositorio Git inicializado"));
        } catch (error) {
            console.log(chalk.yellow("   ⚠️ No se pudo inicializar Git"));
        }

        return context;
    }
};
```

### Ejemplo: Plugin de Configuración de VSCode

```javascript
// vscode-setup.plugin.js
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import chalk from "chalk";

export default {
    name: "vscode-setup",
    version: "1.0.0",
    description: "Configura VSCode con settings recomendados",
    author: "Devanthos",

    async afterClone(context) {
        const { projectName } = context;
        const projectPath = path.resolve(process.cwd(), projectName);
        const vscodeDir = path.join(projectPath, ".vscode");

        try {
            mkdirSync(vscodeDir, { recursive: true });

            // Configuración recomendada
            const settings = {
                "editor.formatOnSave": true,
                "editor.defaultFormatter": "esbenp.prettier-vscode",
                "editor.codeActionsOnSave": {
                    "source.fixAll.eslint": true
                }
            };

            // Extensiones recomendadas
            const extensions = {
                recommendations: [
                    "esbenp.prettier-vscode",
                    "dbaeumer.vscode-eslint",
                    "bradlc.vscode-tailwindcss"
                ]
            };

            writeFileSync(path.join(vscodeDir, "settings.json"), JSON.stringify(settings, null, 4));

            writeFileSync(
                path.join(vscodeDir, "extensions.json"),
                JSON.stringify(extensions, null, 4)
            );

            console.log(chalk.green("   ✅ Configuración de VSCode creada"));
        } catch (error) {
            console.log(chalk.yellow("   ⚠️ Error configurando VSCode"));
        }

        return context;
    }
};
```

### Ejemplo: Plugin de Analytics (Opt-in)

```javascript
// analytics.plugin.js
import https from "https";

export default {
    name: "analytics",
    version: "1.0.0",
    description: "Reporta métricas de uso (opt-in)",
    author: "Devanthos",

    async onComplete(context) {
        // Solo si el usuario dio consentimiento
        if (process.env.DEVANTHOS_ANALYTICS !== "true") {
            return context;
        }

        const { framework, projectName } = context;

        try {
            const data = JSON.stringify({
                framework,
                timestamp: new Date().toISOString(),
                event: "project_created"
            });

            const options = {
                hostname: "api.devanthos.com",
                path: "/analytics",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": data.length
                }
            };

            const req = https.request(options);
            req.write(data);
            req.end();

            console.log("   📊 Métricas reportadas (¡gracias!)");
        } catch {
            // Fallar silenciosamente
        }

        return context;
    }
};
```

## 🚀 Uso

### Cargar plugin desde archivo local

```bash
# Crear plugin en el proyecto
echo 'export default { name: "test", version: "1.0.0" }' > devanthos.plugins.js

# Ejecutar CLI (carga automática)
npx create-devanthos-app
```

### Cargar plugins desde directorio

```bash
# Crear directorio de plugins
mkdir -p .devanthos/plugins

# Copiar plugins
cp mi-plugin.plugin.js .devanthos/plugins/

# Ejecutar CLI
npx create-devanthos-app
```

### Plugins globales

```bash
# Crear directorio global
mkdir -p ~/.devanthos/plugins

# Instalar plugin global
cp mi-plugin.plugin.js ~/.devanthos/plugins/

# Todos los proyectos usarán este plugin
npx create-devanthos-app
```

## 📝 Mejores Prácticas

1. **Nombra tus plugins claramente**: Usa nombres descriptivos
2. **Maneja errores gracefully**: No bloquees el flujo si algo falla
3. **Usa priority**: Ordena la ejecución de plugins (0-999)
4. **Respeta el contexto**: Devuelve el contexto modificado
5. **Sé consciente del rendimiento**: No hagas operaciones pesadas innecesarias
6. **Documenta tu plugin**: Incluye descripción y autor
7. **Opt-in para features invasivos**: Usa variables de entorno

## 🔒 Seguridad

- ⚠️ Los plugins tienen acceso completo al sistema
- ✅ Solo usa plugins de fuentes confiables
- ✅ Revisa el código antes de usarlo
- ✅ No ejecutes plugins desconocidos

## 📚 Recursos

- [Documentación oficial](https://docs.devanthos.com/plugins)
- [Ejemplos en GitHub](https://github.com/devanthos/cli-devanthos/tree/main/examples)
- [Comunidad Discord](https://discord.gg/devanthos)
