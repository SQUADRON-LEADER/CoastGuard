import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Square, Languages, Radio, AlertOctagon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  sampleMessage: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en-IN',
    name: 'English',
    nativeName: 'English',
    sampleMessage: 'Emergency Siren Alert! High wave and storm warning issued for coastal areas. Fishermen must return to port immediately.',
  },
  {
    code: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    sampleMessage: 'அவசர எச்சரிக்கை! கடற்கரை பகுதிகளில் பலத்த காற்று மற்றும் புயல் எச்சரிக்கை விடுக்கப்பட்டுள்ளது. மீனவர்கள் உடனடியாக கரைக்கு திரும்புமாறு கேட்டுக்கொள்ளப்படுகிறார்கள்.',
  },
  {
    code: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    sampleMessage: 'തീരദേശത്ത് ശക്തമായ കാറ്റിനും തിരമാലകൾക്കും സാധ്യതയുണ്ട്. മത്സ്യത്തൊഴിലാളികൾ ഉടൻ തീരത്തേക്ക് മടങ്ങണം.',
  },
  {
    code: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    sampleMessage: 'తీరప్రాంత హెచ్చరిక! సముద్రంలో తుఫాను తీవ్రత વધడంతో మత్స్యకారులు వెంటనే సురక్షిత ప్రాంతాలకు చేరుకోవాలి.',
  },
  {
    code: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    sampleMessage: 'દરિયાઈ ઈમરજન્સી એલર્ટ! ભારે પવન અને ઊંચા મોજાની ચેતવણી. માછીમારોએ તરત જ કાંઠે પાછા ફરવું.',
  },
  {
    code: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    sampleMessage: 'किनारपट्टीसाठी आपत्कालीन इशारा! तीव्र वादळ आणि उंच लाटांची शक्यता. मच्छिमारांनी तात्काळ किनाऱ्यावर परतावे.',
  },
  {
    code: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    sampleMessage: 'উপকূলীয় জরুরী সতর্কতা! উচ্চ তরঙ্গ ও ঘূর্ণিঝড় সতর্কবার্তা जारी করা হয়েছে। মৎস্যজীবীদের অবিলম্বে তীরে ফিরে আসার অনুরোধ করা হচ্ছে।',
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    sampleMessage: 'आपातकालीन चेतावनी! तटीय क्षेत्रों में ऊंची लहरें और चक्रवाती तूफान का अलर्ट जारी। मछुआरे तुरंत तट पर वापस लौटें।',
  },
];

export const AudioAlertPlayer: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-Speech is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = customText.trim() || selectedLang.sampleMessage;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedLang.code;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast.error('Failed to play audio alert.');
    };

    window.speechSynthesis.speak(utterance);
    toast.success(`Broadcasting emergency alert in ${selectedLang.name}...`);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full bg-white text-slate-800 rounded-2xl p-6 shadow-md border border-indigo-100 my-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
            <Radio className="w-7 h-7 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide text-blue-900">Multilingual Audio Warning Broadcast</h2>
            <p className="text-sm text-slate-500">Audio sirens & voice broadcasts in 8 regional Indian coastal languages</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
          <Languages className="w-5 h-5 text-indigo-600" />
          <span className="text-xs text-indigo-800 font-semibold">8 Coastal Languages</span>
        </div>
      </div>

      {/* Language Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-5">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              setSelectedLang(lang);
              if (isPlaying) handleStop();
            }}
            className={`p-3 rounded-xl text-left border transition-all ${
              selectedLang.code === lang.code
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
            }`}
          >
            <span className={`text-xs block font-semibold mb-0.5 ${selectedLang.code === lang.code ? 'text-indigo-100' : 'text-indigo-600'}`}>{lang.name}</span>
            <span className="text-sm font-bold block">{lang.nativeName}</span>
          </button>
        ))}
      </div>

      {/* Message Preview & Voice Control Box */}
      <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 mb-4">
        <label className="text-xs font-semibold text-blue-900 mb-2 block flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-amber-600" />
          <span>Broadcast Warning Text ({selectedLang.nativeName})</span>
        </label>

        <textarea
          rows={3}
          value={customText || selectedLang.sampleMessage}
          onChange={(e) => setCustomText(e.target.value)}
          className="w-full bg-white text-sm text-blue-900 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 leading-relaxed font-sans"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-indigo-100">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            {isPlaying ? (
              <span className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Broadcasting Audio Alert...</span>
              </span>
            ) : (
              <span>Ready for voice dispatch</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isPlaying ? (
              <button
                onClick={handleStop}
                className="flex items-center space-x-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition shadow-sm"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Broadcast</span>
              </button>
            ) : (
              <button
                onClick={handleSpeak}
                className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Broadcast Audio Siren</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioAlertPlayer;
