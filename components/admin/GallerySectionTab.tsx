"use client";

import React, { useState } from "react";
import { GaleriaConfig, GaleriaItem } from "@/types/presskit";
import MediaLibraryModal from "./MediaLibraryModal";
import { Plus, Trash2, Image as ImageIcon, MoveUp, MoveDown } from "lucide-react";

interface GallerySectionTabProps {
  galeria: GaleriaConfig;
  onChange: (updated: GaleriaConfig) => void;
}

export default function GallerySectionTab({ galeria, onChange }: GallerySectionTabProps) {
  const [mediaTargetId, setMediaTargetId] = useState<string | null>(null);

  const update = (field: keyof GaleriaConfig, value: any) => {
    onChange({ ...galeria, [field]: value });
  };

  const updateItem = (id: string, field: keyof GaleriaItem, val: any) => {
    const next = galeria.items.map((it) => (it.id === id ? { ...it, [field]: val } : it));
    update("items", next);
  };

  const addItem = () => {
    const newItem: GaleriaItem = {
      id: "gal_" + Date.now(),
      url: "https://i.scdn.co/image/ab6761610000e5eba4febdd50b2b41216c692f82",
      caption: "Nueva fotografía oficial",
      categoria: "fotos",
      orden: galeria.items.length + 1,
    };
    update("items", [...galeria.items, newItem]);
  };

  const removeItem = (id: string) => {
    if (confirm("¿Eliminar esta fotografía de la galería?")) {
      update("items", galeria.items.filter((it) => it.id !== id));
    }
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= galeria.items.length) return;
    const next = [...galeria.items];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    update("items", next);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-oro">GALERÍA DE ARTE & IMAGEN</h3>
          <p className="text-hueso/50 text-xs mt-1">Sube, reemplaza, reordena y edita las fotografías de uso editorial con lightbox.</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="btn-oro !py-2 !px-4 text-xs flex items-center gap-2 self-start"
        >
          <Plus size={15} /> Añadir Fotografía
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Eyebrow</label>
          <input
            type="text"
            className="campo"
            value={galeria.eyebrow}
            onChange={(e) => update("eyebrow", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Título de Galería</label>
          <input
            type="text"
            className="campo"
            value={galeria.titulo}
            onChange={(e) => update("titulo", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galeria.items?.map((item, index) => (
          <div key={item.id} className="p-3 bg-carbon border border-oro/20 rounded relative flex flex-col justify-between">
            <div className="aspect-square bg-noir border border-oro/20 rounded overflow-hidden relative group mb-3">
              <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setMediaTargetId(item.id)}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-oro text-xs font-head uppercase gap-1"
              >
                <ImageIcon size={15} /> Cambiar Foto
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block">Pie de Foto (Caption)</label>
                <input
                  type="text"
                  className="campo text-xs"
                  value={item.caption}
                  onChange={(e) => updateItem(item.id, "caption", e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-hueso/50 block">Categoría</label>
                <select
                  className="campo text-xs py-1.5"
                  value={item.categoria || "fotos"}
                  onChange={(e) => updateItem(item.id, "categoria", e.target.value)}
                >
                  <option value="fotos">Fotos de Prensa</option>
                  <option value="portadas">Portadas de Discos</option>
                  <option value="prensa">Sesión Editorial</option>
                  <option value="videos">Fotogramas de Video</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-oro/10">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="p-1 hover:text-oro text-hueso/40 disabled:opacity-20"
                    title="Mover antes"
                  >
                    <MoveUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === galeria.items.length - 1}
                    className="p-1 hover:text-oro text-hueso/40 disabled:opacity-20"
                    title="Mover después"
                  >
                    <MoveDown size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-hueso/40 hover:text-red-400"
                  title="Eliminar foto"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MediaLibraryModal
        isOpen={mediaTargetId !== null}
        onClose={() => setMediaTargetId(null)}
        categoryFilter="fotos"
        onSelect={(url) => {
          if (mediaTargetId) updateItem(mediaTargetId, "url", url);
        }}
      />
    </div>
  );
}

