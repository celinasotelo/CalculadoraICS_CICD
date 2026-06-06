# Requirements — Calculadora de Promedio ICS

> **Spec Driven Development**: Este archivo es la fuente de verdad del proyecto.
> Toda implementación, test y decisión de diseño debe poder trazarse hasta una sección de este documento.
> Si algo no está aquí, no se implementa. Si hay ambigüedad, se resuelve acá primero.

---

## 1. Descripción General

Función pura escrita en **JavaScript (Node.js)** que calcula el promedio de un alumno en la materia **Ingeniería y Calidad de Software (ICS)** a partir de tres notas de parcial, e indica si aprobó o desaprobó.

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
  promedio: number,   
  aprobado: boolean
}
```

### Retorno — caso de error

La función **lanza una excepción** (`throw new Error(...)`). No devuelve un objeto de error.

| Situación                  | Mensaje del error                        | Regla  |
|----------------------------|------------------------------------------|--------|
| Alguna nota no es número   | `"Las notas deben ser números"`          | RN-07  |
| Alguna nota fuera de rango | `"Las notas deben estar entre 0 y 10"`  | RN-08  |

---

## 4. Casos de Prueba Obligatorios

Estos casos deben existir como tests **antes** de la implementación.

### 4.1 Casos de aprobación / desaprobación

| ID    | parcial1 | parcial2 | parcial3 | promedio esperado | aprobado esperado | Motivo                       |
|-------|----------|----------|----------|-------------------|-------------------|------------------------------|
| TC-01 | 7        | 8        | 9        | 8.00              | true              | Las tres notas ≥ 6           |
| TC-02 | 6        | 6        | 6        | 6.00              | true              | Exactamente en el límite     |
| TC-03 | 5        | 8        | 9        | 7.33              | false             | parcial1 < 6                 |
| TC-04 | 7        | 5        | 9        | 7.00              | false             | parcial2 < 6                 |
| TC-05 | 7        | 8        | 5        | 6.67              | false             | parcial3 < 6                 |
| TC-06 | 0        | 0        | 0        | 0.00              | false             | Todas en mínimo              |
| TC-07 | 10       | 10       | 10       | 10.00             | true              | Todas en máximo              |
| TC-08 | 5        | 5        | 5        | 5.00              | false             | Todas < 6                    |
| TC-09 | 6        | 6        | 5        | 5.67              | false             | Dos aprueban, una desaprueba |
| TC-10 | 7.5      | 8.3      | 6.2      | 7.33              | true              | Notas decimales, todas ≥ 6   |

### 4.2 Casos de validación de entrada

| ID    | Entrada                        | Comportamiento esperado                               | Regla  |
|-------|--------------------------------|-------------------------------------------------------|--------|
| TV-01 | `(-1, 7, 8)`                   | Lanza `"Las notas deben estar entre 0 y 10"`         | RN-08  |
| TV-02 | `(11, 7, 8)`                   | Lanza `"Las notas deben estar entre 0 y 10"`         | RN-08  |
| TV-03 | `(7, 7, 11)`                   | Lanza `"Las notas deben estar entre 0 y 10"`         | RN-08  |
| TV-04 | `("abc", 7, 8)`                | Lanza `"Las notas deben ser números"`                | RN-07  |
| TV-05 | `(null, 7, 8)`                 | Lanza `"Las notas deben ser números"`                | RN-07  |
| TV-06 | `(undefined, undefined, undefined)` | Lanza `"Las notas deben ser números"`           | RN-07  |

---

## 5. Estructura del Proyecto

```
ics-grade-calculator/
├── src/
│   └── calculadora.js        # Función pura calcularPromedio()
├── tests/
│   └── calculadora.test.js   # Tests unitarios (TC-01 a TC-10, TV-01 a TV-06)
├── package.json
├── Dockerfile
└── requirements.md           # Este archivo — fuente de verdad
```

---

## 6. Stack Tecnológico — Fase actual

| Componente  | Tecnología       |
|-------------|------------------|
| Runtime     | Node.js (≥ 18)   |
| Testing     | Jest             |

---

## 7. Roadmap de Fases

El proyecto crece fase a fase. Cada fase tiene su propia sección en este documento
**antes** de ser implementada.

| Fase | Contenido                                      | Estado     |
|------|------------------------------------------------|------------|
| 1    | Función pura + tests unitarios                 | ✅ Actual  |
| 2    | Lint (ESLint)                                  | 🔲 Próxima |
| 3    | Docker                                         | 🔲 Futura  |
| 4    | CI con GitHub Actions                          | 🔲 Futura  |
| 5    | Deploy en Render                               | 🔲 Futura  |

---