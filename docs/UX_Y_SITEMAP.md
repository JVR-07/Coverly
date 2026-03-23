# UX y Sitemap — Coverly

Este documento define la estructura de navegación, la jerarquía de información y los flujos de usuario para la plataforma Coverly.

## 1. Mapa del Sitio (Sitemap) por Rol

La navegación se estructura mediante un menú lateral persistente que adapta sus opciones según el rol del usuario autenticado.

### A. Vista de Entrada (Pública Interna)

- **Login:** Acceso mediante credenciales corporativas.

### B. Menú Lateral (Vistas Principales)

| Opción de Menú          | Descripción                          | Agente | Supervisor | Admin |
| :---------------------- | :----------------------------------- | :----: | :--------: | :---: |
| **Dashboard**           | Resumen de métricas y actividad.     |   ✅   |     ✅     |  ✅   |
| **Registrar Cliente**   | Formulario de perfilamiento inicial. |   ✅   |     ✅     |  ✅   |
| **Detalle Cliente**     | Perfil profundo y recomendaciones.   |   ✅   |     ✅     |  ✅   |
| **Catálogo de Seguros** | Lista de productos y coberturas.     |   ✅   |     ✅     |  ✅   |
| **Motor Inteligente**   | Configuración de recomendaciones.    |   ❌   |     ✅     |  ✅   |
| **Administración**      | Gestión de usuarios y cuentas.       |   ❌   |     ❌     |  ✅   |
| **Reportes**            | Analítica avanzada y exportación.    |   ❌   |     ✅     |  ✅   |

---

## 2. Descripción de Vistas Principales

### Dashboard / Reportes

- **Propósito:** Ofrecer una visión rápida del desempeño.
- **Elementos clave:**
  - Widgets de resumen: Total de cotizaciones, Tasa de conversión, Ventas del mes.
  - Gráfico de actividad: Recomendaciones aceptadas vs. rechazadas.
  - Listado de "Últimos clientes atendidos".

### Registro de Cliente (Flujo Guiado)

- **Propósito:** Capturar datos de forma eficiente.
- **Estructura (Formulario en panel continuo):**
  1. **Datos Básicos:** Nombre, contacto, fecha de nacimiento.
  2. **Perfil Económico:** Ingresos, ocupación, dependientes.
  3. **Necesidades e Intereses:** Sistema interactivo de chips por afinidad (Auto, Vida, etc.) y valoración de riesgo inicial.

### Detalle de Cliente y Recomendador

- **Propósito:** El centro operativo del agente.
- **Secciones:**
  - **Header:** Resumen del cliente y "Nivel de Riesgo" (Badge de color).
  - **Panel de Recomendaciones:**
    - Sugerencia principal (Tarjeta destacada con score).
    - Alternativas (Carrusel de tarjetas secundarias).
    - Botón "Ver Justificación" (Abre modal con el porqué de la IA).
  - **Sección de Promociones:** Listado de beneficios aplicables al cliente.
  - **Historial:** Timeline de interacciones previas.

### Catálogo de Seguros

- **Propósito:** Consulta rápida de productos.
- **Funcionalidad:**
  - Filtros por categoría (Auto, Vida, etc.).
  - Buscador global.
  - Tarjetas de producto con "Quick View" para coberturas.

---

## 3. Flujos de Usuario Críticos

### Flujo: "Del Perfilamiento a la Oferta"

1. El **Agente** selecciona "Registrar Cliente".
2. Completa los 3 pasos del formulario.
3. Al finalizar, el sistema muestra un **Loader Animado** ("Analizando perfil...").
4. El sistema redirige automáticamente a la vista de **Detalle de Cliente / Recomendación**.
5. El agente revisa la "Mejor Opción", aplica una promoción si es necesario y presenta la oferta al cliente.
6. El agente marca como "Aceptada" o "Rechazada" (Feedback para el motor).

---

## 4. Criterios de Diseño y Componentes

Para mantener la **identidad de producto** (Confianza y Modernidad), se utilizarán los siguientes estándares:

- **Framework de UI:** [Tailwind CSS](https://tailwindcss.com/) + [HeroUI v3](https://www.heroui.com/).
- **Iconografía:** [Lucide React](https://lucide.dev/) para iconos consistentes y vectoriales en toda la dApp.
- **Principios Visuales:**
  - **Glassmorphism sutil:** Para tarjetas y paneles laterales.
  - **Micro-interacciones:** Hovers en tarjetas de seguros y transiciones suaves entre pasos del registro.
  - **Colores:** Uso estricto de `Deep Trust Blue` para acciones primarias y `Teal Insight` para estados activos/IA.
  - **Tipografía:** Inter (Cuerpo) y Outfit (Títulos para un toque moderno).

---

## 5. Diseño Adaptativo (Responsive)

- **Escritorio:** Menú lateral expandido, vista multi-columna en Detalle de Cliente.
- **Tablet:** Menú lateral colapsado (Iconos), paneles apilados verticalmente.
- **Móvil:** Bottom Navigation Bar para opciones críticas, formularios en una sola columna.
