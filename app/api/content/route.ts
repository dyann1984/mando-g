import { NextResponse } from "next/server";
import { getPublishedContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getPublishedContent();
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "public, s-maxage=1, stale-while-revalidate=59",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al obtener contenido." }, { status: 500 });
  }
}

