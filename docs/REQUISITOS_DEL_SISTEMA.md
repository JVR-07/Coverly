# Requisitos del Sistema - Coverly

## Requisitos Funcionales (RF)

### RF-01 Gestión de Usuarios

El sistema deberá permitir:

- Login seguro.
- Gestión de roles y permisos (Agente, Supervisor, Administrador).
- Administración de cuentas.

### RF-02 Captura de Información del Cliente

El sistema deberá permitir registrar:

- Datos personales.
- Perfil económico.
- Historial de seguros.
- Tipo de cliente (nuevo/recurrente).
- Necesidades declaradas.
- Nivel de riesgo.

### RF-03 Catálogo de Seguros

El sistema deberá:

- Mostrar productos disponibles.
- Permitir CRUD de productos.
- Incluir gestión de coberturas, precios y restricciones.

### RF-04 Motor Inteligente de Recomendación

El sistema deberá analizar datos del cliente para:

- Comparar productos.
- Evaluar elegibilidad.
- Generar ranking de opciones basado en perfil demográfico, historial, rentabilidad y riesgo.

### RF-05 Personalización de Ofertas

El sistema deberá sugerir:

- Promociones aplicables y descuentos.
- Complementos recomendados.
- Estrategias de Upselling y Cross-selling.

### RF-06 Visualización de Resultados

El agente deberá visualizar:

- La mejor opción sugerida.
- Alternativas viables.
- Justificación de la recomendación (Score de adecuación).
- Beneficios esperados.

### RF-07 Reportes

El sistema deberá generar métricas sobre:

- Uso del sistema.
- Recomendaciones aceptadas vs. rechazadas.
- Ventas derivadas.
- Desempeño general.

---

## Requisitos No Funcionales (RNF)

### RNF-01 Seguridad

- Autenticación robusta.
- Encriptación de datos sensibles.
- Control estricto por roles.

### RNF-02 Escalabilidad

Arquitectura preparada para:

- Futuro acceso de clientes externos (Autoservicio).
- Incremento de volumen de usuarios.
- Integración futura con modelos de IA avanzada.

### RNF-03 Rendimiento

- Tiempo de respuesta de UI: < 2 segundos.
- Generación de recomendación: < 5 segundos.

### RNF-04 Usabilidad

- UI clara y profesional.
- Flujo guiado para minimizar capacitación.

### RNF-05 Mantenibilidad

- Código modular (Clean Code).
- API desacoplada.
- Documentación técnica actualizada.
