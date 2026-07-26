import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Anchor, 
  User, 
  LogOut, 
  Search, 
  Menu, 
  X, 
  Settings, 
  HelpCircle,
  Shield,
  MessageSquare,
  Activity,
  Zap,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher2';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const currentPage = location.pathname;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-white/70 backdrop-blur-2xl border-b border-ocean-100/50 shadow-nav sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative flex items-center"
            >
              <img src="/logo.png" alt="CoastGuard Logo" className="h-11 w-auto object-contain drop-shadow-sm" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-ocean-800 leading-none">
                CoastGuard
              </span>
              <span className="text-xs text-ocean-500 font-medium hidden sm:block leading-none mt-0.5">
                Coastal Intelligence
              </span>
            </div>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-1 lg:space-x-2">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {[
                  { to: '/dashboard', label: user?.role === 'verifier_protector' ? 'Dashboard (Verifier)' : user?.role === 'community_validator' ? 'Dashboard (Community)' : t('nav.dashboard') },
                  { to: '/map', label: 'Interactive Map' },
                  ...(user?.role === 'community_user' ? [{ to: '/upload', label: 'Submit Report' }] : []),
                  ...(user?.role === 'verifier_protector' ? [
                    { to: '/verify', label: t('nav.verify') },
                    { to: '/analytics', label: t('nav.analytics') },
                  ] : []),
                  ...(user?.role === 'community_validator' ? [{ to: '/community-dashboard', label: t('nav.validation') }] : []),
                  { to: '/community', label: t('nav.community') },
                  { to: '/leaderboard', label: t('nav.leaderboard') },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      position: 'relative',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      color: currentPage === link.to ? '#0A2540' : 'rgba(10,37,64,0.55)',
                      background: currentPage === link.to ? 'rgba(59,158,255,0.08)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (currentPage !== link.to) {
                        (e.currentTarget as HTMLElement).style.color = '#0A2540';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(10,37,64,0.04)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (currentPage !== link.to) {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(10,37,64,0.55)';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                    {currentPage === link.to && (
                      <span style={{
                        position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)',
                        width: '60%', height: '2px', borderRadius: '1px',
                        background: 'linear-gradient(90deg, #3B9EFF, #0891B2)',
                      }} />
                    )}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-ocean-200/50 mx-1" />

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-ocean-800/60 hover:text-ocean-800 hover:bg-ocean-50 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Search */}
              <button 
                className="p-2 text-ocean-800/60 hover:text-ocean-800 hover:bg-ocean-50 rounded-lg transition-all duration-200"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              <LanguageSwitcher />

              {/* User Menu */}
              <div className="flex items-center space-x-2 ml-1">
                  <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-xl"
                    style={{ background: 'rgba(10,37,64,0.05)', border: '1px solid rgba(10,37,64,0.07)' }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '8px',
                      background: [
                        user?.role === 'verifier_protector' ? 'linear-gradient(135deg, #FF5A5F, #E0484D)' :
                        user?.role === 'community_validator' ? 'linear-gradient(135deg, #059669, #047857)' :
                        'linear-gradient(135deg, #0A2540, #1565C0)'
                      ].join(''),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs font-semibold text-ocean-800 max-w-[90px] truncate leading-none" style={{ marginBottom: '2px' }}>{user?.name}</p>
                      <p className="text-ocean-400 leading-none" style={{ fontSize: '0.62rem' }}>
                        {user?.role === 'verifier_protector' ? 'Verifier' : user?.role === 'community_validator' ? 'Validator' : 'Community'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-ocean-800/40 hover:text-coral-600 hover:bg-coral-50 rounded-lg transition-all duration-200"
                    title="Sign out"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                  </button>
                </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/auth"
                className="text-sm font-medium text-ocean-800/70 hover:text-ocean-800 transition-colors duration-200"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/auth?mode=register"
                className="btn-primary text-sm"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
        
        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-3 overflow-hidden"
            >
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ocean-400" />
                <input
                  type="text"
                  placeholder={t('nav.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-ocean-100 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500/30 focus:border-ocean-300 transition-all placeholder:text-ocean-400"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-ocean-100/40 bg-white/80 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  { to: '/dashboard', label: user?.role === 'verifier_protector' ? 'Verifier Dashboard' : user?.role === 'community_validator' ? 'Community Dashboard' : 'Dashboard' },
                  { to: '/map', label: 'Interactive Map' },
                  ...(user?.role === 'community_user' ? [{ to: '/upload', label: 'Submit Report' }] : []),
                  ...(user?.role === 'verifier_protector' ? [
                    { to: '/verify', label: 'Verification Center' },
                    { to: '/analytics', label: 'Verifier Analytics' },
                  ] : []),
                  ...(user?.role === 'community_validator' ? [{ to: '/community-dashboard', label: 'Validation Center' }] : []),
                  { to: '/community', label: 'Community' },
                  { to: '/leaderboard', label: 'Leaderboard' },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      currentPage === link.to
                        ? 'bg-ocean-50 text-ocean-700'
                        : 'text-ocean-800/60 hover:text-ocean-800 hover:bg-ocean-50/60'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;