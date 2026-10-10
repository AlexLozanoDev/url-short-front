"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { UserPlus } from "lucide-react";
import Header from "@/components/layout/Header";
import { toast } from "@/components/ui/toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ email, password });
      setSuccess(true);
      router.push("/auth/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#e9e9e9] text-black flex flex-col justify-between p-6 dark:bg-[#161616] dark:text-white">
      <Header />
      <div className="flex items-center justify-center my-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-10 font-passion">Crear cuenta</h1>
          <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label
                    className="text-xs font-medium text-muted-foreground"
                    htmlFor="email"
                  >
                    Correo Electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#d7d7d7] border-0 focus-visible:ring-1 focus-visible:ring-zinc-700 text-[#191919] placeholder:text-zinc-600 px-4 py-5 rounded-[10] max-w-xl self-center dark:text-[#e9e9e9]"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs font-medium text-muted-foreground"
                    htmlFor="password"
                  >
                    Contraseña
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#d7d7d7] border-0 focus-visible:ring-1 focus-visible:ring-zinc-700 text-[#191919] placeholder:text-zinc-600 px-4 py-5 rounded-[10] max-w-xl self-center dark:text-[#e9e9e9]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2 font-passion text-lg py-5 rounded-xl"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
          </CardContent>
          <p className="text-muted-foreground mt-3">
            <Link
              href="/auth/login"
              className="text-primary text-xs hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
