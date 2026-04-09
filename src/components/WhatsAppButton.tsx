import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/5592999990000?text=Olá! Gostaria de mais informações sobre o Amazon Samaúma Lodge."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-background shadow-lg hover:scale-110 transition-transform duration-300"
    aria-label="WhatsApp"
  >
    <MessageCircle size={28} />
  </a>
);

export default WhatsAppButton;
