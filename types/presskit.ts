export interface HeroConfig {
  nombre: string;
  inicial: string;
  subtitulo: string;
  descripcion: string;
  badgeAno: string;
  badgeSub: string;
  stamp: string;
  heroImage: string;
  heroLogoImage: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
}

export interface StatItem {
  id: string;
  numero: string;
  etiqueta: string;
  rotacion?: string;
}

export interface BioConfig {
  eyebrow: string;
  tituloPrincipal: string;
  tituloSecundario: string;
  foto: string;
  fotoCaption: string;
  cintaTexto: string;
  parrafos: string[];
  stats: StatItem[];
}

export interface LanzamientoItem {
  id: string;
  tipo: string;
  titulo: string;
  spotifyEmbedUrl: string;
  orden?: number;
}

export interface SencilloItem {
  id: string;
  titulo: string;
  portada: string;
  url: string;
  ano: string;
  orden?: number;
}

export interface MusicaConfig {
  eyebrow: string;
  titulo: string;
  subrayado: string;
  spotifyEmbedUrl: string;
  spotifyArtistUrl: string;
  lanzamientosDestacados: LanzamientoItem[];
  sencillos: SencilloItem[];
}

export interface VideoPrincipal {
  titulo: string;
  subtitulo: string;
  youtubeUrl: string;
  posterUrl: string;
  videoFileUrl?: string;
}

export interface VideoSecundario {
  id: string;
  titulo: string;
  youtubeUrl: string;
  posterUrl: string;
  orden?: number;
}

export interface EnlaceCanal {
  id: string;
  titulo: string;
  subtitulo: string;
  cta: string;
  url: string;
}

export interface VideosConfig {
  eyebrow: string;
  titulo: string;
  subrayado: string;
  youtubeChannelUrl: string;
  videoPrincipal: VideoPrincipal;
  videosSecundarios: VideoSecundario[];
  enlacesCanal: EnlaceCanal[];
}

export interface GaleriaItem {
  id: string;
  url: string;
  caption: string;
  categoria?: "fotos" | "portadas" | "prensa" | "videos";
  orden?: number;
}

export interface GaleriaConfig {
  eyebrow: string;
  titulo: string;
  subrayado: string;
  items: GaleriaItem[];
}

export interface EventoItem {
  id: string;
  mes: string;
  ano: string;
  estadoFecha: string;
  titulo: string;
  ubicacion: string;
  linkTexto: string;
  linkUrl: string;
  destacado?: boolean;
  orden?: number;
}

export interface EventosConfig {
  eyebrow: string;
  titulo: string;
  subrayado: string;
  eventos: EventoItem[];
}

export interface RedSocialItem {
  id: string;
  red: "instagram" | "facebook" | "spotify" | "apple" | "youtube" | "tiktok";
  nombre: string;
  url: string;
  activo: boolean;
  orden?: number;
}

export interface QrCardConfig {
  etiqueta: string;
  qrImage: string;
  url: string;
  titulo: string;
  descripcion: string;
  usuario: string;
}

export interface RedesConfig {
  eyebrow: string;
  titulo: string;
  subrayado: string;
  redes: RedSocialItem[];
  qrCard: QrCardConfig;
}

export interface DocumentoItem {
  id: string;
  titulo: string;
  descripcion: string;
  url: string;
  tamano?: string;
  fecha?: string;
  tipo: "pdf" | "zip" | "doc";
}

export interface DocumentosConfig {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  items: DocumentoItem[];
}

export interface ContactoConfig {
  eyebrow: string;
  titulo: string;
  subrayado: string;
  descripcion: string;
  whatsappNumero: string;
  whatsappTexto: string;
  email: string;
  cintaTiempo: string;
  formTitulo: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  author: string;
  themeColor: string;
  canonicalUrl: string;
  ogImage: string;
  locale: string;
}

export interface SeccionControl {
  id: string;
  nombre: string;
  visible: boolean;
  orden: number;
}

export interface MarqueeConfig {
  linea1: string;
  linea2: string;
}

export interface PressKitData {
  version: number;
  updatedAt: string;
  seo: SeoConfig;
  hero: HeroConfig;
  marquee: MarqueeConfig;
  bio: BioConfig;
  musica: MusicaConfig;
  videos: VideosConfig;
  galeria: GaleriaConfig;
  eventos: EventosConfig;
  documentos: DocumentosConfig;
  redes: RedesConfig;
  contacto: ContactoConfig;
  secciones: SeccionControl[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "superadmin" | "admin" | "editor";
  createdAt: string;
  lastLogin?: string;
}

export interface InviteCode {
  id: string;
  code: string;
  role: "admin" | "editor";
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedBy?: string;
  revoked: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  category: "fotos" | "portadas" | "videos" | "documentos" | "general";
  createdAt: string;
}

