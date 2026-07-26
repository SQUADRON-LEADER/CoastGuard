import React from 'react';

const VerifierDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">
          Verifier Dashboard (Debug)
        </h1>
        <p className="text-lg text-gray-600">
          If you see this, the component is rendering!
        </p>
      </div>
    </div>
  );
};

export default VerifierDashboard;