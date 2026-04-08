import index from "./index.html";

const PORT = 3777;

Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  routes: {
    "/": index,
    "/manifest.json": {
      GET: () => new Response(Bun.file("public/manifest.json")),
    },
    "/icon.svg": {
      GET: () => new Response(Bun.file("public/icon.svg")),
    },
    "/sw.js": {
      GET: () =>
        new Response(Bun.file("public/sw.js"), {
          headers: { "Content-Type": "application/javascript" },
        }),
    },
    "/api/type": {
      async POST(req) {
        const { text, mode } = (await req.json()) as {
          text: string;
          mode: "type" | "clipboard";
        };

        if (!text?.trim()) {
          return Response.json({ error: "No text provided" }, { status: 400 });
        }

        const trimmed = text.trim();

        try {
          if (mode === "clipboard") {
            const proc = Bun.spawn(["wl-copy", trimmed]);
            await proc.exited;
          } else if (mode === "type") {
            await Bun.sleep(150);
            const proc = Bun.spawn(["wtype", "--", trimmed]);
            await proc.exited;
          }

          console.log(
            `[${mode}] "${trimmed.slice(0, 60)}${trimmed.length > 60 ? "..." : ""}"`
          );
          return Response.json({ ok: true, mode, length: trimmed.length });
        } catch (err) {
          console.error("Failed to inject text:", err);
          return Response.json(
            { error: "Failed to inject text" },
            { status: 500 }
          );
        }
      },
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`\n  whispr-bridge running on:`);
console.log(`  Local:   http://localhost:${PORT}`);
console.log(`  Network: http://${getLocalIP()}:${PORT}`);
console.log(`\n  Open the network URL on your phone to start dictating.\n`);

function getLocalIP(): string {
  try {
    const result = Bun.spawnSync(["ip", "route", "get", "1"]);
    const output = result.stdout.toString();
    const match = output.match(/src\s+(\d+\.\d+\.\d+\.\d+)/);
    return match?.[1] ?? "0.0.0.0";
  } catch {
    return "0.0.0.0";
  }
}
