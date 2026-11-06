"use client";

import { useEffect, useState } from "react";

export default function InteractiveEffects() {
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    // 1. Cursor personalizado y glow
    const dot = document.querySelector(".cursor-dot") as HTMLElement | null;
    const halo = document.querySelector(".cursor-halo") as HTMLElement | null;
    const glow = document.getElementById("glowMouse") as HTMLElement | null;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let hx = mx;
    let hy = my;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
      }
      if (glow) {
        glow.style.left = mx + "px";
        glow.style.top = my + "px";
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let animId: number;
    const seguir = () => {
      hx += (mx - hx) * 0.14;
      hy += (my - hy) * 0.14;
      if (halo) {
        halo.style.left = hx + "px";
        halo.style.top = hy + "px";
      }
      animId = requestAnimationFrame(seguir);
    };
    animId = requestAnimationFrame(seguir);

    const interactiveEls = document.querySelectorAll("a, button, [data-lb]");
    const onEnter = () => document.body.classList.add("cursor-activo");
    const onLeave = () => document.body.classList.remove("cursor-activo");

    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // 2. Spotlight en bloques
    const bloques = document.querySelectorAll(".bloque") as NodeListOf<HTMLElement>;
    const onBloqueMove = function (this: HTMLElement, e: MouseEvent) {
      const r = this.getBoundingClientRect();
      this.style.setProperty("--mx", e.clientX - r.left + "px");
      this.style.setProperty("--my", e.clientY - r.top + "px");
    };

    bloques.forEach((b) => {
      b.addEventListener("mousemove", onBloqueMove, { passive: true });
    });

    // 3. Scroll nav sólido
    const nav = document.getElementById("nav");
    const onScroll = () => {
      if (nav) {
        nav.classList.toggle("solido", window.scrollY > 40);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // 4. Reveal on scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("reveal-listo");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // 5. Lightbox listener
    const onLbClick = (e: Event) => {
      const target = (e.currentTarget as HTMLElement).querySelector("img");
      if (target) {
        setLightboxImg({ src: target.src, alt: target.alt || "" });
        document.body.style.overflow = "hidden";
      }
    };

    const lbFigures = document.querySelectorAll("[data-lb]");
    lbFigures.forEach((f) => f.addEventListener("click", onLbClick));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxImg(null);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      bloques.forEach((b) => b.removeEventListener("mousemove", onBloqueMove));
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      lbFigures.forEach((f) => f.removeEventListener("click", onLbClick));
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeLb = () => {
    setLightboxImg(null);
    document.body.style.overflow = "";
  };

  return (
    <>
      <div className="cursor-halo" />
      <div className="cursor-dot" />
      <div className="glow-mouse" id="glowMouse" />

      {/* Lightbox modal */}
      <div
        id="lightbox"
        role="dialog"
        aria-label="Vista ampliada"
        className={lightboxImg ? "abierto" : ""}
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName !== "IMG") closeLb();
        }}
      >
        <button
          onClick={closeLb}
          className="absolute top-6 right-6 text-oro font-head tracking-[.3em] text-xs uppercase hover:underline"
          aria-label="Cerrar vista previa"
        >
          Cerrar ✕
        </button>
        {lightboxImg && (
          <img
            src={lightboxImg.src}
            alt={lightboxImg.alt}
            className="max-w-[88vw] max-h-[82vh] border border-oro/40 shadow-2xl"
          />
        )}
      </div>
    </>
  );
}

