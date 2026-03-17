import { auth, signOut } from '@/auth';

export default async function Topbar() {
  const session = await auth();

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-40">
      <div className="flex items-center gap-4 text-sm text-neutral-400">
        <span>Buscador...</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-white">{session?.user?.email}</span>
          <span className="text-xs text-blue-400 uppercase tracking-widest">{session?.user?.role}</span>
        </div>
        
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button 
            type="submit" 
            className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/25 border border-red-500/20 font-medium transition-all"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </header>
  );
}
