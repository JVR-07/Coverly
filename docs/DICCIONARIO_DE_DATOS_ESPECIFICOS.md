# Especialización de Datos: Productos y Clientes — Coverly

Este documento define la estructura detallada de los datos para los diferentes tipos de seguros y el perfilamiento avanzado de clientes, asegurando que el motor de recomendaciones tenga información estructurada y validada.

## 1. Catálogo de Seguros (Estructura por Tipo)

Cada producto de seguro comparte una base común, pero requiere campos específicos según su categoría.

### A. Base Común (SeguroBase)

- `id`: UUID.
- `name`: String (Nombre comercial).
- `type`: Enum (AUTO, VIDA, INCENDIO, CELULAR).
- `priceBase`: Decimal (Prima base anual/mensual).
- `isActive`: Boolean.
- `coverages`: List<String> (Lista de coberturas incluidas).

### B. Especificaciones por Categoría

| Tipo de Seguro             | Atributos Específicos                                                                    | Requisitos / Validaciones                                           |
| :------------------------- | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Seguro de Auto**         | `brand`, `model`, `year`, `useType` (Personal/Uber), `securitySystems` (Boolean).        | Antigüedad máxima: 15 años. Solo uso particular o comercial ligero. |
| **Seguro de Vida**         | `maxAge`, `smoker` (Boolean), `occupationRisk` (Enum: Low, Mid, High), `coverageAmount`. | Edad máxima de contratación: 70 años.                               |
| **Seguro Contra Incendio** | `propertyType` (Casa/Depto/Local), `m2`, `locationRiskZone` (Enum: 1-5), `contentValue`. | Requiere dirección validada.                                        |
| **Seguro de Celulares**    | `deviceBrand`, `deviceModel`, `purchaseValue`, `screenProtection` (Boolean).             | Antigüedad máxima dispositivo: 24 meses.                            |

---

## 2. Perfilamiento Profundo del Cliente (`Client`)

Se expande el modelo de cliente para soportar análisis de riesgo y capacidad económica.

### A. Información Económica (`economicProfile`)

- `annualIncome`: Decimal (Ingresos anuales brutos).
- `employmentStatus`: Enum (Empleado, Independiente, Desempleado, Jubilado).
- `monthlyExpenses`: Decimal (Estimado de gastos fijos).
- `debtLevel`: Enum (Ninguna, Bajo, Medio, Alto).

### B. Análisis de Riesgo (`riskProfile`)

- `riskScore`: Integer (0-100, calculado internamente).
- `healthStatus`: Enum (Excelente, Bueno, Regular, Crítico) - _Solo para Vida_.
- `drivingRecord`: Enum (Limpio, 1-2 siniestros, +3 siniestros) - _Solo para Auto_.
- `claimsHistory`: List<String> (Historial de reclamos previos).

---

## 3. Diccionario de Enumeraciones (Enums)

Para evitar ambigüedades en la base de datos y la API:

```typescript
enum InsuranceType {
  AUTO = "AUTO",
  LIFE = "LIFE",
  FIRE = "FIRE",
  MOBILE = "MOBILE",
}

enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

enum ClientType {
  NEW = "NEW",
  RECURRING = "RECURRING",
  VIP = "VIP",
}

enum PropertyType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
  COMMERCIAL = "COMMERCIAL",
}
```

---

## 4. Validaciones de Negocio Críticas

1. **Integridad de Datos:** No se puede generar una recomendación si el cliente no tiene definido un `economicProfile`.
2. **Restricción de Edad:** El seguro de Vida se bloquea automáticamente si `age > 70`.
3. **Validación de Dispositivo:** Para seguros de celulares, el `purchaseValue` no puede ser superior al precio de mercado actual indexado.
4. **Zona de Riesgo:** Para incendios, si `locationRiskZone == 5`, se requiere aprobación manual de un Supervisor.
