# Modelo de Dominio Global - Coverly

## Entidades principales

- **User (Usuario)**: Representa a las personas que operan el sistema (agentes, supervisores y administradores), gestionando el acceso y los permisos a las funcionalidades.

- **Client (Cliente)**: Contiene la información central de los prospectos, abarcando sus datos personales, perfil económico (ingresos, estatus laboral, nivel de deuda), necesidades específicas, portafolio actual de seguros y evaluación de nivel de riesgo (score interno, historial de siniestros).

- **InsuranceProduct (Producto de Seguro)**: Define los seguros disponibles en el catálogo, incluyendo su tipo (Auto, Vida, Incendio, Celular), precio base, estado y restricciones aplicables (edad, antigüedad del bien, zona de riesgo).

- **Coverage (Cobertura)**: Desglose de los detalles de protección específicos que componen e integran un producto de seguro.

- **Promotion (Promoción)**: Estrategias comerciales y descuentos (ej. 10% off). Su alcance es flexible: pueden aplicarse de manera global a un `InsuranceProduct`, estar dirigidas a un `Client` en específico (como incentivo de *cross-selling* si ya posee otro tipo de póliza), o inyectarse dinámicamente como un beneficio exclusivo dentro de una `Recommendation` para maximizar la conversión.

- **Recommendation (Recomendación)**: El resultado generado por el motor inteligente (*score* de adecuación, mejor opción y alternativas) que vincula un perfil de cliente con los seguros más aptos.

- **History (Historial)**: Registro analítico que almacena las cotizaciones previas, interacciones y decisiones (aceptadas o rechazadas) para auditoría y reportes.

- **BusinessRule (Regla Comercial)**: Lógica y parámetros utilizados por el motor de recomendaciones para evaluar la elegibilidad, generar *rankings* y detectar oportunidades de venta.

## Relaciones conceptuales

- Un `Client` genera y está asociado a un `History` de interacciones.

- Un `Client` recibe múltiples `Recommendation` de seguros a lo largo del tiempo.

- Un `InsuranceProduct` está compuesto por múltiples `Coverage`.

- Las `BusinessRule` determinan cómo se generan las `Recommendation` para cada cliente.

- Una `Recommendation` sugiere uno o varios `InsuranceProduct`.

- Una `Promotion` puede aplicar de forma general a uno o varios `InsuranceProduct`.

- Una `Promotion` puede estar asignada directamente a un `Client` específico según su perfil o historial.

- Una `Recommendation` puede incluir una `Promotion` específica generada por el motor para incentivar el cierre de esa propuesta en particular.

## Objetivo del modelo

Establecer una base expandible que soporte:

- Analítica futura
- Machine Learning
- Personalización avanzada
