import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Quote, Phone, PhoneCall, X, MapPin, Shield, BarChart3, Waves, Users, Clock, AlertTriangle, Zap, Globe, Activity } from 'lucide-react';

/* ─── Blue Palette (mirrors the Substance Lab green → CoastGuard ocean blue) ─ */
// Accent:      #3B9EFF   (bright ocean blue — was #42A85D)
// Dark:        #0A2540   (deep navy — was #1E4D33)
// Light bg:    #E8F2FF   (pale blue — was #E4EFDA)
// Cream:       #F5F7FA   (slightly blue-tinted cream — was #FBFAF7)
// Text dark:   #061829   (deepest navy — was #12281A)

/* ─── Keyframe CSS injected once ─────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

  @keyframes drift1 {
    0%,100% { transform: translate(0,0) rotate(0deg); }
    50%      { transform: translate(30px,-40px) rotate(8deg); }
  }
  @keyframes drift2 {
    0%,100% { transform: translate(0,0) rotate(0deg); }
    50%      { transform: translate(-40px,30px) rotate(-6deg); }
  }
  @keyframes drift3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(20px,50px) scale(1.05); }
  }
  .cg-drift-a { animation: drift1 14s ease-in-out infinite; }
  .cg-drift-b { animation: drift2 19s ease-in-out infinite; }
  .cg-drift-c { animation: drift3 24s ease-in-out infinite; }

  .cg-reveal {
    opacity: 0;
    transform: translateY(48px);
    filter: blur(10px);
    transition: opacity .9s cubic-bezier(.22,1,.36,1),
                transform .9s cubic-bezier(.22,1,.36,1),
                filter .9s cubic-bezier(.22,1,.36,1);
  }
  .cg-reveal.is-in {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  .cg-panel-img {
    transform: translateY(12%) scale(1.06);
    transition: transform 1.2s cubic-bezier(.22,1,.36,1);
  }
  .cg-panel-img.is-in {
    transform: translateY(0) scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .cg-drift-a, .cg-drift-b, .cg-drift-c { animation: none !important; }
    .cg-reveal { transition: opacity .4s ease !important; transform: none !important; filter: none !important; }
  }

  .cg-serif { font-family: 'Instrument Serif', 'Georgia', serif; }
  
  .cg-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(10,37,64,0.2);
    outline: none;
    padding: 12px 0;
    font-size: 1rem;
    color: #061829;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.3s;
  }
  .cg-input::placeholder { color: rgba(10,37,64,0.3); }
  .cg-input:focus { border-bottom-color: #0A2540; }

  .cg-capability-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding: 28px 0;
    text-decoration: none;
    transition: border-color 0.5s;
    cursor: pointer;
  }
  .cg-capability-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.1); }
  .cg-capability-row:hover { border-top-color: rgba(59,158,255,0.5); }
  .cg-capability-row:hover .cg-cap-label {
    color: white;
    transform: translateX(8px);
  }
  .cg-capability-row:hover .cg-cap-num { color: #3B9EFF; }
  .cg-cap-label {
    font-size: clamp(1.4rem, 3.5vw, 2.5rem);
    color: rgba(255,255,255,0.75);
    font-weight: 300;
    letter-spacing: -0.03em;
    transition: color 0.5s, transform 0.5s;
    font-family: 'Inter', sans-serif;
  }
  .cg-cap-num {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.3);
    transition: color 0.5s;
  }

  .cg-wordmark {
    font-size: 19.5vw;
    line-height: 1;
    text-align: center;
    color: rgba(10,37,64,0.08);
    white-space: nowrap;
    user-select: none;
    font-weight: 300;
    letter-spacing: -0.03em;
    -webkit-text-stroke: 1px rgba(10,37,64,0.1);
  }
`;

/* ─── useReveal hook (IntersectionObserver) ─────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.cg-reveal, .cg-panel-img').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Hazard types for emergency call ───────────────────────────────────── */
const HAZARDS = [
  { digit: '1', label: 'Tsunami' },
  { digit: '2', label: 'Storm Surge' },
  { digit: '3', label: 'High Waves' },
  { digit: '4', label: 'Coastal Flood' },
  { digit: '5', label: 'Oil Spill' },
  { digit: '6', label: 'Marine Debris' },
  { digit: '7', label: 'Erosion' },
  { digit: '8', label: 'Pollution' },
];

/* ─── Project panels data ───────────────────────────────────────────────── */
const PROJECTS = [
  {
    num: '01',
    title: 'Coastal Watch',
    desc: 'Real-time hazard intelligence — a citizen-powered reporting system rebuilt around speed and truth.',
    tags: ['Reporting', 'Real-time'],
    img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1200&auto=format&fit=crop',
  },
  {
    num: '02',
    title: 'Threat Map',
    desc: 'A live dashboard where every scroll has urgency — disaster data rendered as navigable terrain.',
    tags: ['Maps', 'Analytics'],
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=900&auto=format&fit=crop',
  },
  {
    num: '03',
    title: 'AI Alert System',
    desc: 'Gemini-powered analysis that turns social noise into actionable distress signals for responders.',
    tags: ['AI', 'ML'],
    img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=900&auto=format&fit=crop',
  },
];

/* ─── Method cards ──────────────────────────────────────────────────────── */
const METHOD_CARDS = [
  {
    letter: 'A',
    title: 'Community intelligence',
    desc: 'Every citizen becomes a sensor. Reports, votes, and verifications build a living picture of coastal risk — at every scale.',
    img: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop',
  },
  {
    letter: 'B',
    title: 'Verified response',
    desc: 'AI pre-screening plus human verification ensures authorities act on signal, not noise. Every report carries a trust score.',
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop',
  },
  {
    letter: 'C',
    title: 'Crisis surfaces',
    desc: 'Real-time dashboards, heatmaps, and analytics — built for protectors who need answers in seconds, not minutes.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
];

/* ─── Capabilities list ─────────────────────────────────────────────────── */
const CAPABILITIES = [
  { label: 'Hazard Reporting', num: '01', role: 'user' },
  { label: 'Live Threat Maps', num: '02', role: 'user' },
  { label: 'AI Social Analytics', num: '03', role: 'analyst' },
  { label: 'Verification Engine', num: '04', role: 'verifier_protector' },
  { label: 'Emergency AI Calls', num: '05', role: 'user' },
  { label: 'Multilingual Chatbot', num: '06', role: 'user' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const LandingPage: React.FC = () => {
  useReveal();

  /* emergency call state */
  const [showCall, setShowCall] = useState(false);
  const [phone, setPhone] = useState('');
  const [callState, setCallState] = useState<'idle' | 'calling' | 'done' | 'error'>('idle');
  const [callMsg, setCallMsg] = useState('');

  /* contact form */
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  /* cursor preview (capabilities section) */
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  const previewImages: Record<string, string> = {
    '01': 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=600&auto=format&fit=crop',
    '02': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=600&auto=format&fit=crop',
    '03': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop',
    '04': 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop',
    '05': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop',
    '06': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  };

  const startCall = async () => {
    if (!phone.trim()) { setCallState('error'); setCallMsg('Enter your phone number.'); return; }
    setCallState('calling');
    try {
      const res = await fetch('/api/twilio/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, userName: 'Visitor' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setCallState('done');
      setCallMsg('Call initiated! Pick up your phone — the CoastGuard AI agent will guide you.');
    } catch (err: unknown) {
      setCallState('error');
      setCallMsg(err instanceof Error ? err.message : 'Call failed. Try again.');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <>
      {/* ── Global styles injected once ── */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      <div style={{ background: '#F5F7FA', color: '#061829', fontFamily: "'Inter', sans-serif" }} className="antialiased">

        {/* ════════════════════════════════════════════════════
            CAPSULE NAV
        ════════════════════════════════════════════════════ */}
        <nav style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', top: '28px', zIndex: 50 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
            borderRadius: '9999px', padding: '6px 6px 6px 16px',
            border: '1px solid rgba(10,37,64,0.1)',
            boxShadow: '0 8px 32px rgba(10,37,64,0.12)',
          }}>
            {/* Logo */}
            <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px', textDecoration: 'none' }}>
              <img src="/logo.png" alt="CoastGuard Logo" style={{ height: 26, width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.02em', color: '#061829', whiteSpace: 'nowrap' }}>
                CoastGuard
              </span>
            </a>
            {/* Nav links */}
            <div style={{ display: 'flex', gap: '2px' }} className="hidden md:flex">
              {[['#about', 'Platform'], ['#features', 'Features'], ['#contact', 'Contact']].map(([href, label]) => (
                <a key={label} href={href} style={{ padding: '6px 12px', borderRadius: '9999px', fontSize: '0.875rem', color: 'rgba(6,24,41,0.6)', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = '#061829'; (e.target as HTMLElement).style.background = 'rgba(10,37,64,0.05)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(6,24,41,0.6)'; (e.target as HTMLElement).style.background = 'transparent'; }}>
                  {label}
                </a>
              ))}
            </div>
            {/* CTA */}
            <Link to="/auth?mode=register" style={{
              marginLeft: '8px', background: '#0A2540', color: 'white',
              padding: '8px 20px', borderRadius: '9999px', fontSize: '0.875rem',
              fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(10,37,64,0.3)',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#1565C0'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#0A2540'; }}>
              Join Now
            </Link>
          </div>
        </nav>

        {/* ════════════════════════════════════════════════════
            EMERGENCY CALL FLOATING BUTTON
        ════════════════════════════════════════════════════ */}
        <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 50 }}>
          <button
            onClick={() => { setShowCall(!showCall); setCallState('idle'); setCallMsg(''); }}
            style={{
              background: '#DC2626', color: 'white', border: 'none', cursor: 'pointer',
              width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 24px rgba(220,38,38,0.4)',
              animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
            }}
            title="Emergency AI Call"
          >
            <Phone size={22} />
          </button>

          {showCall && (
            <div style={{
              position: 'absolute', bottom: 70, left: 0, width: 320,
              background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              border: '1px solid rgba(10,37,64,0.08)', overflow: 'hidden',
            }}>
              <div style={{ background: 'linear-gradient(135deg, #DC2626, #EA580C)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={16} color="white" />
                  <div>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>AI Disaster Reporter</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: 0 }}>No login needed</p>
                  </div>
                </div>
                <button onClick={() => setShowCall(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: 16 }}>
                {callState !== 'done' && (
                  <>
                    <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 12, padding: 12, marginBottom: 12 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.75rem', color: '#92400E', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={13} color="#92400E" /> Emergency — No login required
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#78350F', margin: 0 }}>Say the disaster type and location. Report auto-saved for authorities.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 12 }}>
                      {HAZARDS.map(h => (
                        <div key={h.digit} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #F3F4F6', fontSize: '0.75rem' }}>
                          <span style={{ fontWeight: 700, color: '#9CA3AF', width: 12 }}>{h.digit}.</span>
                          <span style={{ fontWeight: 500, color: '#374151' }}>{h.label}</span>
                        </div>
                      ))}
                    </div>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '0.875rem', border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }} />
                    {callState === 'error' && <p style={{ fontSize: '0.75rem', color: '#DC2626', marginBottom: 8 }}>{callMsg}</p>}
                    <button onClick={startCall} disabled={!phone.trim() || callState === 'calling'}
                      style={{ width: '100%', background: '#DC2626', color: 'white', border: 'none', borderRadius: 12, padding: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {callState === 'calling' ? <><span>Calling…</span></> : <><PhoneCall size={16} /><span>Start AI Disaster Call</span></>}
                    </button>
                  </>
                )}
                {callState === 'done' && (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ width: 48, height: 48, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <PhoneCall size={24} color="#059669" />
                    </div>
                    <p style={{ fontWeight: 700, color: '#059669', fontSize: '0.875rem' }}>Call Connected!</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '8px 0' }}>{callMsg}</p>
                    <button onClick={() => { setCallState('idle'); setPhone(''); }} style={{ fontSize: '0.75rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Make another call</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════════════ */}
        <header id="top" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Background video */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <video
              src="/bg.mp4"
              autoPlay loop muted playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.1)', opacity: 0.9 }}
            />
          </div>

          {/* Floating translucent orbs */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div className="cg-drift-a" style={{ position: 'absolute', top: '12%', left: '8%', width: 240, height: 240, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04))', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: 'inset 0 0 60px rgba(255,255,255,0.22)' }} />
            <div className="cg-drift-b" style={{ position: 'absolute', top: '28%', right: '10%', width: 160, height: 160, borderRadius: '40%', background: 'linear-gradient(135deg, rgba(59,158,255,0.22), rgba(255,255,255,0.08))', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 40px rgba(59,158,255,0.25)' }} />
            <div className="cg-drift-c" style={{ position: 'absolute', top: '52%', left: '38%', width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)', backdropFilter: 'blur(2px)', border: '1px solid rgba(255,255,255,0.22)' }} />
            <div className="cg-drift-b" style={{ position: 'absolute', top: '8%', left: '55%', width: 72, height: 72, borderRadius: '45%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.18)' }} />
            <div className="cg-drift-a" style={{ position: 'absolute', bottom: '38%', right: '28%', width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59,158,255,0.18), transparent)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>

          {/* Readability gradients */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #F5F7FA, rgba(245,247,250,0.5) 50%, rgba(245,247,250,0.08))' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(245,247,250,0.55), transparent, rgba(245,247,250,0.25))' }} />

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '0 40px 18vw' }}>
              <div className="cg-reveal" style={{ maxWidth: 680 }}>
                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#0A2540', fontWeight: 500, marginBottom: 32 }}>
                  Coastal crisis intelligence — est. 2019
                </p>
                <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 0.95, color: '#061829', fontWeight: 300, letterSpacing: '-0.04em', margin: '0 0 24px', fontFamily: "'Inter', sans-serif" }}>
                  Early alerts from the people,{' '}
                  <br />for the{' '}
                  <em className="cg-serif" style={{ fontStyle: 'italic', fontWeight: 400 }}>people.</em>
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'rgba(6,24,41,0.5)', letterSpacing: '0.08em', marginBottom: 40 }}>
                  / Community-powered coastal disaster management /
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <Link to="/auth?mode=register" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#0A2540', color: 'white', fontWeight: 500,
                    fontSize: '1rem', padding: '14px 28px', borderRadius: '9999px',
                    textDecoration: 'none', boxShadow: '0 8px 32px rgba(10,37,64,0.3)',
                    transition: 'all 0.3s',
                  }}>
                    Join the mission <ArrowUpRight size={16} />
                  </Link>
                  <Link to="/auth" style={{ fontSize: '0.875rem', color: 'rgba(6,24,41,0.5)', textDecoration: 'none', borderBottom: '1px solid rgba(6,24,41,0.2)', paddingBottom: 2 }}>
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Giant cropped wordmark */}
          <div style={{ position: 'absolute', bottom: '-4vw', left: '50%', transform: 'translateX(-50%)', width: '100%', zIndex: 5, pointerEvents: 'none', overflow: 'hidden' }}>
            <p className="cg-wordmark">COASTGUARD</p>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════
            PROJECT REEL
        ════════════════════════════════════════════════════ */}
        <section id="features" style={{ position: 'relative', paddingTop: '9vw', paddingBottom: 32 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
            <div className="cg-reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56 }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 300, letterSpacing: '-0.04em', margin: 0 }}>
                Platform{' '}
                <em className="cg-serif" style={{ fontStyle: 'italic', fontWeight: 400 }}>capabilities</em>
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(6,24,41,0.4)', display: 'none' }} className="hidden sm:block">2024 — 2025</p>
            </div>
          </div>

          {/* Panel 01 — full width */}
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', marginBottom: 40 }}>
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '21/9', boxShadow: '0 24px 80px rgba(10,37,64,0.15)' }}>
              <img className="cg-panel-img" src={PROJECTS[0].img} alt={PROJECTS[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,24,41,0.75), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
                <div className="cg-reveal">
                  <p style={{ fontSize: '0.75rem', color: '#3B9EFF', fontWeight: 500, marginBottom: 8 }}>{PROJECTS[0].num}</p>
                  <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, letterSpacing: '-0.03em', color: 'white', margin: '0 0 8px' }}>{PROJECTS[0].title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 480, margin: 0 }}>{PROJECTS[0].desc}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {PROJECTS[0].tags.map(t => (
                    <span key={t} style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 9999, padding: '4px 12px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panels 02 + 03 */}
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, marginBottom: 40 }}>
            {PROJECTS.slice(1).map((p, i) => (
              <div key={p.num} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 24px 80px rgba(10,37,64,0.15)', marginTop: i === 0 ? -16 : 96 }}>
                <img className="cg-panel-img" src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,24,41,0.75), transparent)' }} />
                <div className="cg-reveal" style={{ position: 'absolute', bottom: 0, left: 0, padding: 32 }}>
                  <p style={{ fontSize: '0.75rem', color: '#3B9EFF', fontWeight: 500, marginBottom: 8 }}>{p.num}</p>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 300, letterSpacing: '-0.03em', color: 'white', margin: '0 0 8px' }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', maxWidth: 320, margin: '0 0 16px' }}>{p.desc}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 9999, padding: '4px 12px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            PLATFORM METHOD (light blue bg)
        ════════════════════════════════════════════════════ */}
        <section id="about" style={{ background: '#E8F2FF', padding: '96px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
            <div className="cg-reveal" style={{ maxWidth: 720, marginBottom: 80 }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#0A2540', fontWeight: 500, marginBottom: 24 }}>
                Platform
              </p>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.04em', margin: '0 0 24px' }}>
                We give coastal communities{' '}
                <em className="cg-serif" style={{ fontStyle: 'italic', fontWeight: 400 }}>real-time protection.</em>
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(6,24,41,0.6)', maxWidth: 560, lineHeight: 1.7, margin: 0 }}>
                Screens forget. Disasters don't. Every report starts with urgency — what should the responders know, and how fast can we get it to them.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
              {METHOD_CARDS.map((card, i) => (
                <div key={card.letter} className="cg-reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '3/2', marginBottom: 24, boxShadow: '0 16px 40px rgba(10,37,64,0.1)' }}>
                    <img src={card.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', cursor: 'default' }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(6,24,41,0.4)', fontWeight: 500, marginBottom: 8 }}>{card.letter}</p>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 12 }}>{card.title}</h3>
                  <p style={{ fontSize: '1rem', color: 'rgba(6,24,41,0.6)', lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CAPABILITIES (dark navy bg)
        ════════════════════════════════════════════════════ */}
        <section style={{ background: '#0A2540', padding: '96px 0', position: 'relative' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
            <p className="cg-reveal" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#3B9EFF', fontWeight: 500, marginBottom: 48 }}>
              Features
            </p>

            <div>
              {CAPABILITIES.map((cap, i) => (
                <Link
                  to={`/auth?mode=register&role=${cap.role}`}
                  key={cap.num}
                  className="cg-capability-row"
                  style={{ transitionDelay: `${i * 80}ms` } as React.CSSProperties}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    if (previewRef.current && previewImgRef.current) {
                      previewImgRef.current.src = previewImages[cap.num];
                      previewRef.current.style.opacity = '1';
                      previewRef.current.style.transform = 'scale(1)';
                    }
                    el.style.borderTopColor = 'rgba(59,158,255,0.5)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    if (previewRef.current) {
                      previewRef.current.style.opacity = '0';
                      previewRef.current.style.transform = 'scale(0.9)';
                    }
                    el.style.borderTopColor = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseMove={e => {
                    if (previewRef.current) {
                      previewRef.current.style.left = `${e.clientX + 28}px`;
                      previewRef.current.style.top = `${e.clientY - 80}px`;
                    }
                  }}
                >
                  <span className="cg-cap-label">{cap.label}</span>
                  <span className="cg-cap-num">{cap.num}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Floating cursor preview */}
          <div ref={previewRef} style={{
            position: 'fixed', zIndex: 40, pointerEvents: 'none',
            width: 220, aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden',
            opacity: 0, transform: 'scale(0.9)',
            transition: 'all 0.3s ease-out',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}>
            <img ref={previewImgRef} src="" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            STATS STRIP
        ════════════════════════════════════════════════════ */}
        <section style={{ background: '#F5F7FA', padding: '80px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
              {[
                { icon: <AlertTriangle size={24} color="#3B9EFF" />, stat: '12,000+', label: 'Hazard reports processed' },
                { icon: <Users size={24} color="#3B9EFF" />, stat: '4,800+', label: 'Active community members' },
                { icon: <Zap size={24} color="#3B9EFF" />, stat: '<3 min', label: 'Average alert response time' },
                { icon: <Globe size={24} color="#3B9EFF" />, stat: '18', label: 'Coastal districts covered' },
                { icon: <Activity size={24} color="#3B9EFF" />, stat: '99.7%', label: 'Platform uptime' },
              ].map((item, i) => (
                <div key={item.label} className="cg-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div style={{ marginBottom: 16 }}>{item.icon}</div>
                  <p style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#0A2540', margin: '0 0 6px' }}>{item.stat}</p>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(6,24,41,0.5)', margin: 0 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            TESTIMONIAL / PROOF
        ════════════════════════════════════════════════════ */}
        <section style={{ background: '#F5F7FA', paddingTop: 0, paddingBottom: '9vw' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
              {/* Photo */}
              <div className="cg-reveal" style={{ order: 2 }}>
                <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 24px 80px rgba(10,37,64,0.15)' }}>
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?q=80&w=800&auto=format&fit=crop"
                    alt="Priya Nair, district coordinator"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', transition: 'filter 0.7s' }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.filter = 'grayscale(0)'; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.filter = 'grayscale(1)'; }} />
                </div>
              </div>
              {/* Quote */}
              <div className="cg-reveal" style={{ order: 1 }}>
                <Quote size={32} color="#0A2540" style={{ marginBottom: 32 }} />
                <blockquote style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', lineHeight: 1.25, fontWeight: 300, letterSpacing: '-0.03em', color: '#061829', margin: '0 0 32px' }}>
                  "Our old process took 40 minutes to verify and escalate a coastal event. CoastGuard brought that to under 3 minutes. Responders now arrive before the situation worsens."
                </blockquote>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '1rem', margin: '0 0 4px' }}>Priya Nair</p>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(6,24,41,0.4)', margin: 0 }}>District Disaster Coordinator, Kerala NDRF</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CONTACT
        ════════════════════════════════════════════════════ */}
        <section id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* cropped wordmark backdrop */}
          <div style={{ overflow: 'hidden', userSelect: 'none', pointerEvents: 'none' }}>
            <p style={{ fontSize: '13vw', lineHeight: 0.85, color: 'rgba(10,37,64,0.06)', whiteSpace: 'nowrap', textAlign: 'center', marginBottom: '-2vw', fontWeight: 300, letterSpacing: '-0.04em', fontFamily: "'Inter', sans-serif" }}>
              PROTECT EVERY COAST
            </p>
          </div>

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56 }}>
            {/* Left */}
            <div className="cg-reveal">
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '-0.04em', margin: '0 0 24px' }}>
                Join the{' '}
                <br />
                <em className="cg-serif" style={{ fontStyle: 'italic', fontWeight: 400 }}>mission.</em>
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(6,24,41,0.6)', maxWidth: 360, marginBottom: 40, lineHeight: 1.7 }}>
                Bring a coastal hazard to report, a community to protect, or data to analyze. We'll tell you honestly what CoastGuard can do.
              </p>
              <a href="mailto:hello@coastguard.in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '1rem', color: '#061829', borderBottom: '1px solid rgba(6,24,41,0.2)', paddingBottom: 4, textDecoration: 'none', transition: 'border-color 0.3s' }}>
                hello@coastguard.in <ArrowUpRight size={16} color="#0A2540" />
              </a>

              <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Link to="/auth?mode=register&role=user" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#E8F2FF', borderRadius: 14, textDecoration: 'none', color: '#061829', transition: 'background 0.3s' }}>
                  <MapPin size={20} color="#0A2540" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>Join as Citizen Reporter</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(6,24,41,0.5)', margin: 0 }}>Report hazards from your area</p>
                  </div>
                </Link>
                <Link to="/auth?mode=register&role=verifier_protector" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#E8F2FF', borderRadius: 14, textDecoration: 'none', color: '#061829', transition: 'background 0.3s' }}>
                  <Shield size={20} color="#0A2540" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>Join as Protector</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(6,24,41,0.5)', margin: 0 }}>Verify & coordinate response</p>
                  </div>
                </Link>
                <Link to="/auth?mode=register&role=analyst" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#E8F2FF', borderRadius: 14, textDecoration: 'none', color: '#061829', transition: 'background 0.3s' }}>
                  <BarChart3 size={20} color="#0A2540" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>Join as Analyst</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(6,24,41,0.5)', margin: 0 }}>Monitor trends & analytics</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Contact form */}
            <div className="cg-reveal">
              {formSent ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ width: 64, height: 64, background: '#DBEAFE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <Waves size={28} color="#0A2540" />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '-0.03em', marginBottom: 12 }}>Message received.</h3>
                  <p style={{ color: 'rgba(6,24,41,0.5)', lineHeight: 1.6 }}>We'll get back to you within 24 hours. Meanwhile, you can <Link to="/auth?mode=register" style={{ color: '#0A2540' }}>create your account</Link>.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(6,24,41,0.4)', marginBottom: 8 }}>Name</label>
                      <input type="text" placeholder="Your name" required className="cg-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(6,24,41,0.4)', marginBottom: 8 }}>Email</label>
                      <input type="email" placeholder="you@district.gov" required className="cg-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(6,24,41,0.4)', marginBottom: 8 }}>Your message</label>
                    <textarea rows={4} placeholder="What coastal area are you protecting, and what do you need?" required className="cg-input" style={{ resize: 'none' }} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                  </div>
                  <button type="submit" style={{
                    alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#0A2540', color: 'white', border: 'none', cursor: 'pointer',
                    fontWeight: 500, fontSize: '1rem', padding: '14px 28px', borderRadius: '9999px',
                    boxShadow: '0 8px 32px rgba(10,37,64,0.3)', transition: 'all 0.3s',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    Send message <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <footer style={{ borderTop: '1px solid rgba(6,24,41,0.1)' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
              {/* Brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'grid', gridTemplateColumns: 'repeat(3,4px)', gap: '2.5px' }}>
                  {[1,0.6,0.3, 0.6,0.3,0.6, 0.3,0.6,1].map((op, i) => (
                    <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i === 0 || i === 8 ? '#3B9EFF' : `rgba(6,24,41,${op})`, display: 'block' }} />
                  ))}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.02em' }}>CoastGuard</span>
              </div>
              {/* Nav */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 28px' }}>
                {[['#about', 'Platform'], ['#features', 'Features'], ['#contact', 'Contact'], ['/auth', 'Sign in']].map(([href, label]) => (
                  <a key={label} href={href} style={{ fontSize: '0.875rem', color: 'rgba(6,24,41,0.5)', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = '#061829'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(6,24,41,0.5)'; }}>
                    {label}
                  </a>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(6,24,41,0.3)' }}>© 2025 CoastGuard. Early alerts from the people, for the people.</p>
            </div>
          </footer>
        </section>

      </div>
    </>
  );
};

export default LandingPage;