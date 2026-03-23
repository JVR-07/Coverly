"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClientRegistrationSchema,
  ClientRegistrationType,
} from "@/schemas/client";
import { Input, Select, ListBox, Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  UserPlus,
  Car,
  Heart,
  Home,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export default function NuevoClientePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientRegistrationType>({
    resolver: zodResolver(ClientRegistrationSchema) as any,
    defaultValues: {
      personalData: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: undefined,
        contact: { email: "", phone: "" },
      },
      economicProfile: { annualIncome: 0, occupation: "", dependents: 0 },
      needs: [],
      riskLevel: undefined,
    },
  });

  const onSubmit = async (data: ClientRegistrationType) => {
    setIsSubmitting(true);
    setErrorStatus(null);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok)
        throw new Error(result.error?.message || "Error al crear cliente.");

      setSuccessMessage("Cliente registrado correctamente. Redirigiendo...");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setErrorStatus(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-trust-blue mb-2">
          Registrar Nuevo Cliente
        </h1>
        <p className="text-slate">
          Captura la información de perfilamiento base para la posterior
          recomendación AI.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        {/* Section: Personal Data */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
          <Card.Header className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-trust-blue">
              Datos Personales
            </h2>
          </Card.Header>
          <Card.Content className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="personalData.firstName"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-trust-blue px-0.5">
                    Nombre(s) <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative flex items-center h-12 w-full border-1.5 ${errors.personalData?.firstName ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-gray-200 focus-within:border-trust-blue!"} bg-white shadow-sm rounded-2xl px-4 transition-colors`}
                  >
                    <Input
                      {...field}
                      placeholder="Ej. Juan Carlos"
                      variant="primary"
                      className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-medium text-trust-blue shadow-none!"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              )}
            />
            <Controller
              name="personalData.lastName"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-trust-blue px-0.5">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative flex items-center h-12 w-full border-1.5 ${errors.personalData?.lastName ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-gray-200 focus-within:border-trust-blue!"} bg-white shadow-sm rounded-2xl px-4 transition-colors`}
                  >
                    <Input
                      {...field}
                      placeholder="Ej. Pérez Gómez"
                      variant="primary"
                      className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-medium text-trust-blue shadow-none!"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              )}
            />
            <Controller
              name="personalData.dateOfBirth"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-trust-blue px-0.5">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative flex items-center h-12 w-full border-1.5 ${errors.personalData?.dateOfBirth ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-gray-200 focus-within:border-trust-blue!"} bg-white shadow-sm rounded-2xl px-4 transition-colors`}
                  >
                    <Input
                      {...field}
                      type="date"
                      variant="primary"
                      className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-medium text-trust-blue shadow-none!"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              )}
            />
            <Controller
              name="personalData.gender"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-trust-blue px-0.5">
                    Género <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...field}
                    placeholder="Selecciona un género"
                    variant="primary"
                    className="w-full"
                  >
                    <Select.Trigger className="h-12 w-full flex items-center justify-between bg-white border-1.5 border-gray-200 rounded-2xl shadow-sm transition-all focus:border-trust-blue! px-4">
                      <Select.Value className="text-sm font-medium text-trust-blue" />
                      <Select.Indicator className="text-slate/40" />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-1.5 min-w-[200px]">
                        <ListBox.Item
                          id="M"
                          textValue="Masculino"
                          className="group flex items-center justify-between p-3 rounded-xl hover:bg-soft-light cursor-pointer transition-colors"
                        >
                          <span className="text-trust-blue font-bold text-sm">
                            Masculino
                          </span>
                          <ListBox.ItemIndicator className="text-trust-blue" />
                        </ListBox.Item>
                        <ListBox.Item
                          id="F"
                          textValue="Femenino"
                          className="group flex items-center justify-between p-3 rounded-xl hover:bg-soft-light cursor-pointer transition-colors"
                        >
                          <span className="text-trust-blue font-bold text-sm">
                            Femenino
                          </span>
                          <ListBox.ItemIndicator className="text-trust-blue" />
                        </ListBox.Item>
                        <ListBox.Item
                          id="O"
                          textValue="Otro"
                          className="group flex items-center justify-between p-3 rounded-xl hover:bg-soft-light cursor-pointer transition-colors"
                        >
                          <span className="text-trust-blue font-bold text-sm">
                            Otro
                          </span>
                          <ListBox.ItemIndicator className="text-trust-blue" />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              )}
            />
            <Controller
              name="personalData.contact.email"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-trust-blue px-0.5">
                    Correo Electrónico
                  </label>
                  <div
                    className={`relative flex items-center h-12 w-full border-1.5 ${errors.personalData?.contact?.email ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-gray-200 focus-within:border-trust-blue!"} bg-white shadow-sm rounded-2xl px-4 transition-colors`}
                  >
                    <Input
                      {...field}
                      type="email"
                      placeholder="ejemplo@correo.com"
                      variant="primary"
                      className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-medium text-trust-blue shadow-none!"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              )}
            />
            <Controller
              name="personalData.contact.phone"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-trust-blue px-0.5">
                    Teléfono
                  </label>
                  <div
                    className={`relative flex items-center h-12 w-full border-1.5 ${errors.personalData?.contact?.phone ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-gray-200 focus-within:border-trust-blue!"} bg-white shadow-sm rounded-2xl px-4 transition-colors`}
                  >
                    <Input
                      {...field}
                      type="tel"
                      placeholder="10 dígitos"
                      variant="primary"
                      className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-medium text-trust-blue shadow-none!"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              )}
            />
          </Card.Content>
        </Card>

        {/* Section: Economic Profile */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
          <Card.Header className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-trust-blue">
              Perfil Económico
            </h2>
          </Card.Header>
          <Card.Content className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="economicProfile.annualIncome"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-trust-blue px-0.5">
                    Ingreso Anual Aproximado (MXN){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative flex items-center h-12 w-full border-1.5 ${errors.economicProfile?.annualIncome ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-gray-200 focus-within:border-trust-blue!"} bg-white shadow-sm rounded-2xl px-4 transition-colors`}
                  >
                    <span className="text-slate/40 text-sm font-bold mr-1.5">
                      $
                    </span>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined ? String(field.value) : ""
                      }
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      type="number"
                      placeholder="Ej. 350000"
                      variant="primary"
                      className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-medium text-trust-blue shadow-none!"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              )}
            />
            <Controller
              name="economicProfile.occupation"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-trust-blue px-0.5">
                    Ocupación / Profesión{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative flex items-center h-12 w-full border-1.5 ${errors.economicProfile?.occupation ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-gray-200 focus-within:border-trust-blue!"} bg-white shadow-sm rounded-2xl px-4 transition-colors`}
                  >
                    <Input
                      {...field}
                      placeholder="Ej. Ingeniero o Empleado"
                      variant="primary"
                      className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-medium text-trust-blue shadow-none!"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              )}
            />
            <div className="md:col-span-2">
              <Controller
                name="economicProfile.dependents"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-trust-blue px-0.5">
                      Número de Dependientes Económicos{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`relative flex items-center h-12 w-full border-1.5 ${errors.economicProfile?.dependents ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-gray-200 focus-within:border-trust-blue!"} bg-white shadow-sm rounded-2xl px-4 transition-colors`}
                    >
                      <Input
                        {...field}
                        value={
                          field.value !== undefined ? String(field.value) : ""
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        type="number"
                        placeholder="Ej. 2"
                        variant="primary"
                        className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-medium text-trust-blue shadow-none!"
                        style={{ background: "transparent" }}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          </Card.Content>
        </Card>

        {/* Section: Interests and Risk */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
          <Card.Header className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-trust-blue">
              Intereses y Riesgo Evaluado
            </h2>
          </Card.Header>
          <Card.Content className="px-6 py-6 gap-6">
            <Controller
              name="needs"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-4 items-center text-center">
                  <label className="text-sm font-bold text-trust-blue">
                    ¿Qué tipo de seguros le interesan?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-[280px]">
                    {["AUTO", "LIFE", "FIRE", "MOBILE"].map((type) => {
                      const config: Record<
                        string,
                        { label: string; icon: any }
                      > = {
                        AUTO: { label: "Autos", icon: Car },
                        LIFE: { label: "Vida", icon: Heart },
                        FIRE: { label: "Hogar", icon: Home },
                        MOBILE: { label: "Móvil", icon: Smartphone },
                      };
                      const isSelected = (field.value || []).includes(type);
                      const Icon = config[type].icon;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            const current = field.value || [];
                            if (isSelected) {
                              field.onChange(
                                current.filter((t: string) => t !== type),
                              );
                            } else {
                              field.onChange([...current, type]);
                            }
                          }}
                          className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 relative group ${
                            isSelected
                              ? "bg-trust-blue border-trust-blue text-white shadow-md shadow-trust-blue/10"
                              : "bg-white border-gray-100 text-slate hover:border-trust-blue/20 hover:bg-soft-light/20"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2
                              size={12}
                              className="absolute top-2 right-2 text-white"
                            />
                          )}
                          <Icon
                            size={20}
                            className={`mb-1.5 transition-colors ${isSelected ? "text-white" : "text-slate/40 group-hover:text-trust-blue"}`}
                          />
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? "text-white" : "text-slate/80"}`}
                          >
                            {config[type].label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            />

            <Controller
              name="riskLevel"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-4 items-center text-center mt-6">
                  <label className="text-sm font-bold text-trust-blue">
                    Nivel de Riesgo Subjetivo Inicial{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full max-w-sm">
                    <Select
                      {...field}
                      placeholder="Selecciona el riesgo"
                      variant="primary"
                      className="w-full"
                    >
                      <Select.Trigger className="h-12 w-full flex items-center justify-between bg-white border-1.5 border-gray-200 rounded-2xl shadow-sm transition-all focus:border-trust-blue! px-4">
                        <Select.Value className="text-sm font-medium text-trust-blue" />
                        <Select.Indicator className="text-slate/40" />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-1.5 min-w-[200px]">
                          <ListBox.Item
                            id="LOW"
                            textValue="Bajo Riesgo"
                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors"
                          >
                            <span className="text-emerald-600 font-bold text-sm">
                              Bajo Riesgo
                            </span>
                            <ListBox.ItemIndicator className="text-emerald-500" />
                          </ListBox.Item>
                          <ListBox.Item
                            id="MEDIUM"
                            textValue="Riesgo Medio"
                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-yellow-50 cursor-pointer transition-colors"
                          >
                            <span className="text-yellow-600 font-bold text-sm">
                              Riesgo Medio
                            </span>
                            <ListBox.ItemIndicator className="text-yellow-500" />
                          </ListBox.Item>
                          <ListBox.Item
                            id="HIGH"
                            textValue="Alto Riesgo"
                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-red-50 cursor-pointer transition-colors"
                          >
                            <span className="text-red-500 font-bold text-sm">
                              Alto Riesgo
                            </span>
                            <ListBox.ItemIndicator className="text-red-500" />
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              )}
            />
          </Card.Content>
        </Card>

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <span>✓</span>
            {successMessage}
          </div>
        )}

        {errorStatus && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
            {errorStatus}
          </div>
        )}

        <div className="flex justify-center pt-8">
          <Button
            type="submit"
            isDisabled={isSubmitting}
            size="lg"
            className="w-full md:w-auto px-16 h-14 font-extrabold text-white bg-trust-blue shadow-lg hover:shadow-trust-blue/20 hover:scale-[1.02] transition-all rounded-full"
          >
            {isSubmitting ? "Registrando..." : "Registrar Perfil Cliente"}
          </Button>
        </div>
      </form>
    </div>
  );
}
