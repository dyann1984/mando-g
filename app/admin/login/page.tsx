"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, LogIn, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Credenciales inválidas.");
      }
    } catch (err: any) {
      setError("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center p-6 relative overflow-hidden">
      {/* Luces y texturas de fondo */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-selva blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-oro blur-3xl opacity-20" />
      </div>

      <div className="w-full max-w-md bg-carbon border border-oro/30 p-8 rounded-lg shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="sello !text-sm">2SIK MUSIC</span>
          <h1 className="font-display text-4xl text-hueso mt-4">
            MANDO <span className="text-oro">G</span>
          </h1>
          <p className="font-head text-xs uppercase tracking-widest text-hueso/50">
            Panel de Administración · Acceso Seguro
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5">
              Usuario o Correo Electrónico
            </label>
            <input
              type="text"
              required
              className="campo text-sm"
              placeholder="admin@mandog.mx"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="campo text-sm"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-oro w-full justify-center !py-3 text-sm flex items-center gap-2 mt-2"
          >
            <LogIn size={16} />
            <span>{loading ? "Verificando..." : "Iniciar Sesión"}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-oro/15 flex flex-col gap-3 text-center text-xs">
          <Link
            href="/admin/register"
            className="text-oro/70 hover:text-oro font-head tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Tengo un código de invitación</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/"
            className="text-hueso/40 hover:text-hueso transition-colors"
          >
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}

