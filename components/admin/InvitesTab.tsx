"use client";

import React, { useState, useEffect } from "react";
import { InviteCode } from "@/types/presskit";
import { Plus, Trash2, Copy, Check, ShieldCheck, KeyRound } from "lucide-react";

export default function InvitesTab() {
  const [invites, setInvites] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  const [role, setRole] = useState<"admin" | "editor">("admin");
  const [generating, setGenerating] = useState(false);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invites");
      const data = await res.json();
      if (data.invites) setInvites(data.invites);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleCreate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, days }),
      });
      const data = await res.json();
      if (res.ok && data.invite) {
        setInvites([data.invite, ...invites]);
      } else {
        alert(data.error || "Error creando código.");
      }
    } catch (err) {
      alert("Error en la conexión.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("¿Revocar este código de invitación? Ya no podrá ser utilizado.")) return;
    try {
      const res = await fetch(`/api/admin/invites?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvites(invites.map((i) => (i.id === id ? { ...i, revoked: true } : i)));
      }
    } catch (err) {
      alert("Error revocando código.");
    }
  };

  const copyCode = (code: string, id: string) => {
    const link = `${window.location.origin}/admin/register?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">CÓDIGOS DE ACCESO & ADMINISTRADORES</h3>
        <p className="text-hueso/50 text-xs mt-1">
          Crea y revoca códigos de invitación temporales para permitir que nuevos administradores creen su usuario y contraseña de forma segura.
        </p>
      </div>

      {/* Generador de Invitaciones */}
      <div className="bg-carbon p-6 border border-oro/30 rounded max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-oro">
          <KeyRound size={20} />
          <h4 className="font-head text-sm uppercase tracking-wider font-semibold">Generar Nuevo Código de Acceso</h4>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-hueso/60 block mb-1">Rol a Asignar</label>
            <select
              className="campo text-xs"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="admin">Administrador Total</option>
              <option value="editor">Editor de Contenido</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-hueso/60 block mb-1">Vigencia del Código</label>
            <select
              className="campo text-xs"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={1}>24 Horas</option>
              <option value={7}>7 Días</option>
              <option value={30}>30 Días</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleCreate}
              disabled={generating}
              className="btn-oro !py-2.5 !px-5 text-xs w-full justify-center flex items-center gap-2"
            >
              <Plus size={16} /> {generating ? "Generando..." : "Crear Invitación"}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-hueso/40">
          Nota de seguridad: Los códigos son de un solo uso. Una vez canjeados o vencidos quedan inhabilitados automáticamente.
        </p>
      </div>

      {/* Lista de Códigos */}
      <div className="space-y-4 max-w-4xl pt-4">
        <h4 className="font-head text-sm text-oro uppercase tracking-wider">Historial de Códigos de Invitación</h4>

        {loading ? (
          <div className="py-8 text-center text-oro text-xs font-head uppercase tracking-wider animate-pulse">
            Cargando invitaciones...
          </div>
        ) : invites.length === 0 ? (
          <div className="p-8 bg-carbon border border-oro/15 rounded text-center text-hueso/40 text-xs">
            No hay códigos de invitación creados aún.
          </div>
        ) : (
          <div className="space-y-3">
            {invites.map((inv) => {
              const isExpired = new Date(inv.expiresAt).getTime() < Date.now();
              const isValid = !inv.used && !inv.revoked && !isExpired;

              return (
                <div
                  key={inv.id}
                  className={`p-4 bg-carbon border rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isValid ? "border-oro/40" : "border-white/10 opacity-60"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-oro tracking-wider">{inv.code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded uppercase font-head bg-black/60 border border-oro/20 text-hueso/70">
                        Rol: {inv.role}
                      </span>
                      {isValid && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-green-950 border border-green-500/40 text-green-300 uppercase font-head">
                          Activo
                        </span>
                      )}
                      {inv.used && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 uppercase font-head">
                          Canjeado por {inv.usedBy}
                        </span>
                      )}
                      {inv.revoked && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-300 uppercase font-head">
                          Revocado
                        </span>
                      )}
                      {!inv.used && !inv.revoked && isExpired && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-950 border border-yellow-500/40 text-yellow-300 uppercase font-head">
                          Expirado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-hueso/40">
                      Creado: {new Date(inv.createdAt).toLocaleDateString()} · Vence: {new Date(inv.expiresAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isValid && (
                      <>
                        <button
                          type="button"
                          onClick={() => copyCode(inv.code, inv.id)}
                          className="btn-fantasma !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                          title="Copiar enlace de registro"
                        >
                          {copiedId === inv.id ? (
                            <>
                              <Check size={14} className="text-green-400" /> <span>¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> <span>Copiar Enlace</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRevoke(inv.id)}
                          className="p-2 text-hueso/40 hover:text-red-400 border border-transparent hover:border-red-500/30 rounded"
                          title="Revocar código"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

