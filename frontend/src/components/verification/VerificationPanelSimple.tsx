import React, { useState } from 'react';
import { CheckCircle, XCircle, Flag, MessageCircle, MapPin, Clock, User, AlertTriangle, ThumbsUp, ThumbsDown, Eye, ShieldCheck, FileSearch } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { useAuth } from '../../context/AuthContext';
import { ReportAccuracyDisplay } from '../common/ReportAccuracyDisplay';
import toast from 'react-hot-toast';

const VerificationPanelSimple: React.FC = () => {
  const { reports, updateReport } = useReports();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged'>('pending');
  const [inspectingReport, setInspectingReport] = useState<any | null>(null);

  console.log('VerificationPanelSimple: reports loaded:', reports);


  // Filter reports based on verification status
  const filteredReports = reports?.filter(report => {
    if (filter === 'pending') return report.verificationStatus === 'pending';
    if (filter === 'flagged') return report.verificationStatus === 'flagged';
    return true; // 'all'
  }) || [];

  const handleVerify = async (reportId: string, status: 'verified' | 'rejected') => {
    console.log(`Verifying report ${reportId} as ${status}`);
    
    try {
      const updatedReport = {
        verificationStatus: status,
        verifiedBy: user?.name || 'Protector',
        verifiedAt: new Date(),
      };
      
      await updateReport(reportId, updatedReport);
      toast.success(`Report ${status} successfully!`);
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report. Please try again.');
    }
  };

  const handleFlag = async (reportId: string, reason: string) => {
    console.log(`Flagging report ${reportId} with reason: ${reason}`);
    
    try {
      const updatedReport = {
        verificationStatus: 'flagged' as const,
        flagReason: reason,
        flaggedBy: user?.name || 'Protector',
        flaggedAt: new Date(),
      };
      
      await updateReport(reportId, updatedReport);
      toast.success('Report flagged successfully!');
    } catch (error) {
      console.error('Error flagging report:', error);
      toast.error('Failed to flag report. Please try again.');
    }
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
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-700 mb-3">{report.description}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {report.location?.address || 'Location not available'}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 inline" /> {report.upvotes || 0}</span>
                        <span className="flex items-center gap-1"><ThumbsDown className="w-3.5 h-3.5 inline" /> {report.downvotes || 0}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 inline" /> {report.views || 0}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 inline" /> {report.comments?.length || 0}</span>
                      </div>
                      
                      {/* Accuracy Display for Report Viewing */}
                      <ReportAccuracyDisplay 
                        reportId={report.id}
                        context="view"
                        reportData={{
                          hazardType: report.hazardType,
                          severity: report.severity,
                          hasLocation: !!report.location,
                          hasDescription: !!report.description,
                        }}
                        showOnClick={true}
                      />
                    </div>
                    
                    <div>
                      {report.fileUrl && (
                        <div className="mb-3">
                          <img
                            src={report.fileUrl}
                            alt="Report evidence"
                            className="w-full h-32 object-cover rounded-lg"
                            onLoad={() => console.log(`Image loaded: ${report.fileUrl}`)}
                            onError={(e) => {
                              console.error(`Image failed to load: ${report.fileUrl}`);
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTk5OTkiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {report.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerify(report.id, 'verified')}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 inline mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerify(report.id, 'rejected')}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              <XCircle className="w-4 h-4 inline mr-2" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleFlag(report.id, 'Requires review')}
                          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
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
      </div>
    </div>
  );
};

export default VerificationPanelSimple;