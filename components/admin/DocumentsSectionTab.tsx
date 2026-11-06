"use client";

import React, { useState } from "react";
import { DocumentosConfig, DocumentoItem } from "@/types/presskit";
import MediaLibraryModal from "./MediaLibraryModal";
import { Plus, Trash2, FileText } from "lucide-react";

interface DocumentsSectionTabProps {
  documentos: DocumentosConfig;
  onChange: (updated: DocumentosConfig) => void;
}

export default function DocumentsSectionTab({ documentos, onChange }: DocumentsSectionTabProps) {
  const [mediaTargetId, setMediaTargetId] = useState<string | null>(null);

  const update = (field: keyof DocumentosConfig, value: any) => {
    onChange({ ...documentos, [field]: value });
  };

  const updateItem = (id: string, field: keyof DocumentoItem, val: string) => {
    const next = documentos.items.map((it) => (it.id === id ? { ...it, [field]: val } : it));
    update("items", next);
  };

  const addItem = () => {
    const newItem: DocumentoItem = {
      id: "doc_" + Date.now(),
      titulo: "Nuevo Documento Descargable",
      descripcion: "Descripción para medios, prensa o promotores.",
      url: "#",
      tamano: "PDF · 2 MB",
      fecha: "Actualizado 2026",
      tipo: "pdf",
    };
    update("items", [...documentos.items, newItem]);
  };

  const removeItem = (id: string) => {
    if (confirm("¿Eliminar este documento descargable?")) {
      update("items", documentos.items.filter((it) => it.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-oro">DOCUMENTOS DE PRENSA (PDF / RIDER)</h3>
          <p className="text-hueso/50 text-xs mt-1">Sube archivos descargables (Rider técnico, Stage plot, Press kit PDF, fotos en ZIP).</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="btn-oro !py-2 !px-4 text-xs flex items-center gap-2 self-start"
        >
          <Plus size={15} /> Añadir Documento
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Eyebrow</label>
          <input
            type="text"
            className="campo"
            value={documentos.eyebrow}
            onChange={(e) => update("eyebrow", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Título de Sección</label>
          <input
            type="text"
            className="campo"
            value={documentos.titulo}
            onChange={(e) => update("titulo", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-head uppercase tracking-wider text-oro mb-2">Descripción General</label>
          <input
            type="text"
            className="campo"
            value={documentos.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {documentos.items?.map((doc) => (
          <div key={doc.id} className="p-5 bg-carbon border border-oro/20 rounded relative flex flex-col justify-between space-y-4">
            <button
              type="button"
              onClick={() => removeItem(doc.id)}
              className="absolute top-2 right-2 text-hueso/40 hover:text-red-400 p-1"
              title="Eliminar documento"
            >
              <Trash2 size={16} />
            </button>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block">Título del Archivo</label>
                <input
                  type="text"
                  className="campo text-sm font-semibold text-oro"
                  value={doc.titulo}
                  onChange={(e) => updateItem(doc.id, "titulo", e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-hueso/50 block">Descripción Breve</label>
                <textarea
                  rows={2}
                  className="campo text-xs"
                  value={doc.descripcion}
                  onChange={(e) => updateItem(doc.id, "descripcion", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Tamaño / Tipo</label>
                  <input
                    type="text"
                    className="campo text-xs"
                    value={doc.tamano || ""}
                    onChange={(e) => updateItem(doc.id, "tamano", e.target.value)}
                    placeholder="PDF · 2.4 MB"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-hueso/50 block">Fecha / Etiqueta</label>
                  <input
                    type="text"
                    className="campo text-xs"
                    value={doc.fecha || ""}
                    onChange={(e) => updateItem(doc.id, "fecha", e.target.value)}
                    placeholder="Gira 2026"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Archivo / URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="campo text-xs flex-1 font-mono"
                    value={doc.url}
                    onChange={(e) => updateItem(doc.id, "url", e.target.value)}
                    placeholder="URL del PDF o ZIP"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaTargetId(doc.id)}
                    className="btn-oro !py-1.5 !px-3 text-xs flex items-center gap-1"
                  >
                    <FileText size={13} /> Subir/Elegir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MediaLibraryModal
        isOpen={mediaTargetId !== null}
        onClose={() => setMediaTargetId(null)}
        categoryFilter="documentos"
        onSelect={(url) => {
          if (mediaTargetId) updateItem(mediaTargetId, "url", url);
        }}
      />
    </div>
  );
}

