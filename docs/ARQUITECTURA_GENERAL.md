# Arquitectura General - Coverly

## Estilo Arquitectónico

**Cloud-Native Modular Monolith**
El sistema se diseña como un monolito modular desacoplado, desplegado en contenedores sobre infraestructura PaaS (Platform as a Service) y Serverless. Esta estrategia equilibra la simplicidad de desarrollo inicial con la potencia de escalado futura.

## Componentes Principales

### Backend Web Core & Frontend (Next.js)

Aplicación Web Full-Stack.

- **Responsabilidad:** Interfaz de agente, visualización, captura de datos, autenticación y API transaccional.
- **Despliegue:** Contenedor Docker desplegado en AWS Elastic Beanstalk.

### Motor Inteligente

Microservicio aislado (Python/FastAPI).

- **Responsabilidad:** Algoritmos de recomendación, scoring y reglas complejas.
- **Despliegue:** Contenedor Docker en AWS Elastic Beanstalk (comunicación inter-contenedores).

### Persistencia

Base de datos relacional gestionada.

- **Dominios:** Clientes, Productos, Reglas, Historial.
- **Tecnología:** PostgreSQL en AWS RDS.

---

## Estrategia de Infraestructura (AWS)

La solución se apoya nativamente en recursos en la nube de Amazon Web Services, utilizando Elastic Beanstalk para manejar la orquestación y balanceo de los contenedores Docker, además de instancias en AWS RDS para bases de datos transaccionales, minimizando el esfuerzo de DevOps.

Ver detalle técnico en: [STACK_TECNOLOGICO.md](STACK_TECNOLOGICO.md)

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
