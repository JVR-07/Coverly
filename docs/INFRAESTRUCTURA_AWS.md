# Arquitectura de Infraestructura — Coverly

Con el objetivo de garantizar escalabilidad, desacoplamiento y evolución futura del sistema, la plataforma adopta una arquitectura basada en servicios PaaS gestionados y contenedores dentro de Amazon Web Services (AWS). Esta estrategia separa completamente la interfaz de usuario, la lógica de negocio y el motor inteligente, permitiendo escalar cada componente de forma independiente.

Esta arquitectura prioriza:

* Bajo costo operativo en etapas iniciales.

* Despliegue rápido.

* Mantenimiento simplificado.

* Preparación para crecimiento modular.

* Integración futura de servicios de inteligencia artificial.

---

## Principios Arquitectónicos

La infraestructura se diseña bajo los siguientes principios:

### **Desacoplamiento**

* Frontend independiente del backend
* Backend independiente del motor inteligente

### **Escalabilidad Independiente**

* Cada servicio puede escalar sin afectar a otros

### **Stateless API**

* Las APIs no mantienen estado de sesión
* Facilita balanceo de carga y expansión hacia acceso externo

### **Contenerización**

* Servicios backend empaquetados como contenedores (*Docker*)
* Portabilidad y consistencia entre entornos

### **Preparación para expansión externa**

* Base para futuro portal cliente
* Integración con terceros
* Exposición controlada de endpoints

---

## Componentes de Infraestructura

### Frontend (SPA)

**Servicio:** AWS Amplify Hosting (o Amazon S3 + Amazon CloudFront)

**Responsabilidad:**

* Hosting de la aplicación web.
* Distribución global a través de CDN.
* HTTPS automático.
* Integración CI/CD directa desde el repositorio.

**Beneficios:**

* Coste reducido.
* Despliegue automatizado.
* Aislamiento completo de la lógica de servidor.
* Alta disponibilidad.

---

### Backend API

**Servicio:** AWS App Runner / Amazon ECS con AWS Fargate

**Responsabilidad:**

* Gestión de usuarios.
* Gestión de clientes.
* Catálogo de productos.
* Aplicación de promociones.
* Exposición de endpoints REST.

**Beneficios:**

* Despliegue sin gestionar servidores subyacentes (*Serverless*).
* Escalado automático basado en tráfico.
* Balanceo de carga integrado.
* Independencia tecnológica.

---

### Motor Inteligente

**Servicio:** AWS App Runner / Amazon ECS con AWS Fargate (contenedor independiente)

**Responsabilidad:**

* Evaluación de perfiles.
* Generación de recomendaciones.
* Análisis de reglas.
* Futuro soporte predictivo.

**Motivo de separación:**

* Permite evolucionar el motor sin afectar al backend.
* Escalado independiente.
* Posible reemplazo por modelos más avanzados.

---

### Base de Datos

**Servicio:** Amazon RDS for PostgreSQL

**Responsabilidad:**

* Persistencia relacional del dominio.
* Historial analítico.
* Datos estructurados reutilizables.

**Beneficios:**

* Servicio completamente gestionado por AWS.
* Backups automáticos y ventanas de mantenimiento.
* Posibilidad de cambiar a Amazon Aurora Serverless v2 en el futuro si se requiere escalar la base de datos bajo demanda extrema.
* Alta compatibilidad con ecosistemas modernos.

---

### Servicios de Inteligencia Artificial (Fase futura)

**Servicio:** Amazon Bedrock

**Uso previsto:**

* Justificación en lenguaje natural.
* Asistencia contextual a agentes.
* Generación de *insights* comerciales.
* Modelos predictivos avanzados.

Este componente no forma parte de la fase inicial, pero la arquitectura permite su integración sin rediseños estructurales a través de la API y SDK de AWS.

---

## Flujo de Comunicación

1. El usuario interactúa con el Frontend SPA.
2. La SPA consume la Backend API.
3. El Backend delega evaluaciones al Motor Inteligente.
4. El Motor devuelve resultados procesados.
5. El Backend persiste la información en la base de datos y responde al cliente.
6. La base de datos soporta todas las capas de backend.

Esta separación evita dependencias circulares y mejora la observabilidad.

---

## Escalabilidad y Optimización de Costos

La arquitectura permite:

* Escalado automático bajo demanda mediante reglas de auto-scaling.
* Uso eficiente de los recursos bajo el modelo de pago por uso (Serverless).
* Crecimiento progresivo sin necesidad de re-arquitecturar el sistema.
* Aprovechamiento del Free Tier de AWS y la beca académica para los despliegues de desarrollo inicial.

---

## Preparación para Evolución del Sistema

La estructura soporta la incorporación futura de:

* Portal de clientes externo
* Autenticación federada
* Integraciones con terceros
* Microservicios adicionales
* Analítica avanzada
* IA conversacional

La adopción temprana de APIs *stateless* y servicios desacoplados reduce significativamente el costo de expansión futura.

---
