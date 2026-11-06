import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDraftContent, getPublishedContent, saveDraftContent } from "@/lib/db";
import { PressKitData } from "@/types/presskit";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const [draft, published] = await Promise.all([
    getDraftContent(),
    getPublishedContent(),
  ]);

  return NextResponse.json({
    draft,
    publishedVersion: published.version,
    publishedUpdatedAt: published.updatedAt,
  });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const data: PressKitData = await req.json();

    if (!data || !data.hero || !data.bio || !data.musica) {
      return NextResponse.json({ error: "Estructura de datos incompleta." }, { status: 400 });
    }

    const success = await saveDraftContent(data);
    if (!success) {
      return NextResponse.json({ error: "No se pudo guardar el borrador." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Borrador guardado exitosamente.",
      updatedAt: data.updatedAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al actualizar borrador." }, { status: 500 });
  }
}

