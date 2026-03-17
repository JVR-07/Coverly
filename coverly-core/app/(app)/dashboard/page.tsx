import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Resumen de Actividad</h1>
        <p className="text-neutral-400">Tus datos en tiempo real.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 shadow-lg">
           <h3 className="text-sm font-medium text-neutral-400 mb-1">Rol actual</h3>
           <p className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-emerald-400 font-mono">
             {session?.user?.role || 'Desconocido'}
           </p>
        </div>
        
        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 shadow-lg">
           <h3 className="text-sm font-medium text-neutral-400 mb-1">Clientes Registrados</h3>
           <p className="text-2xl font-bold text-white">4</p>
        </div>
        
        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 shadow-lg">
           <h3 className="text-sm font-medium text-neutral-400 mb-1">Recomendaciones Exitosas</h3>
           <p className="text-2xl font-bold text-emerald-400">2</p>
        </div>
      </div>
      
      <section className="mt-10 p-6 bg-neutral-900 rounded-xl border border-neutral-800 shadow-lg min-h-[400px]">
         <h2 className="text-xl font-bold border-b border-neutral-800 pb-4 mb-4">Últimos Clientes</h2>
         <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500">
           <span className="text-4xl mb-4">📭</span>
           <p>Todavía no hay clientes creados.</p>
           <p className="text-sm mt-2">Visita "Nuevo Cliente" en el menú para crear el primero.</p>
         </div>
      </section>
    </div>
  );
}
