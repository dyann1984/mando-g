"use client";

import React, { useState, useEffect } from "react";
import { History, RotateCcw } from "lucide-react";

interface VersionsTabProps {
  onRestored: () => void;
}

export default function VersionsTab({ onRestored }: VersionsTabProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/versions");
      const data = await res.json();
      if (data.versions) setVersions(data.versions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const handleRestore = async (versionId: string, autoPublish: boolean) => {
    const actionText = autoPublish
      ? "¿Restaurar esta versión y publicarla inmediatamente en vivo?"
      : "¿Cargar esta versión en tu borrador de trabajo actual?";

    if (!confirm(actionText)) return;

    setRestoringId(versionId);
    try {
      const res = await fetch("/api/admin/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId, autoPublish }),
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Versión recuperada con éxito.");
        onRestored();
      } else {
        alert(result.error || "Error al restaurar.");
      }
    } catch (err) {
      alert("Error de conexión al restaurar.");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">HISTORIAL DE VERSIONES & RECUPERACIÓN</h3>
        <p className="text-hueso/50 text-xs mt-1">
          Cada vez que publicas se guarda una copia de seguridad automática. Puedes restaurar cualquier estado anterior.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-oro font-head text-sm tracking-widest uppercase animate-pulse">
          Cargando historial de versiones...
        </div>
      ) : versions.length === 0 ? (
        <div className="py-12 text-center text-hueso/40">
          <History size={36} className="mx-auto mb-2 text-oro/30" />
          <p className="font-display text-xl">No hay versiones archivadas aún</p>
          <p className="text-xs mt-1">Al publicar tu primer cambio se guardará un punto de restauración aquí.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {versions.map((ver, idx) => (
            <div
              key={ver.id}
              className="p-5 bg-carbon border border-oro/20 rounded flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl text-oro">VERSIÓN #{ver.version}</span>
                  {idx === 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-green-950/80 border border-green-500/40 text-green-300 uppercase font-head">
                      Actual en vivo
                    </span>
                  )}
                </div>
                <p className="text-hueso/70 text-xs mt-1 font-medium">{ver.note || "Publicación manual"}</p>
                <p className="text-hueso/40 text-[11px] mt-1">
                  Publicado por <strong className="text-hueso/60">{ver.author || "Admin"}</strong> el{" "}
                  {new Date(ver.createdAt || ver.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  type="button"
                  onClick={() => handleRestore(ver.id, false)}
                  disabled={restoringId !== null}
                  className="btn-fantasma !py-2 !px-4 text-xs flex items-center gap-1.5"
                >
                  <RotateCcw size={14} /> Cargar en Borrador
                </button>
                <button
                  type="button"
                  onClick={() => handleRestore(ver.id, true)}
                  disabled={restoringId !== null}
                  className="btn-oro !py-2 !px-4 text-xs flex items-center gap-1.5"
                >
                  Restaurar en Vivo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

