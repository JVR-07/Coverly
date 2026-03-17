'use client';

import { Input, Button } from '@nextui-org/react';
import { useActionState } from 'react';
import { authenticate } from './actions';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 relative z-10 text-white">
      <Input
        name="email"
        type="email"
        label="Correo Electrónico"
        variant="bordered"
        radius="sm"
        isRequired
        classNames={{
          input: ["text-white"],
          inputWrapper: [
            "border-neutral-700",
            "hover:border-neutral-500",
            "focus-within:!border-white"
          ]
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
          input: ["text-white"],
          inputWrapper: [
            "border-neutral-700",
            "hover:border-neutral-500",
            "focus-within:!border-white"
          ]
        }}
      />

      <Button
        type="submit"
        color="primary"
        radius="sm"
        isLoading={isPending}
        className="mt-4 bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
      >
        Iniciar Sesión
      </Button>
      
      {errorMessage && (
        <div className="mt-2 text-center text-sm text-red-400">
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  );
}
