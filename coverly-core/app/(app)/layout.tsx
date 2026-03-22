import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import { auth } from '@/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex h-dvh bg-soft-light overflow-hidden font-sans antialiased text-graphite relative">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar userEmail={session?.user?.email} userRole={session?.user?.role} />
      </div>
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Nav Mobile */}
      <MobileNav />
    </div>
  );
}
