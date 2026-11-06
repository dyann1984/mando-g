"use client";

import React, { useState } from "react";
import { SeoConfig } from "@/types/presskit";
import MediaLibraryModal from "./MediaLibraryModal";
import { Image as ImageIcon } from "lucide-react";

interface SeoSectionTabProps {
  seo: SeoConfig;
  onChange: (updated: SeoConfig) => void;
}

export default function SeoSectionTab({ seo, onChange }: SeoSectionTabProps) {
  const [mediaOpen, setMediaOpen] = useState(false);

  const update = (field: keyof SeoConfig, val: string) => {
    onChange({ ...seo, [field]: val });
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">METADATOS & SEO (GOOGLE Y REDES)</h3>
        <p className="text-hueso/50 text-xs mt-1">Personaliza el título en el navegador, descripción en Google y la imagen que aparece al compartir en WhatsApp o Twitter.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">
            Título de la Página (Meta Title)
          </label>
          <input
            type="text"
            className="campo"
            value={seo.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">
            Descripción SEO (Meta Description)
          </label>
          <textarea
            rows={3}
            className="campo"
            value={seo.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">
            Palabras Clave (Keywords separadas por coma)
          </label>
          <input
            type="text"
            className="campo text-xs"
            value={seo.keywords}
            onChange={(e) => update("keywords", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">
              URL Canónica
            </label>
            <input
              type="text"
              className="campo text-xs font-mono"
              value={seo.canonicalUrl}
              onChange={(e) => update("canonicalUrl", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">
              Autor / Créditos
            </label>
            <input
              type="text"
              className="campo text-xs"
              value={seo.author}
              onChange={(e) => update("author", e.target.value)}
            />
          </div>
        </div>

        {/* Imagen OpenGraph */}
        <div className="bg-carbon p-5 border border-oro/20 rounded">
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-3">
            Imagen para Compartir en Redes (Open Graph / WhatsApp / Twitter)
          </label>
          <div className="flex gap-4 items-center">
            <div className="w-24 h-24 bg-black border border-oro/30 rounded overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
              <img src={seo.ogImage} alt="OG Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                className="campo text-xs"
                value={seo.ogImage}
                onChange={(e) => update("ogImage", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="btn-oro !py-1.5 !px-3 text-xs flex items-center gap-1.5"
              >
                <ImageIcon size={14} /> Seleccionar de la Biblioteca
              </button>
            </div>
          </div>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        categoryFilter="portadas"
        onSelect={(url) => update("ogImage", url)}
      />
    </div>
  );
}

