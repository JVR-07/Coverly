import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

export default async function Topbar() {
  const session = await auth();

  return (
    <header className="md:hidden h-16 flex items-center justify-between px-4 bg-trust-blue border-b border-trust-blue-hover sticky top-0 z-40 shadow-sm shrink-0">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Coverly<span className="text-insight-teal">.</span>
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end max-w-[120px]">
          <span className="text-xs font-semibold text-white truncate w-full text-right">
            {session?.user?.email?.split("@")[0] || "Usuario"}
          </span>
          <span className="text-[10px] text-insight-teal font-medium uppercase tracking-widest truncate">
            {session?.user?.role}
          </span>
        </div>

        <form
          className="shrink-0"
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-100 hover:bg-red-500/30 border border-red-500/30 transition-all font-bold"
            aria-label="Cerrar Sesión"
          >
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </header>
  );
}
