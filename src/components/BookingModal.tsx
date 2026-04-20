import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

/* <!-- Booking system: WhatsApp link with service-specific pre-filled messages --> */
const WHATSAPP_NUMBER = '5592991163391';

function buildMessage(defaultInterest?: string, defaultRoom?: string): string {
  // Room-specific message takes priority
  if (defaultRoom) {
    return `Olá! Tenho interesse em reservar o "${defaultRoom}" no Amazon Samaúma Lodge. Poderia me enviar valores, datas disponíveis e o que está incluso?`;
  }

  // Service-specific messages
  switch (defaultInterest) {
    case 'Pesca Esportiva':
      return `Olá! Tenho interesse no pacote de Pesca Esportiva do Amazon Samaúma Lodge. Gostaria de saber valores, datas disponíveis, espécies da temporada e o que está incluso (guia, equipamentos, refeições).`;
    case 'Ecoturismo':
      return `Olá! Tenho interesse nos passeios de Ecoturismo do Amazon Samaúma Lodge (trilhas, observação de fauna, passeios de barco). Poderia me enviar valores, datas disponíveis e roteiros?`;
    case 'Relaxar/Descansar':
      return `Olá! Quero reservar uma estadia de descanso no Amazon Samaúma Lodge. Poderia me enviar valores das diárias, datas disponíveis e o que está incluso (refeições, traslado)?`;
    default:
      return `Olá! Gostaria de fazer uma reserva no Amazon Samaúma Lodge. Poderia me enviar mais informações sobre valores, datas disponíveis e pacotes?`;
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
