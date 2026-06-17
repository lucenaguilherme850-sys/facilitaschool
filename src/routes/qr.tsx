import { createFileRoute } from "@tanstack/react-router";
import { Printer, Download } from "lucide-react";

const SITE_URL = "https://facilitaschool.lovable.app";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&margin=20&data=${encodeURIComponent(SITE_URL)}`;

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Code — Facilit" },
      { name: "description", content: "QR Code do site Facilit para impressão." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QrPage,
  notFoundComponent: () => <div className="p-10 text-center">Página não encontrada.</div>,
});

function QrPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .qr-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className="no-print mx-auto max-w-3xl px-6 pt-8 flex items-center justify-between">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Início</a>
        <div className="flex gap-2">
          <a href={QR_SRC} download="facilit-qr.png" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
            <Download className="h-4 w-4" /> Baixar PNG
          </a>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm">
            <Printer className="h-4 w-4" /> Imprimir
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="qr-card rounded-2xl bg-card border border-border/60 shadow-card p-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Facilit</div>
          <h1 className="font-display text-3xl mb-3">Bora facilitar sua vida escolar? 🚀</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Trabalhos, resumos e provas sem stress. Aponta a câmera, escaneia e descobre como a gente te ajuda a tirar nota alta sobrando tempo pra Netflix. 🎬✨
          </p>
          <img
            src={QR_SRC}
            alt={`QR Code para ${SITE_URL}`}
            width={400}
            height={400}
            loading="lazy"
            className="mx-auto h-auto w-full max-w-[400px] bg-white p-4 rounded-xl"
          />
          <p className="mt-6 text-xs text-muted-foreground">Não conseguiu escanear? Digita no navegador:</p>
          <p className="mt-1 font-mono text-sm break-all font-semibold">{SITE_URL}</p>
        </div>
      </div>
    </div>
  );
}
