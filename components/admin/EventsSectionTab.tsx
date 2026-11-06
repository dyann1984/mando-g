"use client";

import React from "react";
import { EventosConfig, EventoItem } from "@/types/presskit";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";

interface EventsSectionTabProps {
  eventos: EventosConfig;
  onChange: (updated: EventosConfig) => void;
}

export default function EventsSectionTab({ eventos, onChange }: EventsSectionTabProps) {
  const update = (field: keyof EventosConfig, value: any) => {
    onChange({ ...eventos, [field]: value });
  };

  const updateItem = (id: string, field: keyof EventoItem, val: any) => {
    const next = eventos.eventos.map((ev) => (ev.id === id ? { ...ev, [field]: val } : ev));
    update("eventos", next);
  };

  const addItem = () => {
    const newItem: EventoItem = {
      id: "ev_" + Date.now(),
      mes: "OCT",
      ano: "2026",
      estadoFecha: "Fecha por confirmar",
      titulo: "NUEVO CONCIERTO / SHOW",
      ubicacion: "Ciudad · Recinto o Club",
      linkTexto: "Booking disponible →",
      linkUrl: "#contacto",
      destacado: false,
      orden: eventos.eventos.length + 1,
    };
    update("eventos", [...eventos.eventos, newItem]);
  };

  const removeItem = (id: string) => {
    if (confirm("¿Eliminar este evento de la agenda?")) {
      update("eventos", eventos.eventos.filter((ev) => ev.id !== id));
    }
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= eventos.eventos.length) return;
    const next = [...eventos.eventos];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    update("eventos", next);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-oro">PRÓXIMOS EVENTOS & SHOWS</h3>
          <p className="text-hueso/50 text-xs mt-1">Modifica fechas, ciudades, recintos y llamadas de booking.</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="btn-oro !py-2 !px-4 text-xs flex items-center gap-2 self-start"
        >
          <Plus size={15} /> Añadir Evento
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Eyebrow</label>
          <input
            type="text"
            className="campo"
            value={eventos.eyebrow}
            onChange={(e) => update("eyebrow", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Título de Sección</label>
          <input
            type="text"
            className="campo"
            value={eventos.titulo}
            onChange={(e) => update("titulo", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {eventos.eventos?.map((ev, index) => (
          <div
            key={ev.id}
            className={`p-5 bg-carbon border rounded space-y-4 relative ${
              ev.destacado ? "border-oro bg-oro/5" : "border-oro/20"
            }`}
          >
            <div className="flex items-center justify-between border-b border-oro/10 pb-3">
              <span className="font-head text-xs uppercase tracking-wider text-oro font-bold">
                Evento #{index + 1} {ev.destacado && "— ★ DESTACADO"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="p-1 hover:text-oro text-hueso/40 disabled:opacity-20"
                  title="Subir"
                >
                  <MoveUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === eventos.eventos.length - 1}
                  className="p-1 hover:text-oro text-hueso/40 disabled:opacity-20"
                  title="Bajar"
                >
                  <MoveDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(ev.id)}
                  className="p-1 hover:text-red-400 text-hueso/40 ml-2"
                  title="Eliminar evento"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Mes (3 letras ej. AGO)</label>
                <input
                  type="text"
                  className="campo text-sm font-bold text-oro uppercase"
                  value={ev.mes}
                  maxLength={5}
                  onChange={(e) => updateItem(ev.id, "mes", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Año / Texto (ej. 2026)</label>
                <input
                  type="text"
                  className="campo text-sm"
                  value={ev.ano}
                  onChange={(e) => updateItem(ev.id, "ano", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Estado de la fecha</label>
                <input
                  type="text"
                  className="campo text-sm"
                  value={ev.estadoFecha}
                  onChange={(e) => updateItem(ev.id, "estadoFecha", e.target.value)}
                  placeholder="ej. Fecha por confirmar / Agenda abierta"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Título del Evento / Tour</label>
                <input
                  type="text"
                  className="campo text-sm font-semibold"
                  value={ev.titulo}
                  onChange={(e) => updateItem(ev.id, "titulo", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Ubicación / Ciudad / Venue</label>
                <input
                  type="text"
                  className="campo text-sm"
                  value={ev.ubicacion}
                  onChange={(e) => updateItem(ev.id, "ubicacion", e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Texto del Enlace / Botón</label>
                <input
                  type="text"
                  className="campo text-xs"
                  value={ev.linkTexto}
                  onChange={(e) => updateItem(ev.id, "linkTexto", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">URL / Enlace</label>
                <input
                  type="text"
                  className="campo text-xs"
                  value={ev.linkUrl}
                  onChange={(e) => updateItem(ev.id, "linkUrl", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id={`dest_${ev.id}`}
                  checked={ev.destacado || false}
                  onChange={(e) => updateItem(ev.id, "destacado", e.target.checked)}
                  className="accent-oro w-4 h-4 cursor-pointer"
                />
                <label htmlFor={`dest_${ev.id}`} className="text-xs uppercase font-head text-oro cursor-pointer">
                  Marcar como destacado (botón oro)
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

