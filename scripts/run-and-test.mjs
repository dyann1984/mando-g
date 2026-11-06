// scripts/run-and-test.mjs
import { spawn } from "child_process";
import path from "path";

async function main() {
  console.log("Iniciando servidor Next.js para pruebas...");

  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  const server = spawn("node", [nextBin, "start", "-H", "127.0.0.1", "-p", "3000"], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  let serverReady = false;
  server.stdout.on("data", (data) => {
    const msg = data.toString();
    if (msg.includes("Ready in") || msg.includes("started server on")) {
      console.log("Servidor listo:", msg.trim());
      serverReady = true;
    }
  });

  server.stderr.on("data", (data) => {
    console.error("Server stderr:", data.toString());
  });

  // Esperar a que el servidor esté listo
  for (let i = 0; i < 30; i++) {
    if (serverReady) break;
    try {
      const res = await fetch("http://127.0.0.1:3000/api/content");
      if (res.ok) {
        serverReady = true;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  if (!serverReady) {
    console.error("El servidor no respondió a tiempo.");
    server.kill();
    process.exit(1);
  }

  console.log("Servidor verificado en http://localhost:3000. Ejecutando batería de pruebas...");

  const testProcess = spawn("node", [path.join(process.cwd(), "scripts", "test-cms.mjs")], {
    stdio: "inherit",
  });

  testProcess.on("close", (code) => {
    console.log(`Batería de pruebas finalizada con código ${code}`);
    server.kill();
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error("Error en runner:", err);
  process.exit(1);
});

