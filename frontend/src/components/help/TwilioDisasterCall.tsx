import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneCall, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidE164PhoneNumber, normalizePhoneNumber } from '../../lib/phone';
import { API_BASE_URL } from '../../services/api';
import toast from 'react-hot-toast';

const HAZARD_OPTIONS = [
  { value: 'tsunami',           label: 'Tsunami',          digit: '1', icon: '', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'storm_surge',       label: 'Storm Surge',      digit: '2', icon: '', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'high_waves',        label: 'High Waves',       digit: '3', icon: '', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { value: 'coastal_flooding',  label: 'Coastal Flooding', digit: '4', icon: '', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'oil_spill',         label: 'Oil Spill',        digit: '5', icon: '', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'marine_debris',     label: 'Marine Debris',    digit: '6', icon: '', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'erosion',           label: 'Erosion',          digit: '7', icon: '', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'pollution',         label: 'Pollution',        digit: '8', icon: '', color: 'bg-red-100 text-red-700 border-red-200' },
];

type CallState = 'idle' | 'panel' | 'calling' | 'connected' | 'error';

const TwilioDisasterCall: React.FC = () => {
  const { user } = useAuth();
  const [callState, setCallState] = useState<CallState>('idle');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedHazard, setSelectedHazard] = useState('');
  const [callSid, setCallSid] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [detectedLocation, setDetectedLocation] = useState('');

  if (!user) return null;

  const getCoords = (): Promise<{ lat: number; lng: number } | null> =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 5000 }
      );
    });

  const initiateCall = async () => {
    const cleanPhone = normalizePhoneNumber(phone);
    if (!cleanPhone) {
      toast.error('Please enter your phone number. Example: +918891042078');
      return;
    }
    if (!isValidE164PhoneNumber(cleanPhone)) {
      toast.error('Use a full international number in E.164 format, like +918891042078.');
      return;
    }
    if (!selectedHazard) {
      toast.error('Please select the disaster type first.');
      return;
    }

    setCallState('calling');
    setErrorMsg('');
    setDetectedLocation('');

    // Get GPS coords silently — don't block the call if denied
    const coords = await getCoords();

    try {
      const res = await fetch(`${API_BASE_URL}/api/twilio/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          userId: user.id,
          userName: user.name,
          lat: coords?.lat,
          lng: coords?.lng,
          hazardType: selectedHazard,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate call');
      }

      setCallSid(data.callSid);
      if (data.detectedLocation) setDetectedLocation(data.detectedLocation);
      setCallState('connected');
      toast.success('📞 Call initiated! Pick up your phone — the AI agent is calling you.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setErrorMsg(message);
      setCallState('error');
      toast.error('Call failed: ' + message);
    }
  };

  const resetPanel = () => {
    setCallState('panel');
    setCallSid('');
    setErrorMsg('');
  };

  const closePanel = () => {
    setCallState('idle');
    setCallSid('');
    setErrorMsg('');
    setSelectedHazard('');
  };

  return (
    <>
      {/* Floating call button */}
      <div className="relative group">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => callState === 'idle' ? setCallState('panel') : closePanel()}
          className={`relative p-4 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            callState === 'calling' || callState === 'connected'
              ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400 animate-pulse'
              : 'bg-red-500 hover:bg-red-600 focus:ring-red-400'
          }`}
          title="Report Disaster via AI Call"
          aria-label="Report Disaster via AI Phone Call"
        >
          {callState === 'calling' || callState === 'connected' ? (
            <PhoneCall size={24} className="text-white" />
          ) : (
            <Phone size={24} className="text-white" />
          )}
          {/* Live indicator */}
          {(callState === 'calling' || callState === 'connected') && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-300 rounded-full ring-2 ring-white animate-ping" />
          )}
        </motion.button>

        {/* Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          📞 AI Disaster Call Reporter
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
        </div>
      </div>

      {/* Expandable panel */}
      <AnimatePresence>
        {callState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="fixed bottom-28 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AI Disaster Reporter</h3>
                  <p className="text-red-100 text-xs">CoastGuard Voice Agent</p>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4">
              {/* Idle / panel state - show phone input */}
              {(callState === 'panel' || callState === 'error') && (
                <>
                  {/* How it works */}
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-amber-800 mb-1">How it works</p>
                        <p className="text-xs text-amber-700">
                          Select the disaster type below, enter your number, then tap <strong>Start AI Disaster Call</strong>.
                          Our AI agent will call you, announce your location and the rescue team on the way.
                          Your report is <strong>auto-saved</strong> for verifier review.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Disaster type selector */}
                  <p className="text-xs font-semibold text-gray-600 mb-2">Select the disaster type <span className="text-red-500">*</span></p>
                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    {HAZARD_OPTIONS.map((h) => (
                      <button
                        key={h.value}
                        type="button"
                        onClick={() => setSelectedHazard(h.value)}
                        className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg border text-xs transition-all duration-150 ${
                          selectedHazard === h.value
                            ? 'ring-2 ring-red-500 border-red-400 bg-red-50 font-bold'
                            : h.color + ' hover:opacity-80'
                        }`}
                      >
                        <span>{h.icon}</span>
                        <span className="font-medium leading-tight">{h.label}</span>
                        {selectedHazard === h.value && <span className="ml-auto text-red-500">✓</span>}
                      </button>
                    ))}
                  </div>

                  {/* Phone input */}
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your phone number (with country code)
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {callState === 'error' && errorMsg && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-600">{errorMsg}</p>
                    </div>
                  )}

                  {/* Call button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={initiateCall}
                    disabled={!phone.trim() || !selectedHazard}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-colors duration-200"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Start AI Disaster Call</span>
                  </motion.button>
                </>
              )}

              {/* Calling state */}
              {callState === 'calling' && (
                <div className="text-center py-6">
                  <div className="relative inline-flex mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <PhoneCall className="h-8 w-8 text-green-600 animate-bounce" />
                    </div>
                    <span className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Locating &amp; calling you…</h4>
                  <p className="text-xs text-gray-500">Dialing <strong>{phone}</strong></p>
                  {selectedHazard && (
                    <p className="text-xs text-gray-500 mt-2">
                      Reporting: <strong>{HAZARD_OPTIONS.find(h => h.value === selectedHazard)?.icon} {HAZARD_OPTIONS.find(h => h.value === selectedHazard)?.label}</strong>
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Detecting your GPS location — CoastGuard AI will announce it on the call
                  </p>
                </div>
              )}

              {/* Connected / success state */}
              {callState === 'connected' && (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PhoneCall className="h-7 w-7 text-green-600" />
                  </div>
                  <h4 className="font-bold text-green-700 text-sm mb-1">Call Connected!</h4>
                  {detectedLocation && (
                    <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        📍 <strong>Detected location:</strong> {detectedLocation}
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">The AI will announce this on the call</p>
                    </div>
                  )}
                  {selectedHazard && (
                    <div className="mb-3 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs text-orange-800 font-semibold">
                        {HAZARD_OPTIONS.find(h => h.value === selectedHazard)?.icon}{' '}
                        Reporting: {HAZARD_OPTIONS.find(h => h.value === selectedHazard)?.label}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mb-3">
                    Pick up your phone — the AI agent is calling you now.
                  </p>
                  <div className="text-left space-y-1.5 mb-4">
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                      <span className="w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                      <span className="text-xs text-blue-700">AI announces your <strong>detected location</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-teal-50 rounded-lg">
                      <span className="w-5 h-5 bg-teal-500 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                      <span className="text-xs text-teal-700">AI confirms <strong>rescue team details</strong> &amp; ETA</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                      <span className="w-5 h-5 bg-green-500 text-white rounded-full text-xs flex items-center justify-center font-bold">✓</span>
                      <span className="text-xs text-green-700">Report <strong>auto-saved</strong> with GPS coordinates</span>
                    </div>
                  </div>

                  {callSid && (
                    <p className="text-xs text-gray-300 font-mono break-all mb-3">
                      Call ID: {callSid}
                    </p>
                  )}

                  <button
                    onClick={resetPanel}
                    className="w-full border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Make Another Call
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TwilioDisasterCall;
