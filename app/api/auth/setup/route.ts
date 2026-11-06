import { NextResponse } from "next/server";
import { getAdmins, addAdmin } from "@/lib/db";
import { hashPassword, generateToken, setSessionCookie } from "@/lib/auth";
import { AdminUser } from "@/types/presskit";

function cleanKey(val: any): string {
  if (!val) return "";
  let str = String(val).trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

export async function GET() {
  const admins = await getAdmins();
  const requiresKey = Boolean(cleanKey(process.env.ADMIN_SETUP_KEY));
  return NextResponse.json({
    needsSetup: admins.length === 0,
    requiresKey,
    count: admins.length,
  });
}

export async function POST(req: Request) {
  try {
    const admins = await getAdmins();
    if (admins.length > 0) {
      return NextResponse.json(
        { error: "El sistema ya tiene un administrador inicial configurado. Usa el inicio de sesión o un código de invitación." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { username, email, password } = body;

    // Validación de autorización para el setup inicial
    const requiredSetupKey = cleanKey(process.env.ADMIN_SETUP_KEY);
    if (requiredSetupKey) {
      const rawProvided =
        body.setupKey ||
        body.adminSetupKey ||
        body.ADMIN_SETUP_KEY ||
        body.setup_key ||
        req.headers.get("x-admin-setup-key") ||
        "";
      const providedKey = cleanKey(rawProvided);

      if (!providedKey || providedKey !== requiredSetupKey) {
        return NextResponse.json(
          { error: "Acceso denegado: Se requiere una clave de autorización válida (ADMIN_SETUP_KEY) para configurar el primer administrador." },
          { status: 401 }
        );
      }
    }

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Nombre de usuario, email y contraseña son obligatorios." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const newAdmin: AdminUser = {
      id: "admin_" + Date.now(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "superadmin",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await addAdmin(newAdmin);

    const token = generateToken(newAdmin);
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al inicializar el administrador." }, { status: 500 });
  }
}

