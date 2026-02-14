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

### Autenticación

Uso de token:

```bash
Authorization: Bearer <token>
```

Emitido por módulo de autenticación.

---

## Endpoints Base

---

### 1️⃣ Autenticación

#### Login

POST `/auth/login`

Request:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "role": "agent|admin|supervisor"
  }
}
```

---

#### Verificación de sesión

GET `/auth/me`

Response:

```json
{
  "id": "uuid",
  "email": "string",
  "role": "string"
}
```

---

### 2️⃣ Usuarios

#### Crear usuario

POST `/users`

```json
{
  "name": "string",
  "email": "string",
  "role": "string"
}
```

---

#### Listar usuarios

GET `/users`

---

### 3️⃣ Clientes

#### Crear cliente

POST `/clients`

```json
{
  "personalData": {},
  "economicProfile": {},
  "riskLevel": "low|medium|high",
  "needs": []
}
```

---

#### Obtener perfil

GET `/clients/{id}`

---

#### Actualizar cliente

PUT `/clients/{id}`

---

### 4️⃣ Catálogo de Productos

#### Listar productos

GET `/products`

---

#### Crear producto

POST `/products`

```json
{
  "name": "string",
  "type": "string",
  "coverages": [],
  "priceBase": 0,
  "restrictions": []
}
```

---

### 5️⃣ Recomendaciones

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

### 6️⃣ Promociones

#### Obtener promociones aplicables

GET `/promotions/applicable/{clientId}`

---

### 7️⃣ Reportes

#### Métricas generales

GET `/reports/metrics`

---

#### Uso del sistema

GET `/reports/usage`

---

## Códigos de Error Base

| Código  | Descripción            |
| ------- | ---------------------- |
| AUTH_01 | Credenciales inválidas |
| AUTH_02 | Token expirado         |
| PERM_01 | Acceso no autorizado   |
| DATA_01 | Payload inválido       |
| SYS_01  | Error interno          |

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
