import React, { useState } from 'react';
import { Wind, Waves, AlertTriangle, ShieldAlert, Eye, MapPin, RefreshCw, Thermometer } from 'lucide-react';

interface WeatherRegion {
  id: string;
  name: string;
  state: string;
  windSpeed: number;
  waveHeight: number;
  visibility: number;
  tideStatus: 'High Tide' | 'Low Tide' | 'Normal';
  warningLevel: 'Normal' | 'Advisory' | 'Warning' | 'Severe' | 'Critical';
  summary: string;
  updatedAt: string;
  seaTemp?: number;
}

// Includes mock coastal regions for expanded territory monitoring (including Andaman & Lakshadweep)
const SAMPLE_REGIONS: WeatherRegion[] = [
  {
    id: 'tn-chennai',
    name: 'Chennai Coast',
    state: 'Tamil Nadu',
    windSpeed: 24,
    waveHeight: 2.8,
    visibility: 6,
    tideStatus: 'High Tide',
    warningLevel: 'Warning',
    summary: 'Depression over Southwest Bay of Bengal. Fishermen advised not to venture into deep sea.',
    updatedAt: '10 mins ago',
    seaTemp: 29,
  },
  {
    id: 'kl-kochi',
    name: 'Kochi Port & Waters',
    state: 'Kerala',
    windSpeed: 18,
    waveHeight: 1.9,
    visibility: 8,
    tideStatus: 'Normal',
    warningLevel: 'Advisory',
    summary: 'Squally weather with wind speed reaching 35-45 kmph expected along coast.',
    updatedAt: '25 mins ago',
    seaTemp: 28,
  },
  {
    id: 'od-puri',
    name: 'Puri Maritime Zone',
    state: 'Odisha',
    windSpeed: 32,
    waveHeight: 3.5,
    visibility: 4,
    tideStatus: 'High Tide',
    warningLevel: 'Severe',
    summary: 'Severe cyclonic storm formation predicted. Rough sea conditions with high wave action.',
    updatedAt: 'Just now',
    seaTemp: 27,
  },
  {
    id: 'gj-veraval',
    name: 'Veraval & Porbandar',
    state: 'Gujarat',
    windSpeed: 12,
    waveHeight: 1.2,
    visibility: 10,
    tideStatus: 'Low Tide',
    warningLevel: 'Normal',
    summary: 'Calm sea conditions. Safe for nearshore fishing operations.',
    updatedAt: '1 hour ago',
    seaTemp: 26,
  },
  {
    id: 'wb-haldia',
    name: 'Haldia & Sundarbans',
    state: 'West Bengal',
    windSpeed: 28,
    waveHeight: 3.1,
    visibility: 5,
    tideStatus: 'High Tide',
    warningLevel: 'Critical',
    summary: 'High surge alert during full moon tide. Embankment vulnerability high.',
    updatedAt: '5 mins ago',
    seaTemp: 28,
  },
  {
    id: 'an-portblair',
    name: 'Port Blair & Andaman Waters',
    state: 'Andaman & Nicobar',
    windSpeed: 22,
    waveHeight: 2.4,
    visibility: 7,
    tideStatus: 'Normal',
    warningLevel: 'Advisory',
    summary: 'Moderate swell activity reported. Inter-island ferry services may be affected. Vessels advised to exercise caution.',
    updatedAt: '15 mins ago',
    seaTemp: 30,
  },
  {
    id: 'ld-kavaratti',
    name: 'Kavaratti & Lakshadweep Sea',
    state: 'Lakshadweep',
    windSpeed: 14,
    waveHeight: 1.5,
    visibility: 12,
    tideStatus: 'Low Tide',
    warningLevel: 'Normal',
    summary: 'Fair weather conditions over Lakshadweep Sea. Coral reef areas experiencing normal current patterns.',
    updatedAt: '30 mins ago',
    seaTemp: 31,
  },
];

export const WeatherAdvisoryBanner: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_REGIONS[0].id);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const activeRegion = SAMPLE_REGIONS.find((r) => r.id === selectedId) || SAMPLE_REGIONS[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getBadgeColor = (level: WeatherRegion['warningLevel']) => {
    switch (level) {
      case 'Normal':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Advisory':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Warning':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Severe':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300 animate-pulse';
    }
  };

  const getWarningGradient = (level: WeatherRegion['warningLevel']) => {
    switch (level) {
      case 'Normal':    return 'from-emerald-500 to-teal-500';
      case 'Advisory':  return 'from-amber-500 to-orange-400';
      case 'Warning':   return 'from-orange-500 to-red-400';
      case 'Severe':    return 'from-red-600 to-rose-500';
      case 'Critical':  return 'from-red-700 to-red-600';
    }
  };

  return (
    <div className="w-full bg-white text-slate-800 rounded-2xl shadow-md border border-blue-100 my-6 overflow-hidden">
      {/* Coloured top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${getWarningGradient(activeRegion.warningLevel)}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <Waves className="w-7 h-7 text-blue-600 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-wide text-blue-900">Coastal Weather & Sea Advisory</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold">
                  LIVE IMD DATA
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">Real-time oceanographic warnings for Indian fishermen & authorities</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="bg-white text-sm text-blue-900 px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-8 cursor-pointer shadow-sm"
              >
                {SAMPLE_REGIONS.map((r) => (
                  <option key={r.id} value={r.id} className="bg-white text-slate-800">
                    {r.name} ({r.state})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-blue-600 border border-blue-200"
              title="Refresh marine weather data"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Advisory Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {/* Warning card */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-700">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{activeRegion.name}, {activeRegion.state}</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getBadgeColor(activeRegion.warningLevel)}`}>
                STATUS: {activeRegion.warningLevel.toUpperCase()}
              </span>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">IMD Ocean Bulletin</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{activeRegion.summary}</p>
                <p className="text-xs text-slate-400 mt-2">Updated {activeRegion.updatedAt}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 font-medium">
                {activeRegion.warningLevel === 'Critical' || activeRegion.warningLevel === 'Severe'
                  ? '⚠ Fishermen must not venture to sea. Emergency services on standby.'
                  : activeRegion.warningLevel === 'Warning'
                  ? 'Deep sea fishing not recommended. Stay within 12nm of coast.'
                  : 'Safe for supervised near-shore operations. Monitor updates every 3 hours.'}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <Wind className="w-4 h-4" />
                <span className="text-xs text-blue-600 font-medium">Wind Speed</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{activeRegion.windSpeed} <span className="text-xs font-normal text-slate-400">knots</span></p>
              <p className="text-[10px] text-slate-400 mt-1">{(activeRegion.windSpeed * 1.852).toFixed(1)} km/h</p>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-sky-600 mb-1">
                <Waves className="w-4 h-4" />
                <span className="text-xs text-sky-600 font-medium">Wave Height</span>
              </div>
              <p className="text-2xl font-bold text-sky-900">{activeRegion.waveHeight} <span className="text-xs font-normal text-slate-400">m</span></p>
              <p className="text-[10px] text-slate-400 mt-1">Swell Period: 8s</p>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs text-indigo-600 font-medium">Visibility</span>
              </div>
              <p className="text-2xl font-bold text-indigo-900">{activeRegion.visibility} <span className="text-xs font-normal text-slate-400">km</span></p>
              <p className="text-[10px] text-slate-400 mt-1">{activeRegion.tideStatus}</p>
            </div>

            {activeRegion.seaTemp && (
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-teal-600 mb-1">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-xs text-teal-600 font-medium">Sea Temp</span>
                </div>
                <p className="text-2xl font-bold text-teal-900">{activeRegion.seaTemp}<span className="text-xs font-normal text-slate-400">°C</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Surface reading</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAdvisoryBanner;
