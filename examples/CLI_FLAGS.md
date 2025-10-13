# 🚀 CLI Flags y Opciones

## Uso del CLI

El CLI de Devanthos soporta dos modos de operación:

### 1️⃣ Modo Interactivo (Wizard)

Ejecuta el comando sin argumentos para iniciar el wizard interactivo:

```bash
npx create-devanthos-app
```

El wizard te guiará a través de las siguientes opciones:

- ✅ Selección de framework (Astro, Next.js, Expo)
- ✅ Nombre del proyecto
- ✅ Instalación automática de dependencias
- ✅ Inicialización de repositorio Git

---

### 2️⃣ Modo No-Interactivo (CLI Flags)

Crea proyectos directamente con flags para automatización y CI/CD:

```bash
npx create-devanthos-app <nombre-proyecto> [opciones]
```

## Opciones Disponibles

| Flag                         | Descripción                               | Valor por defecto                    |
| ---------------------------- | ----------------------------------------- | ------------------------------------ |
| `-t, --template <framework>` | Framework a usar: `astro`, `next`, `expo` | _(requerido en modo no-interactivo)_ |
| `--no-install`               | No instalar dependencias automáticamente  | `false` (instala por defecto)        |
| `--no-git`                   | No inicializar repositorio Git            | `false` (inicializa por defecto)     |
| `--skip-update-check`        | Saltar verificación de actualizaciones    | `false` (verifica por defecto)       |
| `-V, --version`              | Mostrar versión del CLI                   | -                                    |
| `-h, --help`                 | Mostrar ayuda                             | -                                    |

---

## Ejemplos de Uso

### Crear proyecto básico

```bash
npx create-devanthos-app mi-landing -t astro
```

### Crear sin instalar dependencias

```bash
npx create-devanthos-app mi-app -t next --no-install
```

### Crear sin Git

```bash
npx create-devanthos-app mi-mobile -t expo --no-git
```

### Crear sin actualizaciones ni Git (ideal para CI/CD)

```bash
npx create-devanthos-app build-app -t next --no-git --skip-update-check
```

### Crear proyecto completamente desatendido

```bash
npx create-devanthos-app auto-project -t astro --no-install --no-git --skip-update-check
```

---

## 🤖 Uso en CI/CD

### GitHub Actions

```yaml
name: Create Devanthos Project

on:
    workflow_dispatch:
        inputs:
            project_name:
                description: "Nombre del proyecto"
                required: true
                default: "mi-proyecto"
            framework:
                description: "Framework"
                required: true
                type: choice
                options:
                    - astro
                    - next
                    - expo

jobs:
    create:
        runs-on: ubuntu-latest
        steps:
            - name: Crear proyecto
              run: |
                  npx create-devanthos-app ${{ inputs.project_name }} \
                    -t ${{ inputs.framework }} \
                    --skip-update-check

            - name: Commit changes
              run: |
                  cd ${{ inputs.project_name }}
                  git config user.name "GitHub Actions"
                  git config user.email "actions@github.com"
                  git add -A
                  git commit -m "Initial commit"
```

### GitLab CI

```yaml
create_project:
    script:
        - npx create-devanthos-app mi-proyecto -t astro --skip-update-check
    artifacts:
        paths:
            - mi-proyecto/
```

### Script Bash para múltiples proyectos

```bash
#!/bin/bash

PROJECTS=("landing-1" "landing-2" "landing-3")
TEMPLATE="astro"

for project in "${PROJECTS[@]}"; do
  echo "Creando $project..."
  npx create-devanthos-app "$project" -t "$TEMPLATE" --no-install
done

echo "✅ Todos los proyectos creados"
```

---

## ⚙️ Inicialización de Git

El CLI ahora inicializa Git automáticamente con:

- ✅ Repositorio Git inicializado
- ✅ Branch principal: `main`
- ✅ Commit inicial: "🎉 Initial commit from create-devanthos-app"
- ✅ Todos los archivos agregados al stage

### Verificación de Git

El CLI verifica automáticamente si:

- Git está instalado en el sistema
- El directorio ya es un repositorio Git

Si Git no está disponible o ya está inicializado, el proceso continúa sin errores.

---

## 📋 Validaciones

### Nombre del Proyecto

El CLI valida que el nombre del proyecto:

- ✅ No esté vacío
- ✅ Solo contenga letras, números, guiones y guiones bajos
- ✅ No empiece con guión o guión bajo
- ✅ No exceda 50 caracteres

### Template

El CLI valida que el template sea uno de:

- `astro` - Sitios estáticos y landing pages
- `next` - Aplicaciones web dinámicas
- `expo` - Aplicaciones móviles

---

## 🆘 Solución de Problemas

### Error: "Debes especificar un template con -t"

```bash
# ❌ Incorrecto
npx create-devanthos-app mi-proyecto

# ✅ Correcto
npx create-devanthos-app mi-proyecto -t astro
```

### Error: "Template inválido"

```bash
# ❌ Incorrecto
npx create-devanthos-app mi-proyecto -t react

# ✅ Correcto
npx create-devanthos-app mi-proyecto -t next
```

### Git no se inicializa

Si Git no se inicializa automáticamente:

1. Verifica que Git esté instalado:

    ```bash
    git --version
    ```

2. Inicializa manualmente:
    ```bash
    cd mi-proyecto
    git init
    git add -A
    git commit -m "Initial commit"
    ```

---

## 🔄 Migración desde versiones anteriores

Si usabas el CLI en versiones anteriores, ahora puedes:

### Antes (solo interactivo)

```bash
npx create-devanthos-app
# Luego responder preguntas...
```

### Ahora (interactivo o con flags)

```bash
# Interactivo (mismo comportamiento)
npx create-devanthos-app

# No-interactivo (nuevo)
npx create-devanthos-app mi-app -t astro
```

---

## 📚 Recursos Adicionales

- [Documentación completa](https://docs.devanthos.com)
- [Repositorio en GitHub](https://github.com/devanthos/create-devanthos-app)
- [Reportar issues](https://github.com/devanthos/create-devanthos-app/issues)
- [Discord de soporte](https://discord.gg/devanthos)
