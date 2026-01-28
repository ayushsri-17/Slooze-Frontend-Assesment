"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, session } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    router.replace(session?.role === "Manager" ? "/dashboard" : "/products");
  }, [isAuthenticated, session?.role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm opacity-70">
      Redirecting…
    </div>
  );
}
