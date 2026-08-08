import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Waves, Wind, Droplets, Compass, CheckCircle2, ChevronRight, Mountain } from 'lucide-react';

interface SurvivalGuide {
  id: string;
  title: string;
  icon: string;
  category: 'Cyclone' | 'Tsunami' | 'Boat Capsize' | 'Oil Spill' | 'High Surge' | 'Coastal Erosion';
  summary: string;
  steps: string[];
  dos: string[];
  donts: string[];
}

const categoryColor: Record<string, string> = {
  Cyclone:         'bg-purple-100 text-purple-800 border-purple-200',
  Tsunami:         'bg-blue-100 text-blue-800 border-blue-200',
  'Boat Capsize':  'bg-sky-100 text-sky-800 border-sky-200',
  'Oil Spill':     'bg-amber-100 text-amber-800 border-amber-200',
  'High Surge':    'bg-orange-100 text-orange-800 border-orange-200',
  'Coastal Erosion':'bg-teal-100 text-teal-800 border-teal-200',
};

const GUIDES: SurvivalGuide[] = [
  {
    id: 'cyclone-prep',
    title: 'Severe Cyclone & Storm Surge Survival Protocol',
    icon: 'Wind',
    category: 'Cyclone',
    summary: 'Essential procedures during Category 3+ coastal cyclonic landfall and high wind surges.',
    steps: [
      'Monitor IMD bulletin alerts and evacuate low-lying coastal huts immediately.',
      'Anchor all fishing vessels at designated harbor storm moorings.',
      'Move livestock and family members to reinforced concrete cyclone shelters.',
      'Keep emergency radio, flashlights, non-perishable food, and 10L clean water per person ready.',
    ],
    dos: [
      'Turn off main electricity and LPG valve before evacuating.',
      'Stay inside the shelter until official All-Clear signal is issued.',
    ],
    donts: [
      'Do not venture outdoors during the cyclone eye (calm center), as extreme reverse winds will follow.',
      'Do not touch downed power lines or flooded electrical poles.',
    ],
  },
  {
    id: 'tsunami-action',
    title: 'Tsunami Early Warning Response Protocol',
    icon: 'Waves',
    category: 'Tsunami',
    summary: 'Immediate action when abnormal sea recession or seismic earthquake warning occurs.',
    steps: [
      'If you feel a strong coastal earthquake or observe sudden sea water retreat, move inland immediately.',
      'Climb to an elevation of at least 30 meters above sea level or 3 km inland.',
      'Do not wait for official siren if natural warning signs (roaring ocean sound) appear.',
      'Vessels deep at sea (>100m depth) should NOT return to port; stay in open sea.',
    ],
    dos: [
      'Move perpendicular to the shore towards elevated ground or sturdy multi-story concrete buildings.',
    ],
    donts: [
      'Never go to the beach to watch the tsunami ocean retreat.',
      'Do not return until emergency authorities confirm all wave trains have passed.',
    ],
  },
  {
    id: 'boat-capsize',
    title: 'Offshore Boat Capsize & Drowning Prevention',
    icon: 'Compass',
    category: 'Boat Capsize',
    summary: 'Life-saving survival steps if a fishing trawler or country boat flips offshore.',
    steps: [
      'Ensure every crew member wears SOLAS-certified life jackets before leaving harbor.',
      'In case of capsize, stay together and float on your back (tread water calmly).',
      'Signal using high-visibility reflective mirrors, distress flares, or VHF Channel 16.',
      'Activate your EPIRB (Emergency Position Indicating Radio Beacon) immediately.',
    ],
    dos: [
      'Huddle together in water to preserve body heat and increase radar visibility.',
    ],
    donts: [
      'Do not shed life jackets even if swimming feels easier.',
      'Do not drink sea water under any condition.',
    ],
  },
  {
    id: 'oil-spill',
    title: 'Coastal Marine Oil Spill Containment',
    icon: 'Droplets',
    category: 'Oil Spill',
    summary: 'Environmental and health safety guidelines for hazardous chemical & oil slicks.',
    steps: [
      'Report oil slick coordinates immediately to Indian Coast Guard & Pollution Board.',
      'Avoid contact with contaminated sea water and fish stock in slick zones.',
      'Deploy absorbent booms and oil skimmers around vulnerable mangroves and coral reefs.',
    ],
    dos: [
      'Wear protective gloves and respirators when handling washed-up tarballs.',
    ],
    donts: [
      'Do not consume fish caught near visible oil sheen.',
    ],
  },
  {
    id: 'coastal-erosion',
    title: 'Coastal Erosion & Shoreline Collapse Response',
    icon: 'Mountain',
    category: 'Coastal Erosion',
    summary: 'Safety measures when active coastal erosion threatens settlements, roads, or fishing docks.',
    steps: [
      'Immediately evacuate all persons and structures within 50 meters of an actively eroding cliff or berm.',
      'Report the erosion site with GPS coordinates to the District Disaster Management Authority (DDMA).',
      'Do not attempt to reinforce eroding banks with sandbags without engineering guidance.',
      'Monitor tidal patterns — erosion accelerates significantly during high tides and storm surges.',
    ],
    dos: [
      'Document erosion extent with timestamps using CoastGuard app to support DDMA response.',
      'Coordinate with local Panchayat to reroute footpaths and roads away from vulnerable edges.',
    ],
    donts: [
      'Do not park or store fishing equipment near freshly eroded coastal edges.',
      'Do not allow children to play near eroding bluffs or unstable shoreline berms.',
    ],
  },
];

export const DisasterGuides: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(GUIDES[0].id);

  const activeGuide = GUIDES.find((g) => g.id === selectedId) || GUIDES[0];

  return (
    <div className="w-full bg-white text-slate-800 rounded-2xl shadow-md border border-amber-100 my-6 overflow-hidden">
      {/* Amber top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-500" />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <BookOpen className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-blue-900">Coastal Survival & Disaster Action Guides</h2>
              <p className="text-sm text-slate-500">Standard operating procedures for cyclones, tsunamis, boat capsize, and oil spills</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span className="text-xs text-amber-800 font-semibold">ICG VERIFIED GUIDANCE</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Guide List Sidebar */}
          <div className="space-y-2">
            {GUIDES.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setSelectedId(guide.id)}
                className={`w-full p-4 rounded-xl text-left border transition flex items-center justify-between ${
                  selectedId === guide.id
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200'
                }`}
              >
                <div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold block mb-0.5 ${selectedId === guide.id ? 'text-amber-100' : 'text-amber-600'}`}>
                    {guide.category}
                  </span>
                  <h4 className={`font-bold text-sm leading-tight ${selectedId === guide.id ? 'text-white' : 'text-blue-900'}`}>{guide.title}</h4>
                </div>
                <ChevronRight className={`w-5 h-5 shrink-0 ${selectedId === guide.id ? 'text-white' : 'text-amber-400'}`} />
              </button>
            ))}
          </div>

          {/* Selected Guide Details */}
          <div className="md:col-span-2 bg-blue-50/40 p-6 rounded-2xl border border-blue-100 space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${categoryColor[activeGuide.category] ?? 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                PROTOCOL: {activeGuide.category.toUpperCase()}
              </span>
              <h3 className="text-xl font-bold text-blue-900 mt-2">{activeGuide.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{activeGuide.summary}</p>
            </div>

            {/* Action Steps */}
            <div>
              <h4 className="text-sm font-bold text-amber-700 mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>Step-by-Step Survival Checklist</span>
              </h4>
              <div className="space-y-2">
                {activeGuide.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-amber-100">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-200">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Do's & Don'ts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h5 className="text-xs font-bold text-emerald-700 mb-2">DO'S (Recommended Actions)</h5>
                <ul className="space-y-1.5 text-xs text-emerald-800 list-disc list-inside">
                  {activeGuide.dos.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h5 className="text-xs font-bold text-red-700 mb-2">DON'TS (Prohibited Risks)</h5>
                <ul className="space-y-1.5 text-xs text-red-800 list-disc list-inside">
                  {activeGuide.donts.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterGuides;
