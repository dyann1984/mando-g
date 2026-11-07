"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PressKitData } from "@/types/presskit";

// Subcomponentes de pestañas
import HeroSectionTab from "@/components/admin/HeroSectionTab";
import BioSectionTab from "@/components/admin/BioSectionTab";
import MusicSectionTab from "@/components/admin/MusicSectionTab";
import VideosSectionTab from "@/components/admin/VideosSectionTab";
import GallerySectionTab from "@/components/admin/GallerySectionTab";
import EventsSectionTab from "@/components/admin/EventsSectionTab";
import DocumentsSectionTab from "@/components/admin/DocumentsSectionTab";
import SocialSectionTab from "@/components/admin/SocialSectionTab";
import SectionsOrderTab from "@/components/admin/SectionsOrderTab";
import SeoSectionTab from "@/components/admin/SeoSectionTab";
import VersionsTab from "@/components/admin/VersionsTab";
import InvitesTab from "@/components/admin/InvitesTab";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

// Iconos
import {
  Save,
  Globe,
  UploadCloud,
  LogOut,
  FolderKanban,
  FileText,
  Music,
  Video,
  Image as ImageIcon,
  Calendar,
  Download,
  Share2,
  SlidersVertical,
  Search,
  History,
  KeyRound,
  ExternalLink,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Estados de datos
  const [data, setData] = useState<PressKitData | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string>("");
  const [publishedVersion, setPublishedVersion] = useState<number>(1);
  const [publishedUpdatedAt, setPublishedUpdatedAt] = useState<string>("");

  // Estados de interfaz y sesión
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Verificar autenticación y cargar datos
  const loadData = async () => {
    setLoading(true);
    try {
      // Verificar sesión
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        // Verificar si necesita setup inicial
        const setupRes = await fetch("/api/auth/setup");
        if (!setupRes.ok) {
          showToast("No es posible consultar Supabase. Intenta nuevamente más tarde.", "error");
          return;
        }
        const setupData = await setupRes.json();
        if (setupData.needsSetup === true) {
          router.push("/admin/setup");
        } else if (setupData.needsSetup === false) {
          router.push("/admin/login");
        } else {
          showToast("No se pudo verificar el estado de los administradores.", "error");
        }
        return;
      }

      const authData = await authRes.json();
      setUser(authData.user);

      // Cargar datos del CMS
      const contentRes = await fetch("/api/admin/content");
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setData(contentData.draft);
        setOriginalDraft(JSON.stringify(contentData.draft));
        setPublishedVersion(contentData.publishedVersion);
        setPublishedUpdatedAt(contentData.publishedUpdatedAt);
      }
    } catch (err) {
      console.error(err);
      showToast("Error de conexión al cargar datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Comparar si hay cambios sin guardar
  const hasUnsavedChanges = data ? JSON.stringify(data) !== originalDraft : false;

  // 2. Guardar Borrador
  const handleSaveDraft = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setOriginalDraft(JSON.stringify(data));
        showToast("Borrador guardado exitosamente.");
      } else {
        showToast(result.error || "Error al guardar borrador.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Error al conectar.", "error");
    } finally {
      setSaving(false);
    }
  };

  // 3. Publicar Cambios en Vivo
  const handlePublish = async () => {
    if (!data) return;

    const note = prompt("Nota de la versión (opcional):", "Actualización desde panel");
    if (note === null) return; // Usuario canceló

    setPublishing(true);
    try {
      // Primero guardar el borrador actual
      await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Luego publicar
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setOriginalDraft(JSON.stringify(data));
        setPublishedVersion(result.version);
        setPublishedUpdatedAt(result.updatedAt);
        showToast("¡Publicado en vivo! Los cambios ya son visibles en la página pública.");
      } else {
        showToast(result.error || "Error al publicar.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Error al conectar.", "error");
    } finally {
      setPublishing(false);
    }
  };

  // 4. Cerrar Sesión
  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      if (!confirm("Tienes cambios sin guardar en el borrador. ¿Deseas cerrar sesión de todas formas?")) {
        return;
      }
    }
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-noir flex flex-col items-center justify-center p-6 text-center">
        <span className="sello mb-4 animate-bounce">2SIK MUSIC</span>
        <h2 className="font-display text-4xl text-hueso mt-2">MANDO G</h2>
        <p className="font-head text-xs tracking-widest text-oro uppercase animate-pulse mt-2">
          Cargando panel de administración...
        </p>
      </div>
    );
  }

  if (!data) return null;

  const tabs = [
    { id: "hero", label: "Portada & Hero", icon: FileText },
    { id: "bio", label: "Biografía", icon: FolderKanban },
    { id: "music", label: "Música & Catálogo", icon: Music },
    { id: "videos", label: "Videos Oficiales", icon: Video },
    { id: "gallery", label: "Galería de Fotos", icon: ImageIcon },
    { id: "events", label: "Shows & Eventos", icon: Calendar },
    { id: "documents", label: "Descargas (PDF / Rider)", icon: Download },
    { id: "social", label: "Redes & Booking", icon: Share2 },
    { id: "sections", label: "Orden de Secciones", icon: SlidersVertical },
    { id: "seo", label: "Metadatos & SEO", icon: Search },
    { id: "versions", label: "Historial de Versiones", icon: History },
    { id: "invites", label: "Invitaciones & Admins", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-noir flex flex-col text-hueso font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[300] px-5 py-3 rounded-md shadow-2xl flex items-center gap-3 text-xs font-head tracking-wider uppercase border transition-all animate-in fade-in slide-in-from-top-3 ${
            toast.type === "success"
              ? "bg-[#0b2413] border-green-500/50 text-green-200"
              : "bg-[#2c0b0b] border-red-500/50 text-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={18} className="text-green-400" /> : <AlertCircle size={18} className="text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ============ TOPBAR ============ */}
      <header className="h-16 bg-carbon border-b border-oro/20 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-oro hover:bg-white/5 rounded"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" target="_blank" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-widest text-hueso">
              MANDO <span className="text-oro">G</span>
            </span>
            <span className="cinta !py-0.5 !px-2 text-[.55rem] hidden sm:inline-block">ADMIN</span>
          </Link>

          {/* Indicador de Estado del Borrador */}
          <div className="hidden lg:flex items-center gap-2 ml-6 text-[11px] font-head uppercase tracking-wider">
            {hasUnsavedChanges ? (
              <span className="px-2.5 py-1 rounded bg-yellow-950/80 border border-yellow-500/40 text-yellow-300 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                Borrador con cambios sin guardar
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-green-950/80 border border-green-500/40 text-green-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Borrador al día (v{publishedVersion})
              </span>
            )}
          </div>
        </div>

        {/* Acciones Globales */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setMediaModalOpen(true)}
            className="btn-fantasma !py-2 !px-3 text-xs hidden sm:flex items-center gap-1.5"
            title="Abrir galería de medios"
          >
            <ImageIcon size={15} />
            <span>Biblioteca</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="btn-fantasma !py-2 !px-3.5 text-xs flex items-center gap-1.5"
            title="Guardar borrador sin publicar aún"
          >
            <Save size={15} />
            <span className="hidden sm:inline">{saving ? "Guardando..." : "Guardar Borrador"}</span>
            <span className="sm:hidden">Guardar</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="btn-oro !py-2 !px-4 text-xs flex items-center gap-1.5 shadow-lg shadow-oro/20"
            title="Publicar cambios en la página pública"
          >
            <UploadCloud size={15} />
            <span>{publishing ? "Publicando..." : "Publicar en Vivo"}</span>
          </button>

          <div className="h-6 w-[1px] bg-oro/20 mx-1 hidden sm:block" />

          <Link
            href="/"
            target="_blank"
            className="p-2 text-hueso/60 hover:text-oro transition-colors hidden sm:block"
            title="Ver sitio público en nueva pestaña"
          >
            <ExternalLink size={18} />
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 text-hueso/50 hover:text-red-400 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* ============ CUERPO PRINCIPAL ============ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 w-64 bg-carbon border-r border-oro/15 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="overflow-y-auto py-4 px-3 space-y-1">
            <p className="px-3 pb-2 text-[10px] uppercase font-head tracking-[.25em] text-oro/60">
              Contenido del Press Kit
            </p>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-head uppercase tracking-wider transition-all text-left ${
                    isActive
                      ? "bg-oro text-black font-bold shadow-md shadow-oro/10"
                      : "text-hueso/70 hover:bg-white/5 hover:text-hueso"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Pie de Sidebar */}
          <div className="p-4 border-t border-oro/15 bg-black/40 text-xs">
            <p className="font-head uppercase tracking-wider text-hueso/80 text-[11px] truncate">
              {user?.username || "Administrador"}
            </p>
            <p className="text-hueso/40 text-[10px] capitalize">{user?.role || "Admin"}</p>
          </div>
        </aside>

        {/* Área de Trabajo / Formularios */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 max-w-6xl mx-auto w-full">
          {activeTab === "hero" && (
            <HeroSectionTab hero={data.hero} onChange={(h) => setData({ ...data, hero: h })} />
          )}

          {activeTab === "bio" && (
            <BioSectionTab bio={data.bio} onChange={(b) => setData({ ...data, bio: b })} />
          )}

          {activeTab === "music" && (
            <MusicSectionTab musica={data.musica} onChange={(m) => setData({ ...data, musica: m })} />
          )}

          {activeTab === "videos" && (
            <VideosSectionTab videos={data.videos} onChange={(v) => setData({ ...data, videos: v })} />
          )}

          {activeTab === "gallery" && (
            <GallerySectionTab galeria={data.galeria} onChange={(g) => setData({ ...data, galeria: g })} />
          )}

          {activeTab === "events" && (
            <EventsSectionTab eventos={data.eventos} onChange={(e) => setData({ ...data, eventos: e })} />
          )}

          {activeTab === "documents" && (
            <DocumentsSectionTab documentos={data.documentos} onChange={(d) => setData({ ...data, documentos: d })} />
          )}

          {activeTab === "social" && (
            <SocialSectionTab
              redes={data.redes}
              contacto={data.contacto}
              onRedesChange={(r) => setData({ ...data, redes: r })}
              onContactoChange={(c) => setData({ ...data, contacto: c })}
            />
          )}

          {activeTab === "sections" && (
            <SectionsOrderTab secciones={data.secciones} onChange={(s) => setData({ ...data, secciones: s })} />
          )}

          {activeTab === "seo" && (
            <SeoSectionTab seo={data.seo} onChange={(s) => setData({ ...data, seo: s })} />
          )}

          {activeTab === "versions" && <VersionsTab onRestored={loadData} />}

          {activeTab === "invites" && <InvitesTab />}
        </main>
      </div>

      {/* Modal General de Medios */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        categoryFilter="todos"
      />
    </div>
  );
}

