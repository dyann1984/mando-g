"use client";

import React, { useState } from "react";
import { RedesConfig, ContactoConfig, RedSocialItem, QrCardConfig } from "@/types/presskit";
import MediaLibraryModal from "./MediaLibraryModal";
import { Image as ImageIcon } from "lucide-react";

interface SocialSectionTabProps {
  redes: RedesConfig;
  contacto: ContactoConfig;
  onRedesChange: (updated: RedesConfig) => void;
  onContactoChange: (updated: ContactoConfig) => void;
}

export default function SocialSectionTab({
  redes,
  contacto,
  onRedesChange,
  onContactoChange,
}: SocialSectionTabProps) {
  const [qrMediaOpen, setQrMediaOpen] = useState(false);

  const updateRed = (id: string, field: keyof RedSocialItem, val: any) => {
    const next = redes.redes.map((r) => (r.id === id ? { ...r, [field]: val } : r));
    onRedesChange({ ...redes, redes: next });
  };

  const updateQr = (field: keyof QrCardConfig, val: string) => {
    onRedesChange({ ...redes, qrCard: { ...redes.qrCard, [field]: val } });
  };

  const updateContacto = (field: keyof ContactoConfig, val: string) => {
    onContactoChange({ ...contacto, [field]: val });
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-oro/15 pb-4">
        <h3 className="font-display text-2xl text-oro">REDES SOCIALES & BOOKING DIRECTO</h3>
        <p className="text-hueso/50 text-xs mt-1">Configura enlaces de redes, código QR de Instagram, número de WhatsApp para contrataciones y correo.</p>
      </div>

      {/* Redes Sociales Individuales */}
      <div className="space-y-4">
        <h4 className="font-head text-sm text-oro uppercase tracking-wider">Enlaces de Redes Sociales</h4>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {redes.redes.map((r) => (
            <div key={r.id} className="p-4 bg-carbon border border-oro/20 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-head text-xs uppercase tracking-wider text-hueso font-bold">
                  {r.nombre}
                </span>
                <label className="flex items-center gap-1.5 text-[11px] text-oro cursor-pointer">
                  <input
                    type="checkbox"
                    checked={r.activo}
                    onChange={(e) => updateRed(r.id, "activo", e.target.checked)}
                    className="accent-oro"
                  />
                  <span>Activo</span>
                </label>
              </div>
              <input
                type="text"
                className="campo text-xs"
                value={r.url}
                onChange={(e) => updateRed(r.id, "url", e.target.value)}
                placeholder={`https://${r.red}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tarjeta QR de Instagram */}
      <div className="bg-carbon p-5 border border-oro/20 rounded space-y-4 pt-6">
        <h4 className="font-head text-sm text-oro uppercase tracking-wider">Tarjeta QR de Instagram</h4>
        <div className="grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-3 w-32 h-32 bg-black border border-oro/30 rounded overflow-hidden flex items-center justify-center p-2">
            <img src={redes.qrCard.qrImage || "/assets/qr-instagram.jpg"} alt="QR Instagram" className="max-w-full max-h-full object-contain" />
          </div>

          <div className="md:col-span-9 space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Cinta Superior</label>
                <input
                  type="text"
                  className="campo text-xs"
                  value={redes.qrCard.etiqueta}
                  onChange={(e) => updateQr("etiqueta", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-hueso/50 block mb-1">Usuario / Handle</label>
                <input
                  type="text"
                  className="campo text-xs"
                  value={redes.qrCard.usuario}
                  onChange={(e) => updateQr("usuario", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-hueso/50 block mb-1">Imagen del Código QR</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="campo text-xs flex-1"
                  value={redes.qrCard.qrImage}
                  onChange={(e) => updateQr("qrImage", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setQrMediaOpen(true)}
                  className="btn-oro !py-1.5 !px-3 text-xs flex items-center gap-1"
                >
                  <ImageIcon size={13} /> Cambiar QR
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-hueso/50 block mb-1">Texto Descriptivo</label>
              <textarea
                rows={2}
                className="campo text-xs"
                value={redes.qrCard.descripcion}
                onChange={(e) => updateQr("descripcion", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking & WhatsApp */}
      <div className="bg-carbon p-5 border border-oro/20 rounded space-y-4 pt-6">
        <h4 className="font-head text-sm text-oro uppercase tracking-wider">Datos de Contacto & Booking</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-hueso/50 block mb-1">Número de WhatsApp (con lada ej. 52155...)</label>
            <input
              type="text"
              className="campo text-sm font-mono"
              value={contacto.whatsappNumero}
              onChange={(e) => updateContacto("whatsappNumero", e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-hueso/50 block mb-1">Correo Electrónico de Contrataciones</label>
            <input
              type="email"
              className="campo text-sm"
              value={contacto.email}
              onChange={(e) => updateContacto("email", e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-hueso/50 block mb-1">Texto de Tiempo de Respuesta</label>
            <input
              type="text"
              className="campo text-xs"
              value={contacto.cintaTiempo}
              onChange={(e) => updateContacto("cintaTiempo", e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-hueso/50 block mb-1">Texto Secundario WhatsApp</label>
            <input
              type="text"
              className="campo text-xs"
              value={contacto.whatsappTexto}
              onChange={(e) => updateContacto("whatsappTexto", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase text-hueso/50 block mb-1">Descripción de Booking</label>
            <textarea
              rows={2}
              className="campo text-xs"
              value={contacto.descripcion}
              onChange={(e) => updateContacto("descripcion", e.target.value)}
            />
          </div>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={qrMediaOpen}
        onClose={() => setQrMediaOpen(false)}
        categoryFilter="general"
        onSelect={(url) => updateQr("qrImage", url)}
      />
    </div>
  );
}

