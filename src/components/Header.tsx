"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function Header() {
  const { session, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!session) return null;

  const isManager = session.role === "Manager";

  const linkClass = (href: string) =>
    `px-3 py-1.5 rounded-md text-sm transition ${
      pathname === href
        ? "bg-slate-900 text-white dark:bg-white dark:text-black"
        : "hover:bg-slate-100 dark:hover:bg-zinc-800"
    }`;

  const onLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Slooze</span>
          <span className="text-xs opacity-60">({session.role})</span>
        </div>

        <nav className="flex items-center gap-2">
          {isManager && (
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              Dashboard
            </Link>
          )}

          <Link href="/products" className={linkClass("/products")}>
            Products
          </Link>

          <button
            onClick={onLogout}
            className="ml-2 rounded-md border px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
