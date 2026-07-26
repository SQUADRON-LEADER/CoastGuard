import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Anchor, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Shield,
  Users,
  Map,
  AlertTriangle,
  Heart,
  Globe,
  ArrowUp,
  Waves
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ocean-800 text-white relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="CoastGuard Logo" className="h-10 w-auto object-contain drop-shadow-md" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    CoastGuard
                  </h3>
                  <p className="text-ocean-300 text-xs">Coastal Intelligence Platform</p>
                </div>
              </div>
              
              <p className="text-ocean-300/80 leading-relaxed text-sm">
                Empowering coastal communities through collaborative monitoring and real-time reporting. 
                Together, we protect our precious marine ecosystems and ensure safer shores for everyone.
              </p>
              
              <div className="flex items-center space-x-2 text-ocean-400">
                <Waves className="h-4 w-4" />
                <span className="text-xs font-medium">Guardians of the Coast since 2024</span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <h4 className="text-sm font-semibold text-ocean-300 uppercase tracking-wider flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Quick Access
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Report Incident', link: '/upload', icon: AlertTriangle },
                  { name: 'Interactive Map', link: '/map', icon: Map },
                  { name: 'Community Feed', link: '/community', icon: Users },
                  { name: 'Verification Center', link: '/verify', icon: Shield },
                  { name: 'Leaderboard', link: '/leaderboard', icon: Heart },
                  { name: 'Updates & News', link: '/updates', icon: Globe },
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.link} 
                      className="flex items-center space-x-2 text-ocean-300/70 hover:text-white transition-colors duration-200 text-sm py-0.5"
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h4 className="text-sm font-semibold text-ocean-300 uppercase tracking-wider">Resources & Support</h4>
              <ul className="space-y-3">
                {[
                  'How to Report',
                  'Safety Guidelines',
                  'API Documentation',
                  'Community Guidelines',
                  'Emergency Protocols',
                  'Training Materials',
                  'FAQ & Help Center',
                  'Contact Support'
                ].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-ocean-300/70 hover:text-white transition-colors duration-200 text-sm py-0.5 block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <h4 className="text-sm font-semibold text-ocean-300 uppercase tracking-wider">Connect With Us</h4>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-ocean-300/70">
                  <Mail className="h-4 w-4 text-ocean-400" />
                  <span className="text-sm">support@coastguard.com</span>
                </div>
                <div className="flex items-center space-x-3 text-ocean-300/70">
                  <Phone className="h-4 w-4 text-ocean-400" />
                  <span className="text-sm">+1 (555) COAST-911</span>
                </div>
                <div className="flex items-center space-x-3 text-ocean-300/70">
                  <MapPin className="h-4 w-4 text-ocean-400" />
                  <span className="text-sm">Marine Safety Center, Ocean City</span>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-sm text-gray-400 mb-3">Follow our mission</p>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, name: 'Facebook', color: 'hover:text-blue-400' },
                    { icon: Twitter, name: 'Twitter', color: 'hover:text-sky-400' },
                    { icon: Instagram, name: 'Instagram', color: 'hover:text-pink-400' },
                    { icon: Linkedin, name: 'LinkedIn', color: 'hover:text-blue-500' },
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href="#"
                      whileHover={{ scale: 1.2, y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className={`text-gray-400 ${social.color} transition-colors duration-200`}
                      aria-label={social.name}
                    >
                      <social.icon className="h-6 w-6" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Stay updated with coastal alerts</p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2.5 bg-ocean-900/60 border border-ocean-700/40 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500/40 focus:border-ocean-500/40 placeholder:text-ocean-400/60"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 bg-ocean-500 hover:bg-ocean-400 rounded-xl text-white text-sm font-medium transition-all duration-200"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-ocean-700/30"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: 'Active Guardians', value: '12,543', icon: Users },
                { label: 'Reports Verified', value: '45,672', icon: Shield },
                { label: 'Coastal Areas Protected', value: '1,234', icon: Map },
                { label: 'Lives Impacted', value: '89,456', icon: Heart },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="space-y-2"
                >
                  <div className="flex justify-center">
                    <stat.icon className="h-6 w-6 text-ocean-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-ocean-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ocean-700/30 bg-ocean-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="text-xs text-ocean-400">
                © {currentYear} CoastGuard Platform. All rights reserved. 
                <span className="mx-2">·</span>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span className="mx-2">·</span>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <span className="mx-2">·</span>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>

              {/* Back to Top */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center space-x-2 text-ocean-400 hover:text-white transition-colors duration-200 text-xs"
              >
                <span className="text-sm">Back to Top</span>
                <ArrowUp className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-ocean-700/20 text-center">
              <p className="text-xs text-ocean-500">
                Built with care for coastal communities worldwide · 
                Powered by community collaboration and cutting-edge technology
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Anchor className="h-24 w-24 text-cyan-400" />
        </motion.div>
      </div>
      
      <div className="absolute bottom-20 left-10 opacity-10">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Waves className="h-16 w-16 text-blue-400" />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
