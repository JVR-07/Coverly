# Arquitectura General - Coverly

## Estilo Arquitectónico

**Cloud-Native Modular Monolith**
El sistema se diseña como un monolito modular desacoplado, desplegado en contenedores sobre infraestructura PaaS (Platform as a Service) y Serverless. Esta estrategia equilibra la simplicidad de desarrollo inicial con la potencia de escalado futura.

## Componentes Principales

### Frontend (SPA)

Aplicación Web de Página Única (React/Vite).

- **Responsabilidad:** Interfaz de agente, visualización y captura de datos.
- **Despliegue:** Hosting estático distribuido (CDN).

### Backend API & Motor Inteligente

Núcleo del sistema (Node.js/Python).

- **Responsabilidad:** Orquestación, lógica de negocio y algoritmos de recomendación.
- **Despliegue:** Contenedores sin servidor (Serverless Containers).

### Persistencia

Base de datos relacional gestionada.

- **Dominios:** Clientes, Productos, Reglas, Historial.
- **Tecnología:** PostgreSQL.

---

## Estrategia de Infraestructura (Azure)

La solución se apoya nativamente en servicios gestionados de Microsoft Azure para reducir carga operativa.

Ver detalle en: [INFRAESTRUCTURA_AZURE.md](INFRAESTRUCTURA_AZURE.md)

[![Diagrama-Infraestructura](https://mermaid.ink/img/pako:eNptkmFvmzAQhv-KZalSJ6UpCYwkSJvkBFKhUZJCoknDU-WBS1iDHRmzrY3y33fA0mZK_AHutX3P-T17j1OZcexgKp628ne6YUqjIKKCiqsr9KkZaBb4XrjqBBXriquE5Fxojm7RuqqZKuT3_xLm0SJceaF7TKnqH7liuw2aKwlpIqMCwYiXJIk4S3UTAaFdOMFMyezLJcqUpc9vELL0kxAs9H9WTYxirn4VKb-A8-FMQeDfNV688M4PvTPyvdRSPfpwxm3ROuxqeCIvBE-WL3ojBYp4KssS6EwXILvFC_VcsiJTEp9XWXJVFRX0IS1YV8CdJtdLWelc8fgh-HABNl-v1pGHiH9G88njvNa1-ocifkJea8XRYscFbL8FUxnfHvtSXWIHi6_x6fWim5vPzZ1QAZ9WQGepaNrbCHf6Hnfuqej-73tP9UlqC6UC93Cuigw7WtW8h0uuStZIvG9MUKw3vOQUOxBmTD1TeJ0HyNkx8U3K8pimZJ1vsPPEthWoegcXwt2CQVvKt1kFZrmayVpo7Fi21UKws8d_sGOP-vZH0xzZ1tCYGGPL7uEX7Axgejw2RoPhxBwODdOyDj382pY1-uPBwLANc2iO7ZE5MezDX0H1Aa8?type=png)](https://mermaid.live/edit#pako:eNptkmFvmzAQhv-KZalSJ6UpCYwkSJvkBFKhUZJCoknDU-WBS1iDHRmzrY3y33fA0mZK_AHutX3P-T17j1OZcexgKp628ne6YUqjIKKCiqsr9KkZaBb4XrjqBBXriquE5Fxojm7RuqqZKuT3_xLm0SJceaF7TKnqH7liuw2aKwlpIqMCwYiXJIk4S3UTAaFdOMFMyezLJcqUpc9vELL0kxAs9H9WTYxirn4VKb-A8-FMQeDfNV688M4PvTPyvdRSPfpwxm3ROuxqeCIvBE-WL3ojBYp4KssS6EwXILvFC_VcsiJTEp9XWXJVFRX0IS1YV8CdJtdLWelc8fgh-HABNl-v1pGHiH9G88njvNa1-ocifkJea8XRYscFbL8FUxnfHvtSXWIHi6_x6fWim5vPzZ1QAZ9WQGepaNrbCHf6Hnfuqej-73tP9UlqC6UC93Cuigw7WtW8h0uuStZIvG9MUKw3vOQUOxBmTD1TeJ0HyNkx8U3K8pimZJ1vsPPEthWoegcXwt2CQVvKt1kFZrmayVpo7Fi21UKws8d_sGOP-vZH0xzZ1tCYGGPL7uEX7Axgejw2RoPhxBwODdOyDj382pY1-uPBwLANc2iO7ZE5MezDX0H1Aa8)

---

## Comunicación

- **Interna:** Llamadas directas entre módulos (en memoria) o HTTP (entre contenedores).
- **Externa:** REST API sobre HTTPS (JSON).
- **Autenticación:** JWT vía OAuth2 / OIDC.

## Escalabilidad

El sistema escala horizontalmente gracias a su naturaleza "stateless" en la capa de cómputo:

1. **Frontend:** Escala automáticamente en la CDN.
2. **Backend:** Escala por demanda de peticiones HTTP o carga de CPU (KEDA).
3. **Base de Datos:** Escala verticalmente según necesidad de IOPS.
