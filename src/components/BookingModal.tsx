import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

/* <!-- Booking system removed and replaced with WhatsApp link --> */
export default function BookingModal({ children, className, defaultInterest, defaultRoom }: { children?: React.ReactNode, className?: string, defaultInterest?: string, defaultRoom?: string }) {
  // Construct a personalized WhatsApp message based on the props passed from different pages
  const textMessage = `Olá! Gostaria de saber mais sobre reservas no lodge.${defaultInterest ? ` Tenho interesse especial em: ${defaultInterest}.` : ''}${defaultRoom ? ` Gostaria de ver o: ${defaultRoom}.` : ''}`;
  const encodedText = encodeURIComponent(textMessage);
  const whatsappUrl = `https://wa.me/559299999000?text=${encodedText}`;

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
