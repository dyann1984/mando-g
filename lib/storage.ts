import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MediaItem } from "@/types/presskit";
import { saveMediaItem } from "@/lib/db";

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || "presskit-media";

export async function uploadFile(
  file: File,
  category: "fotos" | "portadas" | "videos" | "documentos" | "general" = "general"
): Promise<{ success: boolean; url: string; item?: MediaItem; error?: string }> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".bin";
    const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${category}/${Date.now()}_${cleanName}${ext}`;

    let publicUrl = "";

    // 1. Intentar Vercel Blob si está configurado
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(filename, buffer, {
          access: "public",
          contentType: file.type,
        });
        publicUrl = blob.url;
      } catch (blobError) {
        console.warn("Fallo subida a Vercel Blob:", blobError);
      }
    }

    // 2. Intentar Supabase Storage si no se subió a Vercel Blob y Supabase está listo
    if (!publicUrl && isSupabaseConfigured && supabase) {
      try {
        // Asegurarse de que el bucket existe o subir
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
          publicUrl = data.publicUrl;
        } else {
          console.warn("Error subiendo a Supabase Storage:", uploadError.message);
        }
      } catch (sbError) {
        console.warn("Excepción al subir a Supabase Storage:", sbError);
      }
    }

    // 3. Fallback local para desarrollo o entornos sin credenciales aún
    if (!publicUrl) {
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", category);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const localPath = path.join(uploadDir, `${Date.now()}_${cleanName}${ext}`);
        fs.writeFileSync(localPath, buffer);
        publicUrl = `/uploads/${category}/${Date.now()}_${cleanName}${ext}`;
      } catch (localError) {
        // Si el filesystem es de solo lectura (como en Vercel sin bucket), codificar como base64 data URI si es imagen pequeña
        if (file.size < 4 * 1024 * 1024) {
          publicUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
        } else {
          throw new Error("No se pudo almacenar el archivo. Configura Supabase Storage o Vercel Blob.");
        }
      }
    }

    const item: MediaItem = {
      id: "med_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      name: file.name,
      url: publicUrl,
      size: file.size,
      type: file.type,
      category,
      createdAt: new Date().toISOString(),
    };

    await saveMediaItem(item);

    return { success: true, url: publicUrl, item };
  } catch (err: any) {
    console.error("Error en uploadFile:", err);
    return { success: false, url: "", error: err.message || "Error al subir archivo" };
  }
}

