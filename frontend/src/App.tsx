import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportsProvider } from './context/ReportsContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/layout/LoadingScreen';
import LandingPage from './components/home/LandingPage';
import AuthPage from './components/auth/AuthPage';
import UserDashboard from './components/dashboard/UserDashboard';
import VerifierDashboard from './components/dashboard/VerifierDashboard';
import AdvancedUploadForm from './components/upload/AdvancedUploadForm';
import CommunityFeed from './components/community/CommunityFeed';
import VerificationPanel from './components/verification/VerificationPanelSimple';
import UpdatesPanel from './components/updates/UpdatesPanel';
import InteractiveMap from './components/map/InteractiveMap';
import AnalyticsPanel from './components/analytics/AnalyticsPanel';
import SocialMediaFeed from './components/analytics/SocialMediaFeed';
import LeaderboardPanel from './components/gamification/LeaderboardPanel';
import MultilingualChatbot from './components/chat/MultilingualChatbot';
import WhatsAppHelp from './components/help/WhatsAppHelp';
import TwilioDisasterCall from './components/help/TwilioDisasterCall';
import EvacuationAdvisor from './components/help/EvacuationAdvisor';
// import VerificationDashboard from './components/verification/VerifierDashboard';
import CommunityDashboard from './components/verification/CommunityDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your CoastGuard experience...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="min-h-screen relative">
      <Header />
      
      {/* Floating Action Buttons */}
      {isAuthenticated && (
        <>
          {/* Left Side - Help/Support Icons */}
          <div className="fixed bottom-6 left-6 flex flex-col space-y-4 z-40">
            <WhatsAppHelp />
            {/* AI Disaster Call – available for all logged-in users */}
            <TwilioDisasterCall />
            {/* AI Evacuation Route Advisor */}
            <EvacuationAdvisor />
          </div>
          
          {/* Right Side - Chatbot */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-40">
            <MultilingualChatbot 
              isOpen={showChatbot} 
              onToggle={() => setShowChatbot(!showChatbot)} 
            />
          </div>
        </>
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {user?.role === 'verifier_protector' ? <VerifierDashboard /> : 
               user?.role === 'community_validator' ? <CommunityDashboard /> : <UserDashboard />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/verifier-dashboard" 
          element={
            <ProtectedRoute>
              <VerifierDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/community-dashboard" 
          element={
            <ProtectedRoute>
              <CommunityDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <AdvancedUploadForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <CommunityFeed />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/verify" 
          element={
            <ProtectedRoute>
              <VerificationPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/updates" 
          element={
            <ProtectedRoute>
              <UpdatesPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/map" 
          element={
            <ProtectedRoute>
              <InteractiveMap />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <AnalyticsPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/social" 
          element={
            <ProtectedRoute>
              <SocialMediaFeed />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute>
              <LeaderboardPanel />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Footer - Always visible */}
      <Footer />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000); // 3 seconds minimum loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ReportsProvider>
          <LoadingScreen 
            isLoading={isInitialLoading}
            onLoadingComplete={() => setIsInitialLoading(false)}
          />
          {!isInitialLoading && <AppRoutes />}
        </ReportsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;