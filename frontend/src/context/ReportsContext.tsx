import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Upload } from '../types';
import { ApiService, API_BASE_URL } from '../services/api';

interface ReportsContextType {
  reports: Upload[];
  addReport: (report: Upload) => void;
  updateReport: (id: string, updates: Partial<Upload>) => void;
  deleteReport: (id: string) => void;
  refreshReports: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load reports from API on initialization
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('ReportsContext: Starting to load reports from API...');
      console.log('ReportsContext: API Base URL:', API_BASE_URL);
      
      const data = await ApiService.getReports();
      console.log('ReportsContext: API call successful, received data:', data);
      console.log('ReportsContext: Number of reports:', data?.length || 0);
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data received from API');
      }

      if (data.length === 0) {
        return; // empty DB — leave state as empty array
      }
      
      // Transform the data to match Upload interface (_id -> id)
      const transformedReports = data.map((report: any) => {
        const userId = typeof report.userId === 'object' && report.userId && '_id' in report.userId 
          ? report.userId._id 
          : report.userId;
        
        const transformedReport = {
          ...report,
          id: report._id || report.id, // Use _id from MongoDB as id
          userId: userId, // Handle populated userId
        } as Upload;
        
        console.log('ReportsContext: Transformed report:', transformedReport);
        return transformedReport;
      });
      
      console.log('ReportsContext: All transformed reports:', transformedReports);
      setReports(transformedReports);
      console.log('ReportsContext: Successfully set real reports from backend');
    } catch (error) {
      setError((error as Error).message);
      console.error('ReportsContext: Failed to load reports:', error);
      console.log('ReportsContext: Error details:', (error as Error).message);
      // Leave existing state on error (don't overwrite with stale mock data)
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (report: Upload) => {
    try {
      if (!report.userId) {
        throw new Error('User not authenticated. Please log in and try again.');
      }
      console.log('Adding report to MongoDB:', report);
      await ApiService.createReport(report);
      // Always reload reports from backend after submission
      await loadReports();
      console.log('Report added and reports reloaded.');
    } catch (error) {
      console.error('Failed to add report:', error);
      toast.error('Failed to submit report. Please try again.');
    }
  };

  const updateReport = async (id: string, updates: Partial<Upload>) => {
    try {
      const data = await ApiService.updateReport(id, updates);
      // Transform returned report the same way as loadReports (backend returns _id not id)
      const updatedReport = {
        ...data.report,
        id: data.report._id || data.report.id,
      };
      setReports(prev =>
        prev.map(report =>
          report.id === id ? updatedReport : report
        )
      );
    } catch (error) {
      console.error('Failed to update report:', error);
      // Fallback to local state
      setReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, ...updates } : report
        )
      );
    }
  };

  const deleteReport = async (id: string) => {
    try {
      // Note: No delete endpoint implemented yet
      setReports(prev => prev.filter(report => report.id !== id));
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const getReportsByStatus = (status: string) => {
    return reports.filter(report => report.verificationStatus === status);
  };

  const getReportsByUser = (userId: string) => {
    return reports.filter(report => report.userId === userId);
  };

  const value = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    refreshReports: loadReports,
    loading,
    error,
    getReportsByStatus,
    getReportsByUser
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};
