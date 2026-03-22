"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  UserPlus,
  BrainCircuit,
  LogOut,
} from "lucide-react";
import { type ReactNode } from "react";
import { signOut } from "next-auth/react";

export default function Sidebar({ userEmail, userRole }: { userEmail?: string | null, userRole?: string | null }) {
  const pathname = usePathname();

  const links: { href: string; label: string; icon: ReactNode }[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: "/catalog",
      label: "Catálogo de Seguros",
      icon: <ShieldCheck size={20} />,
    },
    { href: "/clients", label: "Mis Clientes", icon: <Users size={20} /> },
    {
      href: "/recommendations",
      label: "Recomendaciones",
      icon: <BrainCircuit size={20} />,
    },
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
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 flex flex-col gap-3">
        {(userEmail || userRole) && (
          <div className="flex flex-col mb-1 px-2">
            <span className="text-sm font-semibold text-white truncate">{userEmail}</span>
            <span className="text-[10px] text-insight-teal font-medium uppercase tracking-widest">{userRole}</span>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 justify-center w-full text-xs px-3 py-2 rounded-lg bg-red-500/10 text-red-100 hover:bg-red-500/30 border border-red-500/30 font-bold transition-all"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
