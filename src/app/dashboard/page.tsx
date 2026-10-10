"use client";

import { useAuth } from "@/features/auth/context/auth-context";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#e9e9e9] text-black flex flex-col p-6 dark:bg-[#161616] dark:text-white">
      <Header />
      <Button variant="outline" size="sm" onClick={logout} className="gap-2">
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </Button>
      <div>Bienvenido{user?.email ? `, ${user.email}` : ""}</div>
    </main>
  );
}
