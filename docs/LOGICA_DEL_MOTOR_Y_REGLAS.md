# Lógica del Motor y Reglas de Recomendación — Coverly

Este documento describe el "cerebro" del sistema: cómo se procesan los datos del cliente y el catálogo de productos para generar recomendaciones inteligentes, personalizadas y justificadas.

## 1. Sistema de Scoring (Algoritmo de Adecuación)

El Score de Adecuación ($S$) es un valor de 0 a 100 que determina qué tan bien encaja un producto con un cliente. Se calcula mediante una suma ponderada de cuatro pilares:

$$S = (P \times 0.40) + (N \times 0.30) + (H \times 0.20) + (R \times 0.10)$$

| Variable | Nombre           | Descripción                                                                                            |
| :------- | :--------------- | :----------------------------------------------------------------------------------------------------- |
| **P**    | Perfil Económico | Afinidad entre el precio del seguro y los ingresos/gastos del cliente ($annualIncome$ vs $priceBase$). |
| **N**    | Necesidades      | Coincidencia entre lo que el cliente declaró buscar y el tipo de producto.                             |
| **H**    | Historial        | Bonus por lealtad o penalización por alta siniestralidad previa.                                       |
| **R**    | Riesgo           | Ajuste según el `riskScore` calculado para el cliente.                                                 |

---

## 2. Reglas de Elegibilidad (Filtros Hard)

Antes de calcular el score, el motor aplica filtros binarios. Si un producto no pasa estos filtros, **no se muestra** al agente.

### A. Reglas por Producto

- **Auto:** Si el vehículo tiene $> 15$ años, excluir seguros de tipo "Plus" o "Premium".
- **Vida:** Si $age > 70$, excluir automáticamente todos los productos de Vida.
- **Celular:** Si la antigüedad del dispositivo es $> 24$ meses, excluir seguro de celular.

### B. Reglas de Riesgo

- Si $riskLevel == CRITICAL$, el motor solo puede recomendar productos de nivel "Básico".
- Si $employmentStatus == DESEMPLEADO$, se excluyen productos con primas anuales $> 5\%$ del ingreso declarado.

---

## 3. Lógica de Promociones y Cross-selling

El motor busca incentivar la conversión inyectando promociones dinámicas:

- **Estrategia de Bienvenida:** Si $clientType == NEW$, aplicar automáticamente un 10% de descuento en la "Mejor Opción".
- **Estrategia de Cross-sell:** Si el cliente ya tiene un seguro de AUTO activo, aplicar un 15% de descuento en el seguro de VIDA si se recomienda como alternativa.
- **Estrategia de Fidelidad:** Si $claimsHistory$ está vacío (0 siniestros), aplicar bono de "Conductor Seguro" (5% descuento adicional).

---

## 4. Justificación de la IA (Insights)

Para cada recomendación, el motor debe generar al menos dos "justificaciones" cualitativas:

- _Ejemplo Económico:_ "Este seguro representa menos del 2% de tus ingresos anuales, garantizando estabilidad financiera."
- _Ejemplo de Riesgo:_ "Dada tu ocupación de alto riesgo, la cobertura de Vida Extendida es la más segura para tus dependientes."
- _Ejemplo de Necesidad:_ "Has indicado que te preocupa el robo; este plan incluye cobertura total sin deducible por robo."

---

## 5. Ciclo de Vida de la Recomendación

Las recomendaciones pasan por los siguientes estados:

1.  **GENERADA:** Creada por el motor pero no vista por el agente.
2.  **PRESENTADA:** El agente la visualiza en pantalla.
3.  **AJUSTADA:** El agente modificó algún parámetro (ej. quitó una cobertura opcional).
4.  **ACEPTADA:** El cliente aceptó la propuesta (se procede a cierre).
5.  **RECHAZADA:** El cliente declinó. _Obligatorio:_ El agente debe seleccionar un motivo de rechazo (Precio, Cobertura, Competencia).

---

## 6. Configuración por Supervisor

Los Supervisores pueden ajustar los pesos del scoring desde su panel:

- Aumentar el peso de **Fidelidad** durante campañas de retención.
- Modificar los umbrales de **Riesgo** según directrices anuales de la aseguradora.
