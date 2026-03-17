import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans antialiased text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-neutral-950 p-8">
          <div className="max-w-6xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
