import { NextResponse } from "next/server";

/**
 * Helper centralizado para respuestas de error estandarizadas.
 * Formato: { success: false, error: { code, message } }
 */
export function apiError(
  message: string,
  status: number = 500,
  code?: string
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: code || `ERR_${status}`,
        message,
      },
    },
    { status }
  );
}

/**
 * Helper para respuestas de éxito estandarizadas.
 * Formato: { success: true, data }
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}
