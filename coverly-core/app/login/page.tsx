import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 to-black">
      <div className="w-full max-w-md p-8 bg-neutral-900/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Coverly
          </h1>
          <p className="text-sm text-neutral-400 mt-2">Plataforma de asesores y agentes</p>
        </div>
        
        <LoginForm />
      </div>
    </main>
  );
}
