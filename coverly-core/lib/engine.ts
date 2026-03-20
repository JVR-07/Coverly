import { prisma } from "./prisma";

const ENGINE_BASE_URL = process.env.ENGINE_URL;

if (!ENGINE_BASE_URL) {
  throw new Error("La variable de entorno ENGINE_URL no está definida.");
}

export interface EvaluationResult {
  recommendationId: string;
  clientId: string;
  status: string;
  globalScore: number;
  recommendedProducts: {
    productId: string;
    name: string;
    type: string;
    matchScore: number;
    reasons: string[];
    appliedPromotions: {
      promotionId: string;
      discountPercentage: number;
    }[];
    finalPrice: number;
  }[];
  excludedProducts: {
    productId: string;
    name: string;
    reason: string;
  }[];
}

/**
 * Llama al motor de evaluación en FastAPI para un cliente específico.
 * @param clientId ID del cliente en la base de datos de Next.js
 */
export async function evaluateClient(
  clientId: string,
): Promise<EvaluationResult> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    throw new Error(`Cliente con ID ${clientId} no encontrado.`);
  }

  const needs = (client.needs as string[]) || [];

  const payload = {
    clientId: client.id,
    context: {
      requestedProducts: needs,
    },
    economicProfile: client.economicProfile,
    riskLevel: client.riskLevel,
  };

  const MAX_RETRIES = 3;
  const RETRY_DELAYS_MS = [500, 1000, 2000];

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${ENGINE_BASE_URL}/engine/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP ${response.status}: Error en el motor.`,
        );
      }

      const evaluationResult: EvaluationResult = await response.json();
      return evaluationResult;
    } catch (error: any) {
      lastError = error;

      if (error.message?.startsWith("HTTP ")) {
        console.error("Engine Logic Error:", error.message);
        throw new Error(`Error en el motor: ${error.message}`);
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAYS_MS[attempt];
        console.warn(
          `Engine: intento ${attempt + 1} fallido. Reintentando en ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error("Engine Connection Error tras reintentos:", lastError);
  throw new Error(
    `Motor no disponible tras ${MAX_RETRIES} intentos: ${lastError?.message}`,
  );
}
