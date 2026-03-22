import { NextResponse } from "next/server";
import { logger } from "./logger";

type ApiErrorParams = {
  message: string;
  status?: number;
  code?: string;
};

export function apiError({
  message,
  status = 500,
  code = "ERR_500",
}: ApiErrorParams) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status },
  );
}

export function apiHandler(handler: Function) {
  return async (req: Request, ctx?: any) => {
    try {
      return await handler(req, ctx);
    } catch (error: any) {
      if (error instanceof Error) {
        logger.error(error.message, { route: req.url, name: error.name });
      } else {
        logger.error("Unknown error in API route", { route: req.url, error });
      }

      if (error.code === "P2025") {
        return apiError({
          message: "Recurso no encontrado",
          status: 404,
          code: "ERR_404",
        });
      }

      return apiError({
        message: "Error interno del servidor al procesar la solicitud",
        status: 500,
        code: "ERR_500",
      });
    }
  };
}
