import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Exists" : "MISSING");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: passwordHash,
    },
    create: {
      name: "Administrador Principal",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  const products = [
    {
      name: "Cobertura Amplia Auto Plus",
      type: "AUTO",
      description:
        "Seguro de cobertura amplia para vehículos de uso particular.",
      priceBase: 12000.0,
      specificData: {
        maxYearAge: 15,
        allowedUseTypes: ["PERSONAL"],
        requiresSecuritySystem: false,
      },
      coverages: [
        {
          name: "Daños Materiales",
          description: "Cubre daños al vehículo asegurado.",
          value: 500000.0,
        },
        {
          name: "Robo Total",
          description: "Indemnización en caso de robo total del vehículo.",
          value: null,
        },
        {
          name: "Responsabilidad Civil",
          description: "Daños a terceros en sus bienes o personas.",
          value: 3000000.0,
        },
      ],
    },
    {
      name: "Vida Segura Total",
      type: "LIFE",
      description:
        "Protección financiera para tus seres queridos en caso de fallecimiento.",
      priceBase: 8500.0,
      specificData: {
        maxAge: 70,
        requiresMedicalExam: true,
        baseCoverageAmount: 1500000.0,
      },
      coverages: [
        {
          name: "Fallecimiento",
          description: "Suma asegurada básica.",
          value: 1500000.0,
        },
        {
          name: "Muerte Accidental",
          description: "Doble indemnización si la muerte es por accidente.",
          value: 1500000.0,
        },
        {
          name: "Gastos Funerarios",
          description: "Apoyo adicional para gastos.",
          value: 50000.0,
        },
      ],
    },
    {
      name: "Hogar Protegido",
      type: "FIRE",
      description:
        "Seguro integral para protección de inmuebles contra incendios y desastres.",
      priceBase: 4200.0,
      specificData: {
        allowedPropertyTypes: ["HOUSE", "APARTMENT"],
        maxRiskZone: 4,
      },
      coverages: [
        {
          name: "Daños a la Propiedad",
          description: "Cubre la estructura del inmueble.",
          value: 2000000.0,
        },
        {
          name: "Contenido",
          description: "Muebles y pertenencias dentro del hogar.",
          value: 500000.0,
        },
        {
          name: "Responsabilidad Civil Familiar",
          description: "Protección para la familia residente.",
          value: 1000000.0,
        },
      ],
    },
    {
      name: "Protección Móvil Pro",
      type: "MOBILE",
      description: "Protección total para smartphones de gama alta.",
      priceBase: 1500.0,
      specificData: { maxDeviceAgeMonths: 24, requiresOriginalInvoice: true },
      coverages: [
        {
          name: "Robo con Violencia",
          description: "Cobertura por robo con uso de fuerza.",
          value: null,
        },
        {
          name: "Daño Accidental",
          description: "Rotura de pantalla o derramamiento de líquidos.",
          value: null,
        },
      ],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name } as any,
      update: {
        type: p.type,
        description: p.description,
        priceBase: p.priceBase,
        specificData: p.specificData,
      },
      create: {
        name: p.name,
        type: p.type,
        description: p.description,
        priceBase: p.priceBase,
        specificData: p.specificData,
        coverages: {
          create: p.coverages,
        },
      },
    });
    console.log(`Product created: ${p.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    process.exit(0);
  });
