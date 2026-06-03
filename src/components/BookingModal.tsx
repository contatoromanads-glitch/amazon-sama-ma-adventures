import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

/* <!-- Booking system: WhatsApp link with service-specific pre-filled messages --> */
const WHATSAPP_NUMBER = '5592993839110';

function buildMessage(defaultInterest?: string, defaultRoom?: string): string {
  // Quarto específico tem prioridade
  if (defaultRoom) {
    return `Olá, vim do site. Tenho interesse no ${defaultRoom} no Amazon Samaúma. Como funciona a reserva?`;
  }

  // Mensagens por serviço / passeio
  switch (defaultInterest) {
    case 'Pesca Esportiva':
      return `Olá, vim do site. Tenho interesse na pesca esportiva no Amazon Samaúma.`;
    case 'Ecoturismo':
      return `Olá, vim do site. Tenho interesse nos passeios de ecoturismo no Amazon Samaúma.`;
    case 'Relaxar/Descansar':
      return `Olá, vim do site. Como funciona a reserva no Amazon Samaúma?`;
    case 'Pacote Arara':
      return `Olá, vim do site. Tenho interesse no Pacote Arara (3 dias e 2 noites).`;
    case 'Pacote Uirapuru':
      return `Olá, vim do site. Tenho interesse no Pacote Uirapuru (4 dias e 3 noites).`;
    case 'Pacote Onça Pintada':
      return `Olá, vim do site. Tenho interesse no Pacote Onça Pintada (5 dias e 4 noites).`;
    case 'Pacote Gavião Real':
      return `Olá, vim do site. Tenho interesse no Pacote Gavião Real (6 dias e 5 noites).`;
    default:
      return `Olá, vim do site. Quero conhecer as pousadas flutuantes e pacotes do Amazon Samaúma.`;
  }
}

export default function BookingModal({ children, className, defaultInterest, defaultRoom }: { children?: React.ReactNode, className?: string, defaultInterest?: string, defaultRoom?: string }) {
  const textMessage = buildMessage(defaultInterest, defaultRoom);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textMessage)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`cursor-pointer inline-block ${className || ''}`}
    >
      {children || (
        <button className="group relative overflow-hidden bg-stone-800 hover:bg-stone-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all flex items-center gap-3">
          <CalendarIcon size={20} className="group-hover:animate-bounce" />
          <span>RESERVE AGORA</span>
        </button>
      )}
    </a>
  );
}
