import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Anchor,
  Mail,
  Lock,
  User,
  Phone,
  Users,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Waves,
  Activity,
  MapPin,
  Zap,
} from 'lucide-react';
import { UserRole, Language } from '../../types';

/* ── Floating orbs for left panel ───────────────────────────────── */
const ORB_CONFIGS = [
  { w: 280, h: 280, top: '-80px', left: '-60px', opacity: 0.12 },
  { w: 200, h: 200, top: '38%', right: '-50px', opacity: 0.1 },
  { w: 140, h: 140, bottom: '12%', left: '30%', opacity: 0.14 },
  { w: 80,  h: 80,  top: '22%', left: '55%', opacity: 0.18 },
];

/* ── Stats shown on left panel ───────────────────────────────────── */
const LEFT_STATS = [
  { icon: Activity, value: '12,000+', label: 'Hazard reports processed' },
  { icon: Zap,      value: '<3 min',  label: 'Average alert response' },
  { icon: Users,    value: '4,800+',  label: 'Active community members' },
  { icon: MapPin,   value: '18',      label: 'Coastal districts covered' },
];

const ROLE_OPTIONS = [
  {
    value: 'community_user',
    label: 'Community User',
    icon: Users,
    accentColor: '#3B9EFF',
    bgColor: 'rgba(59,158,255,0.1)',
    description: 'Report hazards, upload media, participate in discussions',
    privileges: ['Submit hazard reports', 'Upload photos/videos', 'Vote on community posts', 'Receive safety alerts'],
  },
  {
    value: 'community_validator',
    label: 'Community Validator',
    icon: CheckCircle,
    accentColor: '#059669',
    bgColor: 'rgba(5,150,105,0.1)',
    description: 'Validate community reports, earn points, collaborative verification',
    privileges: ['Validate community reports', 'Star rating system', 'Discussion forums', 'Community ranking'],
  },
  {
    value: 'verifier_protector',
    label: 'Verifier / Protector',
    icon: Shield,
    accentColor: '#FF5A5F',
    bgColor: 'rgba(255,90,95,0.1)',
    description: 'Verify reports, guide emergency responses, access analytics',
    privileges: ['Verify user reports', 'Emergency response tools', 'Advanced analytics', 'Priority notifications'],
  },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', code: 'EN' },
  { value: 'hi', label: 'हिंदी', code: 'HI' },
  { value: 'ta', label: 'தமிழ்', code: 'TA' },
  { value: 'te', label: 'తెలుగు', code: 'TE' },
  { value: 'ml', label: 'മലയാളം', code: 'ML' },
  { value: 'kn', label: 'ಕನ್ನಡ', code: 'KN' },
  { value: 'gu', label: 'ગુજરાતી', code: 'GU' },
  { value: 'mr', label: 'मराठी', code: 'MR' },
  { value: 'bn', label: 'বাংলা', code: 'BN' },
];

/* ─── Inline styles ──────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'Inter', sans-serif",
    background: '#F5F7FA',
  } as React.CSSProperties,

  left: {
    width: '45%',
    background: 'linear-gradient(160deg, #061829 0%, #0A2540 40%, #0D47A1 75%, #0891B2 100%)',
    padding: '52px 48px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  } as React.CSSProperties,

  leftGlow: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(ellipse at 15% 25%, rgba(59,158,255,0.22) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 75%, rgba(8,145,178,0.18) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  } as React.CSSProperties,

  leftGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '32px 32px',
    pointerEvents: 'none',
  } as React.CSSProperties,

  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    overflowY: 'auto',
  } as React.CSSProperties,

  formCard: {
    width: '100%',
    maxWidth: '500px',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.8)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 1px 3px rgba(10,37,64,0.06), 0 12px 40px rgba(10,37,64,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
  } as React.CSSProperties,
};

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isRegister = searchParams.get('mode') === 'register';
  const defaultRole = (searchParams.get('role') as UserRole) || 'community_user';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: defaultRole,
    preferredLanguage: 'en' as Language,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (isRegister) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      let success = false;
      if (isRegister) {
        success = await register(formData);
      } else {
        success = await login(formData.email, formData.password);
      }
      if (!success) setErrors({ general: 'Authentication failed. Please try again.' });
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Input field helper ─────────────────────────────────────── */
  const InputField = ({
    id, label, type = 'text', value, onChange, placeholder, icon: Icon, error, rightEl,
  }: {
    id: string; label: string; type?: string; value: string;
    onChange: (v: string) => void; placeholder: string; icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
    error?: string; rightEl?: React.ReactNode;
  }) => (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#0A2540', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: error ? '#FF5A5F' : '#8D9AB0', pointerEvents: 'none' }} />
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '12px 14px 12px 38px',
            paddingRight: rightEl ? '44px' : '14px',
            background: error ? 'rgba(255,90,95,0.04)' : '#F8FAFD',
            border: `1.5px solid ${error ? '#FF5A5F' : 'rgba(10,37,64,0.12)'}`,
            borderRadius: '12px', fontSize: '0.875rem', color: '#061829', outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? '#FF5A5F' : '#3B9EFF';
            e.target.style.background = 'white';
            e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(255,90,95,0.1)' : 'rgba(59,158,255,0.12)'}`;
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? '#FF5A5F' : 'rgba(10,37,64,0.12)';
            e.target.style.background = error ? 'rgba(255,90,95,0.04)' : '#F8FAFD';
            e.target.style.boxShadow = 'none';
          }}
        />
        {rightEl && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{rightEl}</div>}
      </div>
      {error && <p style={{ color: '#FF5A5F', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} />{error}</p>}
    </div>
  );

  return (
    <div style={{ ...S.page, flexDirection: 'row' }}>
      {/* Background Video */}
      <video
        src="/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.12,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div style={S.left} className="hidden lg:flex">
        {/* Background layers */}
        <div style={S.leftGlow} />
        <div style={S.leftGrid} />

        {/* Floating orbs */}
        {ORB_CONFIGS.map((orb, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: orb.w, height: orb.h,
            top: orb.top, left: (orb as any).left, right: (orb as any).right,
            bottom: (orb as any).bottom,
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,${orb.opacity * 1.5})`,
            background: `radial-gradient(circle, rgba(255,255,255,${orb.opacity * 0.5}), transparent 70%)`,
            backdropFilter: 'blur(2px)',
          }} />
        ))}

        {/* Top branding */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '64px' }}>
            <img src="/logo.png" alt="CoastGuard Logo" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', margin: 0, letterSpacing: '-0.02em' }}>CoastGuard</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', margin: 0 }}>Coastal Intelligence Platform</p>
            </div>
          </Link>

          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 16px' }}>
            Protecting{' '}<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#3B9EFF' }}>every coastline,</em><br />
            together.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 320 }}>
            Community-powered coastal disaster intelligence. Report, verify, and respond to hazards in real time.
          </p>
        </div>

        {/* Stats grid */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            {LEFT_STATS.map((stat, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}>
                <stat.icon size={16} color="rgba(255,255,255,0.5)" style={{ marginBottom: '8px' }} />
                <p style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            padding: '16px 20px', borderRadius: '14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.6 }}>
              "CoastGuard brought our coastal alert time from 40 minutes to under 3 minutes."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #3B9EFF, #0891B2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={14} color="white" />
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>Priya Nair</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', margin: 0 }}>District Coordinator, Kerala NDRF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div style={S.right}>
        <div style={S.formCard}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <img src="/logo.png" alt="CoastGuard Logo" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0A2540' }}>CoastGuard</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#061829', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h1>
            <p style={{ color: '#8D9AB0', fontSize: '0.875rem', margin: 0 }}>
              {isRegister
                ? 'Join the mission to protect our coastlines'
                : 'Sign in to continue your coastal protection work'}
            </p>
          </div>

          {/* General error */}
          {errors.general && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px',
              background: 'rgba(255,90,95,0.06)', border: '1px solid rgba(255,90,95,0.2)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
              color: '#C2363B', fontSize: '0.875rem',
            }}>
              <AlertCircle size={16} />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isRegister && (
              <>
                {/* Role selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#0A2540', marginBottom: '10px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Choose Your Role
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {ROLE_OPTIONS.map(role => (
                      <label
                        key={role.value}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '14px',
                          padding: '14px 16px', borderRadius: '14px', cursor: 'pointer',
                          border: `2px solid ${formData.role === role.value ? role.accentColor : 'rgba(10,37,64,0.1)'}`,
                          background: formData.role === role.value ? role.bgColor : '#F8FAFD',
                          boxShadow: formData.role === role.value ? `0 0 0 3px ${role.accentColor}22` : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                        />
                        <div style={{
                          width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                          background: role.accentColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: `0 4px 12px ${role.accentColor}44`,
                        }}>
                          <role.icon size={18} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <p style={{ fontWeight: 600, color: '#061829', fontSize: '0.875rem', margin: 0 }}>{role.label}</p>
                            {formData.role === role.value && (
                              <div style={{ width: 18, height: 18, borderRadius: '50%', background: role.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={12} color="white" />
                              </div>
                            )}
                          </div>
                          <p style={{ color: '#8D9AB0', fontSize: '0.75rem', margin: '0 0 8px' }}>{role.description}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {role.privileges.map((p, idx) => (
                              <span key={idx} style={{
                                fontSize: '0.65rem', padding: '2px 8px', borderRadius: '99px',
                                background: `${role.accentColor}18`, color: role.accentColor, fontWeight: 500,
                              }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#0A2540', marginBottom: '10px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Preferred Language
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {LANGUAGE_OPTIONS.map(lang => (
                      <label key={lang.value} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                        padding: '8px 10px', borderRadius: '10px',
                        border: `1.5px solid ${formData.preferredLanguage === lang.value ? '#3B9EFF' : 'rgba(10,37,64,0.1)'}`,
                        background: formData.preferredLanguage === lang.value ? 'rgba(59,158,255,0.06)' : '#F8FAFD',
                        transition: 'all 0.15s',
                        fontSize: '0.75rem', fontWeight: 500, color: '#061829',
                      }}>
                        <input type="radio" name="lang" value={lang.value}
                          checked={formData.preferredLanguage === lang.value}
                          onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value as Language })}
                          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                        />
                        <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(10,37,64,0.08)', borderRadius: '4px', fontWeight: 700 }}>{lang.code}</span>
                        <span>{lang.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <InputField id="name" label="Full Name" value={formData.name}
                  onChange={v => setFormData({ ...formData, name: v })}
                  placeholder="Enter your full name" icon={User} error={errors.name}
                />

                {/* Phone */}
                <InputField id="phone" label="Phone (Optional)" type="tel" value={formData.phone}
                  onChange={v => setFormData({ ...formData, phone: v })}
                  placeholder="+91 98765 43210" icon={Phone}
                />
              </>
            )}

            {/* Email */}
            <InputField id="email" label="Email Address" type="email" value={formData.email}
              onChange={v => setFormData({ ...formData, email: v })}
              placeholder="your@email.com" icon={Mail} error={errors.email}
            />

            {/* Password */}
            <InputField id="password" label="Password" type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={v => setFormData({ ...formData, password: v })}
              placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
              icon={Lock} error={errors.password}
              rightEl={
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D9AB0', padding: 0, display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Confirm password */}
            {isRegister && (
              <InputField id="confirmPassword" label="Confirm Password" type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={v => setFormData({ ...formData, confirmPassword: v })}
                placeholder="Repeat your password" icon={Lock} error={errors.confirmPassword}
              />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '14px',
                background: isLoading ? 'rgba(10,37,64,0.4)' : 'linear-gradient(135deg, #0A2540 0%, #1565C0 100%)',
                border: 'none', borderRadius: '14px', cursor: isLoading ? 'not-allowed' : 'pointer',
                color: 'white', fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '-0.01em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: isLoading ? 'none' : '0 4px 20px rgba(10,37,64,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span>Please wait…</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(10,37,64,0.08)' }} />
              <span style={{ fontSize: '0.75rem', color: '#8D9AB0' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(10,37,64,0.08)' }} />
            </div>

            {/* Switch mode */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#8D9AB0' }}>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button
                type="button"
                onClick={() => navigate(isRegister ? '/auth' : '/auth?mode=register')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1565C0', fontWeight: 600, fontSize: '0.875rem', padding: 0 }}
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Demo accounts */}
          <div style={{
            marginTop: '24px', padding: '16px',
            background: 'rgba(59,158,255,0.04)',
            border: '1px solid rgba(59,158,255,0.12)',
            borderRadius: '14px',
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0A2540', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#3B9EFF" /> Demo Accounts
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Community User', email: 'priya.sharma@email.com', color: '#3B9EFF' },
                { label: 'Verifier', email: 'raj.patel@coastguard.in', color: '#FF5A5F' },
              ].map(demo => (
                <div key={demo.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', color: '#8D9AB0' }}>{demo.label}:</span>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: demo.color, fontWeight: 500 }}>{demo.email}</span>
                </div>
              ))}
              <p style={{ fontSize: '0.65rem', color: '#A8B2C3', marginTop: '4px', margin: '4px 0 0' }}>
                Any password works for demo accounts
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1023px) { .auth-left-panel { display: none !important; } }
      `}</style>
    </div>
  );
};

export default AuthPage;