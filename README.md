# Calculadora ICS — CI/CD

> Aplicación web que calcula el promedio de tres parciales de la materia **Ingeniería y Calidad de Software (ICS)** e indica si el alumno aprobó o desaprobó. Desarrollada con Node.js + Express, dockerizada y desplegada automáticamente en Render mediante un pipeline de GitHub Actions.

---

## Tabla de contenidos

- [Demo](#demo)
- [Reglas de negocio](#reglas-de-negocio)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y uso local](#instalación-y-uso-local)
- [Scripts disponibles](#scripts-disponibles)
- [Tests](#tests)
- [Docker](#docker)
- [Pipeline CI/CD](#pipeline-cicd)
- [Secrets requeridos](#secrets-requeridos)

---

## Demo

La aplicación se despliega automáticamente en **Render** ante cada push a `main`. El pipeline completo corre los tests unitarios, construye la imagen Docker, despliega y ejecuta los tests E2E antes de notificar el resultado a Discord.

---

## Reglas de negocio

| ID    | Regla |
|-------|-------|
| RN-01 | Las notas válidas son números reales en el rango **[0, 10]** (inclusive). |
| RN-02 | Para aprobar, las **tres** notas deben ser **≥ 6**. |
| RN-03 | Si **al menos una** nota es **< 6**, el alumno desaprueba. |
| RN-04 | El promedio se calcula como `(parcial1 + parcial2 + parcial3) / 3`. |
| RN-05 | El promedio se devuelve **redondeado al entero más cercano**. |
| RN-06 | El resultado de aprobación es booleano: `true` = aprobó, `false` = desaprobó. |
| RN-07 | Si alguna nota no es número → lanza `"Las notas deben ser números"`. |
| RN-08 | Si alguna nota está fuera de [0, 10] → lanza `"Las notas deben estar entre 0 y 10"`. |

---

## Stack tecnológico

| Componente            | Tecnología                   | Versión   |
|-----------------------|------------------------------|-----------|
| Runtime               | Node.js                      | 22.x      |
| Framework web         | Express                      | ^4.18.2   |
| Tests unitarios       | Jest                         | ^29.0.0   |
| Tests E2E             | Playwright (Chromium)        | ^1.61.0   |
| Linter                | ESLint                       | ^8.57.0   |
| Contenedor            | Docker (`node:22-alpine`)    | —         |
| CI/CD                 | GitHub Actions               | —         |
| Plataforma de deploy  | Render (runtime: Docker)     | —         |
| Notificaciones        | Discord (webhook)            | —         |

---

## Estructura del proyecto

```
CalculadoraICS_CICD/
├── src/
│   ├── calculadora.js        # Función pura calcularPromedio()
│   ├── index.html            # Interfaz web
│   └── server.js             # Servidor Express (puerto 3000)
├── tests/
│   └── calculadora.test.js   # 16 tests unitarios (Jest)
├── e2e/
│   └── calculadora.spec.js   # 3 tests de integración E2E (Playwright)
├── .github/
│   └── workflows/
│       └── CICD.yaml         # Pipeline CI/CD (4 jobs)
├── .eslintrc.json            # Configuración de ESLint
├── .dockerignore
├── .gitignore
├── Dockerfile                # Imagen Docker (node:22-alpine, puerto 3000)
├── render.yaml               # Configuración de despliegue en Render
├── playwright.config.js      # Configuración de Playwright
├── package.json              # Dependencias y scripts npm
└── requirements.md           # Fuente de verdad del proyecto (Spec)
```

---

## Instalación y uso local

### Prerrequisitos

- **Node.js** 22.x o superior
- **npm** 10.x o superior
- **Docker** (opcional, para correr en contenedor)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/<usuario>/CalculadoraICS_CICD.git
cd CalculadoraICS_CICD

# 2. Instalar dependencias
npm ci

# 3. Iniciar el servidor
npm start
```

La aplicación estará disponible en `http://localhost:3000`.

---

## Scripts disponibles

| Script        | Comando         | Descripción                              |
|---------------|-----------------|------------------------------------------|
| `start`       | `npm start`     | Inicia el servidor Express en el puerto 3000 |
| `test`        | `npm test`      | Ejecuta los 16 tests unitarios con Jest  |
| `lint`        | `npm run lint`  | Analiza el código con ESLint             |

---

## Tests

### Tests unitarios (Jest)

Se ubican en `tests/calculadora.test.js` y cubren 16 escenarios sobre la función `calcularPromedio()`:

- **10 casos funcionales** (TC-01 a TC-10): verifican el cálculo del promedio y la condición de aprobación con distintas combinaciones de notas, incluyendo límites y valores decimales.
- **6 casos de validación** (TV-01 a TV-06): verifican que se lancen los errores correctos ante entradas inválidas (fuera de rango, tipo incorrecto, `null`, `undefined`).

```bash
npm test
```

### Tests E2E (Playwright)

Se ubican en `e2e/calculadora.spec.js` y corren contra la URL de producción en Render con Chromium:

| ID     | Descripción                         |
|--------|-------------------------------------|
| E2E-01 | La página carga correctamente       |
| E2E-02 | Error con campos vacíos             |
| E2E-03 | El botón "Limpiar" resetea el form  |

```bash
npx playwright test
```

---

## Docker

### Construir la imagen

```bash
docker build -t calculadora-ics .
```

### Correr el contenedor

```bash
docker run -p 3000:3000 calculadora-ics
```

La aplicación estará disponible en `http://localhost:3000`.

**Detalles de la imagen:**

- Base: `node:22-alpine` (~50 MB)
- Puerto expuesto: `3000`
- Punto de entrada: `src/server.js`

---

## Pipeline CI/CD

El workflow `.github/workflows/CICD.yaml` se dispara en cada `push` y `pull_request` a `main`.

```
push / pull_request a main
        │
        ▼
   [build]  ──── falla ──► [notify-discord] ❌ Pipeline fallido
        │
   éxito + solo push
        │
        ▼
   [deploy] ──► Render (curl deploy hook)
        │
        ▼
    [e2e]   ──► Playwright contra URL en producción
        │
        ▼
 [notify-discord] ✅ Pipeline exitoso
```

### Job: `build`

Corre en: `ubuntu-latest`. Se ejecuta en pushes **y** pull requests.

| Paso                   | Descripción                                |
|------------------------|--------------------------------------------|
| Checkout               | Descarga el código fuente                  |
| Setup Node.js 22.x     | Configura Node.js con caché de npm         |
| `npm ci`               | Instalación limpia y reproducible          |
| `npm run lint`         | Análisis estático con ESLint               |
| `npm test`             | Ejecuta los 16 tests unitarios con Jest    |
| `docker build`         | Construye la imagen Docker localmente      |
| Detectar paso fallido  | Exporta el paso exacto que falló (si hay)  |

### Job: `deploy`

Solo en `push` a `main`. Requiere que `build` haya pasado.

Dispara el redespliegue en Render vía webhook (`curl -X POST $RENDER_DEPLOY_HOOK_URL`).

### Job: `e2e`

Solo en `push` a `main`. Requiere que `deploy` haya pasado.

Instala Playwright con Chromium (con caché) y ejecuta los 3 tests E2E contra la URL de producción.

### Job: `notify-discord`

Siempre se ejecuta (al final, independientemente del resultado). Envía un embed a Discord con:

- ✅ **Verde** → Pipeline exitoso
- ❌ **Rojo** → Pipeline fallido + job y paso exacto donde ocurrió el fallo
- Repositorio, rama, autor, commit (con link) y link al run de GitHub Actions

---

## Secrets requeridos

Configurar en **Settings → Secrets and variables → Actions** del repositorio:

| Secret                  | Descripción                                          |
|-------------------------|------------------------------------------------------|
| `RENDER_DEPLOY_HOOK_URL`| URL del webhook de Render para disparar el deploy    |
| `DISCORD_WEBHOOK_URL`   | URL del webhook de Discord para las notificaciones   |