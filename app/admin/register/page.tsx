"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, UserPlus, ArrowLeft } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [code, setCode] = useState(initialCode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) setCode(initialCode);
  }, [initialCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, username, email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "No se pudo completar el registro.");
      }
    } catch (err: any) {
      setError("Error de comunicación con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-carbon border border-oro/30 p-8 rounded-lg shadow-2xl relative z-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-oro/10 border border-oro/30 flex items-center justify-center text-oro mb-2">
          <KeyRound size={22} />
        </div>
        <h1 className="font-display text-3xl text-hueso">CANJEAR INVITACIÓN</h1>
        <p className="font-head text-xs uppercase tracking-widest text-hueso/50">
          Crea tu cuenta de administrador con tu código
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
            Código de Invitación
          </label>
          <input
            type="text"
            required
            className="campo text-sm font-mono tracking-wider font-bold text-oro uppercase"
            placeholder="MG-XXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5">
            Nombre de Usuario
          </label>
          <input
            type="text"
            required
            className="campo text-sm"
            placeholder="tu_usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            className="campo text-sm"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5">
            Contraseña (mínimo 8 caracteres)
          </label>
          <input
            type="password"
            required
            minLength={8}
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
          <UserPlus size={16} />
          <span>{loading ? "Creando cuenta..." : "Crear Administrador"}</span>
        </button>
      </form>

      <div className="pt-4 border-t border-oro/15 text-center text-xs">
        <Link
          href="/admin/login"
          className="text-oro/70 hover:text-oro font-head tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Ya tengo una cuenta · Iniciar sesión</span>
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-noir flex items-center justify-center p-6 relative overflow-hidden">
      <Suspense fallback={<div className="text-oro text-sm">Cargando...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}

