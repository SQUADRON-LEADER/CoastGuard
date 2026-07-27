import React, { useState } from 'react';
import { Home, Users, Utensils, HeartPulse, Navigation, Search, CheckCircle, AlertTriangle } from 'lucide-react';

interface ReliefCamp {
  id: string;
  name: string;
  location: string;
  district: string;
  capacity: number;
  occupancy: number;
  foodStatus: 'Abundant' | 'Sufficient' | 'Low' | 'Critical';
  medicalTeam: boolean;
  waterSupply: boolean;
  contactPerson: string;
  phone: string;
  status: 'Open & Accepting' | 'Near Capacity' | 'Full' | 'Standby';
}

const SAMPLE_CAMPS: ReliefCamp[] = [
  {
    id: 'camp-1',
    name: 'Government Higher Secondary School Shelter',
    location: 'Nagapattinam Coastal Road',
    district: 'Nagapattinam, Tamil Nadu',
    capacity: 500,
    occupancy: 340,
    foodStatus: 'Sufficient',
    medicalTeam: true,
    waterSupply: true,
    contactPerson: 'K. Rajendran (Tahsil Relief Officer)',
    phone: '+91 94431 22890',
    status: 'Open & Accepting',
  },
  {
    id: 'camp-2',
    name: 'St. Joseph Community Hall',
    location: 'Vizhinjam Fishing Harbor',
    district: 'Thiruvananthapuram, Kerala',
    capacity: 300,
    occupancy: 285,
    foodStatus: 'Sufficient',
    medicalTeam: true,
    waterSupply: true,
    contactPerson: 'Sister Mary V.',
    phone: '+91 98470 11234',
    status: 'Near Capacity',
  },
  {
    id: 'camp-3',
    name: 'Cyclone Multipurpose Shelter #4',
    location: 'Paradeep Port Area',
    district: 'Jagatsinghpur, Odisha',
    capacity: 1000,
    occupancy: 420,
    foodStatus: 'Abundant',
    medicalTeam: true,
    waterSupply: true,
    contactPerson: 'D. Mohanty (NDRF Coordinator)',
    phone: '+91 94370 88219',
    status: 'Open & Accepting',
  },
  {
    id: 'camp-4',
    name: 'Town Panchayat Flood Relief Center',
    location: 'Dhamra Estuary Zone',
    district: 'Bhadrak, Odisha',
    capacity: 400,
    occupancy: 400,
    foodStatus: 'Low',
    medicalTeam: false,
    waterSupply: true,
    contactPerson: 'B. Swain',
    phone: '+91 97780 44321',
    status: 'Full',
  },
];

export const ReliefCampTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredCamps = SAMPLE_CAMPS.filter((camp) => {
    const matchesSearch = camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          camp.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          camp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || camp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: ReliefCamp['status']) => {
    switch (status) {
      case 'Open & Accepting':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Near Capacity':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Full':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'Standby':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-teal-500/30 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-500/40">
            <Home className="w-7 h-7 text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Coastal Relief Camps & Shelters</h2>
            <p className="text-sm text-slate-400">Live shelter occupancy, emergency food supplies, and medical dispatch</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-teal-950/60 px-4 py-2 rounded-xl border border-teal-800/50">
          <Users className="w-5 h-5 text-teal-400" />
          <span className="text-xs text-teal-200 font-semibold">2,200 Total Capacity Monitored</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-5">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search camp name or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-sm text-white pl-9 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {['All', 'Open & Accepting', 'Near Capacity', 'Full'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                filterStatus === st
                  ? 'bg-teal-600 text-white border-teal-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Camps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCamps.map((camp) => {
          const occupancyPercent = Math.round((camp.occupancy / camp.capacity) * 100);

          return (
            <div
              key={camp.id}
              className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/60 hover:border-teal-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(camp.status)}`}>
                    {camp.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{camp.district}</span>
                </div>

                <h3 className="font-bold text-slate-100 text-base mb-1">{camp.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{camp.location}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Occupancy ({camp.occupancy} / {camp.capacity})</span>
                    <span className={`font-bold ${occupancyPercent >= 90 ? 'text-red-400' : 'text-teal-400'}`}>
                      {occupancyPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occupancyPercent >= 90
                          ? 'bg-red-500'
                          : occupancyPercent >= 70
                          ? 'bg-amber-500'
                          : 'bg-teal-400'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center space-x-2 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-700/40">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">Food: <strong>{camp.foodStatus}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-700/40">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span className="text-slate-300">Medical: <strong>{camp.medicalTeam ? 'On Site' : 'En Route'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Contact Officer</span>
                  <span className="text-slate-200 font-semibold">{camp.contactPerson} ({camp.phone})</span>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(camp.name + ' ' + camp.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 px-3 py-1.5 bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 rounded-lg font-semibold transition border border-teal-500/30 shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReliefCampTracker;
