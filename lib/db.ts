import fs from "fs";
import path from "path";
import { PressKitData, AdminUser, InviteCode, MediaItem } from "@/types/presskit";
import { initialPressKitData } from "@/lib/initial-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const PUBLISHED_FILE = path.join(DATA_DIR, "published.json");
const DRAFT_FILE = path.join(DATA_DIR, "draft.json");
const VERSIONS_FILE = path.join(DATA_DIR, "versions.json");
const ADMINS_FILE = path.join(DATA_DIR, "admins.json");
const INVITES_FILE = path.join(DATA_DIR, "invites.json");
const MEDIA_FILE = path.join(DATA_DIR, "media.json");

function assertPersistentStorageAvailable(operationName: string) {
  if (process.env.NODE_ENV === "production" && (!isSupabaseConfigured || !supabase)) {
    throw new Error(
      `Operación rechazada (${operationName}): La base de datos persistente (Supabase) no está configurada en producción. Las escrituras en disco efímero están bloqueadas para evitar pérdida de datos.`
    );
  }
}

function ensureDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // En entornos de solo lectura, continuar sin fallar
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error leyendo ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): boolean {
  try {
    ensureDirectory();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`Error escribiendo ${filePath}:`, err);
    return false;
  }
}

// ================= CONTENIDO (DRAFT / PUBLISHED) =================

export async function getPublishedContent(): Promise<PressKitData> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("presskit_content")
        .select("data")
        .eq("status", "published")
        .single();
      if (!error && data?.data) {
        return data.data as PressKitData;
      }
    } catch (e) {
      console.warn("Supabase no disponible para contenido publicado, usando fallback:", e);
    }
  }

  return readJsonFile<PressKitData>(PUBLISHED_FILE, initialPressKitData);
}

export async function getDraftContent(): Promise<PressKitData> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("presskit_content")
        .select("data")
        .eq("status", "draft")
        .single();
      if (!error && data?.data) {
        return data.data as PressKitData;
      }
    } catch (e) {
      console.warn("Supabase no disponible para draft, usando fallback:", e);
    }
  }

  return readJsonFile<PressKitData>(DRAFT_FILE, initialPressKitData);
}

export async function saveDraftContent(data: PressKitData): Promise<boolean> {
  assertPersistentStorageAvailable("saveDraftContent");
  data.updatedAt = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("presskit_content")
        .upsert(
          {
            id: "draft_singleton",
            status: "draft",
            data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      if (!error) {
        writeJsonFile(DRAFT_FILE, data);
        return true;
      }
    } catch (e) {
      console.error("Error guardando draft en Supabase:", e);
    }
  }

  return writeJsonFile(DRAFT_FILE, data);
}

export interface ContentVersion {
  id: string;
  version: number;
  data: PressKitData;
  note: string;
  author: string;
  createdAt: string;
}

export async function publishContent(note = "Publicación manual", author = "Admin"): Promise<PressKitData> {
  assertPersistentStorageAvailable("publishContent");
  const draft = await getDraftContent();
  draft.version = (draft.version || 1) + 1;
  draft.updatedAt = new Date().toISOString();

  const newVersion: ContentVersion = {
    id: "ver_" + Date.now(),
    version: draft.version,
    data: JSON.parse(JSON.stringify(draft)),
    note,
    author,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("presskit_content")
        .upsert(
          {
            id: "published_singleton",
            status: "published",
            data: draft,
            version: draft.version,
            updated_at: draft.updatedAt,
          },
          { onConflict: "id" }
        );

      await supabase.from("presskit_versions").insert([
        {
          id: newVersion.id,
          version: newVersion.version,
          data: newVersion.data,
          note: newVersion.note,
          author: newVersion.author,
          created_at: newVersion.createdAt,
        },
      ]);
    } catch (e) {
      console.error("Error publicando en Supabase:", e);
    }
  }

  writeJsonFile(PUBLISHED_FILE, draft);
  writeJsonFile(DRAFT_FILE, draft);

  const versions = readJsonFile<ContentVersion[]>(VERSIONS_FILE, []);
  versions.unshift(newVersion);
  if (versions.length > 30) versions.pop();
  writeJsonFile(VERSIONS_FILE, versions);

  return draft;
}

export async function getVersions(): Promise<ContentVersion[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("presskit_versions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);
      if (!error && data) {
        return data as ContentVersion[];
      }
    } catch (e) {
      console.warn("Error leyendo versiones en Supabase:", e);
    }
  }

  return readJsonFile<ContentVersion[]>(VERSIONS_FILE, []);
}

export async function restoreVersion(versionId: string): Promise<PressKitData | null> {
  const versions = await getVersions();
  const found = versions.find((v) => v.id === versionId);
  if (!found) return null;

  await saveDraftContent(found.data);
  return found.data;
}

// ================= ADMINISTRADORES =================

function adminFromDb(row: Record<string, any>): AdminUser {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
    lastLogin: row.last_login ?? undefined,
  };
}

function adminToDb(admin: AdminUser) {
  return {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    password_hash: admin.passwordHash,
    role: admin.role,
    created_at: admin.createdAt,
    last_login: admin.lastLogin ?? null,
  };
}

export async function getAdmins(): Promise<AdminUser[]> {
  if (process.env.NODE_ENV === "production" && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Falta credencial de servicio Supabase para leer administradores.");
  }
  if (!isSupabaseConfigured || !supabase) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Supabase no está configurado: no se puede determinar si ya existe un administrador.");
    }
    return readJsonFile<AdminUser[]>(ADMINS_FILE, []);
  }

  const { data, error } = await supabase.from("presskit_admins")
    .select("id, username, email, password_hash, role, created_at, last_login");

  if (error) {
    console.error("Error consultando administradores en Supabase:", error.message);
    throw new Error("No fue posible consultar los administradores en Supabase.");
  }

  return (data || []).map(adminFromDb);
}

export async function saveAdmins(admins: AdminUser[]): Promise<boolean> {
  assertPersistentStorageAvailable("saveAdmins");

  if (!isSupabaseConfigured || !supabase) {
    return writeJsonFile(ADMINS_FILE, admins);
  }

  if (admins.length === 0) return true;
  const { data, error } = await supabase.from("presskit_admins")
    .upsert(admins.map(adminToDb), { onConflict: "id" }).select("id");

  if (error || !data || data.length !== admins.length) {
    console.error("Error persistiendo administradores:", error?.message || "Filas no confirmadas");
    throw new Error("Supabase no confirmó el guardado de los administradores.");
  }
  return true;
}

export async function addAdmin(admin: AdminUser): Promise<boolean> {
  assertPersistentStorageAvailable("addAdmin");

  if (!isSupabaseConfigured || !supabase) {
    const list = await getAdmins();
    if (list.some(a => a.username === admin.username || a.email === admin.email)) {
      throw new Error("El administrador ya existe.");
    }
    return writeJsonFile(ADMINS_FILE, [...list, admin]);
  }

  const { data, error } = await supabase.from("presskit_admins")
    .insert(adminToDb(admin)).select("id").single();
  if (error || !data || data.id !== admin.id) {
    console.error("Error al insertar administrador:", error?.message || "Inserción no confirmada");
    throw new Error("No se pudo guardar el administrador en Supabase.");
  }
  return true;
}

// ================= CÓDIGOS DE INVITACIÓN =================

export async function getInvites(): Promise<InviteCode[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("presskit_invites").select("*");
      if (!error && data) return data as InviteCode[];
    } catch (e) {
      console.warn("Error leyendo invites en Supabase:", e);
    }
  }

  return readJsonFile<InviteCode[]>(INVITES_FILE, []);
}

export async function saveInvites(invites: InviteCode[]): Promise<boolean> {
  assertPersistentStorageAvailable("saveInvites");
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("presskit_invites").upsert(invites);
    } catch (e) {
      console.error("Error guardando invites en Supabase:", e);
    }
  }

  return writeJsonFile(INVITES_FILE, invites);
}

export async function createInvite(invite: InviteCode): Promise<boolean> {
  const list = await getInvites();
  list.unshift(invite);
  return saveInvites(list);
}

export async function revokeInvite(codeId: string): Promise<boolean> {
  const list = await getInvites();
  const item = list.find((i) => i.id === codeId || i.code === codeId);
  if (!item) return false;
  item.revoked = true;
  return saveInvites(list);
}

// ================= MEDIA LIBRARY =================

export async function getMediaLibrary(): Promise<MediaItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("presskit_media")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as MediaItem[];
    } catch (e) {
      console.warn("Error leyendo media en Supabase:", e);
    }
  }

  const initialMedia: MediaItem[] = [
    {
      id: "m1",
      name: "logo-mg-hd.png",
      url: "/assets/logo-mg-hd.png",
      size: 873711,
      type: "image/png",
      category: "portadas",
      createdAt: new Date().toISOString(),
    },
    {
      id: "m2",
      name: "mando-g-hero.jpg",
      url: "/assets/mando-g-hero.jpg",
      size: 238974,
      type: "image/jpeg",
      category: "portadas",
      createdAt: new Date().toISOString(),
    },
    {
      id: "m3",
      name: "mando-g-foto.jpg",
      url: "/assets/mando-g-foto.jpg",
      size: 346763,
      type: "image/jpeg",
      category: "fotos",
      createdAt: new Date().toISOString(),
    },
    {
      id: "m4",
      name: "qr-instagram.jpg",
      url: "/assets/qr-instagram.jpg",
      size: 89265,
      type: "image/jpeg",
      category: "general",
      createdAt: new Date().toISOString(),
    },
  ];

  return readJsonFile<MediaItem[]>(MEDIA_FILE, initialMedia);
}

export async function saveMediaItem(item: MediaItem): Promise<boolean> {
  assertPersistentStorageAvailable("saveMediaItem");
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("presskit_media").insert([item]);
    } catch (e) {
      console.error("Error guardando media en Supabase:", e);
    }
  }

  const list = await getMediaLibrary();
  list.unshift(item);
  return writeJsonFile(MEDIA_FILE, list);
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  assertPersistentStorageAvailable("deleteMediaItem");
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("presskit_media").delete().eq("id", id);
    } catch (e) {
      console.error("Error eliminando media en Supabase:", e);
    }
  }

  const list = await getMediaLibrary();
  const filtered = list.filter((m) => m.id !== id);
  return writeJsonFile(MEDIA_FILE, filtered);
}

