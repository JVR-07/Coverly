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
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
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
    // ─── AUTO: 5 Estándar ────────────────────────────────────────────────────────
    {
      name: "Auto Estándar Básico",
      type: "AUTO",
      description: "Cobertura básica de responsabilidad civil para vehículos de uso personal.",
      priceBase: 7800.0,
      specificData: { maxYearAge: 12, allowedUseTypes: ["PERSONAL"], requiresSecuritySystem: false },
      coverages: [
        { name: "Responsabilidad Civil", description: "Daños a terceros.", value: 1500000.0 },
        { name: "Asistencia Vial", description: "Grúa y auxilio en carretera.", value: null },
      ],
    },
    {
      name: "Auto Estándar Plus",
      type: "AUTO",
      description: "Cobertura amplia básica con robo total incluido.",
      priceBase: 8500.0,
      specificData: { maxYearAge: 12, allowedUseTypes: ["PERSONAL"], requiresSecuritySystem: false },
      coverages: [
        { name: "Responsabilidad Civil", description: "Daños a terceros.", value: 2000000.0 },
        { name: "Robo Total", description: "Indemnización por robo.", value: null },
        { name: "Asistencia Vial", description: "Grúa y auxilio.", value: null },
      ],
    },
    {
      name: "Auto Estándar Familiar",
      type: "AUTO",
      description: "Diseñado para familias con vehículos de uso mixto.",
      priceBase: 9200.0,
      specificData: { maxYearAge: 10, allowedUseTypes: ["PERSONAL", "FAMILY"], requiresSecuritySystem: false },
      coverages: [
        { name: "Daños Materiales", description: "Daños al vehículo asegurado.", value: 300000.0 },
        { name: "Responsabilidad Civil", description: "Daños a terceros.", value: 2500000.0 },
        { name: "Robo Total", description: "Indemnización por robo.", value: null },
      ],
    },
    {
      name: "Auto Estándar Completo",
      type: "AUTO",
      description: "Cobertura estándar completa con cristales.",
      priceBase: 10000.0,
      specificData: { maxYearAge: 10, allowedUseTypes: ["PERSONAL"], requiresSecuritySystem: false },
      coverages: [
        { name: "Daños Materiales", description: "Daños al vehículo.", value: 400000.0 },
        { name: "Robo Total", description: "Indemnización por robo.", value: null },
        { name: "Responsabilidad Civil", description: "Daños a terceros.", value: 3000000.0 },
        { name: "Cristales", description: "Reparación y reposición de cristales.", value: 15000.0 },
      ],
    },
    {
      name: "Auto Estándar Conexión",
      type: "AUTO",
      description: "Cobertura estándar con monitoreo GPS y asistencia extendida.",
      priceBase: 10800.0,
      specificData: { maxYearAge: 8, allowedUseTypes: ["PERSONAL"], requiresSecuritySystem: true },
      coverages: [
        { name: "Daños Materiales", description: "Daños al vehículo.", value: 450000.0 },
        { name: "Robo Total", description: "Indemnización por robo.", value: null },
        { name: "Responsabilidad Civil", description: "Daños a terceros.", value: 3000000.0 },
        { name: "Monitoreo GPS", description: "Rastreo satelital 24/7.", value: null },
      ],
    },

    // ─── AUTO: 5 Premium ─────────────────────────────────────────────────────────
    {
      name: "Cobertura Amplia Auto Plus",
      type: "AUTO",
      description: "Seguro de cobertura amplia para vehículos de uso particular.",
      priceBase: 12000.0,
      specificData: { maxYearAge: 15, allowedUseTypes: ["PERSONAL"], requiresSecuritySystem: false },
      coverages: [
        { name: "Daños Materiales", description: "Cubre daños al vehículo asegurado.", value: 500000.0 },
        { name: "Robo Total", description: "Indemnización en caso de robo total.", value: null },
        { name: "Responsabilidad Civil", description: "Daños a terceros.", value: 3000000.0 },
      ],
    },
    {
      name: "Auto Premium Elite",
      type: "AUTO",
      description: "Cobertura premium para vehículos de gama alta con reemplazo de auto.",
      priceBase: 15500.0,
      specificData: { maxYearAge: 5, allowedUseTypes: ["PERSONAL"], requiresSecuritySystem: true },
      coverages: [
        { name: "Daños Materiales", description: "Cubre daños totales.", value: 800000.0 },
        { name: "Robo Total y Parcial", description: "Cobertura completa por robo.", value: null },
        { name: "Responsabilidad Civil Ampliada", description: "Alta cobertura a terceros.", value: 5000000.0 },
        { name: "Auto de Reemplazo", description: "Vehículo de sustitución por 15 días.", value: null },
      ],
    },
    {
      name: "Auto Premium Ejecutivo",
      type: "AUTO",
      description: "Póliza ejecutiva para vehículos de empresa o alta gama.",
      priceBase: 18000.0,
      specificData: { maxYearAge: 5, allowedUseTypes: ["PERSONAL", "EXECUTIVE"], requiresSecuritySystem: true },
      coverages: [
        { name: "Daños Materiales", description: "Valor de mercado total.", value: 1000000.0 },
        { name: "Robo Total", description: "Indemnización a valor nuevo.", value: null },
        { name: "Responsabilidad Civil", description: "Cobertura máxima a terceros.", value: 6000000.0 },
        { name: "Accidentes del Conductor", description: "Gastos médicos del conductor.", value: 200000.0 },
      ],
    },
    {
      name: "Auto Premium Internacional",
      type: "AUTO",
      description: "Cobertura en México y EE.UU. para viajes de negocios.",
      priceBase: 20500.0,
      specificData: { maxYearAge: 4, allowedUseTypes: ["PERSONAL", "TRAVEL"], requiresSecuritySystem: true },
      coverages: [
        { name: "Daños Materiales (MX/US)", description: "Cobertura bilateral.", value: 900000.0 },
        { name: "Robo Total", description: "Cobertura en ambos países.", value: null },
        { name: "Responsabilidad Civil Internacional", description: "Cobertura transfronteriza.", value: 7000000.0 },
      ],
    },
    {
      name: "Auto Premium Total Max",
      type: "AUTO",
      description: "La póliza más completa: cobertura sin deducible en colisión.",
      priceBase: 22000.0,
      specificData: { maxYearAge: 3, allowedUseTypes: ["PERSONAL"], requiresSecuritySystem: true },
      coverages: [
        { name: "Daños Materiales Sin Deducible", description: "Sin costo adicional en colisión.", value: 1200000.0 },
        { name: "Robo Total", description: "Valor factura nuevo.", value: null },
        { name: "Responsabilidad Civil", description: "Cobertura plena.", value: 8000000.0 },
        { name: "Gastos Médicos Ocupantes", description: "Hasta 4 pasajeros cubiertos.", value: 300000.0 },
        { name: "Equipo Especial", description: "Accesorios y GPS de serie.", value: 50000.0 },
      ],
    },

    // ─── VIDA: 5 seguros ─────────────────────────────────────────────────────────
    {
      name: "Vida Segura Total",
      type: "LIFE",
      description: "Protección financiera para tus seres queridos en caso de fallecimiento.",
      priceBase: 8500.0,
      specificData: { maxAge: 70, requiresMedicalExam: true, baseCoverageAmount: 1500000.0 },
      coverages: [
        { name: "Fallecimiento", description: "Suma asegurada básica.", value: 1500000.0 },
        { name: "Muerte Accidental", description: "Doble indemnización si es accidente.", value: 1500000.0 },
        { name: "Gastos Funerarios", description: "Apoyo adicional para gastos.", value: 50000.0 },
      ],
    },
    {
      name: "Vida Básica Joven",
      type: "LIFE",
      description: "Póliza de vida asequible para personas menores de 40 años.",
      priceBase: 5000.0,
      specificData: { maxAge: 40, requiresMedicalExam: false, baseCoverageAmount: 500000.0 },
      coverages: [
        { name: "Fallecimiento", description: "Suma asegurada.", value: 500000.0 },
        { name: "Gastos Funerarios", description: "Apoyo básico.", value: 30000.0 },
      ],
    },
    {
      name: "Vida Familiar Plus",
      type: "LIFE",
      description: "Cobertura familiar con beneficios adicionales para hijos.",
      priceBase: 9500.0,
      specificData: { maxAge: 65, requiresMedicalExam: true, baseCoverageAmount: 2000000.0 },
      coverages: [
        { name: "Fallecimiento", description: "Suma asegurada.", value: 2000000.0 },
        { name: "Invalidez Total Permanente", description: "Pago adelantado por invalidez.", value: 2000000.0 },
        { name: "Gastos Funerarios", description: "Cobertura completa.", value: 80000.0 },
      ],
    },
    {
      name: "Vida Ejecutiva Senior",
      type: "LIFE",
      description: "Cobertura premium con beneficio por enfermedades graves.",
      priceBase: 11000.0,
      specificData: { maxAge: 65, requiresMedicalExam: true, baseCoverageAmount: 3000000.0 },
      coverages: [
        { name: "Fallecimiento", description: "Suma asegurada.", value: 3000000.0 },
        { name: "Enfermedades Graves", description: "Cáncer, infarto, ACV.", value: 1500000.0 },
        { name: "Invalidez Total", description: "Pago adelantado.", value: 3000000.0 },
      ],
    },
    {
      name: "Vida Ahorro Protegido",
      type: "LIFE",
      description: "Seguro de vida con componente de ahorro a 20 años.",
      priceBase: 12000.0,
      specificData: { maxAge: 55, requiresMedicalExam: true, baseCoverageAmount: 2500000.0, savingsComponent: true },
      coverages: [
        { name: "Fallecimiento", description: "Suma asegurada más ahorro acumulado.", value: 2500000.0 },
        { name: "Supervivencia", description: "Retiro del fondo acumulado a los 20 años.", value: null },
        { name: "Invalidez", description: "Exención de pagos por invalidez.", value: null },
      ],
    },

    // ─── HOGAR: 5 seguros ────────────────────────────────────────────────────────
    {
      name: "Hogar Protegido",
      type: "FIRE",
      description: "Seguro integral para protección de inmuebles contra incendios y desastres.",
      priceBase: 4200.0,
      specificData: { allowedPropertyTypes: ["HOUSE", "APARTMENT"], maxRiskZone: 4 },
      coverages: [
        { name: "Daños a la Propiedad", description: "Cubre la estructura del inmueble.", value: 2000000.0 },
        { name: "Contenido", description: "Muebles y pertenencias.", value: 500000.0 },
        { name: "Responsabilidad Civil Familiar", description: "Protección para la familia.", value: 1000000.0 },
      ],
    },
    {
      name: "Hogar Básico Departamento",
      type: "FIRE",
      description: "Cobertura esencial para departamentos en zonas urbanas.",
      priceBase: 2500.0,
      specificData: { allowedPropertyTypes: ["APARTMENT"], maxRiskZone: 3 },
      coverages: [
        { name: "Incendio y Explosión", description: "Daños por fuego o gaseras.", value: 800000.0 },
        { name: "Contenido Básico", description: "Pertenencias esenciales.", value: 200000.0 },
      ],
    },
    {
      name: "Hogar Premium Casa",
      type: "FIRE",
      description: "Cobertura premium para casas habitación de alto valor.",
      priceBase: 6000.0,
      specificData: { allowedPropertyTypes: ["HOUSE"], maxRiskZone: 5 },
      coverages: [
        { name: "Daños a la Propiedad", description: "Valor de reconstrucción.", value: 5000000.0 },
        { name: "Contenido Premium", description: "Arte, joyería y electrónica.", value: 1500000.0 },
        { name: "Responsabilidad Civil", description: "Cobertura extendida.", value: 2000000.0 },
        { name: "Pérdida de Rentas", description: "Renta mensual si el inmueble es inhabitable.", value: 120000.0 },
      ],
    },
    {
      name: "Hogar Total Terremotos",
      type: "FIRE",
      description: "Cobertura incluyendo sismos y fenómenos hidrometeorológicos.",
      priceBase: 5500.0,
      specificData: { allowedPropertyTypes: ["HOUSE", "APARTMENT"], maxRiskZone: 5, coversEarthquake: true },
      coverages: [
        { name: "Daños Estructura", description: "Reconstrucción por sismo o derrumbe.", value: 3000000.0 },
        { name: "Fenómenos Hidrometeorológicos", description: "Inundaciones, granizo.", value: 1000000.0 },
        { name: "Contenido", description: "Pertenencias del hogar.", value: 500000.0 },
      ],
    },
    {
      name: "Hogar Smart PYME",
      type: "FIRE",
      description: "Para inmuebles de uso mixto habitacional-comercial.",
      priceBase: 7000.0,
      specificData: { allowedPropertyTypes: ["MIXED"], maxRiskZone: 4 },
      coverages: [
        { name: "Estructura Comercial", description: "Daños a las instalaciones.", value: 4000000.0 },
        { name: "Mercancía", description: "Stock y equipo de trabajo.", value: 1000000.0 },
        { name: "Responsabilidad Civil Comercial", description: "Daños a clientes.", value: 2000000.0 },
      ],
    },

    // ─── MÓVIL: 1 seguro ─────────────────────────────────────────────────────────
    {
      name: "Protección Móvil Pro",
      type: "MOBILE",
      description: "Protección total para smartphones de gama alta.",
      priceBase: 1500.0,
      specificData: { maxDeviceAgeMonths: 24, requiresOriginalInvoice: true },
      coverages: [
        { name: "Robo con Violencia", description: "Cobertura por robo con fuerza.", value: null },
        { name: "Daño Accidental", description: "Rotura de pantalla o derramamiento.", value: null },
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

  const promotions = [
    {
      name: "Descuento Buen Fin - Auto",
      description: "20% de descuento en el primer año para Auto Plus.",
      discountPercent: 20.0,
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
    {
      name: "Campaña Protección Familiar",
      description: "15% de descuento en contratación conjunta Vida + Hogar.",
      discountPercent: 15.0,
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
    {
      name: "Bonificación Renovación Anticipada",
      description: "10% de ahorro por aceptar en la primera propuesta.",
      discountPercent: 10.0,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  ];

  for (const promo of promotions) {
    const existingPromo = await prisma.promotion.findFirst({
      where: { name: promo.name },
    });

    if (!existingPromo) {
      await prisma.promotion.create({
        data: promo,
      });
      console.log(`Promotion created: ${promo.name}`);
    } else {
      await prisma.promotion.update({
        where: { id: existingPromo.id },
        data: promo,
      });
      console.log(`Promotion updated: ${promo.name}`);
    }
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
