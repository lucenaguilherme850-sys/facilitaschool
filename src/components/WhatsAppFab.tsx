import { MessageCircle } from "lucide-react";

const WHATS_NUMBER = "5564999611088";
const WHATS_MSG = encodeURIComponent("Olá! Preciso de suporte com a Executa.");

export function WhatsAppFab() {
  const href = `https://web.whatsapp.com/send?phone=${WHATS_NUMBER}&text=${WHATS_MSG}`;

  function openWhatsApp(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const popup = window.open("about:blank", "_blank");
    if (popup) {
      popup.opener = null;
      popup.location.href = href;
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <a
      href="#whatsapp-suporte"
      onClick={openWhatsApp}
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-transform"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">Suporte</span>
    </a>
  );
}
