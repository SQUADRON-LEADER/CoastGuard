import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Waves, Wind, Droplets, Compass, CheckCircle2, ChevronRight } from 'lucide-react';

interface SurvivalGuide {
  id: string;
  title: string;
  icon: string;
  category: 'Cyclone' | 'Tsunami' | 'Boat Capsize' | 'Oil Spill' | 'High Surge';
  summary: string;
  steps: string[];
  dos: string[];
  donts: string[];
}

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
];

export const DisasterGuides: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(GUIDES[0].id);

  const activeGuide = GUIDES.find((g) => g.id === selectedId) || GUIDES[0];

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-amber-500/30 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40">
            <BookOpen className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Coastal Survival & Disaster Action Guides</h2>
            <p className="text-sm text-slate-400">Standard operating procedures for cyclones, tsunamis, boat capsize, and oil spills</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-amber-950/60 px-4 py-2 rounded-xl border border-amber-800/50">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span className="text-xs text-amber-200 font-semibold">ICG VERIFIED GUIDANCE</span>
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
                  ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/80'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold block text-amber-200 opacity-90">
                  {guide.category}
                </span>
                <h4 className="font-bold text-sm leading-tight">{guide.title}</h4>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 opacity-80" />
            </button>
          ))}
        </div>

        {/* Selected Guide Details */}
        <div className="md:col-span-2 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60 space-y-5">
          <div className="border-b border-slate-700/60 pb-3">
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PROTOCOL: {activeGuide.category.toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-slate-100 mt-2">{activeGuide.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{activeGuide.summary}</p>
          </div>

          {/* Action Steps */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Step-by-Step Survival Checklist</span>
            </h4>
            <div className="space-y-2">
              {activeGuide.steps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-900/80 rounded-xl border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Do's & Dont's Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
              <h5 className="text-xs font-bold text-emerald-300 mb-2">DO'S (Recommended Actions)</h5>
              <ul className="space-y-1.5 text-xs text-emerald-200/90 list-disc list-inside">
                {activeGuide.dos.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl">
              <h5 className="text-xs font-bold text-red-300 mb-2">DON'TS (Prohibited Risks)</h5>
              <ul className="space-y-1.5 text-xs text-red-200/90 list-disc list-inside">
                {activeGuide.donts.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterGuides;
