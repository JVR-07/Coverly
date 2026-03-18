"use client";

import { Input, Button } from "@nextui-org/react";
import { useActionState } from "react";
import { authenticate } from "./actions";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 relative z-10 text-graphite"
    >
      <Input
        name="email"
        type="email"
        label="Correo Electrónico"
        variant="bordered"
        radius="sm"
        isRequired
        classNames={{
          input: ["text-graphite"],
          inputWrapper: [
            "border-gray-200",
            "hover:border-gray-300",
            "focus-within:!border-trust-blue",
            "bg-white",
          ],
        }}
      />

      <Input
        name="password"
        type="password"
        label="Contraseña"
        variant="bordered"
        radius="sm"
        isRequired
        classNames={{
          input: ["text-graphite"],
          inputWrapper: [
            "border-gray-200",
            "hover:border-gray-300",
            "focus-within:!border-trust-blue",
            "bg-white",
          ],
        }}
      />

      <Button
        type="submit"
        color="primary"
        radius="sm"
        isLoading={isPending}
        className="mt-4 bg-trust-blue text-white font-semibold hover:bg-trust-blue-hover transition-colors shadow-md"
      >
        Iniciar Sesión
      </Button>

      {errorMessage && (
        <div className="mt-2 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  );
}
