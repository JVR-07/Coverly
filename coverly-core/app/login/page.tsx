import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-soft-light bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white to-soft-light">
      <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-trust-blue/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col items-center mb-8 relative z-10">
          <h1 className="text-4xl font-extrabold text-trust-blue tracking-tight">
            Coverly<span className="text-insight-teal">.</span>
          </h1>
          <p className="text-sm text-slate mt-2 tracking-wide font-medium">
            Plataforma de asesores y agentes
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
