"use client";

import React, { useState, useEffect } from "react";
import { MediaItem } from "@/types/presskit";
import { Upload, Trash2, Check, Copy, X, Image as ImageIcon, FileText, Video } from "lucide-react";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
  categoryFilter?: "fotos" | "portadas" | "videos" | "documentos" | "general" | "todos";
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  categoryFilter = "todos",
}: MediaLibraryModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?category=${selectedCategory}`);
      const data = await res.json();
      if (data.media) setItems(data.media);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setErrorMsg(null);

    const uploadCat = selectedCategory === "todos" ? "general" : selectedCategory;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", uploadCat);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          setErrorMsg(result.error || `Error subiendo ${file.name}`);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Error en la conexión al subir.");
      }
    }

    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}" de la biblioteca? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (err) {
      alert("Error al eliminar el archivo.");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <div className="bg-[#0e0e0e] border border-oro/30 w-full max-w-5xl max-h-[90vh] rounded-lg flex flex-col shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="p-5 border-b border-oro/20 flex items-center justify-between bg-black/60">
          <div>
            <h3 className="font-display text-2xl text-oro tracking-wide">BIBLIOTECA MULTIMEDIA</h3>
            <p className="text-hueso/50 text-xs">Sube, selecciona o elimina fotografías, portadas, videos y documentos.</p>
          </div>
          <button
            onClick={onClose}
            className="text-hueso/60 hover:text-oro p-2 transition-colors rounded-full hover:bg-white/5"
            aria-label="Cerrar modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Zona de Arrastrar y Soltar + Selector de Categoría */}
        <div className="p-5 border-b border-oro/15 bg-carbon/60 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 text-xs font-head uppercase tracking-wider">
            {["todos", "portadas", "fotos", "videos", "documentos", "general"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 border transition-all ${
                  selectedCategory === cat
                    ? "border-oro bg-oro text-black font-bold shadow-lg shadow-oro/20"
                    : "border-oro/20 text-hueso/70 hover:border-oro/50 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleUploadFiles(e.dataTransfer.files);
            }}
            className={`btn-oro !py-2 !px-4 text-xs cursor-pointer flex items-center gap-2 ${
              uploading ? "opacity-50 pointer-events-none" : ""
            } ${dragOver ? "ring-2 ring-white" : ""}`}
          >
            <Upload size={15} />
            <span>{uploading ? "Subiendo archivo..." : "Subir archivo nuevo"}</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUploadFiles(e.target.files)}
              accept="image/*,video/mp4,video/webm,application/pdf,application/zip"
            />
          </label>
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border-b border-red-500/40 p-3 text-red-200 text-xs px-6">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Rejilla de Medios */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-20 text-center text-oro font-head tracking-widest text-sm uppercase animate-pulse">
              Cargando archivos multimedia...
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <Upload size={40} className="mx-auto text-oro/30 mb-3" />
              <p className="font-display text-xl text-hueso/60">No hay archivos en esta categoría</p>
              <p className="text-hueso/40 text-xs mt-1">Arrastra o pulsa Subir para añadir fotos o videos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-black/70 border border-oro/20 rounded overflow-hidden flex flex-col justify-between hover:border-oro transition-all"
                >
                  <div className="aspect-square bg-noir relative overflow-hidden flex items-center justify-center">
                    {item.type?.startsWith("image/") ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : item.type?.startsWith("video/") ? (
                      <div className="flex flex-col items-center text-oro/60">
                        <Video size={36} />
                        <span className="text-[10px] mt-1 uppercase font-head">Video</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-oro/60">
                        <FileText size={36} />
                        <span className="text-[10px] mt-1 uppercase font-head">Documento</span>
                      </div>
                    )}

                    {/* Botón de selección rápida */}
                    {onSelect && (
                      <button
                        onClick={() => {
                          onSelect(item.url);
                          onClose();
                        }}
                        className="absolute inset-0 bg-oro/80 text-black font-head font-bold tracking-wider text-xs uppercase flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Seleccionar ✓
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 bg-carbon/90 border-t border-oro/10 flex items-center justify-between text-xs">
                    <span className="truncate text-hueso/80 font-mono text-[11px] max-w-[120px]" title={item.name}>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyToClipboard(item.url)}
                        title="Copiar enlace"
                        className="p-1 hover:text-oro text-hueso/50 transition-colors"
                      >
                        {copiedUrl === item.url ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        title="Eliminar de la biblioteca"
                        className="p-1 hover:text-red-400 text-hueso/50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

