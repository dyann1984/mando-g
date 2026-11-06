"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, KeyRound } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [requiresKey, setRequiresKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/setup")
      .then((res) => res.json())
      .then((data) => {
        if (data.requiresKey) {
          setRequiresKey(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, setupKey }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("¡Primer administrador creado exitosamente!");
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "No se pudo crear el administrador inicial.");
      }
    } catch (err: any) {
      setError("Error de comunicación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-lg bg-carbon border border-oro/30 p-8 rounded-lg shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-oro/10 border border-oro/40 flex items-center justify-center text-oro mb-2">
            <ShieldCheck size={28} />
          </div>
          <span className="cinta text-[.6rem]">Configuración Inicial</span>
          <h1 className="font-display text-4xl text-hueso mt-2">
            MANDO <span className="text-oro">G</span> PRESS KIT
          </h1>
          <p className="font-head text-xs uppercase tracking-widest text-hueso/50">
            Crea el primer Administrador Maestro
          </p>
        </div>

        <p className="text-xs text-hueso/60 leading-relaxed text-center bg-black/40 p-3 rounded border border-oro/10">
          Esta pantalla se activa únicamente durante la primera instalación cuando no existe ningún administrador en el sistema.
        </p>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5">
              Nombre de Usuario Maestro
            </label>
            <input
              type="text"
              required
              className="campo text-sm"
              placeholder="mandog_admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5">
              Correo Electrónico Oficial
            </label>
            <input
              type="email"
              required
              className="campo text-sm"
              placeholder="contacto@mandog.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5">
              Contraseña Maestra (mínimo 8 caracteres)
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

          {requiresKey && (
            <div>
              <label className="block text-xs font-head uppercase tracking-wider text-oro mb-1.5 flex items-center gap-1.5">
                <KeyRound size={13} className="text-oro" />
                <span>Clave de Autorización de Setup (ADMIN_SETUP_KEY)</span>
              </label>
              <input
                type="password"
                required
                className="campo text-sm"
                placeholder="Ingresa la clave de setup del entorno"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
              />
              <p className="text-[10px] text-hueso/40 mt-1">
                Esta clave protege el sistema contra inicializaciones no autorizadas.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-oro w-full justify-center !py-3.5 text-sm flex items-center gap-2 mt-4"
          >
            <span>{loading ? "Inicializando sistema..." : "Crear Administrador y Entrar"}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

