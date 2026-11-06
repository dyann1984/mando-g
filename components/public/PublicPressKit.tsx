"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PressKitData } from "@/types/presskit";
import InteractiveEffects from "./InteractiveEffects";

interface PublicPressKitProps {
  data: PressKitData;
}

export default function PublicPressKit({ data }: PublicPressKitProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    nombre: "",
    empresa: "",
    ciudad: "",
    fecha: "",
    tipo: "Show en vivo",
    mensaje: "",
  });
  const [formError, setFormError] = useState(false);

  const hero = data.hero;
  const bio = data.bio;
  const musica = data.musica;
  const videos = data.videos;
  const galeria = data.galeria;
  const eventos = data.eventos;
  const docs = data.documentos;
  const redes = data.redes;
  const contacto = data.contacto;
  const marquee = data.marquee;

  // Mapa de visibilidad de secciones
  const isSectionVisible = (id: string) => {
    const sec = data.secciones?.find((s) => s.id === id);
    return sec ? sec.visible : true;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.nombre.trim() || !formValues.ciudad.trim() || !formValues.mensaje.trim()) {
      setFormError(true);
      return;
    }
    setFormError(false);

    const msg =
      `*Solicitud de booking — Mando G*%0A%0A` +
      `Nombre: ${encodeURIComponent(formValues.nombre)}%0A` +
      `Empresa/Evento: ${encodeURIComponent(formValues.empresa || "N/A")}%0A` +
      `Ciudad: ${encodeURIComponent(formValues.ciudad)}%0A` +
      `Fecha: ${encodeURIComponent(formValues.fecha || "Por definir")}%0A` +
      `Tipo: ${encodeURIComponent(formValues.tipo)}%0A%0A` +
      `${encodeURIComponent(formValues.mensaje)}`;

    const phone = contacto.whatsappNumero || "5215500000000";
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  return (
    <>
      <InteractiveEffects />

      {/* ============ NAV ============ */}
      <nav id="nav" className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <a href="#inicio" className="flex items-center" aria-label="Inicio Mando G">
            <span className="font-display text-3xl tracking-widest text-hueso">
              {hero.nombre} <span className="text-oro">{hero.inicial}</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {isSectionVisible("bio") && <a className="nav-link" href="#bio">Bio</a>}
            {isSectionVisible("musica") && <a className="nav-link" href="#musica">Música</a>}
            {isSectionVisible("videos") && <a className="nav-link" href="#videos">Videos</a>}
            {isSectionVisible("galeria") && <a className="nav-link" href="#galeria">Galería</a>}
            {isSectionVisible("eventos") && <a className="nav-link" href="#eventos">Eventos</a>}
            {isSectionVisible("documentos") && docs?.items?.length > 0 && <a className="nav-link" href="#documentos">Descargas</a>}
            {isSectionVisible("contacto") && <a className="nav-link" href="#contacto">Contacto</a>}

            <span className="flex items-center gap-2.5">
              {redes.redes.slice(0, 3).map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-red"
                  aria-label={r.nombre}
                  title={r.nombre}
                >
                  {r.red === "instagram" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/></svg>
                  )}
                  {r.red === "spotify" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M7.5 10.2c3-.9 6.5-.6 9 .9M8 13.2c2.4-.7 5-.4 7 .8M8.6 16c1.8-.5 3.6-.3 5.2.6"/></svg>
                  )}
                  {r.red === "youtube" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2.5" y="6" width="19" height="12" rx="3.5"/><path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none"/></svg>
                  )}
                  {r.red !== "instagram" && r.red !== "spotify" && r.red !== "youtube" && (
                    <span className="font-head text-xs font-bold uppercase">{r.nombre[0]}</span>
                  )}
                </a>
              ))}
            </span>

            <a href="#contacto" className="btn-oro !py-2.5 !px-5">
              Booking
            </a>
          </div>

          <button
            id="btnMenu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-oro"
            aria-label="Abrir menú"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 7h18M3 12h12M3 17h18" />
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div
            id="menuMovil"
            className="lg:hidden bg-noir/95 backdrop-blur-xl border-t border-oro/15 px-6 py-8 flex flex-col gap-6"
          >
            {isSectionVisible("bio") && <a onClick={() => setMobileMenuOpen(false)} className="nav-link" href="#bio">Bio</a>}
            {isSectionVisible("musica") && <a onClick={() => setMobileMenuOpen(false)} className="nav-link" href="#musica">Música</a>}
            {isSectionVisible("videos") && <a onClick={() => setMobileMenuOpen(false)} className="nav-link" href="#videos">Videos</a>}
            {isSectionVisible("galeria") && <a onClick={() => setMobileMenuOpen(false)} className="nav-link" href="#galeria">Galería</a>}
            {isSectionVisible("eventos") && <a onClick={() => setMobileMenuOpen(false)} className="nav-link" href="#eventos">Eventos</a>}
            {isSectionVisible("documentos") && docs?.items?.length > 0 && <a onClick={() => setMobileMenuOpen(false)} className="nav-link" href="#documentos">Descargas</a>}
            {isSectionVisible("contacto") && <a onClick={() => setMobileMenuOpen(false)} className="nav-link" href="#contacto">Contacto</a>}
            <div className="pt-4 border-t border-oro/15">
              <p className="font-head text-[.6rem] tracking-[.45em] uppercase text-oro mb-4">Síguelo en redes</p>
              <div className="flex flex-wrap gap-3">
                {redes.redes.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip-red"
                  >
                    {r.nombre}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ============ BARRA SOCIAL FIJA ============ */}
      <div className="social-rail hidden xl:flex" aria-label="Redes sociales de Mando G">
        <span className="rail-txt">Síguelo</span>
        <span className="rail-linea" />
        {redes.redes.filter((r) => r.activo).map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={r.nombre}
            title={r.nombre}
          >
            {r.red === "instagram" && (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="#D4AF37"/></svg>
            )}
            {r.red === "facebook" && (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.7"><path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5v4h3v7h4v-7h3l1-4h-4V7.8c0-.9.6-1.3 1.3-1.3H15z"/></svg>
            )}
            {r.red === "spotify" && (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M7.5 10.2c3-.9 6.5-.6 9 .9M8 13.2c2.4-.7 5-.4 7 .8M8.6 16c1.8-.5 3.6-.3 5.2.6"/></svg>
            )}
            {r.red === "apple" && (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.7"><path d="M9 18V6.5L19 4.5V16"/><circle cx="6.8" cy="18" r="2.4"/><circle cx="16.8" cy="16" r="2.4"/></svg>
            )}
            {r.red === "youtube" && (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.7"><rect x="2.5" y="6" width="19" height="12" rx="3.5"/><path d="M10.5 9.5v5l4.5-2.5z" fill="#D4AF37" stroke="none"/></svg>
            )}
            {r.red === "tiktok" && (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.7"><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.6 2 4.3 4.5 4.6"/></svg>
            )}
          </a>
        ))}
        <span className="rail-linea" style={{ background: "linear-gradient(0deg,#D4AF37,transparent)" }} />
      </div>

      {/* ============ 1. HERO ============ */}
      <header id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Fondo: muro de prensa, vinilo 2Sik y sello */}
        <div className="muro" aria-hidden="true">
          <span className="sello-pk text-[19vw] md:text-[13vw]" style={{ left: "-3%", bottom: "4%" }}>
            {hero.badgeAno || "PRESS KIT · 2026"}
          </span>

          <img
            className="poster-item hidden md:block"
            src="https://i.scdn.co/image/ab67616d0000b27391b6a97aca848aadf085602e"
            alt=""
            style={{ width: "215px", height: "215px", left: "3%", top: "14%", transform: "rotate(-7deg)" }}
            loading="lazy"
          />
          <img
            className="poster-item"
            src="https://i.scdn.co/image/ab67616d0000b273db0a0151a4ca77c5a5527bdf"
            alt=""
            style={{ width: "180px", height: "180px", left: "22%", top: "6%", transform: "rotate(4deg)" }}
            loading="lazy"
          />
          <img
            className="poster-item hidden md:block"
            src="https://i.scdn.co/image/ab67616d0000b273984b108d829c4a10e8bc184c"
            alt=""
            style={{ width: "160px", height: "160px", left: "9%", bottom: "22%", transform: "rotate(6deg)" }}
            loading="lazy"
          />
          <img
            className="poster-item hidden lg:block"
            src="https://i.scdn.co/image/ab67616d0000b2739368aa657073efc807dcae74"
            alt=""
            style={{ width: "190px", height: "190px", left: "38%", bottom: "9%", transform: "rotate(-4deg)" }}
            loading="lazy"
          />
          <img
            className="poster-item hidden lg:block"
            src="https://i.scdn.co/image/ab67616d0000b273fdcbd476c7e8ad1ab50da005"
            alt=""
            style={{ width: "170px", height: "170px", right: "26%", top: "9%", transform: "rotate(5deg)" }}
            loading="lazy"
          />

          {/* Vinilo 2Sik Music */}
          <svg
            className="vinilo w-[380px] h-[380px] md:w-[560px] md:h-[560px]"
            style={{ right: "-120px", top: "6%", opacity: 0.2 }}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="97" fill="#0B0B0B" stroke="rgba(212,175,55,.4)" strokeWidth="1.5" />
            <g stroke="rgba(233,228,214,.08)" fill="none">
              <circle cx="100" cy="100" r="88" /><circle cx="100" cy="100" r="80" /><circle cx="100" cy="100" r="72" />
              <circle cx="100" cy="100" r="64" /><circle cx="100" cy="100" r="56" /><circle cx="100" cy="100" r="48" />
            </g>
            <path d="M30 100a70 70 0 0 1 70-70" stroke="rgba(233,228,214,.22)" strokeWidth="2" fill="none" />
            <path d="M170 100a70 70 0 0 1-70 70" stroke="rgba(233,228,214,.14)" strokeWidth="2" fill="none" />
            <circle cx="100" cy="100" r="33" fill="#0B2A6B" />
            <circle cx="100" cy="100" r="33" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
            <text x="100" y="95" textAnchor="middle" fontFamily="Bebas Neue, sans-serif" fontSize="13" letterSpacing="2" fill="#F0D67E">2SIK MUSIC</text>
            <text x="100" y="112" textAnchor="middle" fontFamily="Oswald, sans-serif" fontSize="7.5" letterSpacing="3" fill="rgba(233,228,214,.85)">MANDO G</text>
            <circle cx="100" cy="100" r="3.5" fill="#050505" stroke="rgba(212,175,55,.6)" />
          </svg>
        </div>

        {/* Salpicaduras de spray */}
        <svg className="spray w-[520px] h-[520px] -left-40 top-16 text-selva" viewBox="0 0 160 140" fill="currentColor" style={{ opacity: 0.35 }} aria-hidden="true"><use href="#salpicadura" /></svg>
        <svg className="spray w-[340px] h-[340px] right-[8%] bottom-[6%] text-oroSombra" viewBox="0 0 160 140" fill="currentColor" style={{ opacity: 0.28 }} aria-hidden="true"><use href="#salpicadura" transform="rotate(140 80 70)" /></svg>

        <span className="txt-contorno absolute -left-3 top-1/2 -translate-y-1/2 text-[24vh] hidden md:block" style={{ writingMode: "vertical-rl" }} aria-hidden="true">
          EST·2007
        </span>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <span className="inline-flex items-center gap-4">
              <span className="cinta" style={{ transform: "rotate(-2deg)" }}>{hero.badgeAno}</span>
              <span className="eq" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            </span>

            <h1 className="mt-7" aria-label="Mando G">
              <img
                src={hero.heroLogoImage || "/assets/logo-mg-hd.png"}
                alt="Logo oficial Mando G"
                className="titulo-imagen"
                loading="eager"
              />
              <span className="block font-display text-5xl md:text-6xl tracking-[.14em] text-hueso mt-5">
                {hero.nombre} <span className="text-oro">{hero.inicial}</span>
              </span>
            </h1>

            <p className="font-head font-light text-hueso/75 tracking-[.3em] uppercase text-sm mt-6 max-w-lg">
              {hero.subtitulo}
            </p>
            <p className="text-hueso/50 font-light text-sm mt-4 max-w-md leading-relaxed">
              {hero.descripcion}
            </p>

            <div className="flex flex-wrap gap-5 mt-9">
              <a
                href={hero.ctaPrimaryUrl || "https://open.spotify.com/artist/7lHwxJADraMnwr1FqgYlyv"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-oro"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                {hero.ctaPrimaryText || "Escuchar ahora"}
              </a>
              <a href={hero.ctaSecondaryUrl || "#contacto"} className="btn-fantasma">
                {hero.ctaSecondaryText || "Contrataciones"}
              </a>
            </div>

            <div className="mt-8">
              <p className="font-head text-[.58rem] tracking-[.5em] uppercase text-oro/80 mb-3">Síguelo en redes</p>
              <div className="flex flex-wrap items-center gap-3">
                {redes.redes.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-red"
                    aria-label={r.nombre}
                    title={r.nombre}
                  >
                    {r.red === "instagram" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/></svg>
                    )}
                    {r.red === "facebook" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5v4h3v7h4v-7h3l1-4h-4V7.8c0-.9.6-1.3 1.3-1.3H15z"/></svg>
                    )}
                    {r.red === "spotify" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M7.5 10.2c3-.9 6.5-.6 9 .9M8 13.2c2.4-.7 5-.4 7 .8M8.6 16c1.8-.5 3.6-.3 5.2.6"/></svg>
                    )}
                    {r.red === "youtube" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2.5" y="6" width="19" height="12" rx="3.5"/><path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none"/></svg>
                    )}
                    {r.red === "apple" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 18V6.5L19 4.5V16"/><circle cx="6.8" cy="18" r="2.4"/><circle cx="16.8" cy="16" r="2.4"/></svg>
                    )}
                    {r.red === "tiktok" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.6 2 4.3 4.5 4.6"/></svg>
                    )}
                  </a>
                ))}
                <span className="font-head text-[.6rem] tracking-[.35em] uppercase text-hueso/50 ml-1">
                  {redes.qrCard.usuario || "@itsmandog"}
                </span>
              </div>
            </div>
          </div>

          {/* Fotografía principal */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <span className="sello absolute -top-4 right-2 md:right-8 z-20">{hero.stamp}</span>
            <div
              className="relative w-full max-w-[500px] mx-auto border border-oro/45 bg-black p-2 md:p-3 shadow-[0_30px_90px_rgba(8,38,105,.48)]"
              style={{ clipPath: "polygon(0 0,100% 0,100% 96%,96% 100%,0 100%)" }}
            >
              <img
                src={hero.heroImage || "/assets/mando-g-hero.jpg"}
                alt="Mando G"
                id="heroLogo"
                className="w-full aspect-[4/5] object-cover"
                style={{ objectPosition: "50% 34%" }}
                loading="eager"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,transparent 60%,rgba(5,5,5,.45))" }} />
            </div>
            <span className="cinta absolute bottom-3 left-1/2 -translate-x-1/2 z-20" style={{ transform: "translateX(-50%) rotate(1.5deg)" }}>
              {hero.badgeSub}
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="font-head text-[.58rem] tracking-[.5em] uppercase text-oro/70">Desliza</span>
          <div className="scroll-ind" />
        </div>
      </header>

      {/* Marquesinas cruzadas */}
      <div className="relative py-2" aria-hidden="true">
        <div className="marquee bg-selvaProfunda/50 border-y border-oro/15 py-3.5" style={{ transform: "rotate(-1.1deg) scale(1.02)" }}>
          <div className="marquee-track">
            <span className="font-display text-2xl md:text-3xl tracking-[.18em] text-oro/85 whitespace-nowrap px-5">
              {marquee.linea1}&nbsp;
            </span>
            <span className="font-display text-2xl md:text-3xl tracking-[.18em] text-oro/85 whitespace-nowrap px-5">
              {marquee.linea1}&nbsp;
            </span>
          </div>
        </div>
        <div className="marquee bg-noir border-b border-oro/10 py-2.5" style={{ transform: "rotate(.7deg) scale(1.02)" }}>
          <div className="marquee-track reversa">
            <span className="font-head text-[.68rem] tracking-[.5em] uppercase text-hueso/40 whitespace-nowrap px-5">
              {marquee.linea2}&nbsp;
            </span>
            <span className="font-head text-[.68rem] tracking-[.5em] uppercase text-hueso/40 whitespace-nowrap px-5">
              {marquee.linea2}&nbsp;
            </span>
          </div>
        </div>
      </div>

      {/* ============ 2. BIOGRAFÍA ============ */}
      {isSectionVisible("bio") && (
        <section id="bio" className="relative py-28 md:py-40 overflow-hidden">
          <span className="lateral absolute right-4 top-32 hidden lg:block">Archivo de prensa · Documento 01</span>
          <span className="txt-contorno absolute -right-6 top-8 text-[26vw] md:text-[18vw]" aria-hidden="true">BIO</span>
          <svg className="spray w-[420px] h-[420px] left-[30%] bottom-0 text-selva" viewBox="0 0 160 140" fill="currentColor" style={{ opacity: 0.2 }} aria-hidden="true"><use href="#salpicadura" transform="rotate(70 80 70)" /></svg>

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative z-10">
            <figure className="md:col-span-5 reveal relative" style={{ transform: "rotate(-1.2deg)" }}>
              <span className="cinta absolute -top-3 left-6 z-20" style={{ transform: "rotate(-3deg)" }}>
                {bio.cintaTexto}
              </span>
              <div className="marco-duotono border border-oro/25">
                <img
                  src={bio.foto}
                  alt="Mando G"
                  className="w-full object-cover duotono"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-4 font-head text-[.62rem] tracking-[.4em] uppercase text-hueso/40">
                {bio.fotoCaption}
              </figcaption>
            </figure>

            <div className="md:col-span-7">
              <p className="eyebrow reveal mb-6">{bio.eyebrow}</p>
              <h2 className="font-display text-6xl md:text-8xl leading-[.85] text-hueso reveal">
                {bio.tituloPrincipal}<br />
                <span className="text-oro" style={{ display: "inline-block", transform: "rotate(-1deg)" }}>
                  {bio.tituloSecundario}
                </span>
              </h2>
              <div className="mt-8 space-y-6 text-hueso/70 leading-relaxed font-light reveal md:columns-2 md:gap-10">
                {bio.parrafos.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-8 reveal">
                {bio.stats?.map((st) => (
                  <div key={st.id} style={{ transform: `rotate(${st.rotacion || "0deg"})` }}>
                    <p className="font-display text-4xl text-oro">{st.numero}</p>
                    <p className="font-head text-[.58rem] tracking-[.35em] uppercase text-hueso/40 mt-1">
                      {st.etiqueta}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Divisor */}
      <svg className="goteo text-carbon" viewBox="0 0 1440 46" preserveAspectRatio="none" aria-hidden="true"><use href="#pathGoteo" fill="#0B0B0B" transform="scale(1,1.05)" /></svg>

      {/* ============ 3. MÚSICA ============ */}
      {isSectionVisible("musica") && (
        <section id="musica" className="relative py-24 md:py-32 bg-carbon overflow-hidden">
          <span className="lateral absolute left-4 top-32 hidden lg:block">Catálogo · 2Sik Music</span>
          <span className="txt-contorno absolute -left-4 -top-2 text-[24vw] md:text-[16vw]" aria-hidden="true">MÚSICA</span>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <p className="eyebrow reveal mb-6">{musica.eyebrow}</p>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <h2 className="font-display text-6xl md:text-8xl leading-[.85] text-hueso reveal">
                {musica.titulo} <span className="text-oro subrayado-spray">{musica.subrayado}</span>
              </h2>
              <a
                href={musica.spotifyArtistUrl || "https://open.spotify.com/artist/7lHwxJADraMnwr1FqgYlyv"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fantasma reveal"
              >
                Ver en Spotify
              </a>
            </div>

            {/* Reproductor Spotify principal */}
            {musica.spotifyEmbedUrl && (
              <div className="reveal mb-12 bloque p-2 md:p-3" style={{ transform: "rotate(-.4deg)" }}>
                <iframe
                  title="Mando G en Spotify"
                  style={{ borderRadius: "6px" }}
                  src={musica.spotifyEmbedUrl}
                  width="100%"
                  height="420"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}

            {/* Lanzamientos destacados */}
            <div className="grid md:grid-cols-3 gap-6">
              {musica.lanzamientosDestacados?.map((item) => (
                <article key={item.id} className="bloque p-2 reveal">
                  <p className="font-head text-[.6rem] tracking-[.4em] uppercase text-oro px-3 pt-3 pb-2">
                    {item.tipo}
                  </p>
                  <iframe
                    title={item.titulo}
                    style={{ borderRadius: "6px" }}
                    src={item.spotifyEmbedUrl}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </article>
              ))}
            </div>

            {/* Sencillos / Portadas */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
              {musica.sencillos?.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bloque group reveal"
                >
                  <img src={item.portada} alt={item.titulo} className="w-full aspect-square object-cover" loading="lazy" />
                  <p className="font-head text-[.6rem] tracking-[.3em] uppercase p-3 text-hueso/70 group-hover:text-oro transition-colors">
                    {item.titulo} · {item.ano}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divisor */}
      <svg className="goteo" viewBox="0 0 1440 46" preserveAspectRatio="none" aria-hidden="true"><use href="#pathGoteo" fill="#050505" /></svg>

      {/* ============ 4. VIDEOS ============ */}
      {isSectionVisible("videos") && (
        <section id="videos" className="relative py-24 md:py-32 overflow-hidden">
          <span className="lateral absolute right-4 top-32 hidden lg:block">Canal oficial · @itsMandoG</span>
          <span className="txt-contorno absolute -right-4 top-4 text-[24vw] md:text-[16vw]" aria-hidden="true">VIDEOS</span>
          <svg className="spray w-[380px] h-[380px] -left-24 bottom-10 text-oroSombra" viewBox="0 0 160 140" fill="currentColor" style={{ opacity: 0.22 }} aria-hidden="true"><use href="#salpicadura" transform="rotate(200 80 70)" /></svg>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <p className="eyebrow reveal mb-6">{videos.eyebrow}</p>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <h2 className="font-display text-6xl md:text-8xl leading-[.85] text-hueso reveal">
                {videos.titulo} <span className="text-oro">{videos.subrayado}</span>
              </h2>
              <a
                href={videos.youtubeChannelUrl || "https://youtube.com/@itsmandog"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fantasma reveal"
              >
                Canal de YouTube
              </a>
            </div>

            {/* Video oficial principal */}
            <div className="video-marco p-2 md:p-3 reveal" style={{ transform: "rotate(.25deg)" }}>
              <div id="videoStage" className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
                {videos.videoPrincipal.videoFileUrl ? (
                  <video
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                    controls
                    playsInline
                    poster={videos.videoPrincipal.posterUrl}
                  >
                    <source src={videos.videoPrincipal.videoFileUrl} type="video/mp4" />
                  </video>
                ) : (
                  <>
                    <img
                      src={videos.videoPrincipal.posterUrl}
                      alt={videos.videoPrincipal.titulo}
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
                    <div className="absolute inset-0 grid place-items-center">
                      <a
                        href={videos.videoPrincipal.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-oro bg-black/65 text-oro grid place-items-center hover:scale-105 transition"
                        aria-label="Abrir video oficial en YouTube"
                      >
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </a>
                    </div>
                    <div className="absolute left-5 right-5 bottom-5 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="font-display text-3xl md:text-5xl text-white">{videos.videoPrincipal.titulo}</p>
                        <p className="text-white/60 text-xs tracking-[.25em] uppercase mt-1">{videos.videoPrincipal.subtitulo}</p>
                      </div>
                      <a
                        href={videos.videoPrincipal.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-oro !py-2.5 !px-5"
                      >
                        Abrir en YouTube
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-center text-hueso/40 text-xs mt-4 tracking-wide">
              Presiona la portada para abrir el video oficial directamente en YouTube.
            </p>

            {/* Videos secundarios */}
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {videos.videosSecundarios?.map((v, i) => (
                <a
                  key={v.id}
                  href={v.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-marco p-2 group reveal block"
                  style={{ transform: `rotate(${i % 2 === 0 ? "-.35deg" : ".35deg"})` }}
                >
                  <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={v.posterUrl}
                      alt={v.titulo}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="w-14 h-14 rounded-full border-2 border-oro bg-black/65 text-oro grid place-items-center group-hover:scale-110 transition">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </span>
                    </div>
                    <p className="absolute left-4 bottom-3 font-display text-2xl text-white">{v.titulo}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Enlaces al canal */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {videos.enlacesCanal?.map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bloque p-7 group reveal"
                >
                  <p className="font-display text-3xl text-hueso group-hover:text-oro transition-colors">{c.titulo}</p>
                  <p className="text-hueso/50 text-sm mt-2 font-light">{c.subtitulo}</p>
                  <span className="inline-block mt-5 font-head text-[.6rem] tracking-[.4em] uppercase text-oro">
                    {c.cta}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divisor */}
      <svg className="goteo" viewBox="0 0 1440 46" preserveAspectRatio="none" aria-hidden="true"><use href="#pathGoteo" fill="#0B0B0B" /></svg>

      {/* ============ 5. GALERÍA ============ */}
      {isSectionVisible("galeria") && (
        <section id="galeria" className="relative py-24 md:py-32 bg-carbon overflow-hidden">
          <span className="lateral absolute left-4 top-32 hidden lg:block">Material de prensa · Uso editorial</span>
          <span className="txt-contorno absolute -left-4 top-4 text-[22vw] md:text-[15vw]" aria-hidden="true">GALERÍA</span>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <p className="eyebrow reveal mb-6">{galeria.eyebrow}</p>
            <h2 className="font-display text-6xl md:text-8xl leading-[.85] text-hueso mb-12 reveal">
              {galeria.titulo} <span className="text-oro subrayado-spray">{galeria.subrayado}</span>
            </h2>

            <div className="masonry reveal">
              {galeria.items?.map((item) => (
                <figure key={item.id} data-lb>
                  <img src={item.url} alt={item.caption} loading="lazy" />
                  <figcaption>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divisor */}
      <svg className="goteo" viewBox="0 0 1440 46" preserveAspectRatio="none" aria-hidden="true"><use href="#pathGoteo" fill="#050505" /></svg>

      {/* ============ 6. EVENTOS ============ */}
      {isSectionVisible("eventos") && (
        <section id="eventos" className="relative py-24 md:py-32 overflow-hidden">
          <span className="txt-contorno absolute -right-4 top-6 text-[20vw] md:text-[14vw]" aria-hidden="true">SHOWS</span>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <p className="eyebrow reveal mb-6">{eventos.eyebrow}</p>
            <h2 className="font-display text-6xl md:text-8xl leading-[.85] text-hueso mb-16 reveal">
              {eventos.titulo} <span className="text-oro">{eventos.subrayado}</span>
            </h2>

            <div className="timeline space-y-14 pl-14 md:pl-0">
              {eventos.eventos?.map((ev) => (
                <article key={ev.id} className="relative reveal md:grid md:grid-cols-2 md:gap-14">
                  <span className="nodo-eslabon" />
                  <div className="md:text-right md:pr-4">
                    <p className="font-display text-5xl text-oro leading-none">
                      {ev.mes}<span className="text-hueso"> {ev.ano}</span>
                    </p>
                    <p className="font-head text-[.62rem] tracking-[.4em] uppercase text-hueso/40 mt-2">
                      {ev.estadoFecha}
                    </p>
                  </div>
                  <div
                    className={`bloque p-6 mt-4 md:mt-0 ${ev.destacado ? "!border-oro/45" : ""}`}
                    style={{ transform: "rotate(-.4deg)" }}
                  >
                    <p className={`font-display text-2xl ${ev.destacado ? "text-oro" : "text-hueso"}`}>{ev.titulo}</p>
                    <p className="text-hueso/55 text-sm mt-2 font-light">{ev.ubicacion}</p>
                    <a
                      href={ev.linkUrl || "#contacto"}
                      className={ev.destacado ? "btn-oro !py-2.5 !px-5 mt-5 inline-block" : "inline-block mt-4 font-head text-[.6rem] tracking-[.4em] uppercase text-oro"}
                    >
                      {ev.linkTexto}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ DESCARGAS DE PRENSA (NUEVO CMS FEATURE) ============ */}
      {isSectionVisible("documentos") && docs?.items?.length > 0 && (
        <section id="documentos" className="relative py-20 bg-carbon border-y border-oro/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <p className="eyebrow reveal mb-4">{docs.eyebrow}</p>
            <h2 className="font-display text-5xl md:text-7xl leading-[.85] text-hueso mb-6 reveal">
              {docs.titulo}
            </h2>
            <p className="text-hueso/60 text-sm max-w-xl mb-10 font-light reveal">
              {docs.descripcion}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {docs.items.map((doc) => (
                <div key={doc.id} className="bloque p-6 flex flex-col justify-between reveal">
                  <div>
                    <span className="cinta !py-1 !px-2 text-[.55rem] text-oro">{doc.tamano || "Descargable"}</span>
                    <h3 className="font-display text-2xl text-hueso mt-4">{doc.titulo}</h3>
                    <p className="text-hueso/50 text-xs mt-2 font-light leading-relaxed">{doc.descripcion}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-oro/15 flex items-center justify-between">
                    <span className="text-[.6rem] font-head uppercase tracking-wider text-hueso/40">{doc.fecha}</span>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="btn-oro !py-2 !px-4 text-[.65rem]"
                    >
                      Descargar ↓
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ 7. REDES SOCIALES ============ */}
      {isSectionVisible("redes") && (
        <section id="redes" className="relative py-20 bg-selvaProfunda/25 border-y border-oro/10 overflow-hidden">
          <svg className="spray w-[300px] h-[300px] right-6 -top-16 text-selva" viewBox="0 0 160 140" fill="currentColor" style={{ opacity: 0.3 }} aria-hidden="true"><use href="#salpicadura" /></svg>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <p className="eyebrow reveal mb-6">{redes.eyebrow}</p>
            <h2 className="font-display text-5xl md:text-7xl leading-[.85] text-hueso mb-12 reveal">
              {redes.titulo} <span className="text-oro subrayado-spray">{redes.subrayado}</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {redes.redes.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="red-social bloque p-7 flex flex-col items-center gap-3 reveal"
                >
                  {r.red === "instagram" && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="#D4AF37"/></svg>
                  )}
                  {r.red === "facebook" && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6"><path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5v4h3v7h4v-7h3l1-4h-4V7.8c0-.9.6-1.3 1.3-1.3H15z"/></svg>
                  )}
                  {r.red === "spotify" && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M7.5 10.2c3-.9 6.5-.6 9 .9M8 13.2c2.4-.7 5-.4 7 .8M8.6 16c1.8-.5 3.6-.3 5.2.6"/></svg>
                  )}
                  {r.red === "apple" && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6"><path d="M9 18V6.5L19 4.5V16"/><circle cx="6.8" cy="18" r="2.4"/><circle cx="16.8" cy="16" r="2.4"/></svg>
                  )}
                  {r.red === "youtube" && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6"><rect x="2.5" y="6" width="19" height="12" rx="3.5"/><path d="M10.5 9.5v5l4.5-2.5z" fill="#D4AF37" stroke="none"/></svg>
                  )}
                  {r.red === "tiktok" && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6"><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.6 2 4.3 4.5 4.6"/></svg>
                  )}
                  <span className="font-head text-[.62rem] tracking-[.35em] uppercase text-hueso/80">{r.nombre}</span>
                </a>
              ))}
            </div>

            {/* QR Instagram */}
            <div className="mt-12 grid md:grid-cols-2 gap-10 items-center reveal">
              <div className="qr-card bloque p-8" style={{ transform: "rotate(-.6deg)" }}>
                <span className="cinta absolute -top-3 left-8 z-20" style={{ transform: "rotate(-2.5deg)" }}>
                  {redes.qrCard.etiqueta}
                </span>
                <a href={redes.qrCard.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Mando G">
                  <img src={redes.qrCard.qrImage || "/assets/qr-instagram.jpg"} alt="Código QR Instagram @itsmandog" loading="lazy" />
                </a>
              </div>
              <div>
                <p className="font-display text-5xl md:text-6xl leading-[.9] text-hueso">{redes.qrCard.titulo}</p>
                <p className="text-hueso/60 font-light leading-relaxed mt-5 max-w-md">{redes.qrCard.descripcion}</p>
                <a href={redes.qrCard.url} target="_blank" rel="noopener noreferrer" className="btn-fantasma mt-7">
                  {redes.qrCard.usuario} →
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ 8. CONTACTO ============ */}
      {isSectionVisible("contacto") && (
        <section id="contacto" className="relative py-24 md:py-32 overflow-hidden">
          <span className="txt-contorno absolute -left-4 bottom-4 text-[20vw] md:text-[14vw]" aria-hidden="true">BOOKING</span>
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <p className="eyebrow reveal mb-6">{contacto.eyebrow}</p>
              <h2 className="font-display text-6xl md:text-8xl leading-[.85] text-hueso reveal">
                {contacto.titulo} <span className="text-oro" style={{ display: "inline-block", transform: "rotate(-1.2deg)" }}>{contacto.subrayado}</span>
              </h2>
              <p className="text-hueso/60 font-light leading-relaxed mt-8 max-w-md reveal">
                {contacto.descripcion}
              </p>

              <div className="mt-10 space-y-5 reveal">
                <a
                  href={`https://wa.me/${contacto.whatsappNumero}?text=Hola%2C%20me%20interesa%20contratar%20a%20Mando%20G`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <span className="w-12 h-12 grid place-items-center border border-oro/30 group-hover:border-oro group-hover:bg-selva/30 transition-all" style={{ transform: "rotate(-3deg)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M8.8 9.2c.3 2.7 3.2 5.6 5.9 5.9l1.4-1.4-2-1.3-1 .7c-.8-.4-1.9-1.5-2.3-2.3l.7-1-1.3-2z"/></svg>
                  </span>
                  <div>
                    <p className="font-head text-[.6rem] tracking-[.4em] uppercase text-oro">WhatsApp</p>
                    <p className="text-hueso/80 text-sm">{contacto.whatsappTexto}</p>
                  </div>
                </a>

                <a href={`mailto:${contacto.email}`} className="flex items-center gap-4 group">
                  <span className="w-12 h-12 grid place-items-center border border-oro/30 group-hover:border-oro group-hover:bg-selva/30 transition-all" style={{ transform: "rotate(2deg)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                  </span>
                  <div>
                    <p className="font-head text-[.6rem] tracking-[.4em] uppercase text-oro">Correo</p>
                    <p className="text-hueso/80 text-sm">{contacto.email}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Formulario Booking */}
            <form onSubmit={handleBookingSubmit} className="bloque p-8 md:p-10 space-y-5 reveal" style={{ transform: "rotate(.3deg)" }} noValidate>
              <span className="cinta" style={{ transform: "rotate(-2deg)" }}>{contacto.cintaTiempo}</span>
              <p className="font-display text-3xl text-hueso pt-1">{contacto.formTitulo}</p>
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  className="campo"
                  type="text"
                  placeholder="Tu nombre *"
                  value={formValues.nombre}
                  onChange={(e) => setFormValues({ ...formValues, nombre: e.target.value })}
                  required
                />
                <input
                  className="campo"
                  type="text"
                  placeholder="Empresa / evento"
                  value={formValues.empresa}
                  onChange={(e) => setFormValues({ ...formValues, empresa: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  className="campo"
                  type="text"
                  placeholder="Ciudad del evento *"
                  value={formValues.ciudad}
                  onChange={(e) => setFormValues({ ...formValues, ciudad: e.target.value })}
                  required
                />
                <input
                  className="campo"
                  type="text"
                  placeholder="Fecha tentativa"
                  value={formValues.fecha}
                  onChange={(e) => setFormValues({ ...formValues, fecha: e.target.value })}
                />
              </div>
              <select
                className="campo"
                value={formValues.tipo}
                onChange={(e) => setFormValues({ ...formValues, tipo: e.target.value })}
              >
                <option value="Show en vivo">Show en vivo</option>
                <option value="Festival">Festival</option>
                <option value="Evento privado">Evento privado</option>
                <option value="Colaboración / feature">Colaboración / feature</option>
                <option value="Prensa / entrevista">Prensa / entrevista</option>
              </select>
              <textarea
                className="campo"
                rows={4}
                placeholder="Cuéntanos sobre tu evento *"
                value={formValues.mensaje}
                onChange={(e) => setFormValues({ ...formValues, mensaje: e.target.value })}
                required
              />
              <button type="submit" className="btn-oro w-full justify-center">
                Enviar por WhatsApp
              </button>
              {formError && (
                <p className="text-oro text-xs font-head tracking-[.25em] uppercase text-center">
                  Completa los campos marcados con *
                </p>
              )}
            </form>
          </div>
        </section>
      )}

      {/* ============ 9. FOOTER ============ */}
      <footer className="relative border-t border-oro/15 bg-carbon overflow-hidden">
        <svg className="spray w-[260px] h-[260px] -left-16 bottom-0 text-selva" viewBox="0 0 160 140" fill="currentColor" style={{ opacity: 0.25 }} aria-hidden="true"><use href="#salpicadura" transform="rotate(40 80 70)" /></svg>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <a href="#inicio" className="flex items-center" aria-label="Volver arriba">
              <div>
                <p className="font-display text-3xl tracking-widest text-hueso leading-none">
                  {hero.nombre} <span className="text-oro">{hero.inicial}</span>
                </p>
                <p className="font-head text-[.58rem] tracking-[.45em] uppercase text-hueso/40 mt-1">2Sik Music · Est. 2007</p>
              </div>
            </a>
            <nav className="flex flex-wrap justify-center gap-3" aria-label="Redes sociales">
              {redes.redes.map((r) => (
                <a key={r.id} className="chip-red" href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.nombre}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-12 pt-8 border-t border-oro/10 flex flex-col md:flex-row items-center justify-between gap-4 text-hueso/35 text-xs font-light">
            <p>© {new Date().getFullYear()} Mando G · 2Sik Music. Todos los derechos reservados.</p>
            <div className="flex items-center gap-6">
              <p className="font-head tracking-[.35em] uppercase text-[.58rem]">Ecatepec ↔ South Omaha</p>
              {/* Acceso seguro al panel de administración */}
              <Link
                href="/admin"
                className="text-oro/50 hover:text-oro font-head text-[.6rem] tracking-widest uppercase transition-colors flex items-center gap-1.5"
                title="Acceso administrativo"
              >
                <span>Acceso Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

