# Arquitectura General - Coverly

## Estilo Arquitectónico

Arquitectura modular desacoplada basada en servicios.

Inicialmente monolito modular con capacidad de evolución a microservicios.

## Componentes principales

### Frontend

Aplicación Web SPA

Responsabilidades:

- Interfaz de agente
- Visualización de recomendaciones
- Captura de datos

---

### Backend API

Núcleo del sistema

Responsabilidades:

- Autenticación
- Lógica de negocio
- Orquestación
- Exposición REST

---

### Motor Inteligente

Servicio lógico desacoplado

Fase 1:

- Reglas determinísticas

Fase 2:

- Machine Learning

Fase 3:

- IA predictiva

---

### Base de Datos

Persistencia estructurada

Dominios:

- Clientes
- Productos
- Reglas
- Promociones
- Historial

---

## Comunicación

- REST
- JSON
- Token authentication

## Escalabilidad

Preparada para:

- Contenerización
- Cloud deployment
- Separación de servicios
- Integraciones externas
