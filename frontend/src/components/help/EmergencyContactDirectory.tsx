import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, Send, MapPin, Copy, Check, LifeBuoy, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContactItem {
  id: string;
  name: string;
  category: 'National' | 'State' | 'Medical' | 'Fisheries' | 'Police';
  phone: string;
  description: string;
  available: string;
}

const EMERGENCY_CONTACTS: ContactItem[] = [
  {
    id: 'icg-sos',
    name: 'Indian Coast Guard Maritime Helpline',
    category: 'National',
    phone: '1554',
    description: 'Toll-free emergency hotline for vessel distress, capsizing, and search & rescue operations.',
    available: '24/7 Toll-Free',
  },
  {
    id: 'ndrf-hq',
    name: 'NDRF Central Control Room',
    category: 'National',
    phone: '1078',
    description: 'National Disaster Response Force emergency deployment and evacuation dispatch.',
    available: '24/7 Toll-Free',
  },
  {
    id: 'sdma-kerala',
    name: 'Coastal Disaster Management Cell',
    category: 'State',
    phone: '1070',
    description: 'State disaster emergency cell for coastal inundation and shelter coordination.',
    available: '24/7 Support',
  },
  {
    id: 'marine-police',
    name: 'Coastal Security Police Patrol',
    category: 'Police',
    phone: '1093',
    description: 'Coastal border patrol, unauthorized vessel detection, and harbor safety.',
    available: '24/7 Patrol',
  },
  {
    id: 'marine-ambulance',
    name: 'Pratheeksha Marine Ambulance',
    category: 'Medical',
    phone: '108',
    description: 'Emergency sea ambulance equipped with ICU setup for offshore medical evacuation.',
    available: '24/7 Emergency',
  },
  {
    id: 'fisheries-dept',
    name: 'Department of Fisheries Helpline',
    category: 'Fisheries',
    phone: '1800-425-1660',
    description: 'Vessel tracking, harbor advisory, and missing fisherman reporting desk.',
    available: '06:00 AM - 10:00 PM',
  },
];

export const EmergencyContactDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customLocation, setCustomLocation] = useState<string>('Lat: 13.0827° N, Lng: 80.2707° E (Off Chennai Coast)');

  const categories = ['All', 'National', 'State', 'Medical', 'Fisheries', 'Police'];

  const filteredContacts = selectedCategory === 'All'
    ? EMERGENCY_CONTACTS
    : EMERGENCY_CONTACTS.filter(c => c.category === selectedCategory);

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    toast.success(`Copied ${phone} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateSMS = (phone: string, name: string) => {
    const message = `EMERGENCY SOS! Require urgent marine rescue assistance at location: ${customLocation}. Contact Name: ${name}`;
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-red-500/30 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/40">
            <ShieldAlert className="w-7 h-7 text-red-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Coastal Emergency Helplines</h2>
            <p className="text-sm text-slate-400">Instant access to maritime rescue, NDRF, and emergency services</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-red-950/60 px-4 py-2 rounded-xl border border-red-800/50">
          <LifeBuoy className="w-5 h-5 text-red-400" />
          <span className="text-xs text-red-200 font-semibold">24x7 DIRECT SOS LINES</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 my-5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition border ${
              selectedCategory === cat
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Emergency SMS Generator Bar */}
      <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="w-full">
            <span className="text-xs text-slate-400 block font-medium">GPS Location for Emergency Broadcast</span>
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="bg-slate-900 text-xs text-amber-200 px-3 py-1.5 rounded-lg border border-slate-700 w-full focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Click <span className="text-red-400 font-semibold">"Send SMS SOS"</span> on any contact below to launch instant SMS payload.
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/60 hover:border-red-500/50 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 border border-slate-600/40">
                  {contact.category}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">● {contact.available}</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base mb-1">{contact.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{contact.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-red-600/20"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {contact.phone}</span>
              </a>

              <button
                onClick={() => handleCopyPhone(contact.id, contact.phone)}
                className="p-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
                title="Copy Number"
              >
                {copiedId === contact.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleGenerateSMS(contact.phone, contact.name)}
                className="p-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded-lg text-xs transition border border-amber-500/30"
                title="Send SMS SOS"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContactDirectory;
