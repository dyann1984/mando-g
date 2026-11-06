import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";


export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as any) || "general";

    if (!file) {
      return NextResponse.json({ error: "No se seleccionó ningún archivo." }, { status: 400 });
    }

    // Validar extensiones y tipos permitidos
    const allowedMime = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
    ];

    if (!allowedMime.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido: ${file.type}. Formatos válidos: JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, PDF, ZIP.` },
        { status: 400 }
      );
    }

    // Validar tamaño máximo
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "El archivo excede el tamaño máximo permitido (50MB)." }, { status: 400 });
    }

    const result = await uploadFile(file, category);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Error al procesar el archivo." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      item: result.item,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error en el servidor de carga." }, { status: 500 });
  }
}
