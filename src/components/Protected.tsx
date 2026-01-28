"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import type { Role } from "@/lib/types";

export default function Protected({
  children,
  allowRoles,
}: {
  children: React.ReactNode;
  allowRoles?: Role[];
}) {
  const { isAuthenticated, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (allowRoles && session?.role && !allowRoles.includes(session.role)) {
      router.replace("/products");
    }
  }, [isAuthenticated, session?.role, allowRoles, router]);

  // Avoid rendering protected content during redirect
  if (!isAuthenticated) return null;
  if (allowRoles && session?.role && !allowRoles.includes(session.role)) return null;

  return <>{children}</>;
}
 