import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, AlertTriangle, Users, TrendingUp, Clock, MapPin,
  BarChart3, Map, Globe, Shield, ArrowUpRight, Zap, Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import { Upload } from '../../types';
import QuickActions from './QuickActions';
import { formatTimeAgo } from '../../lib/utils';
import { Link } from 'react-router-dom';

const severityConfig: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#FF5A5F', text: 'white' },
  severe:   { bg: '#F59E0B', text: 'white' },
  moderate: { bg: '#3B9EFF', text: 'white' },
  low:      { bg: '#059669', text: 'white' },
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  verified: { bg: '#D1FAE5', text: '#065F46', label: '✓ Verified' },
  pending:  { bg: '#FEF3C7', text: '#92400E', label: '⏳ Pending' },
  rejected: { bg: '#FEE2E2', text: '#991B1B', label: '✗ Rejected' },
};

const VerifierDashboard: React.FC = () => {
  const { user } = useAuth();
  const { reports } = useReports();

  const safeReports = Array.isArray(reports) ? reports : [];

  const stats = {
    pendingReports:      safeReports.filter(u => u?.verificationStatus === 'pending').length,
    verifiedToday:       safeReports.filter(u => u?.verificationStatus === 'verified').length,
    highPriority:        safeReports.filter(u => u?.severity === 'severe' || u?.severity === 'critical').length,
    communityEngagement: safeReports.reduce((sum, u) => sum + (u?.upvotes || 0), 0),
  };

  const topUpvotedReports = safeReports
    .filter(u => u && u.upvotes !== undefined && u.downvotes !== undefined)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    .slice(0, 5);

  const urgentReports = safeReports
    .filter(u => u && u.verificationStatus === 'pending' && (u.severity === 'critical' || u.severity === 'severe'))
    .slice(0, 3);

  const safeFormatTimeAgo = (date: Date | string | undefined) => {
    try {
      if (!date) return 'Unknown';
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return 'Unknown';
      return formatTimeAgo(d);
    } catch { return 'Unknown'; }
  };

  const safeImageSrc = (report: Partial<Upload>): string =>
    report?.thumbnailUrl || report?.fileUrl ||
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkMzMS4xNzk3IDMyIDM3IDI2LjE3OTcgMzcgMTlDMzcgMTEuODIwMyAzMS4xNzk3IDYgMjQgNkMxNi44MjAzIDYgMTEgMTEuODIwMyAxMSAxOUMxMSAyNi4xNzk3IDE2LjgyMDMgMzIgMjQgMzJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Im0xNCAyNCAyIDIgNS01IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';

  const statCards = [
    { title: 'Pending Review',    value: stats.pendingReports,      icon: Clock,        accent: '#F59E0B', link: '/verify',    urgent: stats.pendingReports > 5 },
    { title: 'Verified Today',    value: stats.verifiedToday,       icon: CheckCircle,  accent: '#059669', link: '/verify' },
    { title: 'High Priority',     value: stats.highPriority,        icon: AlertTriangle,accent: '#FF5A5F', link: '/verify',    urgent: stats.highPriority > 0 },
    { title: 'Community Votes',   value: stats.communityEngagement, icon: TrendingUp,   accent: '#3B9EFF', link: '/community' },
  ];

  const totalVerifications = stats.verifiedToday + stats.pendingReports;
  const verificationRate = totalVerifications > 0
    ? Math.round((stats.verifiedToday / totalVerifications) * 100)
    : 0;

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
          style={{ marginBottom: '20px' }}
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
                <Shield size={26} color="white" />
              </div>
              <div>
                <h1 style={{ color: 'white', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.03em' }}>
                  Verifier Dashboard
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.84rem', margin: '4px 0 0' }}>
                  Welcome back, <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{user?.name}</strong> — monitor and verify community reports
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{
                padding: '8px 16px', borderRadius: '99px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <div className="live-dot" />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: 500 }}>Live queue</span>
              </div>
              <Link to="/verify" style={{
                padding: '8px 18px', borderRadius: '99px',
                background: 'rgba(255,90,95,0.85)', border: '1px solid rgba(255,90,95,0.4)',
                display: 'flex', alignItems: 'center', gap: '6px',
                textDecoration: 'none', color: 'white', fontSize: '0.78rem', fontWeight: 600,
              }}>
                <Zap size={13} />
                <span>Verify Reports</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── URGENT ALERT BANNER ───────────────────────────────── */}
        {urgentReports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              marginBottom: '20px', padding: '14px 20px',
              background: 'rgba(255,90,95,0.06)',
              border: '1px solid rgba(255,90,95,0.25)',
              borderLeft: '4px solid #FF5A5F',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} color="#FF5A5F" />
              <div>
                <p style={{ fontWeight: 700, color: '#C2363B', fontSize: '0.875rem', margin: 0 }}>
                  URGENT: {urgentReports.length} Critical Report{urgentReports.length > 1 ? 's' : ''} Need Immediate Verification
                </p>
                <p style={{ color: '#A32429', fontSize: '0.75rem', margin: '2px 0 0' }}>
                  High-priority reports are waiting for your review
                </p>
              </div>
            </div>
            <a href="/verify" style={{
              padding: '8px 16px', borderRadius: '99px',
              background: '#FF5A5F', color: 'white', fontSize: '0.78rem', fontWeight: 600,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              Review Now <ArrowUpRight size={13} />
            </a>
          </motion.div>
        )}

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
              style={{
                cursor: 'pointer', textDecoration: 'none',
                '--stat-color': `${stat.accent}22`,
                ...(stat.urgent ? { boxShadow: `0 0 0 2px ${stat.accent}44, 0 4px 20px rgba(10,37,64,0.08)` } : {}),
              } as React.CSSProperties}
            >
              {stat.urgent && (
                <div style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 20, height: 20, borderRadius: '50%',
                  background: stat.accent, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 900,
                  boxShadow: `0 2px 8px ${stat.accent}66`,
                }}>!</div>
              )}
              <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', marginBottom: '14px', background: `${stat.accent}18` }}>
                <stat.icon size={20} color={stat.accent} />
              </div>
              <div style={{
                fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em',
                background: `linear-gradient(135deg, ${stat.accent}, ${stat.accent}99)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: '4px',
              }}>{stat.value}</div>
              <p style={{ color: '#8D9AB0', fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>{stat.title}</p>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', borderRadius: '0 0 16px 16px', background: `linear-gradient(90deg, ${stat.accent}, ${stat.accent}44)`, opacity: 0.7 }} />
            </motion.a>
          ))}
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginBottom: '28px' }}>

          {/* Quick Actions */}
          <QuickActions />

          {/* Urgent Reports */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="premium-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,90,95,0.1)' }}>
                <AlertTriangle size={16} color="#FF5A5F" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#061829', margin: 0 }}>Urgent Verification</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {urgentReports.length > 0 ? urgentReports.map((report, idx) => {
                const sev = severityConfig[report?.severity || 'moderate'] || severityConfig.moderate;
                return (
                  <div key={report.id} style={{
                    padding: '12px', borderRadius: '12px',
                    background: 'rgba(255,90,95,0.04)',
                    border: '1px solid rgba(255,90,95,0.15)',
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                  }}>
                    <img
                      src={safeImageSrc(report)}
                      alt={report?.title || 'Report'}
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                      onError={e => { e.currentTarget.src = safeImageSrc({}); }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: '#C2363B', fontSize: '0.8rem', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report?.title || 'Untitled'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#A32429', fontSize: '0.7rem', marginBottom: '6px' }}>
                        <MapPin size={11} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report?.location?.address || 'Unknown location'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ background: sev.bg, color: sev.text, padding: '2px 8px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700 }}>
                            {(report?.severity || 'unknown').toUpperCase()}
                          </span>
                          <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 500 }}>
                            {report?.upvotes || 0} votes
                          </span>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#A8B2C3' }}>{safeFormatTimeAgo(report?.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ textAlign: 'center', padding: '28px 0' }}>
                  <CheckCircle size={36} color="rgba(5,150,105,0.4)" style={{ marginBottom: '10px' }} />
                  <p style={{ color: '#059669', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 4px' }}>All clear!</p>
                  <p style={{ color: '#8D9AB0', fontSize: '0.75rem', margin: 0 }}>No urgent reports at the moment</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Top Community Issues */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="premium-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59,158,255,0.1)' }}>
                <Users size={16} color="#3B9EFF" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#061829', margin: 0 }}>Top Community Issues</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topUpvotedReports.map((report, idx) => {
                const status = statusColors[report?.verificationStatus || 'pending'] || statusColors.pending;
                return (
                  <div key={report.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                    background: '#F8FAFD', borderRadius: '10px', border: '1px solid rgba(10,37,64,0.06)',
                  }}>
                    <img
                      src={safeImageSrc(report)}
                      alt={report?.title || 'Report'}
                      style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                      onError={e => { e.currentTarget.src = safeImageSrc({}); }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.78rem', color: '#061829', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report?.title || 'Untitled'}
                      </p>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <span style={{ background: '#D1FAE5', color: '#065F46', padding: '1px 7px', borderRadius: '99px', fontSize: '0.63rem', fontWeight: 600 }}>
                          {report?.upvotes || 0} votes
                        </span>
                        <span style={{ background: status.bg, color: status.text, padding: '1px 7px', borderRadius: '99px', fontSize: '0.63rem', fontWeight: 600 }}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#A8B2C3', flexShrink: 0 }}>{safeFormatTimeAgo(report?.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── VERIFICATION ANALYTICS ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="premium-card"
          style={{ marginBottom: '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)' }}>
                <BarChart3 size={16} color="#8B5CF6" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#061829', margin: 0 }}>Verification Analytics</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="live-dot" />
              <span style={{ fontSize: '0.72rem', color: '#8D9AB0' }}>Live Updates</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {[
              { value: stats.verifiedToday, label: 'Verified Today', sub: `+${Math.floor(stats.verifiedToday * 0.3)} from yesterday`, accent: '#059669', bg: 'rgba(5,150,105,0.06)' },
              { value: stats.pendingReports, label: 'Pending Review', sub: 'Avg wait: 2.5 hrs', accent: '#F59E0B', bg: 'rgba(245,158,11,0.06)' },
              { value: reports.length, label: 'Total Reports', sub: 'This month', accent: '#3B9EFF', bg: 'rgba(59,158,255,0.06)' },
              { value: `${verificationRate}%`, label: 'Verification Rate', sub: 'Target: 85%', accent: '#8B5CF6', bg: 'rgba(139,92,246,0.06)' },
            ].map(item => (
              <div key={item.label} style={{
                padding: '16px', borderRadius: '14px',
                background: item.bg,
                border: `1px solid ${item.accent}22`,
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: item.accent, margin: '0 0 4px', letterSpacing: '-0.04em' }}>{item.value}</p>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5A6A84', margin: '0 0 4px' }}>{item.label}</p>
                <p style={{ fontSize: '0.68rem', color: '#8D9AB0', margin: 0 }}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Verification progress bar */}
          <div style={{ marginTop: '16px', padding: '14px 16px', background: '#F8FAFD', borderRadius: '12px', border: '1px solid rgba(10,37,64,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#5A6A84', fontWeight: 500 }}>Verification Progress</span>
              <span style={{ fontSize: '0.78rem', color: '#3B9EFF', fontWeight: 700 }}>{verificationRate}% complete</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(10,37,64,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${verificationRate}%` }}
                transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: '99px',
                  background: 'linear-gradient(90deg, #3B9EFF, #059669)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── FEATURE LINKS ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          {[
            { href: '/analytics', icon: BarChart3, accent: '#8B5CF6', label: 'Advanced Analytics', desc: 'Deep insights into platform performance and hazard trends' },
            { href: '/map',       icon: Map,       accent: '#0D47A1', label: 'Hazard Mapping',     desc: 'Interactive map with heatmaps and geospatial analysis' },
            { href: '/social',    icon: Globe,     accent: '#059669', label: 'Social Monitoring',  desc: 'Real-time social media intelligence and sentiment analysis' },
          ].map((card, i) => (
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
                <div style={{ padding: '10px', borderRadius: '12px', background: `${card.accent}18` }}>
                  <card.icon size={20} color={card.accent} />
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#061829', margin: 0 }}>{card.label}</h3>
              </div>
              <p style={{ color: '#8D9AB0', fontSize: '0.8rem', margin: '0 0 14px', lineHeight: 1.5 }}>{card.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: card.accent, fontSize: '0.75rem', fontWeight: 600 }}>
                <span>Open</span><ArrowUpRight size={13} />
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </div>
  );
};

export default VerifierDashboard;