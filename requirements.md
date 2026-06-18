# Requirements — Calculadora de Promedio ICS

> **Spec Driven Development**: Este archivo es la fuente de verdad del proyecto.
> Toda implementación, test y decisión de diseño debe poder trazarse hasta una sección de este documento.
> Si algo no está aquí, no se implementa. Si hay ambigüedad, se resuelve acá primero.

---

## 1. Descripción General

Aplicación web escrita en **JavaScript (Node.js)** que calcula el promedio de un alumno en la materia **Ingeniería y Calidad de Software (ICS)** a partir de tres notas de parcial, e indica si aprobó o desaprobó. Expone una interfaz web servida con **Express** y es desplegada como contenedor **Docker** en **Render**.

---

## 2. Reglas de Negocio

Estas reglas son el núcleo del spec. Cada una genera al menos un test case obligatorio.

| ID    | Regla |
|-------|-------|
| RN-01 | Las notas válidas son números reales en el rango **[0, 10]** (inclusive). |
| RN-02 | Para aprobar, las **tres** notas deben ser **≥ 6**. |
| RN-03 | Si **al menos una** nota es **< 6**, el alumno desaprueba la materia. |
| RN-04 | El promedio se calcula como `(parcial1 + parcial2 + parcial3) / 3`. |
| RN-05 | El promedio se devuelve **redondeado a un número entero sin decimales**. |
| RN-06 | El resultado de aprobación es un valor booleano: `true` = aprobó, `false` = desaprobó. |
| RN-07 | Si alguna nota no es un número, la función debe lanzar un error con el mensaje `"Las notas deben ser números"`. |
| RN-08 | Si alguna nota está fuera del rango [0, 10], la función debe lanzar un error con el mensaje `"Las notas deben estar entre 0 y 10"`. |

---

## 3. Especificación de la Función

### Archivo

`src/calculadora.js`

### Firma

```js
calcularPromedio(parcial1, parcial2, parcial3)
```

### Parámetros

| Parámetro | Tipo   | Descripción                       |
|-----------|--------|-----------------------------------|
| parcial1  | number | Nota del primer parcial (0 – 10)  |
| parcial2  | number | Nota del segundo parcial (0 – 10) |
| parcial3  | number | Nota del tercer parcial (0 – 10)  |

### Retorno — caso exitoso

```js
{
  promedio: number,   // entero redondeado
  aprobado: boolean
}
```

### Retorno — caso de error

La función **lanza una excepción** (`throw new Error(...)`). No devuelve un objeto de error.

| Situación                  | Mensaje del error                        | Regla  |
|----------------------------|------------------------------------------|--------|
| Alguna nota no es número   | `"Las notas deben ser números"`          | RN-07  |
| Alguna nota fuera de rango | `"Las notas deben estar entre 0 y 10"`   | RN-08  |

---

## 4. Casos de Prueba — Tests Unitarios (Jest)

Archivo: `tests/calculadora.test.js`

### 4.1 Casos de aprobación / desaprobación

| ID    | parcial1 | parcial2 | parcial3 | promedio esperado | aprobado esperado | Motivo                       |
|-------|----------|----------|----------|-------------------|-------------------|------------------------------|
| TC-01 | 7        | 8        | 9        | 8                 | true              | Las tres notas ≥ 6           |
| TC-02 | 6        | 6        | 6        | 6                 | true              | Exactamente en el límite     |
| TC-03 | 5        | 8        | 9        | 7                 | false             | parcial1 < 6                 |
| TC-04 | 7        | 5        | 9        | 7                 | false             | parcial2 < 6                 |
| TC-05 | 7        | 8        | 5        | 7                 | false             | parcial3 < 6                 |
| TC-06 | 0        | 0        | 0        | 0                 | false             | Todas en mínimo              |
| TC-07 | 10       | 10       | 10       | 10                | true              | Todas en máximo              |
| TC-08 | 5        | 5        | 5        | 5                 | false             | Todas < 6                    |
| TC-09 | 6        | 6        | 5        | 6                 | false             | Dos aprueban, una desaprueba |
| TC-10 | 7.5      | 8.3      | 6.2      | 7                 | true              | Notas decimales, todas ≥ 6   |

### 4.2 Casos de validación de entrada

| ID    | Entrada                             | Comportamiento esperado                             | Regla  |
|-------|-------------------------------------|-----------------------------------------------------|--------|
| TV-01 | `(-1, 7, 8)`                        | Lanza `"Las notas deben estar entre 0 y 10"`        | RN-08  |
| TV-02 | `(11, 7, 8)`                        | Lanza `"Las notas deben estar entre 0 y 10"`        | RN-08  |
| TV-03 | `(7, 7, 11)`                        | Lanza `"Las notas deben estar entre 0 y 10"`        | RN-08  |
| TV-04 | `("abc", 7, 8)`                     | Lanza `"Las notas deben ser números"`               | RN-07  |
| TV-05 | `(null, 7, 8)`                      | Lanza `"Las notas deben ser números"`               | RN-07  |
| TV-06 | `(undefined, undefined, undefined)` | Lanza `"Las notas deben ser números"`               | RN-07  |

---

## 5. Casos de Prueba — Tests de Integración E2E (Playwright)

Archivo: `e2e/calculadora.spec.js`  
Entorno: navegador Chromium contra la URL del entorno desplegado en Render.

| ID    | Descripción                          | Acción                                                         | Resultado esperado                                          |
|-------|--------------------------------------|----------------------------------------------------------------|-------------------------------------------------------------|
| E2E-01 | La página carga correctamente       | Navegar a `/`                                                  | Título de página = `"Calculadora ICS"`, heading visible     |
| E2E-02 | Error con campos vacíos             | Click en "Calcular promedio" sin completar campos              | `#errorMsg` visible con texto `"Las notas deben ser números"` |
| E2E-03 | El botón limpiar resetea el form    | Ingresar 7, 8, 9 → calcular → limpiar                         | `#p1`, `#p2`, `#p3` vacíos; `#result` no visible            |

---

## 6. Estructura del Proyecto

```
CalculadoraICS_CICD/
├── src/
│   ├── calculadora.js        # Función pura calcularPromedio()
│   ├── index.html            # Interfaz web
│   └── server.js             # Servidor Express (puerto 3000)
├── tests/
│   └── calculadora.test.js   # 16 tests unitarios (Jest)
├── e2e/
│   └── calculadora.spec.js   # 3 tests de integración (Playwright)
├── .github/
│   └── workflows/
│       └── CICD.yaml         # Pipeline CI/CD (4 jobs)
├── .eslintrc.json            # Configuración de ESLint
├── Dockerfile                # Imagen Docker (node:22-alpine, puerto 3000)
├── render.yaml               # Configuración de despliegue en Render
├── playwright.config.js      # Configuración de Playwright
├── package.json              # Dependencias y scripts npm
└── requirements.md           # Fuente de verdad (este archivo)
```

---

## 7. Stack Tecnológico

| Componente          | Tecnología                  | Versión   |
|---------------------|-----------------------------|-----------|
| Runtime             | Node.js                     | 22.x      |
| Framework web       | Express                     | ^4.18.2   |
| Tests unitarios     | Jest                        | ^29.0.0   |
| Tests de integración| Playwright (Chromium)       | ^1.61.0   |
| Linter              | ESLint                      | ^8.57.0   |
| Contenedor          | Docker (node:22-alpine)     | —         |
| CI/CD               | GitHub Actions              | —         |
| Plataforma de deploy| Render (runtime: Docker)    | —         |
| Feedback            | Discord (webhook)           | —         |

---

## 8. Pipeline de CI/CD (GitHub Actions)

Archivo: `.github/workflows/CICD.yaml`  
Disparador: `push` a `main` y `pull_request` a `main`.

### 8.1 Flujo general

```
push / pull_request a main
        │
        ▼
   [build]  ──── falla ──► [notify-discord] (Pipeline fallido)
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
 [notify-discord] (Pipeline exitoso)
```

### 8.2 Job: `build`

Corre en: `ubuntu-latest`. Se ejecuta en pushes y pull requests.

| Paso                  | ID          | Comando                            | Descripción                                 |
|-----------------------|-------------|------------------------------------|---------------------------------------------|
| Check out repository  | —           | `actions/checkout@v4`              | Descarga el código fuente                   |
| Use Node.js 22.x      | —           | `actions/setup-node@v4.4.0`        | Configura Node.js con caché de npm          |
| Install dependencies  | `install`   | `npm ci`                           | Instalación limpia y reproducible           |
| Lint ESLint           | `lint`      | `npm run lint`                     | Análisis estático del código                |
| Test unitarios        | `unit-test` | `npm test`                         | Ejecuta los 16 tests unitarios con Jest     |
| Build Docker          | `docker`    | `docker build -t calculadora-ics .`| Construye la imagen localmente              |
| Detectar paso fallido | `check`     | —                                  | Solo si hay fallo: exporta qué paso falló   |

Output del job: `failed_step` (nombre del paso que falló, si aplica).

### 8.3 Job: `deploy`

Corre en: `ubuntu-latest`. Solo en `push` a `main`. Requiere que `build` haya pasado.

| Paso             | Comando                        | Descripción                                              |
|------------------|--------------------------------|----------------------------------------------------------|
| Deploy to Render | `curl -X POST $RENDER_DEPLOY_HOOK_URL` | Dispara el deploy en Render vía webhook       |

Secret requerido: `RENDER_DEPLOY_HOOK_URL`.  
Render construye la imagen Docker a partir del `Dockerfile` y la despliega.

### 8.4 Job: `e2e`

Corre en: `ubuntu-latest`. Solo en `push` a `main`. Requiere que `deploy` haya pasado.

| Paso                     | Comando                                    | Descripción                             |
|--------------------------|--------------------------------------------|-----------------------------------------|
| Install dependencies     | `npm ci`                                   | Instala dependencias incluyendo Playwright |
| Cache Playwright browsers| `actions/cache@v4`                         | Caché del binario de Chromium           |
| Install Playwright Browsers | `npx playwright install --with-deps chromium` | Instala Chromium              |
| Run Playwright tests     | `npx playwright test`                      | Ejecuta los 3 tests E2E contra Render   |

### 8.5 Job: `notify-discord`

Corre en: `ubuntu-latest`. Siempre (`if: always()`). Requiere que `build`, `deploy` y `e2e` hayan terminado (con cualquier resultado).

Envía un embed a Discord con:

| Campo        | Contenido                                              |
|--------------|--------------------------------------------------------|
| Título       | `"Pipeline exitoso"` o `"Pipeline fallido"`            |
| Color        | Verde (`#2ECC71`) en éxito, Rojo (`#E74C3C`) en fallo |
| Repositorio  | Nombre del repo                                        |
| Rama         | Rama que disparó el pipeline                           |
| Autor        | Usuario de GitHub                                      |
| Commit       | Hash corto con link al commit                          |
| Job fallido  | Nombre del job (solo en fallo)                         |
| Paso fallido | Nombre del paso exacto (solo en fallo de `build` o `e2e`) |
| Footer       | Link directo al run en GitHub Actions                  |

Secret requerido: `DISCORD_WEBHOOK_URL`.

---

## 9. Configuración de Docker

Archivo: `Dockerfile`

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
EXPOSE 3000
CMD ["node", "src/server.js"]
```

- Imagen base: `node:22-alpine` (liviana, ~50MB)
- Puerto expuesto: `3000`
- Punto de entrada: `src/server.js` (servidor Express)

---

## 10. Configuración de Render

Archivo: `render.yaml`

- Tipo de servicio: web
- Runtime: Docker
- Dockerfile: `./Dockerfile`
- Plan: free
- Health check: `/health`
- Variable de entorno: `NODE_ENV=production`