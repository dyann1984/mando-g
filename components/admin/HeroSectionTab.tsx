"use client";

import React, { useState } from "react";
import { HeroConfig } from "@/types/presskit";
import MediaLibraryModal from "./MediaLibraryModal";
import { Image as ImageIcon } from "lucide-react";

interface HeroSectionTabProps {
  hero: HeroConfig;
  onChange: (updated: HeroConfig) => void;
}

export default function HeroSectionTab({ hero, onChange }: HeroSectionTabProps) {
  const [mediaTarget, setMediaTarget] = useState<"heroImage" | "heroLogoImage" | null>(null);

  const update = (field: keyof HeroConfig, value: string) => {
    onChange({ ...hero, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">HERO & PORTADA PRINCIPAL</h3>
        <p className="text-hueso/50 text-xs mt-1">Configura los títulos, sellos, fotografía principal del artista y botones de llamada a la acción.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Nombre Artístico</label>
          <input
            type="text"
            className="campo"
            value={hero.nombre}
            onChange={(e) => update("nombre", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Letra Inicial / Acento</label>
          <input
            type="text"
            className="campo"
            value={hero.inicial}
            maxLength={4}
            onChange={(e) => update("inicial", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Subtítulo Destacado</label>
          <input
            type="text"
            className="campo"
            value={hero.subtitulo}
            onChange={(e) => update("subtitulo", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Descripción / Biografía Corta</label>
          <textarea
            rows={3}
            className="campo"
            value={hero.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Cinta Superior (Año / Versión)</label>
          <input
            type="text"
            className="campo"
            value={hero.badgeAno}
            onChange={(e) => update("badgeAno", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Cinta Inferior (Idiomas / Lema)</label>
          <input
            type="text"
            className="campo"
            value={hero.badgeSub}
            onChange={(e) => update("badgeSub", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Sello Esténcil (ej. 2SIK MUSIC)</label>
          <input
            type="text"
            className="campo"
            value={hero.stamp}
            onChange={(e) => update("stamp", e.target.value)}
          />
        </div>
      </div>

      {/* Selector de Imágenes */}
      <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-oro/15">
        <div className="bg-carbon p-5 border border-oro/20 rounded">
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-3">
            Fotografía Principal del Artista (Hero)
          </label>
          <div className="flex gap-4 items-start">
            <div className="w-24 h-32 bg-black border border-oro/30 rounded overflow-hidden flex-shrink-0">
              <img src={hero.heroImage} alt="Preview Hero" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-3">
              <input
                type="text"
                className="campo text-xs"
                value={hero.heroImage}
                onChange={(e) => update("heroImage", e.target.value)}
                placeholder="URL de la imagen"
              />
              <button
                type="button"
                onClick={() => setMediaTarget("heroImage")}
                className="btn-oro !py-2 !px-4 text-xs flex items-center gap-2"
              >
                <ImageIcon size={14} /> Seleccionar de Biblioteca
              </button>
            </div>
          </div>
        </div>

        <div className="bg-carbon p-5 border border-oro/20 rounded">
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-3">
            Logotipo Oficial Vector/PNG
          </label>
          <div className="flex gap-4 items-start">
            <div className="w-24 h-24 bg-black border border-oro/30 rounded overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
              <img src={hero.heroLogoImage} alt="Preview Logo" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 space-y-3">
              <input
                type="text"
                className="campo text-xs"
                value={hero.heroLogoImage}
                onChange={(e) => update("heroLogoImage", e.target.value)}
                placeholder="URL del logotipo"
              />
              <button
                type="button"
                onClick={() => setMediaTarget("heroLogoImage")}
                className="btn-oro !py-2 !px-4 text-xs flex items-center gap-2"
              >
                <ImageIcon size={14} /> Seleccionar de Biblioteca
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción (CTAs) */}
      <div className="pt-6 border-t border-oro/15">
        <h4 className="font-head text-sm text-oro uppercase tracking-wider mb-4">Botones de Llamada a la Acción (Hero)</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-carbon/70 border border-oro/20">
            <p className="text-xs font-head uppercase text-hueso/70 mb-3">Botón Dorado Principal</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Texto del Botón</label>
                <input
                  type="text"
                  className="campo text-sm"
                  value={hero.ctaPrimaryText}
                  onChange={(e) => update("ctaPrimaryText", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Enlace / Destino URL</label>
                <input
                  type="text"
                  className="campo text-sm"
                  value={hero.ctaPrimaryUrl}
                  onChange={(e) => update("ctaPrimaryUrl", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-carbon/70 border border-oro/20">
            <p className="text-xs font-head uppercase text-hueso/70 mb-3">Botón Secundario (Fantasma)</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Texto del Botón</label>
                <input
                  type="text"
                  className="campo text-sm"
                  value={hero.ctaSecondaryText}
                  onChange={(e) => update("ctaSecondaryText", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Enlace / Ancla</label>
                <input
                  type="text"
                  className="campo text-sm"
                  value={hero.ctaSecondaryUrl}
                  onChange={(e) => update("ctaSecondaryUrl", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={mediaTarget !== null}
        onClose={() => setMediaTarget(null)}
        categoryFilter="portadas"
        onSelect={(url) => {
          if (mediaTarget) update(mediaTarget, url);
        }}
      />
    </div>
  );
}

