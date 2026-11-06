import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMediaLibrary, deleteMediaItem } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const media = await getMediaLibrary();
  const filtered = category && category !== "todos"
    ? media.filter((m) => m.category === category)
    : media;

  return NextResponse.json({ media: filtered });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de archivo requerido." }, { status: 400 });
    }

    const success = await deleteMediaItem(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al eliminar archivo." }, { status: 500 });
  }
}

