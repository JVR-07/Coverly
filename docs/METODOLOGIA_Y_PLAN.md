# Metodología y Plan de Desarrollo — Coverly

## Propósito

Este documento define la estrategia de ejecución del desarrollo del sistema Coverly, incluyendo:

* Metodología de trabajo
* Organización por roles
* Entregables por fase
* Definición específica de tareas y prioridades

Su objetivo es eliminar ambigüedad operativa y permitir coordinación efectiva entre desarrolladores y agentes AI.

---

## Metodología

### Agile Modular Iterativo (AMI)

Coverly se desarrollará mediante una metodología híbrida que combina:

* Desarrollo desacoplado por dominios técnicos
* Iteraciones cortas
* Integración progresiva
* Entregables funcionales en cada ciclo

### Principios

1. División por módulos técnicos
2. Interfaces contractuales tempranas (APIs)
3. Desarrollo paralelo
4. Integración incremental
5. Testing continuo

---

## Timeline General

| Fase        | Duración  | Objetivo               |
| ----------- | --------- | ---------------------- |
| Fase 0      | 1 semana  | Diseño técnico y setup |
| Iteración 1 | 2 semanas | Núcleo del sistema     |
| Iteración 2 | 2 semanas | Inteligencia comercial |
| Iteración 3 | 2 semanas | Integración completa   |
| Iteración 4 | 1 semana  | Sistema end-to-end     |
| Buffer      | 2 semanas | Estabilización         |

---

## Roles del Equipo

| Persona       | Rol                         |
| ------------- | --------------------------- |
| Líder Técnico | Backend Core / Arquitectura |
| Dev A         | Frontend                    |
| Dev B         | Backend APIs                |
| Dev C         | Base de Datos               |
| Dev D         | Motor Inteligente           |
| Dev E         | QA e Integración            |

---

## Fase 0 — Diseño y Setup

### Objetivo

Preparar infraestructura y definiciones que permitan desarrollo paralelo inmediato.

#### Líder Técnico (Backend Core / Arquitectura)

* **[Prioridad: Alta]** Definir la arquitectura técnica final y documentar decisiones de diseño.
* **[Prioridad: Alta]** Diseñar y documentar los contratos API base (formatos JSON, rutas, códigos de estado).
* **[Prioridad: Media]** Establecer y configurar los linters y estándares de código (ESLint, Prettier).
* **[Prioridad: Alta]** Configurar el pipeline base de CI/CD y políticas de ramas en Git.

#### Dev A (Frontend)

* **[Prioridad: Media]** Diseñar wireframes iniciales de las vistas principales del agente.
* **[Prioridad: Alta]** Configurar el proyecto base usando React y Vite.
* **[Prioridad: Alta]** Integrar y configurar la librería de componentes UI y el sistema de ruteo.

#### Dev B (Backend APIs)

* **[Prioridad: Alta]** Inicializar el proyecto Node.js con la estructura de carpetas definida.
* **[Prioridad: Alta]** Implementar el esqueleto del módulo de autenticación (generación y validación de JWT).
* **[Prioridad: Media]** Crear controladores y rutas vacías (boilerplate) para los endpoints iniciales.

#### Dev C (Base de Datos)

* **[Prioridad: Alta]** Diseñar el diagrama de Entidad-Relación (DER) para los dominios iniciales.
* **[Prioridad: Alta]** Redactar los scripts DDL de creación de tablas.
* **[Prioridad: Media]** Configurar la instancia de PostgreSQL en Azure Flexible Server.

#### Dev D (Motor Inteligente)

* **[Prioridad: Alta]** Definir la estructura del algoritmo de recomendación v1.
* **[Prioridad: Alta]** Documentar los esquemas exactos de inputs (datos del cliente) y outputs (ranking).
* **[Prioridad: Media]** Listar las reglas determinísticas iniciales que evaluará el motor.

#### Dev E (QA e Integración)

* **[Prioridad: Alta]** Redactar el plan de testing general del proyecto.
* **[Prioridad: Media]** Escribir los primeros casos de prueba funcionales basados en los requerimientos.
* **[Prioridad: Alta]** Configurar el framework de pruebas automatizadas (ej. Jest, Cypress).

---

## Iteración 1 — Núcleo del Sistema

### Objetivo

Sistema usable internamente con funcionalidades básicas operativas.

#### Líder Técnico (Backend Core / Arquitectura)

* **[Prioridad: Alta]** Finalizar e integrar el flujo de autenticación y manejo de sesiones.
* **[Prioridad: Alta]** Implementar el middleware de autorización basado en roles (RBAC).
* **[Prioridad: Media]** Establecer la conexión segura y el pool de conexiones entre el API y la base de datos.

#### Dev A (Frontend)

* **[Prioridad: Alta]** Desarrollar la interfaz completa de inicio de sesión y recuperación de accesos.
* **[Prioridad: Media]** Construir el dashboard principal del agente con navegación base.
* **[Prioridad: Alta]** Implementar formularios con validación local para el registro y perfilamiento de clientes.

#### Dev B (Backend APIs)

* **[Prioridad: Alta]** Desarrollar endpoints REST (GET, POST, PUT) para el CRUD de clientes.
* **[Prioridad: Alta]** Desarrollar endpoints REST para la gestión y administración de usuarios del sistema.
* **[Prioridad: Alta]** Implementar endpoints de solo lectura para listar el catálogo de productos de seguros.

#### Dev C (Base de Datos)

* **[Prioridad: Alta]** Ejecutar migraciones para las tablas del dominio de clientes (datos personales, perfil económico).
* **[Prioridad: Alta]** Ejecutar migraciones para el dominio de usuarios y asignación de roles.
* **[Prioridad: Alta]** Poblar la base de datos con el catálogo inicial de productos, coberturas y restricciones.

#### Dev D (Motor Inteligente)

* **[Prioridad: Alta]** Programar el motor de reglas simple en entorno aislado.
* **[Prioridad: Alta]** Codificar la lógica de matching básico que asocie clientes con productos viables.
* **[Prioridad: Media]** Desarrollar la función que devuelva un ranking de productos ordenados sin uso de IA.

#### Dev E (QA e Integración)

* **[Prioridad: Alta]** Ejecutar pruebas unitarias sobre los controladores de autenticación y CRUD.
* **[Prioridad: Alta]** Validar el cumplimiento de los contratos API mediante pruebas de integración.
* **[Prioridad: Media]** Levantar y documentar el primer reporte de defectos (bugs) encontrados.

---

## Iteración 2 — Inteligencia Comercial

### Objetivo

Sistema genera valor comercial real conectando datos con recomendaciones.

#### Líder Técnico (Backend Core / Arquitectura)

* **[Prioridad: Alta]** Configurar la comunicación interna entre el backend principal y el servicio del motor inteligente.
* **[Prioridad: Media]** Implementar manejo de timeouts y fallos de red en el middleware de peticiones.

#### Dev A (Frontend)

* **[Prioridad: Alta]** Construir la vista de resultados que muestre el ranking de seguros al agente.
* **[Prioridad: Media]** Desarrollar un componente visual para comparar coberturas y precios de hasta 3 opciones.
* **[Prioridad: Baja]** Aplicar micro-interacciones y mejoras de UX en las transiciones de pantallas.

#### Dev B (Backend APIs)

* **[Prioridad: Alta]** Crear el endpoint que solicite evaluaciones al motor y formatee la respuesta al frontend.
* **[Prioridad: Alta]** Implementar endpoints para consultar promociones activas y aplicables según el perfil.
* **[Prioridad: Media]** Desarrollar el registro de interacciones en el historial del cliente (cotizaciones previas).

#### Dev C (Base de Datos)

* **[Prioridad: Alta]** Crear las tablas necesarias para almacenar reglas de promociones y descuentos.
* **[Prioridad: Media]** Diseñar e implementar el esquema para guardar el historial analítico y logs de decisiones.
* **[Prioridad: Alta]** Optimizar consultas relacionales complejas mediante índices iniciales.

#### Dev D (Motor Inteligente)

* **[Prioridad: Alta]** Incorporar lógica algorítmica para detectar oportunidades de upselling en el ranking.
* **[Prioridad: Alta]** Incorporar lógica algorítmica para sugerir productos complementarios (cross-selling).
* **[Prioridad: Media]** Refinar la fórmula del "Score de adecuación" ponderando riesgo y rentabilidad.

#### Dev E (QA e Integración)

* **[Prioridad: Alta]** Validar el flujo de datos completo desde el frontend hasta el motor y de regreso.
* **[Prioridad: Alta]** Probar los límites y casos borde de las reglas comerciales (descuentos solapados).
* **[Prioridad: Media]** Ejecutar QA exploratorio sobre la vista de comparación y resultados.

---

## Iteración 3 — Integración Completa

### Objetivo

Sistema cercano a producción con soporte analítico y optimización.

#### Líder Técnico (Backend Core / Arquitectura)

* **[Prioridad: Media]** Revisar y consolidar la orquestación de contenedores en Azure.
* **[Prioridad: Alta]** Auditar la seguridad general (headers HTTP, sanitización de inputs, CORS).
* **[Prioridad: Alta]** Configurar un sistema de logging centralizado para trazabilidad de errores.

#### Dev A (Frontend)

* **[Prioridad: Media]** Refinar estilos globales asegurando consistencia con el manual de identidad.
* **[Prioridad: Alta]** Conectar todos los flujos sueltos para permitir una navegación ininterrumpida del agente.
* **[Prioridad: Baja]** Optimizar el peso de los assets y aplicar lazy loading a rutas no críticas.

#### Dev B (Backend APIs)

* **[Prioridad: Alta]** Desarrollar endpoints para la extracción de métricas generales (conversiones, rechazos).
* **[Prioridad: Media]** Generar endpoints para consultar el uso del sistema por parte de cada agente.
* **[Prioridad: Alta]** Estandarizar la captura y formateo de excepciones (Manejo de errores globales).

#### Dev C (Base de Datos)

* **[Prioridad: Alta]** Realizar un análisis de planes de ejecución y añadir índices faltantes.
* **[Prioridad: Alta]** Aplicar normalización final u optimizaciones específicas para consultas de reportes.
* **[Prioridad: Media]** Configurar políticas de retención y respaldos (backups) automáticos.

#### Dev D (Motor Inteligente)

* **[Prioridad: Alta]** Ejecutar baterías de prueba con perfiles simulados masivos para calibrar resultados.
* **[Prioridad: Media]** Ajustar umbrales de evaluación de riesgo basados en resultados de calibración.
* **[Prioridad: Baja]** Documentar los escenarios de estrés simulados en el motor de recomendaciones.

#### Dev E (QA e Integración)

* **[Prioridad: Alta]** Automatizar y ejecutar pruebas End-to-End (E2E) simulando la jornada completa del agente.
* **[Prioridad: Media]** Realizar pruebas de carga básicas para validar tiempos de respuesta (< 5s en motor).
* **[Prioridad: Alta]** Emitir el reporte de estabilidad determinando si la versión califica como Release Candidate.

---

## Iteración 4 — Sistema End-to-End

### Objetivo

Sistema funcional completo y libre de defectos bloqueantes.

#### Todos los roles

* **[Prioridad: Alta]** Corrección inmediata de bugs críticos y de alta prioridad reportados en QA.
* **[Prioridad: Media]** Ajustes menores de flujos o cálculos basados en validación cruzada del equipo.
* **[Prioridad: Alta]** Participar en la validación general de aceptación operativa.

---

## Buffer — Estabilización

### Objetivo

Preparación técnica y documental para uso real.

#### Todos los roles

* **[Prioridad: Alta]** Monitoreo del deploy interno en el entorno de pruebas de Azure.
* **[Prioridad: Media]** Optimización final del consumo de memoria y CPU en contenedores.
* **[Prioridad: Media]** Revisión de vulnerabilidades de dependencias.
* **[Prioridad: Baja]** Actualización y cierre de documentación técnica del proyecto.
