"use client";

import React, { useState } from "react";
import { BioConfig, StatItem } from "@/types/presskit";
import MediaLibraryModal from "./MediaLibraryModal";
import { Image as ImageIcon, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";

interface BioSectionTabProps {
  bio: BioConfig;
  onChange: (updated: BioConfig) => void;
}

export default function BioSectionTab({ bio, onChange }: BioSectionTabProps) {
  const [mediaOpen, setMediaOpen] = useState(false);

  const update = (field: keyof BioConfig, value: any) => {
    onChange({ ...bio, [field]: value });
  };

  const updateParagraph = (index: number, text: string) => {
    const next = [...bio.parrafos];
    next[index] = text;
    update("parrafos", next);
  };

  const addParagraph = () => {
    update("parrafos", [...bio.parrafos, ""]);
  };

  const removeParagraph = (index: number) => {
    if (confirm("¿Eliminar este párrafo?")) {
      const next = bio.parrafos.filter((_, i) => i !== index);
      update("parrafos", next);
    }
  };

  const moveParagraph = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= bio.parrafos.length) return;
    const next = [...bio.parrafos];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    update("parrafos", next);
  };

  const updateStat = (id: string, field: keyof StatItem, val: string) => {
    const next = bio.stats.map((s) => (s.id === id ? { ...s, [field]: val } : s));
    update("stats", next);
  };

  const addStat = () => {
    const newStat: StatItem = {
      id: "stat_" + Date.now(),
      numero: "NEW",
      etiqueta: "Etiqueta",
      rotacion: "-1deg",
    };
    update("stats", [...bio.stats, newStat]);
  };

  const removeStat = (id: string) => {
    update("stats", bio.stats.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">SECCIÓN DE BIOGRAFÍA</h3>
        <p className="text-hueso/50 text-xs mt-1">Edita la narrativa del artista, los encabezados, la fotografía editorial y los números clave.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Eyebrow (Etiqueta superior)</label>
          <input
            type="text"
            className="campo"
            value={bio.eyebrow}
            onChange={(e) => update("eyebrow", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Título Principal</label>
          <input
            type="text"
            className="campo"
            value={bio.tituloPrincipal}
            onChange={(e) => update("tituloPrincipal", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Título Secundario (Dorado)</label>
          <input
            type="text"
            className="campo"
            value={bio.tituloSecundario}
            onChange={(e) => update("tituloSecundario", e.target.value)}
          />
        </div>
      </div>

      {/* Retrato y datos de foto */}
      <div className="bg-carbon p-5 border border-oro/20 rounded">
        <label className="block text-xs font-head uppercase tracking-wider text-oro mb-3">Fotografía Editorial de Biografía</label>
        <div className="grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-3 w-32 h-40 bg-black border border-oro/30 rounded overflow-hidden flex-shrink-0">
            <img src={bio.foto} alt="Retrato Bio" className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-9 space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">URL de la Foto</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="campo text-xs flex-1"
                  value={bio.foto}
                  onChange={(e) => update("foto", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setMediaOpen(true)}
                  className="btn-oro !py-2 !px-4 text-xs flex items-center gap-2 whitespace-nowrap"
                >
                  <ImageIcon size={14} /> Seleccionar
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Pie de Foto (Datos de Nacimiento)</label>
                <input
                  type="text"
                  className="campo text-xs"
                  value={bio.fotoCaption}
                  onChange={(e) => update("fotoCaption", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Texto de la Cinta</label>
                <input
                  type="text"
                  className="campo text-xs"
                  value={bio.cintaTexto}
                  onChange={(e) => update("cintaTexto", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Párrafos de la Biografía */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-head text-sm text-oro uppercase tracking-wider">Párrafos de la Biografía</h4>
          <button
            type="button"
            onClick={addParagraph}
            className="btn-oro !py-1.5 !px-3 text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Agregar Párrafo
          </button>
        </div>

        <div className="space-y-4">
          {bio.parrafos.map((p, index) => (
            <div key={index} className="bg-carbon/70 border border-oro/20 p-4 rounded flex gap-3 items-start">
              <span className="font-head text-oro font-bold text-sm pt-2 w-6">{index + 1}.</span>
              <textarea
                rows={4}
                className="campo flex-1 text-sm leading-relaxed"
                value={p}
                onChange={(e) => updateParagraph(index, e.target.value)}
                placeholder="Escribe el párrafo aquí..."
              />
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => moveParagraph(index, -1)}
                  disabled={index === 0}
                  className="p-1 hover:text-oro text-hueso/50 disabled:opacity-20"
                  title="Subir párrafo"
                >
                  <MoveUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveParagraph(index, 1)}
                  disabled={index === bio.parrafos.length - 1}
                  className="p-1 hover:text-oro text-hueso/50 disabled:opacity-20"
                  title="Bajar párrafo"
                >
                  <MoveDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="p-1 hover:text-red-400 text-hueso/50 mt-1"
                  title="Eliminar párrafo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas / Cifras Clave */}
      <div className="space-y-4 pt-6 border-t border-oro/15">
        <div className="flex items-center justify-between">
          <h4 className="font-head text-sm text-oro uppercase tracking-wider">Cifras & Estadísticas Clave</h4>
          <button
            type="button"
            onClick={addStat}
            className="btn-oro !py-1.5 !px-3 text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Añadir Cifra
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {bio.stats.map((st) => (
            <div key={st.id} className="p-4 bg-carbon/80 border border-oro/20 rounded relative">
              <button
                type="button"
                onClick={() => removeStat(st.id)}
                className="absolute top-2 right-2 text-hueso/40 hover:text-red-400"
                title="Eliminar cifra"
              >
                <Trash2 size={14} />
              </button>
              <div className="space-y-2 mt-1">
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Número o Sigla (ej. 2007)</label>
                  <input
                    type="text"
                    className="campo text-sm font-bold text-oro"
                    value={st.numero}
                    onChange={(e) => updateStat(st.id, "numero", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Etiqueta descriptiva</label>
                  <input
                    type="text"
                    className="campo text-xs"
                    value={st.etiqueta}
                    onChange={(e) => updateStat(st.id, "etiqueta", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MediaLibraryModal
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        categoryFilter="fotos"
        onSelect={(url) => update("foto", url)}
      />
    </div>
  );
}

