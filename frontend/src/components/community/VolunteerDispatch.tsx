import React, { useState } from 'react';
import { UserCheck, ShieldCheck, HeartHandshake, Award, Clock, MapPin, CheckCircle, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VolunteerTask {
  id: string;
  title: string;
  category: 'Food Distribution' | 'First Aid' | 'Boat Rescue Assist' | 'Shelter Management' | 'Comms';
  location: string;
  volunteersNeeded: number;
  volunteersAssigned: number;
  urgency: 'High' | 'Medium' | 'Normal';
  status: 'Open' | 'In Progress' | 'Completed';
}

const SAMPLE_TASKS: VolunteerTask[] = [
  {
    id: 'task-101',
    title: 'Food Packets & Clean Water Relief Distribution',
    category: 'Food Distribution',
    location: 'Marina Beach Relief Camp #2, Chennai',
    volunteersNeeded: 12,
    volunteersAssigned: 8,
    urgency: 'High',
    status: 'Open',
  },
  {
    id: 'task-102',
    title: 'Emergency First Aid Triage Desk Support',
    category: 'First Aid',
    location: 'Puri District Hospital Coastal Wing, Odisha',
    volunteersNeeded: 6,
    volunteersAssigned: 4,
    urgency: 'High',
    status: 'Open',
  },
  {
    id: 'task-103',
    title: 'Harbor Boat Security & Tie-Down Patrol',
    category: 'Boat Rescue Assist',
    location: 'Munambam Fishing Harbor, Kerala',
    volunteersNeeded: 8,
    volunteersAssigned: 8,
    urgency: 'Medium',
    status: 'In Progress',
  },
  {
    id: 'task-104',
    title: 'Elderly Evacuation Registration & Guidance',
    category: 'Shelter Management',
    location: 'Kadalur Cyclone Center, Tamil Nadu',
    volunteersNeeded: 10,
    volunteersAssigned: 5,
    urgency: 'High',
    status: 'Open',
  },
];

export const VolunteerDispatch: React.FC = () => {
  const [tasks, setTasks] = useState<VolunteerTask[]>(SAMPLE_TASKS);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('First Aid');

  const handleClaimTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId && t.volunteersAssigned < t.volunteersNeeded) {
          toast.success(`You have volunteered for task: "${t.title}"!`);
          return { ...t, volunteersAssigned: t.volunteersAssigned + 1 };
        }
        return t;
      })
    );
  };

  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName.trim() || !volunteerPhone.trim()) {
      toast.error('Please fill in your name and phone number.');
      return;
    }

    toast.success(`Welcome aboard, ${volunteerName}! Registered as Coastal Volunteer (${selectedSkill}).`);
    setVolunteerName('');
    setVolunteerPhone('');
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-emerald-500/30 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/40">
            <HeartHandshake className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Coastal Community Volunteer Dispatch</h2>
            <p className="text-sm text-slate-400">Pledge emergency assistance, claim relief tasks, and earn validator badges</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800/50">
          <Award className="w-5 h-5 text-emerald-400" />
          <span className="text-xs text-emerald-200 font-semibold">1,450 ACTIVE VOLUNTEERS</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Volunteer Signup Form */}
        <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/60 h-fit">
          <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>Join Volunteer Corps</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Register your mobile number to receive instant SMS dispatches during emergency landfall.</p>

          <form onSubmit={handleRegisterVolunteer} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Anand Kumar"
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (WhatsApp enabled)</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={volunteerPhone}
                onChange={(e) => setVolunteerPhone(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Skill / Capability</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="First Aid">First Aid & Paramedic Assist</option>
                <option value="Boat Operations">Boat Operations & Swimmer</option>
                <option value="Food & Supply">Food Packet Cook & Distribution</option>
                <option value="Tech & Comms">Ham Radio & Tech Dispatch</option>
                <option value="General Evacuation">General Evacuation Helper</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 mt-4"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pledge Relief Support</span>
            </button>
          </form>
        </div>

        {/* Task Dispatch List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
            <span>Open Emergency Tasks Near You</span>
            <span className="text-xs text-emerald-400 font-normal">Updated 2 mins ago</span>
          </h3>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/60 hover:border-emerald-500/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      {task.category}
                    </span>
                    <span className="text-xs text-amber-300 font-semibold">• Urgency: {task.urgency}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{task.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{task.location}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/50">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Volunteers</span>
                    <span className="text-xs font-bold text-slate-200">
                      {task.volunteersAssigned} / {task.volunteersNeeded}
                    </span>
                  </div>

                  <button
                    onClick={() => handleClaimTask(task.id)}
                    disabled={task.volunteersAssigned >= task.volunteersNeeded}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      task.volunteersAssigned >= task.volunteersNeeded
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    {task.volunteersAssigned >= task.volunteersNeeded ? 'Filled' : 'Claim Task'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDispatch;
