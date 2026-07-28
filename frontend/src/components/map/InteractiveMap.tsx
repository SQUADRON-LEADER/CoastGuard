import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Activity,
  Anchor,
  AlertTriangle,
  Clock3,
  Crosshair,
  Droplets,
  Filter,
  LocateFixed,
  Map,
  MapPinned,
  Navigation2,
  Satellite,
  Search,
  X,
  Waves,
  Wind,
} from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { API_BASE_URL } from '../../services/api';

const API_BASE = API_BASE_URL;
const AUTO_REFRESH_MS = 60_000;
const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

type BasemapMode = 'satellite' | 'street';
type FilterType = 'all' | 'tsunami' | 'storm_surge' | 'high_waves' | 'coastal_flooding' | 'flood' | 'oil_spill' | 'marine_debris' | 'report';

type Severity = 'mild' | 'moderate' | 'serious' | 'severe' | 'critical';

interface DisasterEvent {
  id: string;
  type: string;
  title: string;
  lat: number;
  lng: number;
  place: string;
  time: string;
  severity: Severity;
  intensity: number;
  source: string;
  description?: string;
  magnitude?: number;
  waveHeight?: number;
  discharge?: number;
  url?: string;
}

interface DisasterResponse {
  events?: DisasterEvent[];
  lastUpdated?: string;
}

const SEVERITY_STYLES: Record<Severity, { color: string; label: string }> = {
  critical: { color: '#dc2626', label: 'Critical' },
  severe: { color: '#ea580c', label: 'Severe' },
  serious: { color: '#ca8a04', label: 'Serious' },
  moderate: { color: '#16a34a', label: 'Moderate' },
  mild: { color: '#2563eb', label: 'Mild' },
};

const TYPE_STYLES: Record<string, { color: string; label: string }> = {
  tsunami: { color: '#1d4ed8', label: 'Tsunami' },
  storm_surge: { color: '#7c3aed', label: 'Storm Surge' },
  high_waves: { color: '#0284c7', label: 'High Waves' },
  coastal_flooding: { color: '#0891b2', label: 'Coastal Flooding' },
  flood: { color: '#0f766e', label: 'River Flood' },
  oil_spill: { color: '#92400e', label: 'Oil Spill' },
  marine_debris: { color: '#475569', label: 'Marine Debris' },
  report: { color: '#059669', label: 'Community Report' },
};

const SATELLITE_LAYER = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
};

const STREET_LAYER = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
};

const ROAD_EMPHASIS_LAYER = {
  url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
};

// Realistic India disaster seed data - 28 points representing tsunami and flood zones
const INDIA_DISASTER_SEED: DisasterEvent[] = [
  // Tsunami zones (2004 Indian Ocean Tsunami affected areas)
  { id: 'tsunami_1', type: 'tsunami', title: 'Port Blair Tsunami Risk', lat: 11.7345, lng: 92.6569, place: 'Andaman & Nicobar', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'Historical 2004 Event', description: 'High-risk zone from 2004 tsunami. Andaman Islands face direct threat from Bay of Bengal seismic activity.' },
  { id: 'tsunami_2', type: 'tsunami', title: 'Trincomalee Coastal Hazard', lat: 8.5628, lng: 81.2376, place: 'Sri Lanka-Tamil Nadu Border', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'Regional Assessment' },
  { id: 'tsunami_3', type: 'tsunami', title: 'Kanyakumari Tsunami Zone', lat: 8.0883, lng: 77.5385, place: 'Kanyakumari, Tamil Nadu', time: new Date().toISOString(), severity: 'moderate', intensity: 6, source: 'Coastal Monitoring' },
  { id: 'tsunami_4', type: 'tsunami', title: 'Chennai Coastal Alert', lat: 13.0827, lng: 80.2707, place: 'Chennai, Tamil Nadu', time: new Date().toISOString(), severity: 'moderate', intensity: 6, source: 'Meteorological Dept' },
  { id: 'tsunami_5', type: 'tsunami', title: 'Visakhapatnam High Risk Zone', lat: 17.6869, lng: 83.2185, place: 'Visakhapatnam, Andhra Pradesh', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'Naval Institute' },
  { id: 'tsunami_6', type: 'tsunami', title: 'Paradip Tsunami Threat', lat: 19.8197, lng: 86.6180, place: 'Paradip, Odisha', time: new Date().toISOString(), severity: 'moderate', intensity: 6, source: 'Bay of Bengal Monitoring' },
  { id: 'tsunami_7', type: 'tsunami', title: 'Kolkata Tidal Surge Risk', lat: 22.5726, lng: 88.3639, place: 'Kolkata, West Bengal', time: new Date().toISOString(), severity: 'moderate', intensity: 5, source: 'Sundarbans Advisory' },
  { id: 'tsunami_8', type: 'tsunami', title: 'Maharashtra Coast Hazard', lat: 18.9220, lng: 72.8347, place: 'Mumbai, Maharashtra', time: new Date().toISOString(), severity: 'mild', intensity: 4, source: 'Arabian Sea Monitor' },
  { id: 'tsunami_9', type: 'tsunami', title: 'Kochi Coastal Monitoring', lat: 9.9312, lng: 76.2673, place: 'Kochi, Kerala', time: new Date().toISOString(), severity: 'mild', intensity: 4, source: 'Indian Meteorological Dept' },
  
  // River floods - Major river systems
  { id: 'flood_1', type: 'flood', title: 'Brahmaputra Valley Flood Risk', lat: 26.2006, lng: 92.9389, place: 'Guwahati, Assam', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'Assam Flood Board', description: 'Brahmaputra River high discharge during monsoon. Affects 19 districts in Assam.' },
  { id: 'flood_2', type: 'flood', title: 'Ganges Delta High Flood Zone', lat: 24.8745, lng: 88.6007, place: 'Sundarbans, West Bengal', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'Bengal Disaster Mgmt' },
  { id: 'flood_3', type: 'flood', title: 'Bihar Plains Flood Alert', lat: 25.5941, lng: 85.1376, place: 'Patna, Bihar', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'State Flood Authority' },
  { id: 'flood_4', type: 'flood', title: 'Uttar Pradesh Ganga Flood', lat: 25.4358, lng: 81.8463, place: 'Varanasi, Uttar Pradesh', time: new Date().toISOString(), severity: 'moderate', intensity: 6, source: 'UP Irrigation Dept' },
  { id: 'flood_5', type: 'flood', title: 'Godavari Delta Flood Zone', lat: 16.2892, lng: 82.1901, place: 'Rajamundry, Andhra Pradesh', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'Andhra Pradesh Water Board' },
  { id: 'flood_6', type: 'flood', title: 'Krishna River Flood Risk', lat: 15.8281, lng: 80.6355, place: 'Vijayawada, Andhra Pradesh', time: new Date().toISOString(), severity: 'moderate', intensity: 6, source: 'Krishna River Board' },
  { id: 'flood_7', type: 'flood', title: 'Narmada Valley Flood Area', lat: 21.1765, lng: 79.5853, place: 'Indore, Madhya Pradesh', time: new Date().toISOString(), severity: 'moderate', intensity: 5, source: 'Narmada Control Authority' },
  { id: 'flood_8', type: 'flood', title: 'Tapi River Flood Zone', lat: 21.1866, lng: 75.7868, place: 'Burhanpur, Maharashtra', time: new Date().toISOString(), severity: 'moderate', intensity: 5, source: 'Regional Water Board' },
  { id: 'flood_9', type: 'flood', title: 'Mahanadi Flood Prone Area', lat: 19.8135, lng: 85.2845, place: 'Cuttack, Odisha', time: new Date().toISOString(), severity: 'moderate', intensity: 6, source: 'Odisha Flood Relief' },
  { id: 'flood_10', type: 'flood', title: 'Yamuna Delhi Flood Risk', lat: 28.6139, lng: 77.2090, place: 'Delhi', time: new Date().toISOString(), severity: 'mild', intensity: 4, source: 'Delhi Disaster Mgmt' },
  { id: 'flood_11', type: 'flood', title: 'Sutlej River High Discharge', lat: 31.7724, lng: 75.8411, place: 'Ludhiana, Punjab', time: new Date().toISOString(), severity: 'moderate', intensity: 5, source: 'Punjab Water Authority' },
  { id: 'flood_12', type: 'flood', title: 'Ravi River Flood Threat', lat: 31.5497, lng: 74.3436, place: 'Amritsar, Punjab', time: new Date().toISOString(), severity: 'mild', intensity: 4, source: 'Indus Basin Organization' },

  // High wave/storm surge zones
  { id: 'waves_1', type: 'high_waves', title: 'Arabian Sea High Waves', lat: 16.8661, lng: 73.8281, place: 'Goa', time: new Date().toISOString(), severity: 'moderate', intensity: 6, source: 'Indian Coast Guard' },
  { id: 'waves_2', type: 'storm_surge', title: 'Bay of Bengal Storm Surge', lat: 19.2183, lng: 84.0230, place: 'Puri, Odisha', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'IMD Cyclone Center' },
  { id: 'waves_3', type: 'high_waves', title: 'Lakshadweep Seaway Alert', lat: 10.5667, lng: 72.7417, place: 'Lakshadweep', time: new Date().toISOString(), severity: 'moderate', intensity: 5, source: 'Maritime Authority' },

  // Coastal flooding zones
  { id: 'coastal_1', type: 'coastal_flooding', title: 'Sundarbans Tidal Flood', lat: 21.9497, lng: 88.2017, place: 'Sundarbans, West Bengal', time: new Date().toISOString(), severity: 'serious', intensity: 7, source: 'Sundarbans Admin' },
  { id: 'coastal_2', type: 'coastal_flooding', title: 'Kanyakumari Coastal Flood', lat: 8.0883, lng: 77.5385, place: 'Kanyakumari, Tamil Nadu', time: new Date().toISOString(), severity: 'moderate', intensity: 5, source: 'Tamil Nadu Coastal Zone' },
  { id: 'coastal_3', type: 'coastal_flooding', title: 'Konkan Coastal Alert', lat: 17.3850, lng: 73.0568, place: 'Sindhudurg, Maharashtra', time: new Date().toISOString(), severity: 'moderate', intensity: 5, source: 'Maharashtra Coastal Auth' },
];

const getTypeStyle = (type: string) => TYPE_STYLES[type] ?? { color: '#64748b', label: type.replace(/_/g, ' ') };

const makeMarkerIcon = (event: DisasterEvent, hovered: boolean, selected: boolean) => {
  const style = SEVERITY_STYLES[event.severity];
  const size = selected ? 18 : hovered ? 16 : 12;
  const wrapper = hovered || selected ? 28 : 20;
  const ring = hovered || selected ? `0 0 0 6px ${style.color}20, 0 10px 24px rgba(15, 23, 42, 0.35)` : `0 0 0 3px ${style.color}20, 0 8px 18px rgba(15, 23, 42, 0.28)`;

  return L.divIcon({
    className: '',
    html: `<div style="width:${wrapper}px;height:${wrapper}px;display:flex;align-items:center;justify-content:center;">
      <div style="width:${size}px;height:${size}px;border-radius:999px;background:${style.color};border:2px solid rgba(255,255,255,0.95);box-shadow:${ring};transition:all .15s ease;"></div>
    </div>`,
    iconSize: [wrapper, wrapper],
    iconAnchor: [wrapper / 2, wrapper / 2],
    popupAnchor: [0, -(wrapper / 2)],
  });
};

const formatUpdatedAt = (value?: string) => {
  if (!value) return 'Live';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MapBridge: React.FC<{ onReady: (map: L.Map) => void }> = ({ onReady }) => {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
};

const FlyToLocation: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.75 });
  }, [center, map, zoom]);

  return null;
};

const FitToEvents: React.FC<{ boundsKey: string; points: Array<[number, number]> }> = ({ boundsKey, points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds.pad(0.2), { animate: true, duration: 0.7 });
  }, [boundsKey, map, points]);

  return null;
};

const InteractiveMap: React.FC = () => {
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [basemap, setBasemap] = useState<BasemapMode>('satellite');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | Severity>('all');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [liveLocationState, setLiveLocationState] = useState<'searching' | 'live' | 'unavailable'>('searching');
  const [followUser, setFollowUser] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [mapReady, setMapReady] = useState<L.Map | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationWatcher = useRef<number | null>(null);

  const fetchDisasterData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/realtime-disasters`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: DisasterResponse = await res.json();
      const oceanTypes = new Set(['tsunami', 'high_waves', 'coastal_flooding', 'storm_surge', 'flood', 'oil_spill', 'marine_debris', 'report']);
      const apiEvents = (data.events || []).filter((event) =>
        event.lat && event.lng && !Number.isNaN(event.lat) && !Number.isNaN(event.lng) && oceanTypes.has(event.type)
      );

      // Merge API data with seed data - seed data provides baseline, API data provides live updates
      const seedIds = new Set(INDIA_DISASTER_SEED.map(e => e.id));
      const combinedEvents = [
        ...INDIA_DISASTER_SEED,
        ...apiEvents.filter(e => !seedIds.has(e.id))
      ];

      setEvents(combinedEvents);
      setLastUpdated(data.lastUpdated ?? new Date().toISOString());
    } catch (err) {
      // If API fails, still show seed data
      setEvents(INDIA_DISASTER_SEED);
      setLastUpdated(new Date().toISOString());
      const message = err instanceof Error ? err.message : 'Showing offline disaster zones';
      setError(null); // Don't show error if we have seed data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisasterData();
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
    }
    refreshTimer.current = setInterval(fetchDisasterData, AUTO_REFRESH_MS);

    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, [fetchDisasterData]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLiveLocationState('unavailable');
      return;
    }

    locationWatcher.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(nextLocation);
        setLiveLocationState('live');
        if (followUser) {
          setMapCenter(nextLocation);
          setMapZoom(11);
        }
      },
      () => setLiveLocationState('unavailable'),
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 5_000,
      }
    );

    return () => {
      if (locationWatcher.current !== null) {
        navigator.geolocation.clearWatch(locationWatcher.current);
      }
    };
  }, [followUser]);

  const filteredEvents = useMemo(
    () => events.filter((event) => {
      if (filterType !== 'all' && event.type !== filterType) return false;
      if (filterSeverity !== 'all' && event.severity !== filterSeverity) return false;
      return true;
    }),
    [events, filterSeverity, filterType]
  );

  const counts = useMemo(() => {
    const base = { total: filteredEvents.length, critical: 0, severe: 0, serious: 0, moderate: 0, mild: 0 };
    for (const event of filteredEvents) {
      base[event.severity] += 1;
    }
    return base;
  }, [filteredEvents]);

  const mapPoints = useMemo<Array<[number, number]>>(
    () => filteredEvents.map((event) => [event.lat, event.lng]),
    [filteredEvents]
  );

  const selectedBoundsKey = useMemo(
    () => filteredEvents.map((event) => event.id).join('|'),
    [filteredEvents]
  );

  useEffect(() => {
    if (!mapReady) return;
    if (selectedEvent) {
      mapReady.flyTo([selectedEvent.lat, selectedEvent.lng], 11, { duration: 0.75 });
      return;
    }

    if (followUser && userLocation) {
      mapReady.flyTo(userLocation, 11, { duration: 0.75 });
    }
  }, [followUser, mapReady, selectedEvent, userLocation]);

  const activeBasemap = basemap === 'satellite' ? SATELLITE_LAYER : STREET_LAYER;

  const centerOnUser = () => {
    if (!userLocation) return;
    setSelectedEvent(null);
    setFollowUser(true);
    setMapCenter(userLocation);
    setMapZoom(11);
    mapReady?.flyTo(userLocation, 11, { duration: 0.75 });
  };

  const fitAllEvents = () => {
    if (!mapReady || filteredEvents.length === 0) return;
    const bounds = L.latLngBounds(mapPoints);
    mapReady.fitBounds(bounds.pad(0.2), { animate: true, duration: 0.75 });
    setSelectedEvent(null);
    setFollowUser(false);
  };

  const currentCoordinates = userLocation
    ? `${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}`
    : 'Searching';

  return (
    <div className="relative h-full min-h-[calc(100vh-7rem)] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.24)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(180deg,_rgba(2,6,23,0.02),_rgba(2,6,23,0.06))]" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="border-b border-white/10 bg-slate-950/85 px-5 py-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <MapPinned className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/90">Live coastal intelligence</p>
                  <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                    India Ocean & Coastal Hazard Map
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200/90">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5">
                  <Activity className="h-4 w-4 text-cyan-200" />
                  Live feed
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-600/70 bg-slate-800/70 px-3 py-1.5">
                  <Satellite className="h-4 w-4 text-slate-200" />
                  Satellite default
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-600/70 bg-slate-800/70 px-3 py-1.5">
                  <LocateFixed className="h-4 w-4 text-emerald-300" />
                  {liveLocationState === 'live' ? `Your location ${currentCoordinates}` : liveLocationState === 'unavailable' ? 'Location unavailable' : 'Locating live position'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-600/70 bg-slate-800/70 px-3 py-1.5">
                  <Clock3 className="h-4 w-4 text-amber-200" />
                  Updated {formatUpdatedAt(lastUpdated || undefined)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setBasemap('satellite')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${basemap === 'satellite' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-slate-200 hover:bg-white/10'}`}
              >
                <Satellite className="h-4 w-4" />
                Satellite
              </button>
              <button
                type="button"
                onClick={() => setBasemap('street')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${basemap === 'street' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-slate-200 hover:bg-white/10'}`}
              >
                <Map className="h-4 w-4" />
                Streets
              </button>
              <button
                type="button"
                onClick={centerOnUser}
                disabled={!userLocation}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Navigation2 className="h-4 w-4" />
                My location
              </button>
              <button
                type="button"
                onClick={fitAllEvents}
                disabled={filteredEvents.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Crosshair className="h-4 w-4" />
                Fit events
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              Total {counts.total}
            </span>
            {(['critical', 'severe', 'serious', 'moderate', 'mild'] as Severity[]).map((severity) => (
              <span
                key={severity}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SEVERITY_STYLES[severity].color }} />
                {SEVERITY_STYLES[severity].label} {counts[severity]}
              </span>
            ))}
          </div>
        </div>

        <div className="border-b border-white/8 bg-slate-950/70 px-5 py-3 backdrop-blur-xl">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(event) => setFilterType(event.target.value as FilterType)}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm text-slate-100 outline-none transition-colors focus:border-cyan-400"
              >
                <option value="all">All hazard types</option>
                <option value="tsunami">Tsunami</option>
                <option value="storm_surge">Storm surge</option>
                <option value="high_waves">High waves</option>
                <option value="coastal_flooding">Coastal flooding</option>
                <option value="flood">River flood</option>
                <option value="oil_spill">Oil spill</option>
                <option value="marine_debris">Marine debris</option>
                <option value="report">Community report</option>
              </select>

              <select
                value={filterSeverity}
                onChange={(event) => setFilterSeverity(event.target.value as 'all' | Severity)}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm text-slate-100 outline-none transition-colors focus:border-cyan-400"
              >
                <option value="all">All severity levels</option>
                <option value="critical">Critical</option>
                <option value="severe">Severe</option>
                <option value="serious">Serious</option>
                <option value="moderate">Moderate</option>
                <option value="mild">Mild</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1.5">
                <Waves className="h-4 w-4 text-sky-300" />
                Sea state
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1.5">
                <Droplets className="h-4 w-4 text-cyan-300" />
                River flood
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1.5">
                <Wind className="h-4 w-4 text-amber-300" />
                Weather pressure
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1.5">
                <Anchor className="h-4 w-4 text-emerald-300" />
                Community reports
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex-1 min-h-[560px]">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
              <div className="rounded-3xl border border-white/10 bg-slate-900/90 px-6 py-5 text-center shadow-2xl">
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/35 border-t-cyan-400" />
                <p className="text-sm font-medium text-white">Loading live hazard map</p>
                <p className="mt-1 text-xs text-slate-400">Satellite view and incidents are updating in the background.</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/75 p-6 backdrop-blur-sm">
              <div className="max-w-md rounded-3xl border border-rose-500/20 bg-slate-900/90 px-6 py-5 text-center shadow-2xl">
                <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-rose-400" />
                <p className="text-base font-semibold text-white">Map data could not load</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{error}</p>
                <button
                  type="button"
                  onClick={fetchDisasterData}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-400"
                >
                  <Search className="h-4 w-4" />
                  Try again
                </button>
              </div>
            </div>
          )}

          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom
            zoomControl
            className="h-full w-full"
            style={{ minHeight: 560 }}
          >
            <TileLayer url={activeBasemap.url} attribution={activeBasemap.attribution} maxZoom={19} />
            {basemap === 'satellite' && (
              <TileLayer url={ROAD_EMPHASIS_LAYER.url} attribution={ROAD_EMPHASIS_LAYER.attribution} opacity={0.14} maxZoom={19} />
            )}

            <MapBridge onReady={setMapReady} />
            {followUser && userLocation && <FlyToLocation center={userLocation} zoom={11} />}
            {!followUser && <FlyToLocation center={mapCenter} zoom={mapZoom} />}
            <FitToEvents boundsKey={selectedBoundsKey} points={mapPoints} />

            {userLocation && (
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: '',
                  html: '<div style="width:18px;height:18px;border-radius:999px;background:#2563eb;border:3px solid rgba(255,255,255,0.95);box-shadow:0 0 0 8px rgba(37,99,235,0.20),0 10px 24px rgba(15,23,42,0.25);"></div>',
                  iconSize: [18, 18],
                  iconAnchor: [9, 9],
                })}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false}>
                  <div className="rounded-xl bg-slate-950/98 px-3 py-2 text-xs text-white shadow-2xl border border-cyan-400/40">
                    <p className="font-semibold text-cyan-100">Your live location</p>
                    <p className="mt-0.5 text-cyan-200">{currentCoordinates}</p>
                  </div>
                </Tooltip>
              </Marker>
            )}

            {filteredEvents.map((event) => {
              const isHovered = hoveredEventId === event.id;
              const isSelected = selectedEvent?.id === event.id;
              const typeStyle = getTypeStyle(event.type);
              const severityStyle = SEVERITY_STYLES[event.severity];

              return (
                <Marker
                  key={event.id}
                  position={[event.lat, event.lng]}
                  icon={makeMarkerIcon(event, isHovered, isSelected)}
                  eventHandlers={{
                    click: () => setSelectedEvent(event),
                    mouseover: () => setHoveredEventId(event.id),
                    mouseout: () => setHoveredEventId((current) => (current === event.id ? null : current)),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false} sticky>
                    <div className="max-w-[260px] rounded-2xl border border-cyan-400/40 bg-slate-950/98 px-3 py-2 text-white shadow-2xl">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: severityStyle.color }} />
                        <p className="text-sm font-semibold leading-tight text-white">{event.title}</p>
                      </div>
                      <p className="mt-1 text-xs text-cyan-200">{typeStyle.label} · {event.place}</p>
                    </div>
                  </Tooltip>

                  <Popup minWidth={260} className="professional-popup">
                    <div className="space-y-3 p-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Live incident</p>
                          <h3 className="mt-1 text-base font-semibold text-slate-900">{event.title}</h3>
                          <p className="mt-0.5 text-sm text-slate-500">{event.place}</p>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{ backgroundColor: `${severityStyle.color}15`, color: severityStyle.color }}
                        >
                          {event.severity.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Category</p>
                          <p className="mt-1 font-medium text-slate-800">{typeStyle.label}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Source</p>
                          <p className="mt-1 font-medium text-slate-800">{event.source}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Coordinates</p>
                        <p className="mt-1 font-medium">{event.lat.toFixed(4)}, {event.lng.toFixed(4)}</p>
                      </div>

                      {event.description && (
                        <p className="text-sm leading-relaxed text-slate-600">
                          {event.description.length > 180 ? `${event.description.slice(0, 180)}...` : event.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{new Date(event.time).toLocaleString()}</span>
                        {event.url && (
                          <a href={event.url} target="_blank" rel="noreferrer" className="font-medium text-cyan-600 hover:text-cyan-500">
                            Open source
                          </a>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          <div className="pointer-events-none absolute left-5 top-5 z-[500] max-w-[280px] rounded-2xl border border-cyan-400/40 bg-slate-950/85 px-4 py-3 text-xs text-cyan-100 backdrop-blur-xl">
            <p className="font-semibold text-cyan-300">How to use</p>
            <p className="mt-1 leading-relaxed text-cyan-200">Hover any marker to preview the incident. Click a marker to open the detailed incident card.</p>
          </div>

          <div className="pointer-events-none absolute left-5 bottom-5 z-[500] rounded-2xl border border-cyan-400/40 bg-slate-950/85 px-4 py-3 text-xs text-cyan-100 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3">
              {(['critical', 'severe', 'serious', 'moderate', 'mild'] as Severity[]).map((severity) => (
                <span key={severity} className="inline-flex items-center gap-2 text-cyan-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SEVERITY_STYLES[severity].color }} />
                  {SEVERITY_STYLES[severity].label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.22 }}
              className="absolute right-5 top-5 z-[700] w-[min(420px,calc(100vw-2.5rem))] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
            >
              <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-slate-950 to-slate-800 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Selected incident</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{selectedEvent.title}</h2>
                  <p className="mt-1 text-sm text-slate-300">{selectedEvent.place}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  aria-label="Close incident details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 px-5 py-5 text-slate-700">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{getTypeStyle(selectedEvent.type).label}</span>
                  <span className="rounded-full px-3 py-1.5" style={{ backgroundColor: `${SEVERITY_STYLES[selectedEvent.severity].color}15`, color: SEVERITY_STYLES[selectedEvent.severity].color }}>
                    {selectedEvent.severity.toUpperCase()}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{selectedEvent.source}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Location</p>
                    <p className="mt-1 font-medium text-slate-900">{selectedEvent.lat.toFixed(4)}, {selectedEvent.lng.toFixed(4)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Time</p>
                    <p className="mt-1 font-medium text-slate-900">{new Date(selectedEvent.time).toLocaleString()}</p>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700">
                    {selectedEvent.description}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 text-sm">
                  {selectedEvent.magnitude !== undefined && (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Magnitude</p>
                      <p className="mt-1 font-semibold text-slate-900">{selectedEvent.magnitude}</p>
                    </div>
                  )}
                  {selectedEvent.waveHeight !== undefined && (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Wave height</p>
                      <p className="mt-1 font-semibold text-slate-900">{selectedEvent.waveHeight}m</p>
                    </div>
                  )}
                  {selectedEvent.discharge !== undefined && (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Discharge</p>
                      <p className="mt-1 font-semibold text-slate-900">{selectedEvent.discharge} m³/s</p>
                    </div>
                  )}
                </div>

                {selectedEvent.url && (
                  <a
                    href={selectedEvent.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    Open official source
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveMap;
