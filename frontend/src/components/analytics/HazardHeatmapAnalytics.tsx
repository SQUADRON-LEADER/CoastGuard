import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Filter, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

interface TrendData {
  month: string;
  cyclones: number;
  highSurge: number;
  oilSpills: number;
  boatCapsizes: number;
}

const TEMPORAL_DATA: TrendData[] = [
  { month: 'Jan', cyclones: 1, highSurge: 4, oilSpills: 0, boatCapsizes: 2 },
  { month: 'Feb', cyclones: 0, highSurge: 3, oilSpills: 1, boatCapsizes: 1 },
  { month: 'Mar', cyclones: 2, highSurge: 5, oilSpills: 0, boatCapsizes: 3 },
  { month: 'Apr', cyclones: 4, highSurge: 8, oilSpills: 2, boatCapsizes: 5 },
  { month: 'May', cyclones: 9, highSurge: 14, oilSpills: 1, boatCapsizes: 8 },
  { month: 'Jun', cyclones: 12, highSurge: 19, oilSpills: 3, boatCapsizes: 11 },
  { month: 'Jul', cyclones: 15, highSurge: 22, oilSpills: 2, boatCapsizes: 14 },
];

const REGIONAL_RISK = [
  { region: 'Tamil Nadu Coast', riskIndex: 88, severeIncidents: 42, activeAlerts: 'High Surge & Depression' },
  { region: 'Odisha Maritime Zone', riskIndex: 94, severeIncidents: 58, activeAlerts: 'Severe Cyclonic Storm' },
  { region: 'Kerala Coast', riskIndex: 76, severeIncidents: 29, activeAlerts: 'Squally Winds & High Tide' },
  { region: 'Gujarat Coast', riskIndex: 62, severeIncidents: 18, activeAlerts: 'Moderate Sea Conditions' },
  { region: 'West Bengal Sundarbans', riskIndex: 91, severeIncidents: 51, activeAlerts: 'High Tidal Inundation' },
];

export const HazardHeatmapAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('2026 YTD');

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-purple-500/30 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/40">
            <BarChart3 className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Coastal Hazard Severity & Temporal Analytics</h2>
            <p className="text-sm text-slate-400">Historical trend mapping, regional risk index, and AI hazard prediction confidence</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-purple-950/60 px-4 py-2 rounded-xl border border-purple-800/50">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="text-xs text-purple-200 font-semibold">96.4% AI CONFIDENCE</span>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 block mb-1">Total Reported Incidents</span>
          <span className="text-2xl font-bold text-white">428</span>
          <span className="text-[10px] text-purple-400 block mt-1">+14% vs last season</span>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 block mb-1">Highest Risk Region</span>
          <span className="text-lg font-bold text-amber-300">Odisha Coast</span>
          <span className="text-[10px] text-slate-400 block mt-1">Risk Index: 94/100</span>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 block mb-1">AI Early Warnings Issued</span>
          <span className="text-2xl font-bold text-emerald-400">142</span>
          <span className="text-[10px] text-emerald-300 block mt-1">100% verified broadcast</span>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 block mb-1">Evacuations Triggered</span>
          <span className="text-2xl font-bold text-cyan-400">18,500+</span>
          <span className="text-[10px] text-cyan-300 block mt-1">Lives protected</span>
        </div>
      </div>

      {/* Temporal Trend Chart */}
      <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/60 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Monthly Coastal Hazard Trends</h3>
            <p className="text-xs text-slate-400">Incidents broken down by Cyclones, High Surges, and Boat Capsize</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300">2026 Monsoon Season</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TEMPORAL_DATA}>
              <defs>
                <linearGradient id="colorCyclones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSurge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#f8fafc' }} />
              <Area type="monotone" dataKey="cyclones" stroke="#ef4444" fillOpacity={1} fill="url(#colorCyclones)" name="Cyclones" />
              <Area type="monotone" dataKey="highSurge" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSurge)" name="High Surges" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Vulnerability Index List */}
      <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/60">
        <h3 className="text-base font-bold text-slate-100 mb-3">Regional Risk Matrix</h3>
        <div className="space-y-3">
          {REGIONAL_RISK.map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-700/50 gap-3">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center border border-purple-500/30">
                  #{i + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{r.region}</h4>
                  <span className="text-xs text-amber-400 font-medium">Alert: {r.activeAlerts}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Incidents</span>
                  <span className="text-xs font-bold text-slate-200">{r.severeIncidents}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Vulnerability Index</span>
                  <span className={`text-sm font-bold ${r.riskIndex > 85 ? 'text-red-400' : 'text-amber-400'}`}>
                    {r.riskIndex}/100
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HazardHeatmapAnalytics;
