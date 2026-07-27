import React, { useState } from 'react';
import { Compass, ShieldCheck, AlertTriangle, Anchor, Navigation, Crosshair, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SafeZoneInfo {
  vesselId: string;
  vesselName: string;
  latitude: number;
  longitude: number;
  distanceToBorderKm: number; // International Maritime Boundary Line
  nearestPort: string;
  distanceToPortKm: number;
  status: 'Safe Water' | 'Caution Zone' | 'Danger Border' | 'International Boundary Breach';
  speedKnots: number;
}

const SAMPLE_VESSELS: SafeZoneInfo[] = [
  {
    vesselId: 'IND-TN-982',
    vesselName: 'Sea Queen V (Nagapattinam)',
    latitude: 10.762,
    longitude: 79.842,
    distanceToBorderKm: 42.5,
    nearestPort: 'Nagapattinam Fishing Harbor',
    distanceToPortKm: 12.3,
    status: 'Safe Water',
    speedKnots: 8.5,
  },
  {
    vesselId: 'IND-TN-411',
    vesselName: 'Ocean Rider II (Rameswaram)',
    latitude: 9.288,
    longitude: 79.312,
    distanceToBorderKm: 6.8,
    nearestPort: 'Rameswaram Harbor',
    distanceToPortKm: 18.2,
    status: 'Caution Zone',
    speedKnots: 11.2,
  },
  {
    vesselId: 'IND-KL-204',
    vesselName: 'Matsya Kripa (Kochi)',
    latitude: 9.931,
    longitude: 76.267,
    distanceToBorderKm: 120.0,
    nearestPort: 'Cochin Port Trust',
    distanceToPortKm: 5.4,
    status: 'Safe Water',
    speedKnots: 6.0,
  },
  {
    vesselId: 'IND-TN-099',
    vesselName: 'Kadal Kanni (Pamban)',
    latitude: 9.255,
    longitude: 79.482,
    distanceToBorderKm: 1.8,
    nearestPort: 'Pamban Port',
    distanceToPortKm: 24.1,
    status: 'Danger Border',
    speedKnots: 14.0,
  },
];

export const GeofenceOverlay: React.FC = () => {
  const [selectedVessel, setSelectedVessel] = useState<SafeZoneInfo>(SAMPLE_VESSELS[0]);
  const [userLat, setUserLat] = useState<string>('13.0827');
  const [userLng, setUserLng] = useState<string>('80.2707');
  const [calculatedRisk, setCalculatedRisk] = useState<string | null>(null);

  const handleEvaluateGeofence = () => {
    const lat = parseFloat(userLat);
    const lng = parseFloat(userLng);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Invalid latitude or longitude coordinates');
      return;
    }

    // Simple distance calculation placeholder for demonstration
    const borderDist = Math.max(2, Math.min(150, Math.round((Math.abs(lat - 10) + Math.abs(lng - 79)) * 30)));
    let riskLevel = 'Safe Territorial Waters';
    if (borderDist < 5) riskLevel = 'CRITICAL: High Risk of Maritime Border Breach!';
    else if (borderDist < 15) riskLevel = 'WARNING: Nearing Border Warning Zone';

    setCalculatedRisk(`Distance to Border: ${borderDist} km. Status: ${riskLevel}`);
    toast.success('Geofence boundary calculated!');
  };

  const getStatusStyle = (status: SafeZoneInfo['status']) => {
    switch (status) {
      case 'Safe Water':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Caution Zone':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Danger Border':
      case 'International Boundary Breach':
        return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-cyan-500/30 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/40">
            <Compass className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Fisherman Geofence & Border Safe Zone</h2>
            <p className="text-sm text-slate-400">Real-time territorial water geofencing & maritime boundary distance monitoring</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-cyan-950/60 px-4 py-2 rounded-xl border border-cyan-800/50">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span className="text-xs text-cyan-200 font-semibold">GEOFENCE ACTIVE</span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Vessel Selector List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracked Fishing Vessels</h3>
          {SAMPLE_VESSELS.map((vessel) => (
            <div
              key={vessel.vesselId}
              onClick={() => setSelectedVessel(vessel)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                selectedVessel.vesselId === vessel.vesselId
                  ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg'
                  : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold text-cyan-300">{vessel.vesselId}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusStyle(vessel.status)}`}>
                  {vessel.status}
                </span>
              </div>
              <h4 className="font-bold text-sm">{vessel.vesselName}</h4>
              <p className="text-xs text-slate-400 mt-1">Border Dist: {vessel.distanceToBorderKm} km</p>
            </div>
          ))}
        </div>

        {/* Selected Vessel Telemetry Panel */}
        <div className="lg:col-span-2 space-y-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
            <div>
              <span className="text-xs text-slate-400 font-mono">SELECTED VESSEL TELEMETRY</span>
              <h3 className="text-lg font-bold text-cyan-200">{selectedVessel.vesselName}</h3>
            </div>
            <Anchor className="w-6 h-6 text-cyan-400" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Border Distance</span>
              <span className={`text-xl font-bold ${selectedVessel.distanceToBorderKm < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                {selectedVessel.distanceToBorderKm} km
              </span>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Nearest Port</span>
              <span className="text-sm font-bold text-slate-200 block truncate">{selectedVessel.nearestPort}</span>
              <span className="text-[10px] text-cyan-400">{selectedVessel.distanceToPortKm} km away</span>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Cruising Speed</span>
              <span className="text-xl font-bold text-cyan-300">{selectedVessel.speedKnots} knots</span>
            </div>
          </div>

          {/* Coordinate Calculator */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/80 mt-4">
            <h4 className="text-xs font-bold text-cyan-300 mb-3 flex items-center space-x-1.5">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>Custom GPS Geofence Check</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Latitude</label>
                <input
                  type="text"
                  value={userLat}
                  onChange={(e) => setUserLat(e.target.value)}
                  className="w-full bg-slate-800 text-xs text-white p-2 rounded-lg border border-slate-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Longitude</label>
                <input
                  type="text"
                  value={userLng}
                  onChange={(e) => setUserLng(e.target.value)}
                  className="w-full bg-slate-800 text-xs text-white p-2 rounded-lg border border-slate-700"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleEvaluateGeofence}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-cyan-600/20"
                >
                  Check Risk
                </button>
              </div>
            </div>

            {calculatedRisk && (
              <div className="p-2.5 bg-cyan-950/60 border border-cyan-800/60 rounded-lg text-xs text-cyan-200 font-mono">
                {calculatedRisk}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeofenceOverlay;
