# Estándares de Seguridad y RBAC — Coverly

La plataforma maneja datos confidenciales, por lo que este documento rige las normativas de cifrado, sesiones y niveles de acceso implementados.

## 1. Autenticación y Sesiones (JWT)

Se utilizarán **JSON Web Tokens (JWT)** como mecanismo de sesión Stateless para maximizar la compatibilidad con Elastic Beanstalk (al escalar contenedores, no se pierde la sesión).

### A. Payload del Token

El token almacenará el mínimo indispensable para evitar consultas saturadas a la BD por cada request. No incluirá contraseñas ni datos sensibles.

```json
{
  "sub": "uuid-usuario-id",
  "email": "agente@coverly.com",
  "name": "Juan Pérez",
  "role": "AGENT",
  "iat": 1710356515,
  "exp": 1710385315
}
```

### B. Ciclo de Vida del Token

- **Tiempo de Expiración (Access Token):** 8 horas (Cubre una jornada laboral, forzando un logut diario de seguridad).
- **Lugar de Almacenamiento (Frontend - Next.js):** Se inyectará y almacenará obligatoriamente en `HttpOnly Secure Cookies` desde las Server Actions o API Routes. **Bajo ninguna circunstancia el token se guardará en `localStorage` o `sessionStorage`** para prevenir ataques XSS.

### C. Almacenamiento de Contraseñas

Las contraseñas de los usuarios internos (`users.password_hash`) deben hashearse en Node.js/Next.js usando `bcrypt` o `argon2` con un mínimo de 10 "salts" (rondas). Está prohibido almacenar "plain text".

---

## 2. Matriz de Permisos (RBAC - Role-Based Access Control)

La función de autorización se aplicará como un middleware o "guard" en las API Routes protegiendo el acceso a módulos específicos.

| Módulo/Acción | `AGENT` (Agente) | `SUPERVISOR` (Supervisor) | `ADMIN` (Administrador) |
| :--- | :--- | :--- | :--- |
| **Login y Cierre Sesión** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Dashboard y Métricas Propias** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Registrar Clientes** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **CRUD Clientes Propios** | ✅ Limitado (Solo sus clientes) | ✅ Permitido (Cualquier cliente) | ✅ Permitido |
| **Ver Catálogo de Productos** | ✅ Read-Only | ✅ Read-Only | ✅ CRUD Total |
| **Solicitar Scorings (Motor)** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Configurar Pesos y Reglas del Motor** | ❌ Denegado | ✅ Permitido | ✅ Permitido |
| **Ver Promociones/Descuentos** | ✅ Read-Only | ✅ CRUD Promociones | ✅ CRUD Total |
| **Dashboard de Métricas Globales** | ❌ Denegado | ✅ Permitido | ✅ Permitido |
| **Crear / Editar Empleados** | ❌ Denegado | ❌ Denegado | ✅ CRUD Total |

## 3. Seguridad de Tráfico y Datos

- **CORS (Cross-Origin Resource Sharing):** Configuraciones restrictivas que solo permitirán llamadas del `origin` alojado en Next.js.
- **SSL / TLS:** Forzado automático (HTTPS) por parte del balanceador de Elastic Beanstalk.
- **Protección de Errores Vagas:** En los endpoints, las respuestas de error en login nunca especificarán si el correo existe o no; emplearán mensajes genéricos "Credenciales Inválidas".
