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
    <form action={formAction} className="flex flex-col gap-5 relative z-10">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-bold text-trust-blue px-0.5"
        >
          Correo Electrónico
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="ejemplo@correo.com"
          variant="bordered"
          isRequired
          classNames={{
            input:
              "text-graphite placeholder:text-slate/40 text-base py-0 h-full",
            inputWrapper: [
              "border-gray-200",
              "hover:border-trust-blue/30",
              "focus-within:!border-trust-blue",
              "bg-white",
              "shadow-sm",
              "h-14",
              "px-5",
              "flex items-center",
              "rounded-3xl",
            ],
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-bold text-trust-blue px-0.5"
        >
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          variant="bordered"
          isRequired
          classNames={{
            input:
              "text-graphite placeholder:text-slate/40 text-base py-0 h-full",
            inputWrapper: [
              "border-gray-200",
              "hover:border-trust-blue/30",
              "focus-within:!border-trust-blue",
              "bg-white",
              "shadow-sm",
              "h-14",
              "px-5",
              "flex items-center",
              "rounded-3xl",
            ],
          }}
        />
      </div>

      <Button
        type="submit"
        color="primary"
        isLoading={isPending}
        className="mt-4 bg-trust-blue text-white font-bold h-14 shadow-lg hover:shadow-trust-blue/20 hover:scale-[1.01] transition-all active:scale-[0.98] rounded-3xl"
      >
        Iniciar Sesión
      </Button>

      {errorMessage && (
        <div className="mt-2 text-center text-sm font-medium text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2">
          <span>⚠️</span> {errorMessage}
        </div>
      )}
    </form>
  );
}
