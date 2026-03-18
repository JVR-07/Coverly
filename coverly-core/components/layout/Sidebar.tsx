"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/catalog", label: "Catálogo de Seguros", icon: "🛡️" },
    { href: "/clients", label: "Mis Clientes", icon: "👥" },
    { href: "/clients/new", label: "Nuevo Cliente", icon: "➕" },
  ];

  return (
    <aside className="w-64 bg-trust-blue border-r border-trust-blue-hover flex flex-col h-full shrink-0 shadow-xl">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Coverly<span className="text-insight-teal">.</span>
        </h2>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-insight-teal text-white font-medium shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/50 text-center uppercase tracking-widest font-semibold">
          Version 0.2.0 Beta
        </p>
      </div>
    </aside>
  );
}
