"use client";

import React, { useState } from "react";
import { VideosConfig, VideoSecundario, EnlaceCanal } from "@/types/presskit";
import MediaLibraryModal from "./MediaLibraryModal";
import { Plus, Trash2, Image as ImageIcon, Video } from "lucide-react";

interface VideosSectionTabProps {
  videos: VideosConfig;
  onChange: (updated: VideosConfig) => void;
}

export default function VideosSectionTab({ videos, onChange }: VideosSectionTabProps) {
  const [mediaTarget, setMediaTarget] = useState<string | null>(null);

  const update = (field: keyof VideosConfig, value: any) => {
    onChange({ ...videos, [field]: value });
  };

  const updatePrincipal = (field: string, val: string) => {
    update("videoPrincipal", { ...videos.videoPrincipal, [field]: val });
  };

  const updateSecundario = (id: string, field: keyof VideoSecundario, val: string) => {
    const next = videos.videosSecundarios.map((v) => (v.id === id ? { ...v, [field]: val } : v));
    update("videosSecundarios", next);
  };

  const addSecundario = () => {
    const newItem: VideoSecundario = {
      id: "vid_" + Date.now(),
      titulo: "VIDEO OFICIAL",
      youtubeUrl: "https://youtu.be/gBRwsuk2TEk",
      posterUrl: "https://img.youtube.com/vi/gBRwsuk2TEk/hqdefault.jpg",
      orden: videos.videosSecundarios.length + 1,
    };
    update("videosSecundarios", [...videos.videosSecundarios, newItem]);
  };

  const removeSecundario = (id: string) => {
    if (confirm("¿Eliminar este video secundario?")) {
      update("videosSecundarios", videos.videosSecundarios.filter((v) => v.id !== id));
    }
  };

  const updateEnlaceCanal = (id: string, field: keyof EnlaceCanal, val: string) => {
    const next = videos.enlacesCanal.map((c) => (c.id === id ? { ...c, [field]: val } : c));
    update("enlacesCanal", next);
  };

  // Helper para auto-generar thumbnail de YouTube cuando cambia la URL
  const handleYoutubeUrlChange = (url: string) => {
    updatePrincipal("youtubeUrl", url);
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (m && m[1]) {
      updatePrincipal("posterUrl", `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">VIDEOS & VISUALES OFICIALES</h3>
        <p className="text-hueso/50 text-xs mt-1">Configura el video principal de YouTube o archivo MP4, miniaturas y videos secundarios.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Eyebrow (Etiqueta superior)</label>
          <input
            type="text"
            className="campo"
            value={videos.eyebrow}
            onChange={(e) => update("eyebrow", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Enlace Oficial al Canal de YouTube</label>
          <input
            type="text"
            className="campo"
            value={videos.youtubeChannelUrl}
            onChange={(e) => update("youtubeChannelUrl", e.target.value)}
          />
        </div>
      </div>

      {/* Video Principal */}
      <div className="bg-carbon p-5 border border-oro/20 rounded space-y-4">
        <h4 className="font-head text-sm text-oro uppercase tracking-wider">Video Principal Destacado</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Título del Video</label>
              <input
                type="text"
                className="campo text-sm"
                value={videos.videoPrincipal.titulo}
                onChange={(e) => updatePrincipal("titulo", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Subtítulo / Etiqueta</label>
              <input
                type="text"
                className="campo text-sm"
                value={videos.videoPrincipal.subtitulo}
                onChange={(e) => updatePrincipal("subtitulo", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Enlace de YouTube</label>
              <input
                type="text"
                className="campo text-sm font-mono"
                value={videos.videoPrincipal.youtubeUrl}
                onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-1">Subir Video MP4 (Opcional, directo)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="campo text-xs flex-1"
                  value={videos.videoPrincipal.videoFileUrl || ""}
                  onChange={(e) => updatePrincipal("videoFileUrl", e.target.value)}
                  placeholder="URL de archivo MP4 alojado"
                />
                <button
                  type="button"
                  onClick={() => setMediaTarget("videoPrincipalFile")}
                  className="btn-oro !py-2 !px-3 text-xs flex items-center gap-1"
                >
                  <Video size={14} /> Seleccionar
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-hueso/50 block mb-2">Póster / Miniatura del Video</label>
            <div className="aspect-video bg-black border border-oro/30 rounded overflow-hidden relative group">
              <img
                src={videos.videoPrincipal.posterUrl}
                alt="Poster Video Principal"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setMediaTarget("videoPrincipalPoster")}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-oro text-xs font-head uppercase gap-2"
              >
                <ImageIcon size={16} /> Cambiar Portada
              </button>
            </div>
            <input
              type="text"
              className="campo text-xs mt-2"
              value={videos.videoPrincipal.posterUrl}
              onChange={(e) => updatePrincipal("posterUrl", e.target.value)}
              placeholder="URL del póster"
            />
          </div>
        </div>
      </div>

      {/* Videos Secundarios */}
      <div className="space-y-4 pt-6 border-t border-oro/15">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-head text-sm text-oro uppercase tracking-wider">Videos Secundarios</h4>
            <p className="text-hueso/40 text-xs">Aparecen en cuadrícula de 2 columnas debajo del video principal.</p>
          </div>
          <button
            type="button"
            onClick={addSecundario}
            className="btn-oro !py-1.5 !px-3 text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Añadir Video
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {videos.videosSecundarios?.map((v) => (
            <div key={v.id} className="p-4 bg-carbon border border-oro/20 rounded relative space-y-3">
              <button
                type="button"
                onClick={() => removeSecundario(v.id)}
                className="absolute top-2 right-2 text-hueso/40 hover:text-red-400"
                title="Eliminar video"
              >
                <Trash2 size={14} />
              </button>

              <div className="aspect-video bg-black border border-oro/20 rounded overflow-hidden relative group">
                <img src={v.posterUrl} alt={v.titulo} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMediaTarget("sec_" + v.id)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-oro text-xs font-head uppercase gap-1"
                >
                  <ImageIcon size={14} /> Cambiar Portada
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Título del Video</label>
                  <input
                    type="text"
                    className="campo text-xs font-medium"
                    value={v.titulo}
                    onChange={(e) => updateSecundario(v.id, "titulo", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">URL de YouTube</label>
                  <input
                    type="text"
                    className="campo text-xs font-mono"
                    value={v.youtubeUrl}
                    onChange={(e) => {
                      updateSecundario(v.id, "youtubeUrl", e.target.value);
                      const m = e.target.value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
                      if (m && m[1]) {
                        updateSecundario(v.id, "posterUrl", `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enlaces de canal */}
      <div className="space-y-4 pt-6 border-t border-oro/15">
        <h4 className="font-head text-sm text-oro uppercase tracking-wider">Enlaces Directos al Canal</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {videos.enlacesCanal?.map((c) => (
            <div key={c.id} className="p-4 bg-carbon border border-oro/20 rounded space-y-2">
              <input
                type="text"
                className="campo text-sm font-bold text-oro"
                value={c.titulo}
                onChange={(e) => updateEnlaceCanal(c.id, "titulo", e.target.value)}
              />
              <input
                type="text"
                className="campo text-xs"
                value={c.subtitulo}
                onChange={(e) => updateEnlaceCanal(c.id, "subtitulo", e.target.value)}
              />
              <input
                type="text"
                className="campo text-xs font-mono"
                value={c.url}
                onChange={(e) => updateEnlaceCanal(c.id, "url", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <MediaLibraryModal
        isOpen={mediaTarget !== null}
        onClose={() => setMediaTarget(null)}
        categoryFilter={mediaTarget === "videoPrincipalFile" ? "videos" : "portadas"}
        onSelect={(url) => {
          if (mediaTarget === "videoPrincipalPoster") updatePrincipal("posterUrl", url);
          else if (mediaTarget === "videoPrincipalFile") updatePrincipal("videoFileUrl", url);
          else if (mediaTarget?.startsWith("sec_")) {
            const vidId = mediaTarget.replace("sec_", "");
            updateSecundario(vidId, "posterUrl", url);
          }
        }}
      />
    </div>
  );
}

