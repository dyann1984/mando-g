import type { Metadata, Viewport } from "next";
import { getPublishedContent } from "@/lib/db";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedContent();
  const seo = content.seo || {
    title: "Mando G | Press Kit Oficial — Hip Hop Bilingüe | 2Sik Music",
    description: "Press Kit oficial de Mando G. Rapero bilingüe (ES/EN) de Ecatepec, Estado de México, criado en South Omaha, Nebraska.",
    keywords: "Mando G, hip hop mexicano, rap bilingüe, 2Sik Music, Border Hoppin",
    canonicalUrl: "https://mandog.vercel.app/",
    ogImage: "/assets/logo-mg-hd.png",
  };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Mando G / 2Sik Music" }],
    metadataBase: new URL(seo.canonicalUrl || "https://mandog.vercel.app/"),
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      type: "profile",
      url: seo.canonicalUrl,
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: seo.ogImage,
          width: 989,
          height: 940,
          alt: "Mando G",
        },
      ],
      locale: "es_MX",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
    icons: {
      icon: "/assets/logo-mg-hd.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Permanent+Marker&family=Black+Ops+One&family=Rubik+Dirt&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain antialiased selection:bg-selva selection:text-oroClaro">
        {/* SVG DEFS: goteo + salpicadura */}
        <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
          <defs>
            <path
              id="pathGoteo"
              d="M0,0 H1440 V6 q-30,0 -34,22 q-3,14 -9,14 q-7,0 -8,-20 q-2,-16 -22,-16 h-120 q-18,0 -20,26 q-2,18 -8,18 q-7,0 -9,-26 q-1,-18 -22,-18 h-180 q-16,0 -18,14 q-3,30 -10,30 q-8,0 -9,-32 q-1,-12 -20,-12 h-140 q-22,0 -24,18 q-2,12 -7,12 q-6,0 -8,-16 q-2,-14 -24,-14 h-200 q-14,0 -16,24 q-2,20 -9,20 q-8,0 -9,-24 q-1,-20 -21,-20 h-130 q-20,0 -21,12 q-3,26 -10,26 q-7,0 -8,-24 q-2,-14 -22,-14 h-160 q-16,0 -18,20 q-2,10 -7,10 q-6,0 -7,-14 q-2,-16 -24,-16 H0 Z"
            />
            <g id="salpicadura">
              <circle cx="60" cy="60" r="34" />
              <circle cx="118" cy="42" r="9" />
              <circle cx="132" cy="78" r="5" />
              <circle cx="20" cy="98" r="7" />
              <circle cx="98" cy="108" r="4" />
              <circle cx="10" cy="40" r="4" />
              <circle cx="145" cy="20" r="3" />
              <circle cx="80" cy="4" r="5" />
              <circle cx="40" cy="128" r="3" />
              <circle cx="150" cy="112" r="6" />
              <circle cx="4" cy="70" r="2.5" />
              <circle cx="112" cy="132" r="2.5" />
            </g>
          </defs>
        </svg>

        {children}
      </body>
    </html>
  );
}

