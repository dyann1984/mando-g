"use client";

import React, { useState } from "react";
import { MusicaConfig, LanzamientoItem, SencilloItem } from "@/types/presskit";
import MediaLibraryModal from "./MediaLibraryModal";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface MusicSectionTabProps {
  musica: MusicaConfig;
  onChange: (updated: MusicaConfig) => void;
}

export default function MusicSectionTab({ musica, onChange }: MusicSectionTabProps) {
  const [mediaTargetId, setMediaTargetId] = useState<string | null>(null);

  const update = (field: keyof MusicaConfig, value: any) => {
    onChange({ ...musica, [field]: value });
  };

  const updateLanzamiento = (id: string, field: keyof LanzamientoItem, val: string) => {
    const next = musica.lanzamientosDestacados.map((l) => (l.id === id ? { ...l, [field]: val } : l));
    update("lanzamientosDestacados", next);
  };

  const addLanzamiento = () => {
    const newItem: LanzamientoItem = {
      id: "lan_" + Date.now(),
      tipo: "Sencillo · 2026",
      titulo: "Nuevo Lanzamiento",
      spotifyEmbedUrl: "https://open.spotify.com/embed/album/1qTJQXFEuH3I7MOr3xlOt6?utm_source=generator&theme=0",
      orden: musica.lanzamientosDestacados.length + 1,
    };
    update("lanzamientosDestacados", [...musica.lanzamientosDestacados, newItem]);
  };

  const removeLanzamiento = (id: string) => {
    if (confirm("¿Eliminar este lanzamiento destacado?")) {
      update("lanzamientosDestacados", musica.lanzamientosDestacados.filter((l) => l.id !== id));
    }
  };

  const updateSencillo = (id: string, field: keyof SencilloItem, val: string) => {
    const next = musica.sencillos.map((s) => (s.id === id ? { ...s, [field]: val } : s));
    update("sencillos", next);
  };

  const addSencillo = () => {
    const newItem: SencilloItem = {
      id: "senc_" + Date.now(),
      titulo: "Nuevo Sencillo",
      portada: "https://i.scdn.co/image/ab67616d0000b27391b6a97aca848aadf085602e",
      url: "https://open.spotify.com/artist/7lHwxJADraMnwr1FqgYlyv",
      ano: "2026",
      orden: musica.sencillos.length + 1,
    };
    update("sencillos", [...musica.sencillos, newItem]);
  };

  const removeSencillo = (id: string) => {
    if (confirm("¿Eliminar este sencillo?")) {
      update("sencillos", musica.sencillos.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">MÚSICA & DISCOGRAFÍA</h3>
        <p className="text-hueso/50 text-xs mt-1">Administra los reproductores de Spotify, lanzamientos destacados y carátulas de sencillos.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Eyebrow (Etiqueta superior)</label>
          <input
            type="text"
            className="campo"
            value={musica.eyebrow}
            onChange={(e) => update("eyebrow", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Enlace de Perfil en Spotify</label>
          <input
            type="text"
            className="campo"
            value={musica.spotifyArtistUrl}
            onChange={(e) => update("spotifyArtistUrl", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">
            URL Embed de Spotify Principal (Reproductor de Artista)
          </label>
          <input
            type="text"
            className="campo text-xs"
            value={musica.spotifyEmbedUrl}
            onChange={(e) => update("spotifyEmbedUrl", e.target.value)}
            placeholder="https://open.spotify.com/embed/artist/..."
          />
        </div>
      </div>

      {/* Lanzamientos Destacados con Reproductor */}
      <div className="space-y-4 pt-6 border-t border-oro/15">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-head text-sm text-oro uppercase tracking-wider">Lanzamientos Destacados (Embeds)</h4>
            <p className="text-hueso/40 text-xs">Muestra tarjetas con reproductores de Spotify para álbumes o EPs.</p>
          </div>
          <button
            type="button"
            onClick={addLanzamiento}
            className="btn-oro !py-1.5 !px-3 text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Añadir Lanzamiento
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {musica.lanzamientosDestacados?.map((item) => (
            <div key={item.id} className="p-4 bg-carbon border border-oro/20 rounded relative flex flex-col justify-between">
              <button
                type="button"
                onClick={() => removeLanzamiento(item.id)}
                className="absolute top-2 right-2 text-hueso/40 hover:text-red-400"
                title="Eliminar lanzamiento"
              >
                <Trash2 size={14} />
              </button>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Tipo (ej. EP · 2026)</label>
                  <input
                    type="text"
                    className="campo text-xs"
                    value={item.tipo}
                    onChange={(e) => updateLanzamiento(item.id, "tipo", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Título del Disco / Single</label>
                  <input
                    type="text"
                    className="campo text-xs font-bold text-oro"
                    value={item.titulo}
                    onChange={(e) => updateLanzamiento(item.id, "titulo", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Spotify Embed URL</label>
                  <input
                    type="text"
                    className="campo text-xs"
                    value={item.spotifyEmbedUrl}
                    onChange={(e) => updateLanzamiento(item.id, "spotifyEmbedUrl", e.target.value)}
                    placeholder="https://open.spotify.com/embed/album/..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sencillos / Portadas tipo sticker */}
      <div className="space-y-4 pt-6 border-t border-oro/15">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-head text-sm text-oro uppercase tracking-wider">Sencillos & Portadas</h4>
            <p className="text-hueso/40 text-xs">Cuadrícula visual de canciones con carátula y link a Spotify.</p>
          </div>
          <button
            type="button"
            onClick={addSencillo}
            className="btn-oro !py-1.5 !px-3 text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Añadir Sencillo
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {musica.sencillos?.map((item) => (
            <div key={item.id} className="p-3 bg-carbon border border-oro/20 rounded relative flex flex-col justify-between">
              <button
                type="button"
                onClick={() => removeSencillo(item.id)}
                className="absolute top-2 right-2 z-10 p-1 bg-black/80 rounded text-hueso/50 hover:text-red-400"
                title="Eliminar sencillo"
              >
                <Trash2 size={13} />
              </button>

              <div className="aspect-square bg-noir border border-oro/20 rounded overflow-hidden relative group mb-2">
                <img src={item.portada} alt={item.titulo} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMediaTargetId(item.id)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-oro text-xs font-head uppercase"
                >
                  <ImageIcon size={16} className="mr-1" /> Cambiar
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Título</label>
                  <input
                    type="text"
                    className="campo text-xs font-medium"
                    value={item.titulo}
                    onChange={(e) => updateSencillo(item.id, "titulo", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Año</label>
                  <input
                    type="text"
                    className="campo text-xs"
                    value={item.ano}
                    onChange={(e) => updateSencillo(item.id, "ano", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Enlace Spotify</label>
                  <input
                    type="text"
                    className="campo text-xs"
                    value={item.url}
                    onChange={(e) => updateSencillo(item.id, "url", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MediaLibraryModal
        isOpen={mediaTargetId !== null}
        onClose={() => setMediaTargetId(null)}
        categoryFilter="portadas"
        onSelect={(url) => {
          if (mediaTargetId) updateSencillo(mediaTargetId, "portada", url);
        }}
      />
    </div>
  );
}

