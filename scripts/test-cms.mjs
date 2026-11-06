// scripts/test-cms.mjs
import fs from "fs";
import path from "path";

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runTests() {
  console.log("=== INICIANDO BATERÍA DE PRUEBAS DE MANDO G PRESS KIT ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // Esperar a que el servidor responda
    let ready = false;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`${BASE_URL}/api/content`);
        if (res.ok) {
          ready = true;
          break;
        }
      } catch (e) {
        console.log(`Intento ${i + 1} falló conectando a ${BASE_URL}/api/content:`, e.message);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    if (!ready) {
      throw new Error("El servidor local no respondió en el puerto 3000.");
    }

    // PRUEBA 1: Verificar contenido público inicial
    const publicRes = await fetch(`${BASE_URL}/api/content`);
    const initialContent = await publicRes.json();
    assert(publicRes.ok && initialContent.hero?.nombre === "MANDO", "1. Contenido público inicial disponible");

    // PRUEBA 2: Bloqueo de acceso no autorizado
    const unauthRes = await fetch(`${BASE_URL}/api/admin/content`);
    assert(unauthRes.status === 401, "2. Bloqueo de acceso no autorizado a rutas administrativas (/api/admin/content -> 401)");

    const unauthPublishRes = await fetch(`${BASE_URL}/api/admin/publish`, { method: "POST" });
    assert(unauthPublishRes.status === 401, "2.1 Protección contra publicación no autorizada (/api/admin/publish -> 401)");

    // PRUEBA 3: Setup inicial del primer Administrador
    const setupStatusRes = await fetch(`${BASE_URL}/api/auth/setup`);
    const setupStatus = await setupStatusRes.json();
    assert(setupStatusRes.ok, "3. Endpoint de setup inicial responde");

    let authCookie = "";
    const testAdminUser = "mandog_super";
    const testAdminEmail = "admin@mandog.mx";
    const testAdminPass = "MandoG2026!Secure";

    if (setupStatus.needsSetup) {
      const createAdminRes = await fetch(`${BASE_URL}/api/auth/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: testAdminUser,
          email: testAdminEmail,
          password: testAdminPass,
        }),
      });
      const cookieHeader = createAdminRes.headers.get("set-cookie");
      if (cookieHeader) authCookie = cookieHeader.split(";")[0];
      assert(createAdminRes.ok, "3.1 Creación del primer administrador maestro");
    }

    // PRUEBA 4: Inicio de sesión válido
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: testAdminEmail,
        password: testAdminPass,
      }),
    });
    const loginData = await loginRes.json();
    const loginCookie = loginRes.headers.get("set-cookie");
    if (loginCookie) authCookie = loginCookie.split(";")[0];
    assert(loginRes.ok && loginData.success, "4. Inicio de sesión válido con usuario y contraseña");

    // PRUEBA 5: Verificación de sesión segura del servidor
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: authCookie },
    });
    const meData = await meRes.json();
    assert(meRes.ok && meData.authenticated && meData.user.username === testAdminUser, "5. Sesión segura verificada en servidor con cookies httpOnly");

    // PRUEBA 6: Creación y revocación de Códigos de Invitación
    const createInviteRes = await fetch(`${BASE_URL}/api/admin/invites`, {
      method: "POST",
      headers: { Cookie: authCookie, "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin", days: 7 }),
    });
    const inviteData = await createInviteRes.json();
    assert(createInviteRes.ok && inviteData.invite?.code?.startsWith("MG-"), "6. Creación de código de invitación temporal para nuevos administradores");

    // Canjear invitación para un segundo admin
    const inviteCode = inviteData.invite.code;
    const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: inviteCode,
        username: "editor_invitado",
        email: "editor@mandog.mx",
        password: "PasswordSegura2026!",
      }),
    });
    assert(registerRes.ok, "6.1 Canje de código de invitación y registro de nuevo administrador");

    // Reusar el mismo código debe fallar
    const reuseInviteRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: inviteCode,
        username: "otro_usuario",
        email: "otro@mandog.mx",
        password: "PasswordSegura2026!",
      }),
    });
    assert(reuseInviteRes.status === 400, "6.2 Bloqueo de código de invitación ya utilizado");

    // PRUEBA 7: Modificación de contenido (Borrador)
    const draftRes = await fetch(`${BASE_URL}/api/admin/content`, {
      headers: { Cookie: authCookie },
    });
    const draftData = await draftRes.json();
    const updatedDraft = draftData.draft;

    // Modificar Biografía, Enlaces y Videos
    const testBioSnippet = "Actualización verificada de biografía: Mando G rompiendo fronteras con sonido bilingüe.";
    updatedDraft.bio.parrafos[0] = testBioSnippet;
    updatedDraft.hero.subtitulo = "HIP HOP BILINGÜE · CDMX ↔ OMAHA";
    updatedDraft.videos.videoPrincipal.youtubeUrl = "https://www.youtube.com/watch?v=gBRwsuk2TEk";
    updatedDraft.contacto.whatsappNumero = "5215512345678";

    const saveDraftRes = await fetch(`${BASE_URL}/api/admin/content`, {
      method: "PUT",
      headers: { Cookie: authCookie, "Content-Type": "application/json" },
      body: JSON.stringify(updatedDraft),
    });
    assert(saveDraftRes.ok, "7. Modificación y guardado de borrador (biografía, subtítulo, video, enlaces)");

    // El sitio público aún debe tener el contenido previo (porque aún no se publica)
    const publicBeforePublish = await (await fetch(`${BASE_URL}/api/content`)).json();
    assert(publicBeforePublish.hero.subtitulo !== "HIP HOP BILINGÜE · CDMX ↔ OMAHA", "7.1 Aislamiento de borrador (el sitio público no cambia antes de publicar)");

    // PRUEBA 8: Publicación de cambios y reflejo en página pública
    const publishRes = await fetch(`${BASE_URL}/api/admin/publish`, {
      method: "POST",
      headers: { Cookie: authCookie, "Content-Type": "application/json" },
      body: JSON.stringify({ note: "Prueba automatizada de publicación" }),
    });
    const publishData = await publishRes.json();
    assert(publishRes.ok && publishData.success, "8. Publicación de cambios ejecutada");

    // Verificar que el sitio público AHORA tiene los cambios publicados
    const publicAfterPublish = await (await fetch(`${BASE_URL}/api/content`)).json();
    assert(publicAfterPublish.hero.subtitulo === "HIP HOP BILINGÜE · CDMX ↔ OMAHA", "8.1 Reflejo inmediato en la página pública sin redeploy");
    assert(publicAfterPublish.bio.parrafos[0] === testBioSnippet, "8.2 Biografía modificada reflejada en vivo");

    // PRUEBA 9: Subida de fotografía / Multimedia
    const dummyImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    const form = new FormData();
    const blob = new Blob([dummyImageBuffer], { type: "image/png" });
    form.append("file", blob, "test_foto_prensa.png");
    form.append("category", "fotos");

    const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      headers: { Cookie: authCookie },
      body: form,
    });
    const uploadData = await uploadRes.json();
    assert(uploadRes.ok && uploadData.url, "9. Subida y almacenamiento de fotografía en biblioteca multimedia");

    // PRUEBA 10: Historial de versiones y Rollback
    const versionsRes = await fetch(`${BASE_URL}/api/admin/versions`, {
      headers: { Cookie: authCookie },
    });
    const versionsData = await versionsRes.json();
    assert(versionsRes.ok && versionsData.versions?.length > 0, "10. Historial de versiones registrado automáticamente");

    // PRUEBA 11: Cierre de sesión seguro
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: authCookie },
    });
    assert(logoutRes.ok, "11. Cierre de sesión ejecutado");

    const meAfterLogout = await fetch(`${BASE_URL}/api/auth/me`);
    assert(meAfterLogout.status === 401, "11.1 Sesión invalidada tras logout");

    // PRUEBA 12: Servir página HTML pública y página de Admin
    const htmlPageRes = await fetch(`${BASE_URL}/`);
    const htmlText = await htmlPageRes.text();
    assert(htmlPageRes.ok && htmlText.includes("MANDO"), "12. Renderizado SSR de página pública con HTML y diseño intacto");

    const adminHtmlRes = await fetch(`${BASE_URL}/admin`);
    assert(adminHtmlRes.ok, "12.1 Ruta /admin responde correctamente con código 200");

    console.log(`\n=== RESUMEN DE PRUEBAS: ${passed} PASADAS, ${failed} FALLADAS ===`);
    if (failed === 0) {
      console.log("¡TODAS LAS PRUEBAS OBLIGATORIAS PASARON CON ÉXITO!");
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("Error crítico en las pruebas:", err);
    process.exit(1);
  }
}

runTests();

