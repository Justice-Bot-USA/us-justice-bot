import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSweepFileUpload } from '@/hooks/useSweepFileUpload';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  Trash2,
  Eye,
  RefreshCw,
  Paperclip
} from 'lucide-react';

interface EvidenceUploaderRealtimeProps {
  caseId: string | null;
  userId: string | null;
  onFilesChanged?: () => void;
}

export function EvidenceUploaderRealtime({ 
  caseId, 
  userId,
  onFilesChanged 
}: EvidenceUploaderRealtimeProps) {
  const {
    isUploading,
    uploadProgress,
    uploadedFiles,
    uploadFiles,
    fetchCaseFiles,
    removeFile,
  } = useSweepFileUpload(caseId, userId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch existing files on mount
  useEffect(() => {
    if (caseId) {
      fetchCaseFiles();
    }
  }, [caseId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(Array.from(e.dataTransfer.files));
      onFilesChanged?.();
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(Array.from(e.target.files));
      onFilesChanged?.();
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    await removeFile(fileId);
    onFilesChanged?.();
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!caseId) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          <Paperclip className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>Start a case analysis to upload evidence</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Paperclip className="h-4 w-4" />
          Evidence Upload
        </CardTitle>
        <CardDescription className="text-sm">
          Upload files to trigger automatic re-analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="space-y-2">
              <RefreshCw className="mx-auto h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium">Uploading & triggering re-analysis...</p>
              <Progress value={uploadProgress} className="max-w-xs mx-auto" />
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                All file types up to 50MB — photos, PDFs, docs, scans, screenshots
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,audio/*,video/*,application/zip,.heic,.heif,.webp,.tiff,.bmp"
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="secondary" className="text-xs h-4">
                          {file.type.split('/')[0]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint */}
        <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
          💡 Adding or removing evidence automatically invalidates downstream analysis 
          and queues a new job to re-process your case.
        </div>
      </CardContent>
    </Card>
  );
}
