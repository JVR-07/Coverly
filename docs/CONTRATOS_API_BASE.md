# Contratos API Base — Coverly

## Propósito

Este documento define los contratos iniciales de comunicación entre frontend, backend y módulos del sistema.

Su objetivo es:

* Establecer interfaces claras desde el inicio
* Permitir desarrollo paralelo
* Reducir ambigüedad entre equipos
* Proveer contexto estructurado para agentes AI

Estos contratos representan una **versión base evolutiva** y podrán expandirse iterativamente.

---

## Convenciones Generales

### Base URL

```bash
/api/
```

---

### Formato de Comunicación

Tipo: `JSON`
Encoding: `UTF-8`

---

### Respuesta Estándar Exitosa

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

---

### Respuesta Estándar de Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

---

## Endpoints Base

### Autenticación (`/api/auth`)

#### POST `/api/auth/login`

Autentica a un usuario y devuelve el token de sesión.

* Request Body:

```json
{
  "email": "agente@coverly.com",
  "password": "password123"
}
```

* Response (`data`):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "user": {
    "id": "uuid",
    "email": "agente@coverly.com",
    "role": "agent"
  }
}
```

#### GET `/api/auth/me`

Devuelve la información del usuario en sesión

* Response (`data`):

```json
{
  "id": "uuid",
  "name": "Nombre Completo",
  "email": "agente@coverly.com",
  "role": "agent"
}
```

---

### Usuarios (`/api/users`)

Permite la gestión de cuentas para agentes, supervisores y administradores.

#### GET `/api/users`

Lista todos los usuarios del sistema.

* **Query Params**: `?page=1&limit=10&role=agent`.

* **Response (`data`)**: Arreglo de objetos de usuario.

#### POST `/api/users`

Crea un nuevo usuario.

* Request Body:

```json
{
  "name": "Juan Perez",
  "email": "juan.perez@coverly.com",
  "password": "SecurePassword123!",
  "role": "agent" 
}
```

#### PUT `/api/users/{id}`

Actualiza el rol o información de un usuario.

* Request Body:

```json
{
  "name": "Juan Perez Actualizado",
  "role": "supervisor",
  "isActive": true
}
```

---

### CLientes (`/api/clients`)

Gestiona el perfilamiento y la evaluación de riesgo de los clientes.

#### GET `/api/clients`

Lista los clientes registrados.

* **Query Params**: `?page=1&limit=10&search=nombre`.

#### POST `/api/clients`

Registra un nuevo cliente con todo su perfilamiento.

* **Request Body**:

```json
{
  "personalData": {
    "firstName": "Ana",
    "lastName": "Gomez",
    "dateOfBirth": "1985-06-15",
    "gender": "F",
    "contact": {
      "email": "ana@example.com",
      "phone": "+525551234567"
    }
  },
  "economicProfile": {
    "annualIncome": 450000,
    "occupation": "Ingeniera",
    "dependents": 2
  },
  "insuranceHistory": {
    "hasPreviousInsurance": true,
    "previousClaimsCount": 0
  },
  "clientType": "new",
  "needs": ["salud", "auto"],
  "riskLevel": "low"
}
```

* **Response (`data`):** El objeto completo del cliente creado incluyendo su id.

#### GET `/api/clients/{id}`

Obtiene el perfil completo de un cliente.

#### PUT `/api/clients/{id}`

Actualiza la información del cliente. Mismo formato que el POST, aceptando envíos parciales.

---

### Catálogo de Productos `/api/products`

Gestión de seguros, coberturas y restricciones.

#### GET `/api/products`

Lista el catálogo de productos.

* **Query Params**: `?type=salud&isActive=true`.

#### POST `/api/products`

Crea un nuevo seguro en el sistema.

* Request Body:

```json
{
  "name": "Seguro Auto Plus",
  "type": "auto",
  "description": "Cobertura amplia para vehículos de modelo reciente.",
  "priceBase": 12000.00,
  "coverages": [
    "Daños materiales",
    "Robo total",
    "Responsabilidad civil"
  ],
  "restrictions": [
    "Vehículos no mayores a 10 años",
    "Uso particular exclusivamente"
  ],
  "isActive": true
}
```

#### GET `/api/products/{id}`

Obtiene el detalle de un seguro específico.

#### PUT `/api/products/{id}`

Actualiza un producto (precios, coberturas o restricciones).

---

> Nota: Los siguientes endpoints son borradores, aún no se han definido en detalle.

### Recomendaciones (`/api/recommendations`)

#### Generar recomendación

POST `/recommendations/evaluate`

```json
{
  "clientId": "uuid"
}
```

Response:

```json
{
  "bestOption": {},
  "alternatives": [],
  "score": 0
}
```

---

### Promociones y Estrategias Comerciales (`/api/promotions`)

#### GET `/api/promotions/applicable/{clientId}`

Obtiene las promociones vigentes que aplican al perfil de un cliente específico.

* Response (`data`):

```json
[
  {
    "promotionId": "uuid",
    "name": "Descuento Buen Fin - Salud",
    "discountPercentage": 15,
    "appliesToProducts": ["product_id_1", "product_id_2"],
    "validUntil": "2026-11-30T23:59:59Z"
  }
]
```

---

### Reportes y Analítica (`/api/reports`)

#### GET `/api/reports/metrics`

Genera métricas de rendimiento general (conversiones, rechazos).

* **Query Params**: `?startDate=2026-01-01&endDate=2026-03-01`.

* Response (`data`):

```json
{
  "totalQuotes": 150,
  "acceptedRecommendations": 45,
  "rejectedRecommendations": 105,
  "conversionRate": 30.0,
  "totalRevenue": 540000.00
}
```

#### GET `/api/reports/usage`

Métricas de uso del sistema por agente.

* **Query Params**: `?agentId=uuid`

* Response (`data`):

```json
{
  "agentId": "uuid",
  "loginsCount": 42,
  "clientsProfiled": 15,
  "recommendationsGenerated": 20
}
```

---

## Evolución Planeada

En iteraciones futuras se añadirán:

* Versionado granular de endpoints
* Webhooks
* Streaming de eventos
* Paginación avanzada
* Filtros complejos
* Rate limiting
* Telemetría

---

## Objetivo Estratégico del Documento

Este contrato:

* Permite iniciar implementación inmediata
* Define lenguaje común del sistema
* Reduce fricción de integración
* Facilita automatización con IA

Representa la base sobre la cual crecerá la comunicación interna de Coverly.
