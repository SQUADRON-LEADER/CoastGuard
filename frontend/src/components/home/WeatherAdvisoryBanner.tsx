import React, { useState } from 'react';
import { Wind, Waves, AlertTriangle, ShieldAlert, Compass, Eye, MapPin, RefreshCw } from 'lucide-react';

interface WeatherRegion {
  id: string;
  name: string;
  state: string;
  windSpeed: number; // in knots
  waveHeight: number; // in meters
  visibility: number; // in km
  tideStatus: 'High Tide' | 'Low Tide' | 'Normal';
  warningLevel: 'Normal' | 'Advisory' | 'Warning' | 'Severe' | 'Critical';
  summary: string;
  updatedAt: string;
}

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
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Advisory':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Warning':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Severe':
      case 'Critical':
        return 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse';
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-2xl p-6 shadow-2xl border border-sky-800/40 my-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-sky-800/40">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-500/20 rounded-xl border border-sky-400/30">
            <Waves className="w-7 h-7 text-sky-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-wide">Coastal Weather & Sea Advisory</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
                LIVE IMD DATA
              </span>
            </div>
            <p className="text-sm text-sky-200/70">Real-time oceanographic warnings for Indian fishermen & authorities</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Region selector */}
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-800/90 text-sm text-white px-4 py-2 rounded-xl border border-sky-700/50 focus:outline-none focus:ring-2 focus:ring-sky-400 pr-8 cursor-pointer"
            >
              {SAMPLE_REGIONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.name} ({r.state})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 bg-sky-800/40 hover:bg-sky-700/60 rounded-xl transition text-sky-200 border border-sky-700/40"
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
            <div className="flex items-center space-x-2 text-sky-300">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span className="font-semibold">{activeRegion.name}, {activeRegion.state}</span>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getBadgeColor(activeRegion.warningLevel)}`}>
              STATUS: {activeRegion.warningLevel.toUpperCase()}
            </span>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-sky-800/60 flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-semibold text-amber-200 mb-1">IMD Ocean Bulletin</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{activeRegion.summary}</p>
              <p className="text-xs text-sky-400/60 mt-2">Updated {activeRegion.updatedAt}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-sky-800/40 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-sky-400 mb-1">
              <Wind className="w-4 h-4" />
              <span className="text-xs text-sky-300 font-medium">Wind Speed</span>
            </div>
            <p className="text-2xl font-bold text-white">{activeRegion.windSpeed} <span className="text-xs font-normal text-slate-400">knots</span></p>
            <p className="text-[10px] text-sky-300/60 mt-1">{(activeRegion.windSpeed * 1.852).toFixed(1)} km/h</p>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-sky-800/40 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-sky-400 mb-1">
              <Waves className="w-4 h-4" />
              <span className="text-xs text-sky-300 font-medium">Wave Height</span>
            </div>
            <p className="text-2xl font-bold text-white">{activeRegion.waveHeight} <span className="text-xs font-normal text-slate-400">m</span></p>
            <p className="text-[10px] text-sky-300/60 mt-1">Swell Period: 8s</p>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-sky-800/40 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-sky-400 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs text-sky-300 font-medium">Visibility</span>
            </div>
            <p className="text-2xl font-bold text-white">{activeRegion.visibility} <span className="text-xs font-normal text-slate-400">km</span></p>
            <p className="text-[10px] text-sky-300/60 mt-1">{activeRegion.tideStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAdvisoryBanner;
