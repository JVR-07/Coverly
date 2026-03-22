"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  UserPlus,
  BrainCircuit,
} from "lucide-react";
import { type ReactNode } from "react";

export default function MobileNav() {
  const pathname = usePathname();

  const links: { href: string; label: string; icon: ReactNode }[] = [
    { href: "/dashboard", label: "Inicio", icon: <LayoutDashboard size={20} /> },
    { href: "/catalog", label: "Catálogo", icon: <ShieldCheck size={20} /> },
    { href: "/clients", label: "Clientes", icon: <Users size={20} /> },
    { href: "/recommendations", label: "Motor", icon: <BrainCircuit size={20} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-trust-blue border-t border-white/10 flex justify-around items-center h-16 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 ${
              isActive
                ? "text-insight-teal"
                : "text-white/60 hover:text-white"
            }`}
          >
            {link.icon}
            <span className="text-[10px] font-medium tracking-wide">
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
