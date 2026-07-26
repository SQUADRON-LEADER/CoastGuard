import React, { useState } from 'react';
import { CheckCircle, XCircle, Flag, MessageCircle, MapPin, Clock, User, AlertTriangle } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';

const VerificationPanel: React.FC = () => {
  const { reports } = useReports();
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged'>('pending');
  
  console.log('VerificationPanel: Rendering with reports:', reports);
  
  // Filter reports based on verification status
  const filteredReports = reports?.filter(report => {
    if (filter === 'pending') return report.verificationStatus === 'pending';
    if (filter === 'flagged') return report.verificationStatus === 'flagged';
    return true; // 'all'
  }) || [];

  const handleVerify = (reportId: string, status: 'verified' | 'rejected') => {
    console.log(`Verifying report ${reportId} as ${status}`);
    // TODO: Implement verification API call
  };

  const handleFlag = (reportId: string, reason: string) => {
    console.log(`Flagging report ${reportId} with reason: ${reason}`);
    // TODO: Implement flag API call
  };

  const getSeverityColor = (severity: string = 'moderate') => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'severe': return 'bg-orange-500 text-white';
      case 'serious': return 'bg-yellow-500 text-black';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Verification Center</h1>
            <p className="text-gray-600">Review and verify community reports</p>
          </div>
          
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'pending' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
              onClick={() => setFilter('pending')}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Pending ({reports?.filter(r => r.verificationStatus === 'pending').length || 0})
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'flagged' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
              onClick={() => setFilter('flagged')}
            >
              <Flag className="w-4 h-4 inline mr-2" />
              Flagged ({reports?.filter(r => r.verificationStatus === 'flagged').length || 0})
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
              onClick={() => setFilter('all')}
            >
              All ({reports?.length || 0})
            </button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-lg">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No {filter} reports found
            </h3>
            <p className="text-gray-500">
              {filter === 'pending' 
                ? 'All reports have been processed.' 
                : `No ${filter} reports at this time.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 pb-3">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={report.userAvatar || "/api/placeholder/40/40"}
                        alt={report.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{report.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <User className="w-4 h-4" />
                          {report.userName}
                          <Clock className="w-4 h-4 ml-2" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                        {report.hazardType}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-700 mb-3">{report.description}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {report.location.address}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👍 {report.upvotes}</span>
                        <span>👎 {report.downvotes}</span>
                        <span>👁️ {report.views}</span>
                        <span><MessageCircle className="w-4 h-4 inline mr-1" />{report.comments?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div>
                      {report.fileUrl && (
                        <img
                          src={report.thumbnailUrl || report.fileUrl}
                          alt="Report evidence"
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      
                      <div className="flex gap-2">
                        {report.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerify(report.id, 'verified')}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                            >
                              <CheckCircle className="w-4 h-4 inline mr-2" />
                              Verify
                            </button>
                            <button
                              onClick={() => handleVerify(report.id, 'rejected')}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                            >
                              <XCircle className="w-4 h-4 inline mr-2" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleFlag(report.id, 'Requires review')}
                          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium"
                        >
                          <Flag className="w-4 h-4 inline mr-2" />
                          Flag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Debug Info */}
        <div className="mt-8 bg-white rounded-lg p-4 border-2 border-blue-200">
          <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
          <p>Total reports: {reports?.length || 0}</p>
          <p>Pending reports: {reports?.filter(r => r.verificationStatus === 'pending').length || 0}</p>
          <p>Flagged reports: {reports?.filter(r => r.verificationStatus === 'flagged').length || 0}</p>
          <p>Data source: {reports?.length > 0 ? 'Reports loaded' : 'No reports loaded'}</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPanel;