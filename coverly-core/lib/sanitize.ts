/**
 * Sanitiza strings de entrada para prevenir inyección HTML/XSS.
 * Escapa caracteres peligrosos en campos de texto libre.
 */
export function sanitizeInput(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(
        sanitized[key] as string,
      );
    }
  }
  return sanitized;
}
