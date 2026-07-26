import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Globe, Mic, MicOff, Volume2, VolumeX, HandPlatter as Translate, Upload, MapPin, Phone, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ChatMessage, Language, QuickAction } from '../../types';
import { formatTimeAgo, translateText, detectLanguage } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface MultilingualChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MultilingualChatbot: React.FC<MultilingualChatbotProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  ];

  const quickActions: QuickAction[] = [
    { id: '1', label: 'Upload Report', action: 'upload', icon: '📤', color: 'bg-ocean-500' },
    { id: '2', label: 'Emergency Help', action: 'emergency', icon: '🚨', color: 'bg-coral-500' },
    { id: '3', label: 'Find Location', action: 'location', icon: '📍', color: 'bg-emerald-500' },
    { id: '4', label: 'Contact Protector', action: 'contact', icon: '👮', color: 'bg-orange-500' },
    { id: '5', label: 'Check Status', action: 'status', icon: '✅', color: 'bg-purple-500' },
    { id: '6', label: 'Platform Help', action: 'help', icon: '❓', color: 'bg-sand-500' },
  ];

  useEffect(() => {
    if (user) {
      setCurrentLanguage(user.preferredLanguage);
      initializeChat();
    }
  }, [user]);

  const initializeChat = async () => {
    const welcomeMessage = await getWelcomeMessage();
    setMessages([{
      id: '1',
      senderId: 'bot',
      senderName: 'CoastGuard Assistant',
      content: welcomeMessage,
      timestamp: new Date(),
      type: 'text',
      language: currentLanguage,
      quickActions: quickActions,
    }]);
  };

  const getWelcomeMessage = async (): Promise<string> => {
    const messages = {
      en: `Hello ${user?.name}! I'm your multilingual CoastGuard assistant. I can help you with:\n\n• Uploading hazard reports\n• Emergency guidance\n• Platform navigation\n• Connecting with protectors\n\nHow can I assist you today?`,
      hi: `नमस्ते ${user?.name}! मैं आपका बहुभाषी CoastGuard सहायक हूं। मैं आपकी मदद कर सकता हूं:\n\n• खतरे की रिपोर्ट अपलोड करना\n• आपातकालीन मार्गदर्शन\n• प्लेटफॉर्म नेवीगेशन\n• रक्षकों से जुड़ना\n\nआज मैं आपकी कैसे सहायता कर सकता हूं?`,
      ta: `வணக்கம் ${user?.name}! நான் உங்கள் பல்மொழி CoastGuard உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:\n\n• ஆபத்து அறிக்கைகளை பதிவேற்றுதல்\n• அவசர வழிகாட்டுதல்\n• தளம் வழிசெலுத்தல்\n• பாதுகாவலர்களுடன் இணைத்தல்\n\nஇன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?`,
    };
    
    return messages[currentLanguage] || messages.en;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keep a rolling window of last 10 turns for Gemini context
  const chatHistoryRef = useRef<{ role: string; text: string }[]>([]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const detectedLang = detectLanguage(inputMessage);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: user?.name || 'You',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text',
      language: detectedLang,
    };

    setMessages(prev => [...prev, userMessage]);
    const userText = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Add user turn to history
    chatHistoryRef.current = [
      ...chatHistoryRef.current.slice(-18), // keep last 9 pairs
      { role: 'user', text: userText },
    ];

    try {
      const res = await fetch('http://localhost:3003/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: currentLanguage,
          history: chatHistoryRef.current.slice(0, -1), // history before this message
        }),
      });

      const data = await res.json();
      const replyText: string = data.reply || "Sorry, I couldn't get a response. Please try again.";

      // Add bot turn to history
      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: 'bot', text: replyText },
      ];

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'bot',
        senderName: 'CoastGuard Assistant',
        content: replyText,
        timestamp: new Date(),
        type: 'text',
        language: currentLanguage,
      };

      setMessages(prev => [...prev, botMessage]);

      if (isSpeaking) {
        speakText(replyText);
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'bot',
        senderName: 'CoastGuard Assistant',
        content: '⚠️ Could not reach the AI service. Please check your connection or try again.',
        timestamp: new Date(),
        type: 'text',
        language: currentLanguage,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    let response = '';
    
    switch (action) {
      case 'upload':
        window.location.href = '/upload';
        return;
      case 'emergency':
        response = 'Opening emergency contacts and procedures...';
        break;
      case 'location':
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationMessage: ChatMessage = {
                id: Date.now().toString(),
                senderId: 'user',
                senderName: user?.name || 'You',
                content: `📍 My location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
                timestamp: new Date(),
                type: 'location',
                language: currentLanguage,
              };
              setMessages(prev => [...prev, locationMessage]);
            }
          );
        }
        response = 'Accessing your location...';
        break;
      case 'whatsapp':
        response = 'Opening WhatsApp connection to local protector...';
        break;
      default:
        response = 'Processing your request...';
    }

    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'bot',
      senderName: 'CoastGuard Assistant',
      content: await translateResponse(response, currentLanguage),
      timestamp: new Date(),
      type: 'quick_action',
      language: currentLanguage,
    };

    setMessages(prev => [...prev, actionMessage]);
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = currentLanguage === 'en' ? 'en-US' : `${currentLanguage}-IN`;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };
      recognition.start();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'en' ? 'en-US' : `${currentLanguage}-IN`;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (user && messages.length === 0) {
      initializeChat();
    }
  }, [user, currentLanguage]);


  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-ocean-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50"
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      className="fixed bottom-6 right-6 w-96 h-[600px] elevated-card shadow-glass-xl z-50 flex flex-col overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="bg-ocean-700 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">CoastGuard Assistant</h3>
              <p className="text-xs opacity-90">Multilingual AI Helper</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Language & Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value as Language)}
              className="bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-sm text-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-ocean-800">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoTranslate(!autoTranslate)}
              className={`p-1 rounded transition-colors ${autoTranslate ? 'bg-white/20' : 'opacity-50'}`}
            >
              <Translate className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={`p-1 rounded transition-colors ${isSpeaking ? 'bg-white/20' : 'opacity-50'}`}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[85%] p-3 rounded-2xl
              ${message.senderId === 'user' 
                ? 'bg-ocean-600 text-white' 
                : 'bg-gray-100 text-ocean-800'
              }
            `}>
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              
              {/* Quick Actions */}
              {message.quickActions && message.quickActions.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {message.quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(action.action)}
                      className={`${action.color} text-white p-2 rounded-lg text-xs font-medium hover:shadow-md transition-all duration-200`}
                    >
                      <span className="mr-1">{action.icon}</span>
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  message.senderId === 'user' ? 'text-blue-100' : 'text-ocean-400'
                }`}>
                  {formatTimeAgo(message.timestamp)}
                </p>
                {message.language !== 'en' && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    message.senderId === 'user' ? 'bg-ocean-500' : 'bg-gray-200 text-ocean-500'
                  }`}>
                    {languages.find(l => l.code === message.language)?.flag}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask me anything in ${languages.find(l => l.code === currentLanguage)?.name}...`}
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200"
          />
          
          <button
            onClick={startVoiceRecognition}
            disabled={isListening}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isListening 
                ? 'bg-coral-500 text-white animate-pulse' 
                : 'bg-gray-100 text-ocean-500 hover:bg-gray-200'
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-ocean-600 text-white p-3 rounded-xl hover:bg-ocean-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
        
        {/* Language Detection */}
        {inputMessage && detectLanguage(inputMessage) !== currentLanguage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-ocean-400 flex items-center space-x-2"
          >
            <Translate className="h-3 w-3" />
            <span>
              Detected: {languages.find(l => l.code === detectLanguage(inputMessage))?.name}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MultilingualChatbot;