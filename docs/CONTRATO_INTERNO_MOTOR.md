# Contrato Interno: Next.js (Core) <-> FastAPI (Motor Inteligente)

Este documento rige la comunicación estrictamente **interna** entre el contenedor de la aplicación transaccional (Next.js) y el microservicio de recomendaciones (Python/FastAPI).

## Principios Base

- **Red Cerrada:** FastAPI no debe estar expuesto a Internet. Solo aceptará peticiones HTTP provenientes y originadas desde el Backend (API de Next.js u ORM).
- **Rápido y Bloqueante (Síncrono):** El frontend hará "await" del resultado visual para mostrar la cotización. El script en Python debe resolver en milisegundos.
- **Microservicio Sin Estado:** El Motor no debe conectarse directamente a la Base de Datos. El Core (Next.js) se encarga de ir a PostgreSQL, recopilar todos los datos de cliente y los catálogos activos, y enviar el mega-JSON condicionado a FastAPI.

---

## 1. Evaluación de Scoring y Ranking

### POST `/api/v1/engine/evaluate`

*Este Endpoint recibe el perfil del cliente, junto con el catálogo disponible, y procesa la evaluación emitiendo recomendaciones y justificaciones.*

### A. Request Payload (Body)

Desde Core a Motor:

```json
{
  "client": {
    "id": "uuid-cliente",
    "age": 35,
    "gender": "M",
    "economic_profile": {
      "annual_income": 450000.00,
      "occupation": "Ingeniero",
      "dependents": 2
    },
    "risk_level": "LOW",
    "needs": ["AUTO", "LIFE"]
  },
  "available_products": [
    {
      "id": "uuid-producto-1",
      "name": "Vida Premium",
      "type": "LIFE",
      "price_base": 15000.00,
      "specific_data": {
        "max_age": 70
      }
    },
    {
      "id": "uuid-producto-2",
      "name": "Auto Respaldo Completo",
      "type": "AUTO",
      "price_base": 8000.00,
      "specific_data": {
        "max_vehicle_age": 10
      }
    }
  ],
  "active_promotions": [
    {
      "id": "uuid-promo",
      "type": "CROSS_SELL",
      "discount_percent": 10.0
    }
  ]
}
```

### B. Response Payload (Body)

Desde Motor a Core:

```json
{
  "success": true,
  "execution_time_ms": 42.5,
  "global_score_calculated": 88.5,
  "recommendations": [
    {
       "product_id": "uuid-producto-2",
       "match_score": 95.0,
       "final_price": 8000.00,
       "promotions_applied": [],
       "justifications": [
          "El margen costo/ingreso es menor a 2%.",
          "El seguro encaja con su necesidad principal declarada: AUTO."
       ]
    },
    {
       "product_id": "uuid-producto-1",
       "match_score": 75.0,
       "final_price": 13500.00,
       "promotions_applied": ["uuid-promo"],
       "justifications": [
          "Beneficio cross-sell activado por llevar seguro comercial de auto.",
          "Cubre protección a dependientes (2)."
       ]
    }
  ],
  "excluded_products": [
    {
      "product_id": "uuid-producto-3",
      "reason": "Excede edad máxima de cobertura permitida (70)."
    }
  ]
}
```

### C. Manejo de Errores de Fast API

Si falta información para procesar o hay un error de validación interna.

```json
{
  "success": false,
  "error": "El perfil económico del cliente no permite estimar el riesgo (falta income)."
}
```

## Beneficios de esta aproximación delegada

Como el Motor de Recomendación exige el catálogo de productos por parte de Next.js en la entrada, esto evita que el motor se vuelva pesado realizando *joins* de SQL.
