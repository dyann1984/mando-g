import { NextResponse } from "next/server";
import { getAdmins, addAdmin } from "@/lib/db";
import { hashPassword, generateToken, setSessionCookie } from "@/lib/auth";
import { AdminUser } from "@/types/presskit";

export async function GET() {
  const admins = await getAdmins();
  return NextResponse.json({
    needsSetup: admins.length === 0,
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

    const { username, email, password } = await req.json();

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

