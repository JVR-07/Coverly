# Stack Tecnológico y Arquitectura de Despliegue — Coverly

Este documento define las tecnologías elegidas para el desarrollo de Coverly, así como la estrategia de despliegue en la nube, basándose en la separación de responsabilidades entre el sistema transaccional y el motor de inteligencia/recomendación.

## 1. Tecnologías Base

### 1.1. Frontend y Backend Core

- **Framework:** **Next.js**. Al elegir Next.js, cubres el Front (React) y tu Backend Core (Node.js) bajo el mismo proyecto y despliegue. Las _API Routes_ o _Server Actions_ de Next.js actúan como Backend.
- **Lenguaje:** TypeScript (Para un tipado estricto, logrando mayor escalabilidad y menos bugs).
- **UI / Estética:** Tailwind CSS + **NextUI**.
- **Gestión de Estado (Frontend):** Zustand o React Context (según la complejidad que adquiera el Dashboard).

### 1.2. Motor de Recomendación (Microservicio)

- **Lenguaje:** Python 3.10+.
- **Framework:** FastAPI.

### 1.3. Base de Datos

- **Motor principal:** PostgreSQL.
- **ORM:** Prisma ORM.

---

## 2. Pila de Despliegue (Infraestructura en AWS)

La separación en contenedores Docker es una excelente práctica.

### 2.1. Contenedores

1. **Contenedor Web (Next.js):** Contendrá el cliente web y la API transaccional.
2. **Contenedor Motor (Python/FastAPI):** Exclusivo para recibir el perfil del cliente, procesar las reglas de negocio y devolver el listado de seguros recomendados.

### 2.2. Alojamiento (Servicios de AWS)

- **Cómputo:** **AWS Elastic Beanstalk (Multi-container Docker).**
  - **¿Cómo funciona?:** Mediante un archivo `docker-compose.yml`, le indicas a Elastic Beanstalk que levante ambos contenedores.
  - **Beneficio:** Elastic Beanstalk maneja la provisión de las máquinas (EC2), el balanceador de carga virtual (Application Load Balancer) y el auto-escalado según el tráfico.
- **Base de Datos:** **AWS RDS (Relational Database Service) para PostgreSQL.**
  - **Beneficio:** Instancia gestionada; no tienes que instalar Postgres a mano. Ofrece copias de seguridad automáticas y se integra directamente en la misma red privada (VPC) que tus Dockers por seguridad.

---

## 3. Diagrama de Red y Flujo de Comunicación

Una vez desplegados en Elastic Beanstalk, el flujo será:

1. El **Agente** ingresa a Coverly a través del navegador (HTTPS).
2. El **Load Balancer** de AWS recibe la petición y la envía al **Contenedor Web (Next.js)** (Puerto 3000).
3. **Flujo de Base de Datos:** Cuando Next.js necesita guardar o leer un cliente, se conecta directamente a **AWS RDS (PostgreSQL)**.
4. **Flujo del Motor:** Cuando el usuario pide una "Recomendación":
   - Next.js recopila los datos del cliente desde Postgres.
   - Envía una petición HTTP interna al **Contenedor Motor (FastAPI)** (Puerto 8000).
   - FastAPI procesa el Scoring y responde el JSON a Next.js.
   - Next.js muestra el resultado en el Frontend al usuario.

Este diseño asegura que si el cálculo del Motor es muy pesado (o requieres modelos complejos a futuro), no trabe la velocidad de la interfaz de usuario.
