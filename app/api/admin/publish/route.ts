import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { publishContent } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { note } = await req.json().catch(() => ({ note: "Publicado desde panel admin" }));
    const published = await publishContent(note || "Publicación manual", session.username);

    // Revalidar la página principal inmediatamente
    try {
      revalidatePath("/");
    } catch (e) {
      // Revalidación ignorada si no está en contexto estático
    }

    return NextResponse.json({
      success: true,
      message: "Contenido publicado exitosamente en la página pública.",
      version: published.version,
      updatedAt: published.updatedAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al publicar cambios." }, { status: 500 });
  }
}

