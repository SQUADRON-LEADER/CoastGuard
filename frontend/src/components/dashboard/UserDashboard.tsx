import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, MapPin, Bell, BadgeCheck, Map, BarChart3, Trophy, Activity, Waves, ArrowUpRight, TrendingUp, Clock, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import QuickActions from './QuickActions';
import { Link } from 'react-router-dom';

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  verified:  { bg: '#D1FAE5', text: '#065F46', label: '✓ Verified' },
  pending:   { bg: '#FEF3C7', text: '#92400E', label: '⏳ Pending' },
  rejected:  { bg: '#FEE2E2', text: '#991B1B', label: '✗ Rejected' },
};

const UserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { reports, getReportsByUser } = useReports();

  const userReports = getReportsByUser(user?.id || '');
  const stats = {
    myUploads:        userReports.length,
    communityUploads: reports.filter(r => r.isLocal).length,
    unreadUpdates:    3,
    verifiedReports:  reports.filter(r => r.verificationStatus === 'verified').length,
  };

  const statCards = [
    { title: 'My Reports',         value: stats.myUploads,        icon: UploadCloud, accent: '#3B9EFF', link: '/upload' },
    { title: 'Community Reports',  value: stats.communityUploads, icon: MapPin,      accent: '#059669', link: '/community' },
    { title: 'New Updates',        value: stats.unreadUpdates,    icon: Bell,        accent: '#F59E0B', link: '/updates' },
    { title: 'Verified Reports',   value: stats.verifiedReports,  icon: BadgeCheck,  accent: '#8B5CF6', link: '/community' },
  ];

  const featureCards = [
    { href: '/map',        icon: Map,      accent: '#0D47A1', label: 'Interactive Map',    desc: 'Live hazard reports on an interactive coastal map' },
    { href: '/leaderboard',icon: Trophy,   accent: '#F59E0B', label: 'Leaderboard',        desc: 'Top contributors and your community rank' },
    { href: '/social',     icon: BarChart3,accent: '#8B5CF6', label: 'Social Intelligence',desc: 'Real-time social media disaster intelligence' },
  ];

  return (
    <div className="dashboard-bg" style={{ padding: '24px 24px 48px', minHeight: '100vh', position: 'relative' }}>
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
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* ── HERO BAR ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="dash-hero"
          style={{ marginBottom: '28px' }}
        >
          <div className="dash-hero-grid" />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '16px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}>
                <Waves size={26} color="white" />
              </div>
              <div>
                <h1 style={{ color: 'white', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.03em' }}>
                  {t('dashboard.welcome')}, {user?.name}!
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>

            {/* Hero right badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{
                padding: '8px 16px', borderRadius: '99px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <div className="live-dot" />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: 500 }}>Live alerts active</span>
              </div>
              <Link to="/upload" style={{
                padding: '8px 18px', borderRadius: '99px',
                background: 'rgba(59,158,255,0.85)',
                border: '1px solid rgba(59,158,255,0.4)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', gap: '6px',
                textDecoration: 'none', color: 'white', fontSize: '0.78rem', fontWeight: 600,
                transition: 'all 0.2s',
              }}>
                <UploadCloud size={14} />
                <span>Submit Report</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          {statCards.map((stat, i) => (
            <motion.a
              key={stat.title}
              href={stat.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="premium-stat"
              style={{ cursor: 'pointer', textDecoration: 'none', '--stat-color': `${stat.accent}22` } as React.CSSProperties}
            >
              <div style={{
                display: 'inline-flex', padding: '10px', borderRadius: '12px', marginBottom: '14px',
                background: `${stat.accent}18`,
              }}>
                <stat.icon size={20} color={stat.accent} />
              </div>
              <div style={{
                fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em',
                background: `linear-gradient(135deg, ${stat.accent}, ${stat.accent}99)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: '4px',
              }}>
                {stat.value}
              </div>
              <p style={{ color: '#8D9AB0', fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>{stat.title}</p>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                borderRadius: '0 0 16px 16px',
                background: `linear-gradient(90deg, ${stat.accent}, ${stat.accent}44)`,
                opacity: 0.7,
              }} />
            </motion.a>
          ))}
        </div>

        {/* ── MAIN CONTENT GRID ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px', marginBottom: '28px' }}>

          {/* Quick Actions — 6 cols */}
          <div style={{ gridColumn: 'span 12', gridRow: '1' }} className="lg:col-span-6">
            <div style={{ gridColumn: '1 / span 6' }}>
              <QuickActions />
            </div>
          </div>

          {/* Impact Analytics — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="premium-card"
            style={{ gridColumn: 'span 12' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59,158,255,0.1)' }}>
                <Activity size={16} color="#3B9EFF" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#061829', margin: 0 }}>Your Impact</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Reports Submitted', value: stats.myUploads, color: '#3B9EFF' },
                { label: 'Reports Verified', value: userReports.filter(r => r.verificationStatus === 'verified').length, color: '#059669' },
                { label: 'Pending Review',    value: userReports.filter(r => r.verificationStatus === 'pending').length, color: '#F59E0B' },
                { label: 'Rejected',          value: userReports.filter(r => r.verificationStatus === 'rejected').length, color: '#FF5A5F' },
                { label: 'Community Rank',    value: '#12',  color: '#8B5CF6', isText: true },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: '10px',
                  background: `${item.color}0A`,
                  border: `1px solid ${item.color}18`,
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#5A6A84' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Reports — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="premium-card"
            style={{ gridColumn: 'span 12' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#061829', margin: 0 }}>Recent Reports</h3>
              <a href="/community" style={{ fontSize: '0.75rem', color: '#3B9EFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View all <ArrowUpRight size={12} />
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userReports.length > 0 ? (
                userReports.slice(0, 4).map(report => (
                  <div key={report.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#F8FAFD', borderRadius: '12px', border: '1px solid rgba(10,37,64,0.06)' }}>
                    <img
                      src={report.thumbnailUrl || report.fileUrl}
                      alt={report.title}
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.8rem', color: '#061829', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.title}</p>
                      <p style={{ fontSize: '0.7rem', color: '#8D9AB0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.location.address}</p>
                    </div>
                    <span style={{
                      ...(() => { const s = statusColors[report.verificationStatus] || statusColors.pending; return { background: s.bg, color: s.text }; })(),
                      padding: '3px 10px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 600, flexShrink: 0,
                    }}>
                      {(statusColors[report.verificationStatus] || statusColors.pending).label}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <UploadCloud size={36} color="rgba(10,37,64,0.2)" style={{ marginBottom: '12px' }} />
                  <p style={{ color: '#8D9AB0', fontSize: '0.875rem', marginBottom: '16px' }}>No reports yet</p>
                  <a href="/upload" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '10px 20px', background: 'linear-gradient(135deg, #0A2540, #1565C0)',
                    color: 'white', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
                  }}>
                    <UploadCloud size={14} /> Submit First Report
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── RECENT ACTIVITY FEED ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="premium-card"
          style={{ marginBottom: '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(5,150,105,0.1)' }}>
                <TrendingUp size={16} color="#059669" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#061829', margin: 0 }}>Recent Community Activity</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="live-dot" />
              <span style={{ fontSize: '0.72rem', color: '#8D9AB0' }}>Live</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {reports.slice(0, 6).map((report, i) => {
              const status = statusColors[report.verificationStatus] || statusColors.pending;
              return (
                <div key={report.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                  borderRadius: '10px', transition: 'background 0.2s', cursor: 'default',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFD')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #0A2540, #1565C0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.8rem', fontWeight: 700,
                  }}>
                    {report.title.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 500, fontSize: '0.82rem', color: '#061829', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.title}</p>
                    <p style={{ fontSize: '0.72rem', color: '#8D9AB0', margin: 0 }}>{report.location.address}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ background: status.bg, color: status.text, padding: '3px 10px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 600 }}>
                      {status.label}
                    </span>
                    <p style={{ fontSize: '0.65rem', color: '#A8B2C3', marginTop: '4px' }}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── FEATURE HIGHLIGHTS ────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          {featureCards.map((card, i) => (
            <motion.a
              key={card.href}
              href={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="premium-card"
              style={{ cursor: 'pointer', textDecoration: 'none', display: 'block' }}
              whileHover={{ y: -4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  padding: '10px', borderRadius: '12px',
                  background: `${card.accent}18`,
                }}>
                  <card.icon size={20} color={card.accent} />
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#061829', margin: 0 }}>{card.label}</h3>
              </div>
              <p style={{ color: '#8D9AB0', fontSize: '0.8rem', margin: '0 0 14px', lineHeight: 1.5 }}>{card.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: card.accent, fontSize: '0.75rem', fontWeight: 600 }}>
                <span>Explore</span>
                <ArrowUpRight size={13} />
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;