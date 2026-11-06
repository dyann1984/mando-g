import { PressKitData } from "@/types/presskit";

export const initialPressKitData: PressKitData = {
  version: 1,
  updatedAt: new Date().toISOString(),
  seo: {
    title: "Mando G | Press Kit Oficial — Hip Hop Bilingüe | 2Sik Music",
    description: "Press Kit oficial de Mando G. Rapero bilingüe (ES/EN) de Ecatepec, Estado de México, criado en South Omaha, Nebraska. Escucha Border Hoppin', Real y más. Contrataciones abiertas.",
    keywords: "Mando G, hip hop mexicano, rap bilingüe, 2Sik Music, Border Hoppin, Ecatepec, Omaha, press kit",
    author: "Mando G / 2Sik Music",
    themeColor: "#050505",
    canonicalUrl: "https://mandog.vercel.app/",
    ogImage: "/assets/logo-mg-hd.png",
    locale: "es_MX"
  },
  hero: {
    nombre: "MANDO",
    inicial: "G",
    subtitulo: "Hip hop bilingüe · Ecatepec ↔ South Omaha",
    descripcion: "Historias de frontera contadas en dos idiomas dentro de una misma barra. Sello 2Sik Music.",
    badgeAno: "Press Kit Oficial · 2026",
    badgeSub: "ES / EN · Sin traducción",
    stamp: "2SIK MUSIC",
    heroImage: "/assets/mando-g-hero.jpg",
    heroLogoImage: "/assets/logo-mg-hd.png",
    ctaPrimaryText: "Escuchar ahora",
    ctaPrimaryUrl: "https://open.spotify.com/artist/7lHwxJADraMnwr1FqgYlyv",
    ctaSecondaryText: "Contrataciones",
    ctaSecondaryUrl: "#contacto"
  },
  marquee: {
    linea1: "BORDER HOPPIN' ✖ REAL ✖ ELEVATE ✖ SAN JOSÉ ITURBIDE ✖ TODO CAMBIÓ ✖ MADE IT FAR ✖ BE ON ✖",
    linea2: "MANDO G · 2SIK MUSIC · ECATEPEC · SOUTH OMAHA · EST. 2007 · ESPAÑOL / ENGLISH ·"
  },
  bio: {
    eyebrow: "La historia",
    tituloPrincipal: "DOS IDIOMAS.",
    tituloSecundario: "UNA SOLA VOZ.",
    foto: "https://i.scdn.co/image/ab6761610000e5eba4febdd50b2b41216c692f82",
    fotoCaption: "Armando Estrada Navarro · n. 05.09.1989 · Ecatepec, Edo. Méx.",
    cintaTexto: "Retrato oficial",
    parrafos: [
      "Armando Estrada Navarro, Mando G, nació el 5 de septiembre de 1989 en Ecatepec, Estado de México. Con apenas seis meses su familia migró a Estados Unidos, y creció en las calles de South Omaha, Nebraska, hasta los 23 años. Hoy vive de regreso en México, con la frontera tatuada en la memoria y en la música.",
      "Su carrera arrancó en 2007 junto a su hermano, y desde entonces ha construido un sonido propio: historias reales de migración, familia y calle, contadas con la habilidad de cambiar del español al inglés dentro de una misma barra, sin perder el flow.",
      "Bajo el sello independiente 2Sik Music, Mando G lanzó en 2026 el EP Border Hoppin', además de los sencillos Real, Elevate, San José Iturbide y Todo Cambió: crónicas de ida y vuelta entre dos países que suenan a un mismo barrio.",
      "Originario de Xalostoc, su historia con el sello incluye colaboraciones como Push (2021) junto a Mummy W.R.A.P.S, y una presencia constante en plataformas: Spotify, Apple Music y YouTube. Vida real, sin filtro, en dos idiomas."
    ],
    stats: [
      { id: "s1", numero: "2007", etiqueta: "Inicio de carrera", rotacion: "-1.5deg" },
      { id: "s2", numero: "ES/EN", etiqueta: "Bilingüe nato", rotacion: "1deg" },
      { id: "s3", numero: "2SIK", etiqueta: "Sello indie", rotacion: "-0.8deg" }
    ]
  },
  musica: {
    eyebrow: "Discografía",
    titulo: "EL",
    subrayado: "CATÁLOGO",
    spotifyEmbedUrl: "https://open.spotify.com/embed/artist/7lHwxJADraMnwr1FqgYlyv?utm_source=generator&theme=0",
    spotifyArtistUrl: "https://open.spotify.com/artist/7lHwxJADraMnwr1FqgYlyv",
    lanzamientosDestacados: [
      {
        id: "l1",
        tipo: "EP · 2026 · Último lanzamiento",
        titulo: "Border Hoppin'",
        spotifyEmbedUrl: "https://open.spotify.com/embed/album/3R8092jGnVOasCdpymxymN?utm_source=generator&theme=0",
        orden: 1
      },
      {
        id: "l2",
        tipo: "Sencillo · 2026",
        titulo: "Real",
        spotifyEmbedUrl: "https://open.spotify.com/embed/album/1qTJQXFEuH3I7MOr3xlOt6?utm_source=generator&theme=0",
        orden: 2
      },
      {
        id: "l3",
        tipo: "Sencillo · 2026",
        titulo: "San Jose Iturbide",
        spotifyEmbedUrl: "https://open.spotify.com/embed/album/30DObYuJjh5ieFobaEVtf5?utm_source=generator&theme=0",
        orden: 3
      }
    ],
    sencillos: [
      {
        id: "s1",
        titulo: "Elevate",
        portada: "https://i.scdn.co/image/ab67616d0000b27391b6a97aca848aadf085602e",
        url: "https://open.spotify.com/album/3IOu3BXciZ3eKSIoKhsbwz",
        ano: "2026",
        orden: 1
      },
      {
        id: "s2",
        titulo: "Be On",
        portada: "https://i.scdn.co/image/ab67616d0000b273984b108d829c4a10e8bc184c",
        url: "https://open.spotify.com/album/4OTll81hzDvo2MmOsJleoQ",
        ano: "2026",
        orden: 2
      },
      {
        id: "s3",
        titulo: "Made It Far",
        portada: "https://i.scdn.co/image/ab67616d0000b2739368aa657073efc807dcae74",
        url: "https://open.spotify.com/album/5YHVwPMk5fTGQGgQ91NHgd",
        ano: "2026",
        orden: 3
      },
      {
        id: "s4",
        titulo: "Real",
        portada: "https://i.scdn.co/image/ab67616d0000b273db0a0151a4ca77c5a5527bdf",
        url: "https://open.spotify.com/album/1qTJQXFEuH3I7MOr3xlOt6",
        ano: "2026",
        orden: 4
      },
      {
        id: "s5",
        titulo: "Todo Cambió",
        portada: "https://i.scdn.co/image/ab67616d0000b273fdcbd476c7e8ad1ab50da005",
        url: "https://open.spotify.com/artist/7lHwxJADraMnwr1FqgYlyv",
        ano: "2026",
        orden: 5
      }
    ]
  },
  videos: {
    eyebrow: "En pantalla",
    titulo: "VISUALES",
    subrayado: "OFICIALES",
    youtubeChannelUrl: "https://youtube.com/@itsmandog",
    videoPrincipal: {
      titulo: "VIDEO OFICIAL",
      subtitulo: "Mando G · YouTube",
      youtubeUrl: "https://www.youtube.com/watch?v=_NJyi3Ska0M",
      posterUrl: "https://img.youtube.com/vi/_NJyi3Ska0M/maxresdefault.jpg"
    },
    videosSecundarios: [
      {
        id: "v1",
        titulo: "VIDEO OFICIAL",
        youtubeUrl: "https://youtu.be/gBRwsuk2TEk",
        posterUrl: "https://img.youtube.com/vi/gBRwsuk2TEk/hqdefault.jpg",
        orden: 1
      },
      {
        id: "v2",
        titulo: "VIDEO OFICIAL",
        youtubeUrl: "https://youtu.be/2RL59QlWORU",
        posterUrl: "https://img.youtube.com/vi/2RL59QlWORU/hqdefault.jpg",
        orden: 2
      }
    ],
    enlacesCanal: [
      {
        id: "c1",
        titulo: "VIDEOCLIPS",
        subtitulo: "Los videos oficiales, en orden de estreno.",
        cta: "Ver todos →",
        url: "https://youtube.com/@itsmandog/videos"
      },
      {
        id: "c2",
        titulo: "SHORTS",
        subtitulo: "Detrás de cámaras, freestyles y adelantos.",
        cta: "Ver shorts →",
        url: "https://youtube.com/@itsmandog/shorts"
      },
      {
        id: "c3",
        titulo: "SUSCRÍBETE",
        subtitulo: "No te pierdas ningún estreno del canal.",
        cta: "@itsMandoG →",
        url: "https://youtube.com/@itsmandog?sub_confirmation=1"
      }
    ]
  },
  galeria: {
    eyebrow: "Arte & imagen",
    titulo: "EN",
    subrayado: "IMÁGENES",
    items: [
      { id: "g1", url: "/assets/logo-mg-hd.png", caption: "Identidad oficial · 2026", categoria: "portadas", orden: 1 },
      { id: "g2", url: "https://i.scdn.co/image/ab6761610000e5eba4febdd50b2b41216c692f82", caption: "Retrato oficial", categoria: "fotos", orden: 2 },
      { id: "g3", url: "https://i.scdn.co/image/ab67616d0000b27391b6a97aca848aadf085602e", caption: "Elevate · Portada", categoria: "portadas", orden: 3 },
      { id: "g4", url: "https://i.scdn.co/image/ab67616d0000b273db0a0151a4ca77c5a5527bdf", caption: "Real · Portada", categoria: "portadas", orden: 4 },
      { id: "g5", url: "https://i.scdn.co/image/ab67616d0000b273984b108d829c4a10e8bc184c", caption: "Be On · Portada", categoria: "portadas", orden: 5 },
      { id: "g6", url: "https://i.scdn.co/image/ab67616d0000b2739368aa657073efc807dcae74", caption: "Made It Far · Portada", categoria: "portadas", orden: 6 },
      { id: "g7", url: "https://i.scdn.co/image/ab67616d0000b273fdcbd476c7e8ad1ab50da005", caption: "Todo Cambió · Portada", categoria: "portadas", orden: 7 },
      { id: "g8", url: "/assets/mando-g-foto.jpg", caption: "Sesión de prensa", categoria: "prensa", orden: 8 },
      { id: "g9", url: "https://img.youtube.com/vi/_NJyi3Ska0M/hq1.jpg", caption: "Video oficial · Fotograma 01", categoria: "videos", orden: 9 },
      { id: "g10", url: "https://img.youtube.com/vi/_NJyi3Ska0M/hq2.jpg", caption: "Video oficial · Fotograma 02", categoria: "videos", orden: 10 },
      { id: "g11", url: "https://img.youtube.com/vi/_NJyi3Ska0M/hq3.jpg", caption: "Video oficial · Fotograma 03", categoria: "videos", orden: 11 }
    ]
  },
  eventos: {
    eyebrow: "Agenda",
    titulo: "PRÓXIMOS",
    subrayado: "EVENTOS",
    eventos: [
      {
        id: "e1",
        mes: "AGO",
        ano: "2026",
        estadoFecha: "Fecha por confirmar",
        titulo: "BORDER HOPPIN' — PRESENTACIÓN EN VIVO",
        ubicacion: "Ciudad de México · Venue por anunciar",
        linkTexto: "Solicitar acceso de prensa →",
        linkUrl: "#contacto",
        orden: 1
      },
      {
        id: "e2",
        mes: "SEP",
        ano: "2026",
        estadoFecha: "Fecha por confirmar",
        titulo: "GIRA ESTADO DE MÉXICO",
        ubicacion: "Ecatepec · Tecámac · Toluca",
        linkTexto: "Booking disponible →",
        linkUrl: "#contacto",
        orden: 2
      },
      {
        id: "e3",
        mes: "TU",
        ano: "CIUDAD",
        estadoFecha: "Agenda abierta",
        titulo: "CONTRATA A MANDO G",
        ubicacion: "Festivales, clubes, eventos privados y colaboraciones. Disponible en México y Estados Unidos.",
        linkTexto: "Cotizar fecha",
        linkUrl: "#contacto",
        destacado: true,
        orden: 3
      }
    ]
  },
  documentos: {
    eyebrow: "Prensa & Logística",
    titulo: "DOCUMENTOS",
    descripcion: "Descarga de material oficial para medios, promotores, organizadores de festivales y prensa.",
    items: [
      {
        id: "doc1",
        titulo: "Press Kit Oficial 2026 (One-Sheet)",
        descripcion: "Biografía ejecutiva, lanzamientos destacados, estadísticas y datos de contacto.",
        url: "#",
        tamano: "PDF · 2.4 MB",
        fecha: "Actualizado 2026",
        tipo: "pdf"
      },
      {
        id: "doc2",
        titulo: "Rider Técnico & Stage Plot",
        descripcion: "Requerimientos de audio, micrófonos, monitoreo y especificaciones de escenario.",
        url: "#",
        tamano: "PDF · 1.1 MB",
        fecha: "Gira 2026",
        tipo: "pdf"
      },
      {
        id: "doc3",
        titulo: "Kit de Fotografías en Alta Resolución",
        descripcion: "Retratos de prensa, logotipo oficial vectorizado y fotos de presentación.",
        url: "#",
        tamano: "ZIP · 48 MB",
        fecha: "Alta Calidad 300 DPI",
        tipo: "zip"
      }
    ]
  },
  redes: {
    eyebrow: "Comunidad",
    titulo: "SIGUE EL",
    subrayado: "MOVIMIENTO",
    redes: [
      { id: "r1", red: "instagram", nombre: "Instagram", url: "https://instagram.com/itsmandog", activo: true, orden: 1 },
      { id: "r2", red: "facebook", nombre: "Facebook", url: "https://www.facebook.com/share/1BV3W1WUN2/", activo: true, orden: 2 },
      { id: "r3", red: "spotify", nombre: "Spotify", url: "https://open.spotify.com/artist/7lHwxJADraMnwr1FqgYlyv", activo: true, orden: 3 },
      { id: "r4", red: "apple", nombre: "Apple Music", url: "https://music.apple.com/us/artist/mando-g/964071259", activo: true, orden: 4 },
      { id: "r5", red: "youtube", nombre: "YouTube", url: "https://youtube.com/@itsmandog", activo: true, orden: 5 },
      { id: "r6", red: "tiktok", nombre: "TikTok", url: "https://tiktok.com/@itsmandog", activo: true, orden: 6 }
    ],
    qrCard: {
      etiqueta: "Escanéame",
      qrImage: "/assets/qr-instagram.jpg",
      url: "https://instagram.com/itsmandog",
      titulo: "DIRECTO A SU INSTAGRAM",
      descripcion: "Apunta la cámara de tu teléfono al código y cae directo al perfil oficial @itsmandog: estrenos, detrás de cámaras y fechas antes que nadie.",
      usuario: "@itsmandog"
    }
  },
  contacto: {
    eyebrow: "Contrataciones & prensa",
    titulo: "HAGAMOS QUE",
    subrayado: "SUENE",
    descripcion: "Booking para shows en México y Estados Unidos, colaboraciones, features, entrevistas y prensa. Respuesta directa del equipo de 2Sik Music.",
    whatsappNumero: "5215500000000",
    whatsappTexto: "Mensaje directo al equipo",
    email: "booking@mandog.mx",
    cintaTiempo: "Respuesta en 24–48 h",
    formTitulo: "SOLICITUD DE BOOKING"
  },
  secciones: [
    { id: "bio", nombre: "Biografía", visible: true, orden: 1 },
    { id: "musica", nombre: "Música / Catálogo", visible: true, orden: 2 },
    { id: "videos", nombre: "Videos Oficiales", visible: true, orden: 3 },
    { id: "galeria", nombre: "Galería de Imágenes", visible: true, orden: 4 },
    { id: "eventos", nombre: "Próximos Shows / Eventos", visible: true, orden: 5 },
    { id: "documentos", nombre: "Documentos Descargables (PDF)", visible: true, orden: 6 },
    { id: "redes", nombre: "Redes Sociales", visible: true, orden: 7 },
    { id: "contacto", nombre: "Booking & Contacto", visible: true, orden: 8 }
  ]
};

