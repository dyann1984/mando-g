import { NextResponse } from "next/server";
import { getInvites, saveInvites, getAdmins, addAdmin } from "@/lib/db";
import { hashPassword, generateToken, setSessionCookie } from "@/lib/auth";
import { AdminUser } from "@/types/presskit";

export async function POST(req: Request) {
  try {
    const { code, username, email, password } = await req.json();

    if (!code || !username || !email || !password) {
      return NextResponse.json({ error: "Todos los campos y el código de invitación son requeridos." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const invites = await getInvites();
    const cleanCode = code.trim().toUpperCase();
    const invite = invites.find((i) => i.code === cleanCode);

    if (!invite) {
      return NextResponse.json({ error: "Código de invitación no válido o inexistente." }, { status: 404 });
    }

    if (invite.revoked) {
      return NextResponse.json({ error: "Este código de invitación ha sido revocado por un administrador." }, { status: 403 });
    }

    if (invite.used) {
      return NextResponse.json({ error: "Este código de invitación ya ha sido utilizado." }, { status: 400 });
    }

    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Este código de invitación ha expirado." }, { status: 410 });
    }

    const admins = await getAdmins();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUser = username.trim().toLowerCase();

    if (admins.some((a) => a.email.toLowerCase() === cleanEmail || a.username.toLowerCase() === cleanUser)) {
      return NextResponse.json({ error: "Ese correo o nombre de usuario ya está registrado." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const newAdmin: AdminUser = {
      id: "admin_" + Date.now(),
      username: username.trim(),
      email: cleanEmail,
      passwordHash,
      role: invite.role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await addAdmin(newAdmin);

    // Marcar código como usado
    invite.used = true;
    invite.usedBy = newAdmin.username;
    await saveInvites(invites);

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
    return NextResponse.json({ error: err.message || "Error al procesar registro." }, { status: 500 });
  }
}

