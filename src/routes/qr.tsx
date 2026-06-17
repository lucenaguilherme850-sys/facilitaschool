import { createFileRoute } from "@tanstack/react-router";
import { Printer, Download } from "lucide-react";
import { jsPDF } from "jspdf";

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

async function loadQrDataUrl(): Promise<string> {
  const res = await fetch(QR_SRC);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function handleDownloadPdf() {
  const qrDataUrl = await loadQrDataUrl();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Background card
  doc.setFillColor(20, 20, 24);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

  // Eyebrow
  doc.setTextColor(212, 175, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("FACILIT", pageW / 2, 30, { align: "center" });

  // Title
  doc.setTextColor(245, 245, 245);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("Bora facilitar sua vida escolar?", pageW / 2, 45, { align: "center" });

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(200, 200, 200);
  const desc = "NetEscola, So-Vem-Enem, GoEnglish e IFA, SEM B.O. Aponta a câmera, escaneia e descobre como a gente te ajuda a tirar nota alta sobrando tempo pra Netflix.";
  const lines = doc.splitTextToSize(desc, pageW - 50);
  doc.text(lines, pageW / 2, 58, { align: "center" });

  // QR with white background
  const qrSize = 110;
  const qrX = (pageW - qrSize) / 2;
  const qrY = 80;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 4, 4, "F");
  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // Footer
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(10);
  doc.text("Não conseguiu escanear? Digita no navegador:", pageW / 2, qrY + qrSize + 18, { align: "center" });
  doc.setFont("courier", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(SITE_URL, pageW / 2, qrY + qrSize + 26, { align: "center" });

  doc.save("facilit-qr.pdf");
}

function QrPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
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
          <button onClick={handleDownloadPdf} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
            <Download className="h-4 w-4" /> Baixar PDF
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm">
            <Printer className="h-4 w-4" /> Imprimir
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="qr-card rounded-2xl bg-card border border-border/60 shadow-card p-8 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-gold font-bold mb-3">✦ Facilit ✦</div>
          <h1 className="font-display text-4xl md:text-5xl mb-4 bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent leading-tight">Bora facilitar sua vida escolar? 🚀</h1>
          <p className="font-display text-lg md:text-xl text-foreground/90 mb-6 italic leading-snug">
            NetEscola, So-Vem-Enem, GoEnglish e IFA, <span className="text-gold font-bold not-italic">SEM B.O.</span> Aponta a câmera, escaneia e descobre como a gente te ajuda a tirar <span className="text-gold-soft font-semibold">nota alta</span> sobrando tempo pra Netflix. 🎬✨
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
