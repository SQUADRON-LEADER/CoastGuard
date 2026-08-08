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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Caution Zone':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Danger Border':
      case 'International Boundary Breach':
        return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
    }
  };

  return (
    <div className="w-full bg-white text-slate-800 rounded-2xl p-6 shadow-md border border-sky-100 my-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
            <Compass className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide text-blue-900">Fisherman Geofence & Border Safe Zone</h2>
            <p className="text-sm text-slate-500">Real-time territorial water geofencing & maritime boundary distance monitoring</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <span className="text-xs text-sky-800 font-semibold">GEOFENCE ACTIVE</span>
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
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedVessel.vesselId === vessel.vesselId
                  ? 'bg-sky-50 border-sky-300 text-blue-900 shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold text-blue-700">{vessel.vesselId}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusStyle(vessel.status)}`}>
                  {vessel.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-blue-900">{vessel.vesselName}</h4>
              <p className="text-xs text-slate-500 mt-1">Border Dist: {vessel.distanceToBorderKm} km</p>
            </div>
          ))}
        </div>

        {/* Selected Vessel Telemetry Panel */}
        <div className="lg:col-span-2 space-y-4 bg-sky-50/50 p-5 rounded-2xl border border-sky-100">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div>
              <span className="text-xs text-slate-400 font-mono">SELECTED VESSEL TELEMETRY</span>
              <h3 className="text-lg font-bold text-blue-900">{selectedVessel.vesselName}</h3>
            </div>
            <Anchor className="w-6 h-6 text-sky-600" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-sm">
              <span className="text-xs text-slate-400 block mb-1">Border Distance</span>
              <span className={`text-xl font-bold ${selectedVessel.distanceToBorderKm < 10 ? 'text-red-600' : 'text-emerald-600'}`}>
                {selectedVessel.distanceToBorderKm} km
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-sm">
              <span className="text-xs text-slate-400 block mb-1">Nearest Port</span>
              <span className="text-sm font-bold text-blue-900 block truncate">{selectedVessel.nearestPort}</span>
              <span className="text-[10px] text-sky-600 font-medium">{selectedVessel.distanceToPortKm} km away</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-sm">
              <span className="text-xs text-slate-400 block mb-1">Cruising Speed</span>
              <span className="text-xl font-bold text-blue-800">{selectedVessel.speedKnots} knots</span>
            </div>
          </div>

          {/* Coordinate Calculator */}
          <div className="p-4 bg-white rounded-xl border border-sky-100 shadow-sm mt-4">
            <h4 className="text-xs font-bold text-blue-900 mb-3 flex items-center space-x-1.5">
              <Crosshair className="w-4 h-4 text-sky-600" />
              <span>Custom GPS Geofence Check</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1 font-medium">Latitude</label>
                <input
                  type="text"
                  value={userLat}
                  onChange={(e) => setUserLat(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-blue-900 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-300"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1 font-medium">Longitude</label>
                <input
                  type="text"
                  value={userLng}
                  onChange={(e) => setUserLng(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-blue-900 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-300"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleEvaluateGeofence}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Check Risk
                </button>
              </div>
            </div>

            {calculatedRisk && (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 font-mono">
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
