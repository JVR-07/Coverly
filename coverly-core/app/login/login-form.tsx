"use client";

import { Input, Button } from "@heroui/react";
import { useActionState, useState } from "react";
import { authenticate } from "./actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form action={formAction} className="flex flex-col gap-5 relative z-10">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-bold text-trust-blue px-0.5"
        >
          Correo Electrónico
        </label>
        <div className="relative flex items-center h-14 w-full border-1.5 border-gray-200 hover:border-trust-blue/30 focus-within:border-trust-blue! bg-white shadow-sm rounded-3xl px-5 transition-colors">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            variant="flat"
            required
            className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0"
            style={{
              boxShadow: "none",
              background: "transparent",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-bold text-trust-blue px-0.5"
        >
          Contraseña
        </label>
        <div className="relative flex items-center h-14 w-full border-1.5 border-gray-200 hover:border-trust-blue/30 focus-within:border-trust-blue! bg-white shadow-sm rounded-3xl px-5 transition-colors">
          <Input
            id="password"
            name="password"
            type={isVisible ? "text" : "password"}
            placeholder="••••••••"
            variant="flat"
            required
            className="w-full h-full bg-transparent border-none focus:ring-0 outline-none p-0"
            style={{
              boxShadow: "none",
              background: "transparent",
            }}
          />
          <button
            className="focus:outline-none p-2 -mr-1"
            type="button"
            onClick={toggleVisibility}
            aria-label="toggle password visibility"
          >
            {isVisible ? (
              <EyeOff className="size-5 text-slate hover:text-trust-blue transition-colors" />
            ) : (
              <Eye className="size-5 text-slate hover:text-trust-blue transition-colors" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        isDisabled={isPending}
        className="mt-4 bg-trust-blue text-white font-bold h-14 shadow-lg hover:shadow-trust-blue/20 hover:scale-[1.01] transition-all active:scale-[0.98] rounded-3xl"
      >
        {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
        {isPending ? "Iniciando..." : "Iniciar Sesión"}
      </Button>

      {errorMessage && (
        <div className="mt-2 text-center text-sm font-medium text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2">
          <span>⚠️</span> {errorMessage}
        </div>
      )}
    </form>
  );
}
