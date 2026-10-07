import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import { marked } from "marked";
import { terminosRaw, privacidadRaw } from "./src/features/legal/legalContent";

function prerenderLegalPages(): Plugin {
  return {
    name: "prerender-legal-pages",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexHtmlPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexHtmlPath)) return;

      const baseHtml = fs.readFileSync(indexHtmlPath, "utf-8");

      const pages = [
        {
          slug: "terminos",
          content: terminosRaw,
          title: "Términos y Condiciones | NEXOL",
          description:
            "Términos y condiciones regulan el uso del sitio web y los servicios de software y membresía de NEXOL.",
        },
        {
          slug: "privacidad",
          content: privacidadRaw,
          title: "Política de Privacidad | NEXOL",
          description:
            "Política de privacidad y protección de datos personales de NEXOL y la plataforma TrackDeli.",
        },
      ];

      for (const page of pages) {
        if (!page.content) continue;

        const bodyHtml = marked.parse(page.content, { gfm: true }) as string;

        const targetDir = path.join(distDir, page.slug);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        let pageHtml = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`)
          .replace(
            /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
            `<meta name="description" content="${page.description}" />`,
          )
          .replace(
            '<div id="root"></div>',
            `<div id="root"><div class="min-h-screen bg-[#FAFAF8] text-[#1f2937] font-geist"><main class="max-w-[760px] mx-auto px-6 py-12 md:py-16"><article class="legal-prose">${bodyHtml}</article></main></div></div>`,
          );

        fs.writeFileSync(path.join(targetDir, "index.html"), pageHtml, "utf-8");
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderLegalPages()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
