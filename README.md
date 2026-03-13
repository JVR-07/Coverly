![Wallpaper-ITT](https://raw.githubusercontent.com/JVR-07/College-Projects/refs/heads/main/Resource/wallpaper_itt.png)

> ### ⚖️ Legal Disclaimer and Project Purpose
>
> This project (Coverly) has been created solely as an academic exercise to demonstrate knowledge in software architecture and full-stack development.
>
> 1. **Academic Nature:** All content, including the business logic, architecture, and documentation, is fictitious and intended for demonstration purposes only.
>
> 2. **No Affiliation:** This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any real insurance company or existing organization.
>
> 3. **Non-Profit Use:** This software is distributed under the specified license (GPLv3) for non-profit educational purposes and is not intended for commercial use or production environments.
>

![Coverly-full-logo](coverly_full_logo.png)

# Coverly

![Status: En Desarrollo](https://img.shields.io/badge/Status-En_Desarrollo-blue)
![License: GPLv3](https://img.shields.io/badge/License-GPLv3-green)
![Node: 20+](https://img.shields.io/badge/Node-20%2B-brightgreen)
![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)

**"Coverage with confidence"**

Coverly es una plataforma web interna diseñada para transformar la gestión de seguros. Asiste a los agentes en la toma de decisiones comerciales mediante análisis automatizado, gestión centralizada de clientes y un motor de recomendaciones inteligentes.

---

## 📋 Tabla de Contenidos

- [Visión del Proyecto](#-visión-del-proyecto)
- [Arquitectura Técnica](#-arquitectura-técnica)
- [Funcionalidades Clave](#-funcionalidades-clave)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Documentación](#-documentación)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## 🔭 Visión del Proyecto

El objetivo de Coverly es migrar la interacción comercial de un proceso manual a uno guiado por datos. Actualmente, los agentes invierten demasiado tiempo analizando perfiles y comparando productos manualmente.

Coverly resuelve esto centralizando la información y utilizando un Motor Inteligente para generar rankings de productos, estrategias de upselling y cross-selling, mejorando así la tasa de conversión y la consistencia en las ofertas.

---

## 🏗 Arquitectura Técnica

El sistema sigue un estilo arquitectónico de Monolito Modular Cloud-Native, diseñado para ser desplegado en contenedores (Docker) sobre infraestructura PaaS en AWS.

### Stack Tecnológico

**Frontend:** React + Vite (SPA) alojado en el mismo entorno o contenedor para simplificación inicial.

**Backend:** Node.js (o Next.js) contenerizado.

**Motor Inteligente:** Servicio aislado (Python) para evaluación de reglas y scoring empacado en su propio contenedor Docker.

**Base de Datos:** PostgreSQL en AWS (RDS o EC2 de persistencia).

**Infraestructura:** Despliegues gestionados a través de Multi-docker en AWS Elastic Beanstalk.

---

## ✨ Funcionalidades Clave

Coverly incluye:

- **Gestión de Usuarios y Roles:** Control de acceso seguro para Agentes, Supervisores y Administradores.

- **Perfilado de Clientes:** Registro de datos personales, perfil económico y evaluación de riesgo.

- **Catálogo de Productos:** Gestión completa de seguros, coberturas y restricciones.

**Motor de Recomendación:** Algoritmos que evalúan la elegibilidad y generan un ranking de las mejores opciones para cada cliente.

**Estrategias Comerciales:** Sugerencias automáticas de promociones y oportunidades de venta cruzada.

**Reportes y Analítica:** Métricas de conversión y desempeño comercial.

---

## 📂 Estructura del Proyecto

La documentación técnica se encuentra centralizada en el directorio `docs/.`

```bash
coverly/
├── docs/                 # Documentación técnica y funcional
├── src/                  # Código fuente (Frontend/Backend)
├── tests/                # Pruebas unitarias e integración
├── LICENSE               # Licencia GNU GPLv3
└── README.md             # Este archivo
```

*Próximamente se agregarán las carpetas faltantes al repositorio.*

---

## 🛠 Instalación y Configuración

Sigue estos pasos para levantar un entorno de desarrollo local.

### Prerrequisitos
Asegúrate de tener instalados:
- Node.js (v20 o superior)
- Python (v3.10 o superior)
- Docker y Docker Compose
- PostgreSQL (si decides instanciarla de forma local)

### Configuración del Entorno
1. Copia el archivo de variables de entorno de ejemplo:
   ```bash
   cp .env.example .env
   ```
2. Configura los valores necesarios de puerto, conexión a la DB y secretos en `.env`.

### Ejecución con Docker
Para desplegar la aplicación completa usa Docker Compose:
```bash
docker-compose up -build
```

### Ejecución Local
Si optas por correr cada servicio independientemente:
- **Core (Node/React):** `npm install` && `npm run dev`
- **Motor de Recomendación (Python):** `pip install -r requirements.txt` && `python app.py`

### Testing
- Para pruebas del Core (Node): `npm run test`
- Para el Motor Inteligente (Python): `pytest`

---

## 📚 Documentación

Para entender a profundidad el sistema, consulta los siguientes documentos oficiales:

### Contexto y Diseño

- [Visión del Sistema:](docs/VISION_DEL_SISTEMA.md) El "por qué" del proyecto.

- [Identidad de Producto:](docs/IDENTIDAD_DE_PRODUCTO.md) Guía de estilo, tono y paleta de colores.

- [Arquitectura General:](docs/ARQUITECTURA_GENERAL.md) Visión de alto nivel de la infraestructura.

- [Arquitectura de Módulos:](docs/ARQUITECTURA_DE_MODULOS.md) Detalle de los límites funcionales y dependencias.

### Desarrollo y Especificaciones

- [Requisitos del Sistema:](docs/REQUISITOS_DEL_SISTEMA.md) Listado de RF y RNF.

- [Contratos API Base:](docs/CONTRATOS_API_BASE.md) Definición de endpoints y payloads JSON.

- [Modelo de Dominio:](docs/MODELO_DE_DOMINIO_GLOBAL.md) Entidades y relaciones de la base de datos.

- [Metodología y Plan:](docs/METODOLOGIA_Y_PLAN.md) Fases, roles y estrategia de desarrollo iterativo.

---

## 🚀 Roadmap

El desarrollo se rige por la metodología Agile Modular Iterativo (AMI):

- **Fase 0:** Diseño y Setup (Arquitectura, CI/CD).

- **Iteración 1:** Núcleo del sistema (Auth, CRUD Clientes/Productos).

- **Iteración 2:** Inteligencia Comercial (Motor de recomendaciones, Promociones).

- **Iteración 3:** Integración Completa (Reportes, Seguridad avanzada).

- **Iteración 4:** Sistema End-to-End y estabilización.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia GNU General Public License v3.0. Consulta el archivo [LICENSE](LICENSE) para más detalles.
