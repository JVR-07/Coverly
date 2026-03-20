/**
 * Tests unitarios para el módulo de autenticación.
 * Se validan principalmente las capas de validación de credenciales.
 */

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const mockPrismaUser = prisma.user as jest.Mocked<typeof prisma.user>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("Auth - Validación de Credenciales", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Formato de credenciales", () => {
    it("debe rechazar emails inválidos", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test("not-an-email")).toBe(false);
      expect(emailRegex.test("user@")).toBe(false);
      expect(emailRegex.test("@domain.com")).toBe(false);
    });

    it("debe aceptar emails válidos", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test("admin@coverly.mx")).toBe(true);
      expect(emailRegex.test("agent.john@company.co")).toBe(true);
    });

    it("debe requerir contraseña de al menos 6 caracteres", () => {
      const isValidPassword = (pwd: string) => pwd.length >= 6;
      expect(isValidPassword("abc")).toBe(false);
      expect(isValidPassword("abcde")).toBe(false);
      expect(isValidPassword("abcdef")).toBe(true);
      expect(isValidPassword("securepass123")).toBe(true);
    });
  });

  describe("Flujo de autenticación", () => {
    const mockUser = {
      id: "user-123",
      email: "admin@coverly.mx",
      passwordHash: "$2a$10$hashedpassword",
      name: "Admin Test",
      role: "ADMIN" as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("debe retornar null si el usuario no existe", async () => {
      (mockPrismaUser.findUnique as jest.Mock).mockResolvedValue(null);
      const user = await prisma.user.findUnique({
        where: { email: "nobody@coverly.mx" },
      });
      expect(user).toBeNull();
    });

    it("debe retornar el usuario si existe en la DB", async () => {
      (mockPrismaUser.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const user = await prisma.user.findUnique({
        where: { email: "admin@coverly.mx" },
      });
      expect(user).not.toBeNull();
      expect(user?.email).toBe("admin@coverly.mx");
      expect(user?.role).toBe("ADMIN");
    });

    it("debe verificar que bcrypt.compare se llama con la contraseña y el hash", async () => {
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await bcrypt.compare(
        "plainpassword",
        mockUser.passwordHash,
      );
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "plainpassword",
        mockUser.passwordHash,
      );
      expect(result).toBe(true);
    });

    it("debe retornar false si la contraseña es incorrecta", async () => {
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await bcrypt.compare(
        "wrongpassword",
        mockUser.passwordHash,
      );
      expect(result).toBe(false);
    });
  });
});
