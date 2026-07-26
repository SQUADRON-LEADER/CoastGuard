import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WhatsAppHelpProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppHelp: React.FC<WhatsAppHelpProps> = ({ 
  phoneNumber = "1234567890", // Replace with your actual WhatsApp business number
  message = "Hello! I need help with the platform." 
}) => {
  const { t } = useTranslation();

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="relative group">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        title={t('help.whatsapp')}
        aria-label={t('help.whatsapp')}
      >
        <MessageCircle size={24} />
      </button>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {t('help.whatsappTooltip')}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
      </div>
    </div>
  );
};

export default WhatsAppHelp;