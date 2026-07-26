import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, MapPin, Phone, ChevronRight, AlertTriangle, CheckCircle, Navigation, Route, Zap, Radio } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

// Fix leaflet default icon URLs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE';

interface EvacStep {
  step: number;
  icon: string;
  title: string;
  description: string;
}

interface ReliefCamp {
  name: string;
  address: string;
  distance: string;
  contact: string;
}

interface Contact {
  name: string;
  number: string;
}

interface Waypoint {
  name: string;
  type: 'start' | 'waypoint' | 'destination';
  icon: string;
  instruction: string;
  hazard: boolean;
  lat?: number;
  lng?: number;
}

interface RouteInfo {
  name: string;
  totalDistance: string;
  estimatedDriveTime: string;
  status: string;
  waypoints?: Waypoint[];
}

interface HazardZone {
  name: string;
  reason: string;
}

interface EvacPlan {
  title: string;
  urgencyLevel: UrgencyLevel;
  estimatedTime: string;
  situation: string;
  agentSummary?: string;
  primaryRoute?: RouteInfo;
  alternateRoute?: RouteInfo;
  hazardZones?: HazardZone[];
  steps: EvacStep[];
  reliefCamps: ReliefCamp[];
  contacts: Contact[];
  doList: string[];
  avoidList: string[];
  safeZones: string;
}

const AGENT_STAGES = [
  { id: 1, icon: '🛰️', label: 'Scanning your location', detail: 'Accessing geospatial hazard data…' },
  { id: 2, icon: '⚠️', label: 'Mapping flood & surge zones', detail: 'Cross-referencing SDMA inundation models…' },
  { id: 3, icon: '🗺️', label: 'Plotting escape corridors', detail: 'Analysing road network & bridge statuses…' },
  { id: 4, icon: '🏕️', label: 'Locating active relief camps', detail: 'Checking camp availability & distance…' },
  { id: 5, icon: '✅', label: 'Finalising your rescue route', detail: 'Optimising for fastest safe evacuation…' },
];

const DISASTER_TYPES = [
  { value: 'cyclone', label: '🌀 Cyclone' },
  { value: 'storm_surge', label: '🌊 Storm Surge' },
  { value: 'tsunami', label: '🌊 Tsunami' },
  { value: 'flood', label: '🌧️ Flood' },
  { value: 'coastal_flooding', label: '💧 Coastal Flooding' },
  { value: 'earthquake', label: '🏔️ Earthquake' },
  { value: 'oil_spill', label: '🛢️ Oil Spill' },
  { value: 'high_waves', label: '🏄 High Waves' },
];

const urgencyConfig: Record<UrgencyLevel, { bg: string; text: string; border: string; label: string; pulse: string }> = {
  CRITICAL: { bg: 'bg-red-600',    text: 'text-red-600',    border: 'border-red-500',    label: '🔴 CRITICAL', pulse: 'bg-red-400' },
  HIGH:     { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-400', label: '🟠 HIGH',     pulse: 'bg-orange-400' },
  MODERATE: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-400', label: '🟡 MODERATE', pulse: 'bg-yellow-400' },
};

// ─── Agent Thinking Loader ────────────────────────────────────────────────────
const AgentLoader: React.FC<{ location: string }> = ({ location }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= AGENT_STAGES.length - 1) return;
    const t = setTimeout(() => setStageIndex(i => i + 1), 1100);
    return () => clearTimeout(t);
  }, [stageIndex]);

  return (
    <div className="flex flex-col p-5 gap-4">
      {/* Agent header */}
      <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl p-3">
        <div className="relative">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-orange-900">AI Rescue Agent • Active</p>
          <p className="text-xs text-orange-600">Analysing {location}…</p>
        </div>
      </div>

      {/* Stage list */}
      <div className="space-y-2">
        {AGENT_STAGES.map((stage, i) => {
          const done = i < stageIndex;
          const active = i === stageIndex;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: i <= stageIndex ? 1 : 0.25, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                active ? 'bg-orange-50 border border-orange-300' : done ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <span className="text-lg w-7 text-center flex-shrink-0">{done ? '✅' : stage.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${active ? 'text-orange-800' : done ? 'text-green-800' : 'text-gray-400'}`}>
                  {stage.label}
                </p>
                {active && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-orange-500 mt-0.5"
                  >
                    {stage.detail}
                  </motion.p>
                )}
              </div>
              {active && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full flex-shrink-0"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-1">
        Powered by Gemini AI · Tamil Nadu SDMA data
      </p>
    </div>
  );
};

// ─── Map auto-fit helper ──────────────────────────────────────────────────────
const FitBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      try { map.fitBounds(positions, { padding: [48, 48] }); } catch { /* ignore */ }
    } else if (positions.length === 1) {
      map.setView(positions[0], 13);
    }
  }, [map, positions]);
  return null;
};

// Custom tear-drop marker icons
const makeMarkerIcon = (color: string, emoji: string) =>
  L.divIcon({
    className: '',
    html: `<div style="
      background:${color};width:36px;height:36px;
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,.4);
    "><span style="transform:rotate(45deg);font-size:15px;">${emoji}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });

const startIcon = makeMarkerIcon('#f97316', '📍');
const midIcon   = makeMarkerIcon('#3b82f6', '➡');
const destIcon  = makeMarkerIcon('#22c55e', '🏕');

// ─── Force Leaflet to recalculate its size after mount ───────────────────────
const InvalidateSize: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    // Small delay ensures the panel animation has settled before Leaflet measures
    const t = setTimeout(() => { try { map.invalidateSize(); } catch { /* ignore */ } }, 120);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

// ─── Full-screen map overlay (outside panel, no overflow-hidden ancestor) ────
const FullScreenMap: React.FC<{ plan: EvacPlan; onClose: () => void }> = ({ plan, onClose }) => {
  const route = plan.primaryRoute;
  const geoWps = (route?.waypoints ?? []).filter(
    (wp): wp is Waypoint & { lat: number; lng: number } =>
      typeof wp.lat === 'number' && typeof wp.lng === 'number'
  );
  const positions: [number, number][] = geoWps.map(wp => [wp.lat, wp.lng]);
  const center: [number, number] = positions[0] ?? [13.0827, 80.2707];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
      >
        {/* Full-screen Leaflet map — no overflow:hidden anywhere above this */}
        <div style={{ width: '100%', height: '100%' }}>
          <MapContainer
            center={center}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom
            zoomControl
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positions.length >= 2 && <FitBounds positions={positions} />}

            {/* Glow underlay */}
            {positions.length >= 2 && (
              <Polyline positions={positions} pathOptions={{ color: '#93c5fd', weight: 14, opacity: 0.4 }} />
            )}
            {/* Main route line */}
            {positions.length >= 2 && (
              <Polyline positions={positions} pathOptions={{ color: '#2563eb', weight: 6, opacity: 1 }} />
            )}

            {/* Markers */}
            {geoWps.map((wp, i) => (
              <Marker
                key={i}
                position={[wp.lat, wp.lng]}
                icon={wp.type === 'start' ? startIcon : wp.type === 'destination' ? destIcon : midIcon}
              >
                <Popup>
                  <div style={{ minWidth: 180, fontFamily: 'sans-serif' }}>
                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                      {wp.type === 'start' ? '🟠 YOUR LOCATION' : wp.type === 'destination' ? '🟢 RELIEF CAMP' : `🔵 WAYPOINT ${i}`}
                    </p>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{wp.name}</p>
                    <p style={{ color: '#555', fontSize: 12, marginTop: 4 }}>{wp.instruction}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Overlay UI — header bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10000,
          background: 'linear-gradient(135deg,#ea580c,#dc2626)',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,.3)',
        }}>
          <div style={{ background: 'rgba(255,255,255,.2)', borderRadius: 10, padding: '6px 8px' }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>Live Rescue Route Map</p>
            <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 11, margin: 0 }}>
              {route?.name ?? 'Evacuation Route'} · {route?.totalDistance} · ~{route?.estimatedDriveTime}
            </p>
          </div>
          <span style={{
            background: '#dcfce7', color: '#15803d',
            fontWeight: 700, fontSize: 11, padding: '3px 8px', borderRadius: 20,
          }}>
            {route?.status ?? 'CLEAR'}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff',
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
              fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Bottom legend bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10000,
          background: 'rgba(255,255,255,.95)',
          backdropFilter: 'blur(8px)',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 -2px 12px rgba(0,0,0,.15)',
          flexWrap: 'wrap',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} /> Your Location
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} /> Waypoint
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Relief Camp
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
            <span style={{ width: 32, height: 5, borderRadius: 4, background: '#2563eb', display: 'inline-block' }} /> Safe Evacuation Route
          </span>
          {plan.hazardZones && plan.hazardZones.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
              ⚠ {plan.hazardZones.length} hazard zone{plan.hazardZones.length > 1 ? 's' : ''} identified — tap markers
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Route tab content (inside the side panel) ────────────────────────────────
const RouteVisual: React.FC<{ plan: EvacPlan; onOpenMap: () => void }> = ({ plan, onOpenMap }) => {
  const route = plan.primaryRoute;
  if (!route) return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <span className="text-4xl mb-3">🗺️</span>
      <p className="text-sm font-semibold">Route data unavailable</p>
      <p className="text-xs mt-1">Try generating a new plan</p>
    </div>
  );

  const statusColor: Record<string, string> = {
    CLEAR:   'text-green-700 bg-green-100 border-green-300',
    CAUTION: 'text-yellow-700 bg-yellow-100 border-yellow-300',
    AVOID:   'text-red-700 bg-red-100 border-red-300',
  };
  const statusClass = statusColor[route.status] ?? 'text-gray-600 bg-gray-100 border-gray-200';

  const geoWps = (route.waypoints ?? []).filter(
    (wp): wp is Waypoint & { lat: number; lng: number } =>
      typeof wp.lat === 'number' && typeof wp.lng === 'number'
  );
  const positions: [number, number][] = geoWps.map(wp => [wp.lat, wp.lng]);
  const hasMap = geoWps.length >= 2;
  const center: [number, number] = positions[0] ?? [13.0827, 80.2707];

  return (
    <div className="space-y-3">
      {/* Route header card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Route className="h-4 w-4" />
          <p className="font-bold text-sm">Primary Rescue Route</p>
          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full border ${statusClass}`}>
            {route.status}
          </span>
        </div>
        <p className="text-blue-100 text-xs">{route.name}</p>
        <div className="flex gap-3 mt-2 flex-wrap">
          <span className="text-xs bg-white/20 rounded-lg px-2.5 py-1 font-semibold">📏 {route.totalDistance}</span>
          <span className="text-xs bg-white/20 rounded-lg px-2.5 py-1 font-semibold">⏱️ ~{route.estimatedDriveTime}</span>
        </div>
        <button
          onClick={onOpenMap}
          style={{
            marginTop: 10, width: '100%', background: 'rgba(255,255,255,.15)',
            border: '1px solid rgba(255,255,255,.35)', color: '#fff',
            borderRadius: 10, padding: '7px 0', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
          }}
        >
          <Navigation style={{ width: 14, height: 14 }} /> Open Full Screen Map
        </button>
      </div>

      {/* ── Inline map — Leaflet directly in the tab content area ── */}
      {hasMap && (
        <div style={{ height: 260, width: '100%', borderRadius: 14, overflow: 'hidden', border: '2px solid #60a5fa', boxShadow: '0 4px 16px rgba(37,99,235,.18)', position: 'relative' }}>
          <MapContainer
            center={center}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={false}
            zoomControl
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <InvalidateSize />
            <FitBounds positions={positions} />
            <Polyline positions={positions} pathOptions={{ color: '#bfdbfe', weight: 16, opacity: 0.4 }} />
            <Polyline positions={positions} pathOptions={{ color: '#1d4ed8', weight: 5, opacity: 1 }} />
            {geoWps.map((wp, i) => (
              <Marker
                key={i}
                position={[wp.lat, wp.lng]}
                icon={wp.type === 'start' ? startIcon : wp.type === 'destination' ? destIcon : midIcon}
              >
                <Popup>
                  <div style={{ minWidth: 150, fontSize: 12 }}>
                    <p style={{ fontWeight: 700, margin: '0 0 2px' }}>
                      {wp.type === 'start' ? '🟠 START' : wp.type === 'destination' ? '🟢 CAMP' : `🔵 STOP ${i}`}
                    </p>
                    <p style={{ fontWeight: 600, margin: '0 0 3px' }}>{wp.name}</p>
                    <p style={{ color: '#555', margin: 0 }}>{wp.instruction}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          {/* badge */}
          <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 500, background: 'rgba(29,78,216,.88)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, pointerEvents: 'none' }}>🗺️ AI Rescue Route</div>
        </div>
      )}

      {/* Legend */}
      {hasMap && (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-600"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Start</span>
          <span className="flex items-center gap-1 text-xs text-gray-600"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Via</span>
          <span className="flex items-center gap-1 text-xs text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Relief Camp</span>
          <span className="flex items-center gap-1 text-xs text-gray-600"><span className="w-7 h-1.5 bg-blue-600 inline-block rounded" /> Safe Route</span>
        </div>
      )}

      {/* Waypoint turn-by-turn list */}
      {route.waypoints && route.waypoints.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Turn-by-turn directions</p>
          <div className="relative">
            {route.waypoints.map((wp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 relative"
              >
                {i < route.waypoints!.length - 1 && (
                  <div className="absolute left-[18px] top-10 w-0.5 h-[calc(100%-8px)] bg-gradient-to-b from-blue-400 to-blue-200 z-0" />
                )}
                <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base shadow border-2 ${
                  wp.type === 'start'       ? 'bg-orange-500 border-orange-300' :
                  wp.type === 'destination' ? 'bg-green-500 border-green-300'  :
                                              'bg-blue-500 border-blue-300'
                }`}>
                  {wp.icon}
                </div>
                <div className={`flex-1 mb-3 rounded-xl p-2.5 border ${
                  wp.type === 'start'       ? 'bg-orange-50 border-orange-200' :
                  wp.type === 'destination' ? 'bg-green-50 border-green-200'  :
                                              'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-xs font-bold ${
                    wp.type === 'start'       ? 'text-orange-800' :
                    wp.type === 'destination' ? 'text-green-800'  :
                                                'text-blue-800'
                  }`}>
                    {wp.type === 'start' ? '📍 Start: ' : wp.type === 'destination' ? '🏁 Destination: ' : ''}
                    {wp.name}
                  </p>
                  <p className={`text-xs mt-0.5 leading-relaxed ${
                    wp.type === 'start'       ? 'text-orange-700' :
                    wp.type === 'destination' ? 'text-green-700'  :
                                                'text-blue-700'
                  }`}>
                    {wp.instruction}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Alternate route */}
      {plan.alternateRoute && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-700">{plan.alternateRoute.name}</p>
              <p className="text-xs text-gray-500">{plan.alternateRoute.totalDistance} · {plan.alternateRoute.estimatedDriveTime} · {plan.alternateRoute.status}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hazard zones */}
      {plan.hazardZones && plan.hazardZones.length > 0 && (
        <div>
          <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Hazard Zones — AVOID
          </p>
          <div className="space-y-1.5">
            {plan.hazardZones.map((hz, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-2">
                <span className="text-red-500 text-xs font-bold flex-shrink-0 mt-0.5">⊗</span>
                <div>
                  <p className="text-xs font-semibold text-red-800">{hz.name}</p>
                  <p className="text-xs text-red-600">{hz.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const EvacuationAdvisor: React.FC = () => {
  const [isOpen, setIsOpen]             = useState(false);
  const [location, setLocation]         = useState('Marina Beach, Chennai');
  const [disasterType, setDisasterType] = useState('cyclone');
  const [plan, setPlan]                 = useState<EvacPlan | null>(null);
  const [loading, setLoading]           = useState(false);
  const [activeTab, setActiveTab]       = useState<'route' | 'steps' | 'camps' | 'dos'>('route');
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showMap, setShowMap]           = useState(false);
  const stepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generatePlan = async () => {
    if (!location.trim()) {
      toast.error('Please enter your location');
      return;
    }
    setLoading(true);
    setPlan(null);
    setVisibleSteps(0);
    if (stepTimer.current) clearTimeout(stepTimer.current);
    try {
      const res = await fetch('http://localhost:3003/api/ai-evacuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: location.trim(), disasterType }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        setActiveTab('route');
        // stream steps in one by one
        const totalSteps = data.plan.steps?.length ?? 0;
        let s = 0;
        const tick = () => {
          if (s < totalSteps) {
            s++;
            setVisibleSteps(s);
            stepTimer.current = setTimeout(tick, 300);
          }
        };
        stepTimer.current = setTimeout(tick, 600);
        toast.success('🛡️ Rescue route ready!');
      } else {
        throw new Error('No plan returned');
      }
    } catch {
      toast.error('Failed to generate plan. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const urgency = plan ? urgencyConfig[plan.urgencyLevel] ?? urgencyConfig.HIGH : null;

  return (
    <>
      {/* Full-screen map overlay — rendered outside the panel, no overflow:hidden ancestor */}
      {showMap && plan && (
        <FullScreenMap plan={plan} onClose={() => setShowMap(false)} />
      )}

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white p-3.5 rounded-full shadow-2xl z-50"
        title="AI Evacuation Route Advisor"
      >
        <ShieldAlert className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: -80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-4 left-4 w-[390px] max-h-[92vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              style={{ maxWidth: 'calc(100vw - 32px)' }}
            >
              {/* ── Header ── */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative bg-white/20 p-2 rounded-xl">
                      <ShieldAlert className="h-5 w-5 text-white" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-base">AI Rescue Route Advisor</h2>
                      <p className="text-orange-100 text-xs flex items-center gap-1">
                        <Radio className="h-3 w-3 animate-pulse" /> Live · Powered by Gemini AI
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* ── Input Form ── */}
              {!plan && !loading && (
                <div className="p-4 flex-shrink-0">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-xs leading-relaxed">
                      Enter your location and the active disaster type. The AI agent will scan hazard zones and plot the safest rescue corridor for you.
                    </p>
                  </div>

                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Your Location</label>
                  <div className="relative mb-3">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-orange-400" />
                    <input
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Marina Beach, Chennai"
                      className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-0 focus:border-orange-400 transition-colors"
                    />
                  </div>

                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Disaster Type</label>
                  <select
                    value={disasterType}
                    onChange={e => setDisasterType(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm mb-5 focus:ring-0 focus:border-orange-400 transition-colors"
                  >
                    {DISASTER_TYPES.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={generatePlan}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Zap className="h-4 w-4" />
                    Activate AI Rescue Agent
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              )}

              {/* ── Agent Thinking Loader ── */}
              {loading && <AgentLoader location={location} />}

              {/* ── Plan ── */}
              {plan && urgency && (
                <div className="flex flex-col min-h-0 flex-1">
                  {/* Urgency banner */}
                  <div className={`${urgency.bg} px-4 py-2.5 flex-shrink-0`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold text-sm">{urgency.label} ALERT</span>
                        <p className="text-white/90 text-xs mt-0.5">{plan.estimatedTime}</p>
                      </div>
                      <button
                        onClick={() => { setPlan(null); setActiveTab('route'); setVisibleSteps(0); setShowMap(false); }}
                        className="text-white/80 hover:text-white text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors"
                      >
                        New Plan
                      </button>
                    </div>
                  </div>

                  {/* Agent summary */}
                  {plan.agentSummary && (
                    <div className="px-4 pt-3 pb-0 flex-shrink-0">
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-3 flex gap-2"
                      >
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-indigo-800 text-xs leading-relaxed font-medium">{plan.agentSummary}</p>
                      </motion.div>
                    </div>
                  )}

                  {/* Situation */}
                  <div className="px-4 pt-2 pb-0 flex-shrink-0">
                    <p className="text-gray-700 text-xs leading-relaxed bg-orange-50 border border-orange-200 rounded-xl p-3">
                      {plan.situation}
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 px-3 mt-2 flex-shrink-0 gap-1">
                    {[
                      { key: 'route', label: '🗺️ Route' },
                      { key: 'steps', label: '📋 Steps' },
                      { key: 'camps', label: '🏕️ Camps' },
                      { key: 'dos',   label: '✅ Do/Don\'t' },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={`py-2 px-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === tab.key
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="overflow-y-auto flex-1 p-4 space-y-3">

                    {/* ── Route Tab ── */}
                    {activeTab === 'route' && <RouteVisual plan={plan} onOpenMap={() => setShowMap(true)} />}

                    {/* ── Steps Tab ── */}
                    {activeTab === 'steps' && (
                      <>
                        {plan.steps.slice(0, visibleSteps).map(s => (
                          <motion.div
                            key={s.step}
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow">
                              {s.step}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{s.icon} {s.title}</p>
                              <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{s.description}</p>
                            </div>
                          </motion.div>
                        ))}
                        {visibleSteps < plan.steps.length && (
                          <div className="flex items-center gap-2 text-xs text-orange-500 font-medium">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                              className="w-3.5 h-3.5 border-2 border-orange-400 border-t-transparent rounded-full"
                            />
                            Agent is loading next step…
                          </div>
                        )}
                        {plan.safeZones && visibleSteps >= plan.steps.length && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-green-50 border border-green-200 rounded-xl p-3"
                          >
                            <p className="text-green-800 font-bold text-xs">🟢 Safe Zones Identified</p>
                            <p className="text-green-700 text-xs mt-1 leading-relaxed">{plan.safeZones}</p>
                          </motion.div>
                        )}
                      </>
                    )}

                    {/* ── Camps Tab ── */}
                    {activeTab === 'camps' && (
                      <>
                        {plan.reliefCamps.map((camp, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-blue-50 border border-blue-200 rounded-xl p-3"
                          >
                            <p className="font-bold text-blue-900 text-sm">{camp.name}</p>
                            <div className="flex items-start gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-blue-400 flex-shrink-0 mt-0.5" />
                              <p className="text-blue-700 text-xs">{camp.address}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{camp.distance}</span>
                              <a
                                href={`tel:${camp.contact}`}
                                className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full hover:bg-green-200 transition-colors"
                              >
                                <Phone className="h-3 w-3" /> {camp.contact}
                              </a>
                            </div>
                          </motion.div>
                        ))}

                        <div className="mt-1">
                          <p className="font-bold text-gray-700 text-xs mb-2">📞 Emergency Contacts</p>
                          <div className="grid grid-cols-2 gap-2">
                            {plan.contacts.map((c, i) => (
                              <a
                                key={i}
                                href={`tel:${c.number}`}
                                className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center hover:bg-red-100 transition-colors"
                              >
                                <p className="text-red-800 font-bold text-sm">{c.number}</p>
                                <p className="text-red-600 text-xs mt-0.5">{c.name}</p>
                              </a>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* ── Dos/Don'ts Tab ── */}
                    {activeTab === 'dos' && (
                      <>
                        <div>
                          <p className="font-bold text-green-700 text-xs mb-2 flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> DO These Right Now
                          </p>
                          <div className="space-y-2">
                            {plan.doList.map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-2.5"
                              >
                                <span className="text-green-500 font-bold text-sm flex-shrink-0">✓</span>
                                <p className="text-green-800 text-xs leading-relaxed">{item}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-1">
                          <p className="font-bold text-red-700 text-xs mb-2 flex items-center gap-1">
                            <X className="h-3.5 w-3.5" /> AVOID These
                          </p>
                          <div className="space-y-2">
                            {plan.avoidList.map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-2.5"
                              >
                                <span className="text-red-500 font-bold text-sm flex-shrink-0">✗</span>
                                <p className="text-red-800 text-xs leading-relaxed">{item}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EvacuationAdvisor;
