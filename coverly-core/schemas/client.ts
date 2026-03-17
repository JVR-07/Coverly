import { z } from 'zod';

export const ClientRegistrationSchema = z.object({
  personalData: z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
    lastName: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres."),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), "Fecha de nacimiento inválida"),
    gender: z.enum(['M', 'F', 'O'], {
      errorMap: () => ({ message: "Selecciona un género válido" })
    }),
    contact: z.object({
      email: z.string().email("Correo electrónico inválido").optional().or(z.literal('')),
      phone: z.string().min(10, "El teléfono debe tener minimo 10 dígitos").optional().or(z.literal(''))
    })
  }),
  economicProfile: z.object({
    annualIncome: z.coerce.number().min(0, "El ingreso no puede ser negativo"),
    occupation: z.string().min(2, "Ocupación requerida"),
    dependents: z.coerce.number().int().min(0, "El número de dependientes no puede ser negativo")
  }),
  needs: z.array(z.string()).min(1, "Debes seleccionar al menos una necesidad (Auto, Vida, etc.)"),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: "Selecciona un nivel de riesgo" })
  })
});

export type ClientRegistrationType = z.infer<typeof ClientRegistrationSchema>;
