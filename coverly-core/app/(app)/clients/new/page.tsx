"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClientRegistrationSchema,
  ClientRegistrationType,
} from "@/schemas/client";
import {
  Input,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

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
    resolver: zodResolver(ClientRegistrationSchema),
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section: Personal Data */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-trust-blue">
              Datos Personales
            </h2>
          </CardHeader>
          <CardBody className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="personalData.firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre(s)"
                  isRequired
                  errorMessage={errors.personalData?.firstName?.message}
                  isInvalid={!!errors.personalData?.firstName}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper:
                      "border-gray-200 focus-within:!border-trust-blue",
                  }}
                />
              )}
            />
            <Controller
              name="personalData.lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Apellidos"
                  isRequired
                  errorMessage={errors.personalData?.lastName?.message}
                  isInvalid={!!errors.personalData?.lastName}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper:
                      "border-gray-200 focus-within:!border-trust-blue",
                  }}
                />
              )}
            />
            <Controller
              name="personalData.dateOfBirth"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  label="Fecha de Nacimiento"
                  placeholder="YYYY-MM-DD"
                  isRequired
                  errorMessage={errors.personalData?.dateOfBirth?.message}
                  isInvalid={!!errors.personalData?.dateOfBirth}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper:
                      "border-gray-200 focus-within:!border-trust-blue",
                  }}
                />
              )}
            />
            <Controller
              name="personalData.gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Género"
                  isRequired
                  errorMessage={errors.personalData?.gender?.message}
                  isInvalid={!!errors.personalData?.gender}
                  variant="bordered"
                  labelPlacement="outside"
                >
                  <SelectItem key="M" value="M">
                    Masculino
                  </SelectItem>
                  <SelectItem key="F" value="F">
                    Femenino
                  </SelectItem>
                  <SelectItem key="O" value="O">
                    Otro
                  </SelectItem>
                </Select>
              )}
            />
            <Controller
              name="personalData.contact.email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  label="Correo Electrónico (Opcional)"
                  errorMessage={errors.personalData?.contact?.email?.message}
                  isInvalid={!!errors.personalData?.contact?.email}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper:
                      "border-gray-200 focus-within:!border-trust-blue",
                  }}
                />
              )}
            />
            <Controller
              name="personalData.contact.phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="tel"
                  label="Teléfono (Opcional)"
                  errorMessage={errors.personalData?.contact?.phone?.message}
                  isInvalid={!!errors.personalData?.contact?.phone}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper:
                      "border-gray-200 focus-within:!border-trust-blue",
                  }}
                />
              )}
            />
          </CardBody>
        </Card>

        {/* Section: Economic Profile */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-trust-blue">
              Perfil Económico
            </h2>
          </CardHeader>
          <CardBody className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="economicProfile.annualIncome"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value !== undefined ? String(field.value) : ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  type="number"
                  label="Ingreso Anual Aproximado (MXN)"
                  startContent={<span className="text-gray-500">$</span>}
                  isRequired
                  errorMessage={errors.economicProfile?.annualIncome?.message}
                  isInvalid={!!errors.economicProfile?.annualIncome}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper:
                      "border-gray-200 focus-within:!border-trust-blue",
                  }}
                />
              )}
            />
            <Controller
              name="economicProfile.occupation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Ocupación / Profesión"
                  isRequired
                  errorMessage={errors.economicProfile?.occupation?.message}
                  isInvalid={!!errors.economicProfile?.occupation}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper:
                      "border-gray-200 focus-within:!border-trust-blue",
                  }}
                />
              )}
            />
            <div className="md:col-span-2">
              <Controller
                name="economicProfile.dependents"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                    label="Número de Dependientes Económicos"
                    isRequired
                    errorMessage={errors.economicProfile?.dependents?.message}
                    isInvalid={!!errors.economicProfile?.dependents}
                    variant="bordered"
                  labelPlacement="outside"
                    classNames={{
                      inputWrapper:
                        "border-gray-200 focus-within:!border-trust-blue",
                    }}
                  />
                )}
              />
            </div>
          </CardBody>
        </Card>

        {/* Section: Interests and Risk */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-trust-blue">
              Intereses y Riesgo Evaluado
            </h2>
          </CardHeader>
          <CardBody className="px-6 py-6 gap-6">
            <Controller
              name="needs"
              control={control}
              render={({ field }) => (
                <CheckboxGroup
                  label="¿Qué tipo de seguros le interesan?"
                  orientation="horizontal"
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.needs?.message}
                  isInvalid={!!errors.needs}
                  classNames={{ label: "text-slate" }}
                >
                  <Checkbox
                    value="AUTO"
                    classNames={{ label: "text-graphite" }}
                  >
                    Auto
                  </Checkbox>
                  <Checkbox
                    value="LIFE"
                    classNames={{ label: "text-graphite" }}
                  >
                    Vida
                  </Checkbox>
                  <Checkbox
                    value="FIRE"
                    classNames={{ label: "text-graphite" }}
                  >
                    Hogar/Incendio
                  </Checkbox>
                  <Checkbox
                    value="MOBILE"
                    classNames={{ label: "text-graphite" }}
                  >
                    Móvil
                  </Checkbox>
                </CheckboxGroup>
              )}
            />

            <Controller
              name="riskLevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Nivel de Riesgo Subjetivo Inicial"
                  isRequired
                  errorMessage={errors.riskLevel?.message}
                  isInvalid={!!errors.riskLevel}
                  variant="bordered"
                  labelPlacement="outside"
                >
                  <SelectItem
                    key="LOW"
                    value="LOW"
                    className="text-emerald-500"
                  >
                    Bajo Riesgo
                  </SelectItem>
                  <SelectItem
                    key="MEDIUM"
                    value="MEDIUM"
                    className="text-yellow-600"
                  >
                    Riesgo Medio
                  </SelectItem>
                  <SelectItem key="HIGH" value="HIGH" className="text-red-500">
                    Alto Riesgo
                  </SelectItem>
                </Select>
              )}
            />
          </CardBody>
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

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            size="lg"
            className="w-full md:w-auto px-8 font-semibold"
          >
            Registrar Perfil Cliente
          </Button>
        </div>
      </form>
    </div>
  );
}
