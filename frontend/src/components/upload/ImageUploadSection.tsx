import React, { useCallback, useState } from 'react';
import { Upload, X, Image, MapPin, Clock, FileText, Zap, AlertTriangle } from 'lucide-react';
import { extractMetadata, analyzeImageWithAI } from '../../lib/utils';

interface FileWithMetadata extends File {
  id: string;
  preview: string;
  metadata?: any;
  aiAnalysis?: any;
}

interface ImageUploadSectionProps {
  files: FileWithMetadata[];
  onFilesChange: (files: FileWithMetadata[]) => void;
  onMetadataExtracted: (fileId: string, metadata: any) => void;
  onAIAnalysis: (fileId: string, analysis: any) => void;
  onHazardSuggestion: (suggestion: string) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  files,
  onFilesChange,
  onMetadataExtracted,
  onAIAnalysis,
  onHazardSuggestion
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(async (newFiles: FileList | File[]) => {
    setUploading(true);
    const fileArray = Array.from(newFiles);
    
    const processedFiles: FileWithMetadata[] = await Promise.all(
      fileArray.map(async (file) => {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);
        
        // Extract metadata
        const metadata = await extractMetadata(file);
        onMetadataExtracted(id, metadata);
        
        // Perform AI analysis
        const aiAnalysis = await analyzeImageWithAI(file);
        onAIAnalysis(id, aiAnalysis);
        
        // Suggest hazard type based on AI analysis
        if (aiAnalysis.hazardType) {
          onHazardSuggestion(aiAnalysis.hazardType);
        }
        
        return Object.assign(file, {
          id,
          preview,
          metadata,
          aiAnalysis
        });
      })
    );
    
    onFilesChange([...files, ...processedFiles]);
    setUploading(false);
  }, [files, onFilesChange, onMetadataExtracted, onAIAnalysis, onHazardSuggestion]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Support for images and videos up to 10MB each
            </p>
          </div>
          
          {uploading && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Processing files...</span>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {/* File Preview */}
              <div className="relative aspect-video bg-gray-100">
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* File Info */}
              <div className="p-3 space-y-2">
                <h4 className="font-medium text-sm text-gray-900 truncate">
                  {file.name}
                </h4>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  <span>{file.type}</span>
                </div>

                {/* AI Analysis */}
                {file.aiAnalysis && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-gray-700">AI Analysis</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>Hazard: {file.aiAnalysis.hazardType || 'Unknown'}</div>
                      <div>Confidence: {file.aiAnalysis.confidence || 0}%</div>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {file.metadata && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Image className="h-3 w-3 text-blue-500" />
                      <span className="text-xs font-medium text-gray-700">Metadata</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {file.metadata.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>GPS: {file.metadata.location.lat?.toFixed(4)}, {file.metadata.location.lng?.toFixed(4)}</span>
                        </div>
                      )}
                      {file.metadata.timestamp && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(file.metadata.timestamp).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};