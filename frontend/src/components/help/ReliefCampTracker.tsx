import React, { useState } from 'react';
import { Home, Users, Utensils, HeartPulse, Navigation, Search, CheckCircle, AlertTriangle, Droplets } from 'lucide-react';

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
  {
    id: 'camp-5',
    name: 'Coastal Zone Community Cyclone Shelter',
    location: 'Calangute Beach Road',
    district: 'North Goa, Goa',
    capacity: 250,
    occupancy: 80,
    foodStatus: 'Abundant',
    medicalTeam: true,
    waterSupply: true,
    contactPerson: 'R. Naik (District Collector Office)',
    phone: '+91 83207 65412',
    status: 'Open & Accepting',
  },
  {
    id: 'camp-6',
    name: 'Andaman Marine Emergency Relief Camp',
    location: 'Phoenix Bay Jetty Area',
    district: 'South Andaman, A&N Islands',
    capacity: 600,
    occupancy: 210,
    foodStatus: 'Sufficient',
    medicalTeam: true,
    waterSupply: true,
    contactPerson: 'Lt. Cdr. P. Sharma (Coast Guard)',
    phone: '+91 3192 233 450',
    status: 'Open & Accepting',
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Near Capacity':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Full':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Standby':
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const totalCapacity = SAMPLE_CAMPS.reduce((s, c) => s + c.capacity, 0);

  return (
    <div className="w-full bg-white text-slate-800 rounded-2xl shadow-md border border-blue-100 my-6 overflow-hidden">
      {/* Blue top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-blue-600" />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
              <Home className="w-7 h-7 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-blue-900">Coastal Relief Camps & Shelters</h2>
              <p className="text-sm text-slate-500">Live shelter occupancy, emergency food supplies, and medical dispatch</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-teal-50 px-4 py-2 rounded-xl border border-teal-100">
            <Users className="w-5 h-5 text-teal-600" />
            <span className="text-xs text-teal-800 font-semibold">{totalCapacity.toLocaleString()} Total Capacity Monitored</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-5">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-blue-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search camp name or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-blue-50 text-sm text-blue-900 pl-9 pr-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-blue-300"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
            {['All', 'Open & Accepting', 'Near Capacity', 'Full'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
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
                className="p-5 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(camp.status)}`}>
                      {camp.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{camp.district}</span>
                  </div>

                  <h3 className="font-bold text-blue-900 text-base mb-1">{camp.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{camp.location}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Occupancy ({camp.occupancy} / {camp.capacity})</span>
                      <span className={`font-bold ${occupancyPercent >= 90 ? 'text-red-600' : 'text-teal-600'}`}>
                        {occupancyPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          occupancyPercent >= 90
                            ? 'bg-red-500'
                            : occupancyPercent >= 70
                            ? 'bg-amber-400'
                            : 'bg-teal-500'
                        }`}
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex items-center space-x-1.5 text-xs bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <Utensils className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-amber-800 truncate">{camp.foodStatus}</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 text-xs p-2 rounded-lg border ${camp.medicalTeam ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'}`}>
                      <HeartPulse className={`w-3.5 h-3.5 shrink-0 ${camp.medicalTeam ? 'text-rose-500' : 'text-slate-400'}`} />
                      <span className={`truncate ${camp.medicalTeam ? 'text-rose-800' : 'text-slate-500'}`}>{camp.medicalTeam ? 'On Site' : 'En Route'}</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 text-xs p-2 rounded-lg border ${camp.waterSupply ? 'bg-sky-50 border-sky-100' : 'bg-slate-50 border-slate-200'}`}>
                      <Droplets className={`w-3.5 h-3.5 shrink-0 ${camp.waterSupply ? 'text-sky-500' : 'text-slate-400'}`} />
                      <span className={`truncate ${camp.waterSupply ? 'text-sky-800' : 'text-slate-500'}`}>{camp.waterSupply ? 'Available' : 'Limited'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Contact Officer</span>
                    <span className="text-blue-900 font-semibold">{camp.contactPerson} ({camp.phone})</span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(camp.name + ' ' + camp.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-sm shrink-0"
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
    </div>
  );
};

export default ReliefCampTracker;
