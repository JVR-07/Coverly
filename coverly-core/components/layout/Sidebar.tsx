'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/catalog', label: 'Catálogo de Seguros', icon: '🛡️' },
    { href: '/clients', label: 'Mis Clientes', icon: '👥' },
    { href: '/clients/new', label: 'Nuevo Cliente', icon: '➕' },
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-emerald-400">
          Coverly
        </h2>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 font-medium'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-neutral-800">
        <p className="text-xs text-neutral-500 text-center">Version 0.1.0 Beta</p>
      </div>
    </aside>
  );
}
