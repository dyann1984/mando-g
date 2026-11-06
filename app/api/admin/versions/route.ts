import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getVersions, restoreVersion, publishContent } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const versions = await getVersions();
  return NextResponse.json({ versions });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { versionId, autoPublish } = await req.json();
    if (!versionId) {
      return NextResponse.json({ error: "ID de versión requerido." }, { status: 400 });
    }

    const restored = await restoreVersion(versionId);
    if (!restored) {
      return NextResponse.json({ error: "Versión no encontrada." }, { status: 404 });
    }

    if (autoPublish) {
      await publishContent(`Restauración de versión ${versionId}`, session.username);
      try {
        revalidatePath("/");
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: autoPublish
        ? "Versión restaurada y publicada en el sitio público."
        : "Versión cargada en borrador. Revisa y pulsa Publicar.",
      data: restored,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al restaurar versión." }, { status: 500 });
  }
}

