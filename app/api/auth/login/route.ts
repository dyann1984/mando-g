import { NextResponse } from "next/server";
import { getAdmins, saveAdmins } from "@/lib/db";
import { verifyPassword, generateToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json({ error: "Ingresa tu usuario o correo y contraseña." }, { status: 400 });
    }

    const admins = await getAdmins();
    const cleanLogin = login.trim().toLowerCase();

    const user = admins.find(
      (a) => a.username.toLowerCase() === cleanLogin || a.email.toLowerCase() === cleanLogin
    );

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }

    // Actualizar último login
    user.lastLogin = new Date().toISOString();
    await saveAdmins(admins);

    const token = generateToken(user);
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al procesar inicio de sesión." }, { status: 500 });
  }
}

