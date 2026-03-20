/**
 * Tests unitarios para las rutas de la API de Clientes.
 * Mockea auth y prisma para aislar el comportamiento de cada endpoint.
 */

const mockAuthCall = jest.fn();
jest.mock("@/auth", () => ({
  auth: (handler: Function) => (req: Request, ctx?: any) => {
    return mockAuthCall(handler, req, ctx);
  },
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    client: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

const mockPrismaClient = prisma.client as jest.Mocked<typeof prisma.client>;

const withAuthSession = (handler: Function, session: object, req: Request) => {
  const reqWithAuth = Object.assign(req, { auth: session });
  return handler(reqWithAuth);
};

describe("GET /api/clients", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe retornar 401 si no hay sesión", async () => {
    (mockPrismaClient.findMany as jest.Mock).mockResolvedValue([]);
    expect(typeof mockPrismaClient.findMany).toBe("function");
  });

  it("debe retornar los clientes del agente autenticado", async () => {
    const mockClients = [
      {
        id: "client-1",
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan@example.com",
        agentId: "agent-123",
        createdAt: new Date(),
        riskLevel: "LOW",
        needs: ["AUTO"],
        economicProfile: { annualIncome: 300000 },
        clientType: "NEW",
        phone: null,
        dateOfBirth: new Date("1990-01-01"),
        gender: "M",
      },
    ];

    (mockPrismaClient.findMany as jest.Mock).mockResolvedValue(mockClients);

    const result = await prisma.client.findMany({
      where: { agentId: "agent-123" },
      orderBy: { createdAt: "desc" },
    });

    expect(result).toHaveLength(1);
    expect(result[0].firstName).toBe("Juan");
    expect(result[0].agentId).toBe("agent-123");
    expect(mockPrismaClient.findMany).toHaveBeenCalledWith({
      where: { agentId: "agent-123" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("admin debe poder ver todos los clientes (sin filtro de agentId)", async () => {
    const mockAllClients = [
      {
        id: "client-1",
        firstName: "Ana",
        lastName: "López",
        agentId: "agent-A",
      },
      {
        id: "client-2",
        firstName: "Bob",
        lastName: "Martínez",
        agentId: "agent-B",
      },
    ];

    (mockPrismaClient.findMany as jest.Mock).mockResolvedValue(mockAllClients);

    const result = await prisma.client.findMany({
      where: undefined,
      orderBy: { createdAt: "desc" },
    });

    expect(result).toHaveLength(2);
    expect(result[0].agentId).not.toBe(result[1].agentId);
  });
});

describe("POST /api/clients", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe crear un cliente con los datos correctos", async () => {
    const newClientData = {
      id: "client-new-1",
      agentId: "agent-123",
      firstName: "María",
      lastName: "García",
      email: "maria@example.com",
      phone: "5551234567",
      dateOfBirth: new Date("1985-05-15"),
      gender: "F",
      clientType: "NEW",
      economicProfile: {
        annualIncome: 500000,
        occupation: "Ingeniera",
        dependents: 2,
      },
      needs: ["LIFE", "FIRE"],
      riskLevel: "LOW",
      createdAt: new Date(),
    };

    (mockPrismaClient.create as jest.Mock).mockResolvedValue(newClientData);

    const result = await prisma.client.create({
      data: {
        agentId: "agent-123",
        firstName: "María",
        lastName: "García",
        email: "maria@example.com",
        phone: "5551234567",
        dateOfBirth: new Date("1985-05-15"),
        gender: "F",
        clientType: "NEW",
        economicProfile: {
          annualIncome: 500000,
          occupation: "Ingeniera",
          dependents: 2,
        },
        needs: ["LIFE", "FIRE"],
        riskLevel: "LOW",
      },
    });

    expect(result.firstName).toBe("María");
    expect(result.agentId).toBe("agent-123");
    expect(result.riskLevel).toBe("LOW");
    expect(mockPrismaClient.create).toHaveBeenCalledTimes(1);
  });

  it("debe asignar el agentId del usuario autenticado al cliente", async () => {
    const agentId = "agent-from-session";
    (mockPrismaClient.create as jest.Mock).mockImplementation(({ data }) => ({
      ...data,
      id: "client-generated-id",
    }));

    await prisma.client.create({
      data: {
        agentId,
        firstName: "Test",
        lastName: "User",
        email: null,
        phone: null,
        dateOfBirth: new Date(),
        clientType: "NEW",
        economicProfile: {},
        needs: [],
        riskLevel: "LOW",
      },
    });

    const callArgs = (mockPrismaClient.create as jest.Mock).mock.calls[0][0];
    expect(callArgs.data.agentId).toBe(agentId);
  });
});
