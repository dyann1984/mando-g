import { NextResponse } from "next/server";
import { getSession, generateInviteCode } from "@/lib/auth";
import { getInvites, createInvite, revokeInvite } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const invites = await getInvites();
  return NextResponse.json({ invites });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (session.role !== "superadmin" && session.role !== "admin") {
    return NextResponse.json({ error: "Solo administradores pueden crear invitaciones." }, { status: 403 });
  }

  try {
    const { role = "admin", days = 7 } = await req.json().catch(() => ({}));
    const newInvite = generateInviteCode(role, days);

    await createInvite(newInvite);

    return NextResponse.json({
      success: true,
      invite: newInvite,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al crear invitación." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const codeId = searchParams.get("id");
    if (!codeId) {
      return NextResponse.json({ error: "ID de código requerido." }, { status: 400 });
    }

    const success = await revokeInvite(codeId);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al revocar código." }, { status: 500 });
  }
}

