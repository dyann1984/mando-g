"use client";

import React from "react";
import { SeccionControl } from "@/types/presskit";
import { MoveUp, MoveDown, Eye, EyeOff } from "lucide-react";

interface SectionsOrderTabProps {
  secciones: SeccionControl[];
  onChange: (updated: SeccionControl[]) => void;
}

export default function SectionsOrderTab({ secciones, onChange }: SectionsOrderTabProps) {
  const toggleVisibility = (id: string) => {
    const next = secciones.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s));
    onChange(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= secciones.length) return;
    const next = [...secciones];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    // recalcular orden numérico
    const normalized = next.map((s, idx) => ({ ...s, orden: idx + 1 }));
    onChange(normalized);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">ORGANIZACIÓN & VISIBILIDAD DE SECCIONES</h3>
        <p className="text-hueso/50 text-xs mt-1">
          Oculta o muestra secciones de la página pública y cambia el orden vertical con los botones de subir/bajar.
        </p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {secciones.map((sec, index) => (
          <div
            key={sec.id}
            className={`p-4 bg-carbon border rounded flex items-center justify-between transition-colors ${
              sec.visible ? "border-oro/30 text-hueso" : "border-white/10 opacity-60 text-hueso/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-head text-oro font-bold text-sm w-6">{index + 1}.</span>
              <span className="font-head tracking-wider uppercase text-sm font-semibold">{sec.nombre}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 border border-oro/20 uppercase font-mono">
                #{sec.id}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleVisibility(sec.id)}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-head uppercase tracking-wider transition-colors ${
                  sec.visible ? "text-green-400 hover:bg-green-950/40" : "text-hueso/40 hover:bg-white/5"
                }`}
                title={sec.visible ? "Ocultar sección" : "Mostrar sección"}
              >
                {sec.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                <span>{sec.visible ? "Visible" : "Oculta"}</span>
              </button>

              <div className="flex items-center gap-1 border-l border-oro/20 pl-3">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="p-1 hover:text-oro text-hueso/50 disabled:opacity-20"
                  title="Subir posición"
                >
                  <MoveUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === secciones.length - 1}
                  className="p-1 hover:text-oro text-hueso/50 disabled:opacity-20"
                  title="Bajar posición"
                >
                  <MoveDown size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

