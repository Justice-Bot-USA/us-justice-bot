import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { analytics } from "@/hooks/useAnalytics";
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  Trash2,
  Eye,
  Download,
  Cloud,
  Folder,
  ExternalLink
} from "lucide-react";

interface FileUploadProps {
  sessionId?: string;
  caseId?: string;
  onUploadComplete?: (files: any[]) => void;
  bucketType?: 'evidence-files' | 'case-documents' | 'user-uploads';
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  description?: string;
  tags: string[];
  uploadProgress: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  sessionId, 
  caseId,
  onUploadComplete,
  bucketType = 'user-uploads' 
}) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sanitizeFileName = (name: string) => {
    // Keep it readable but safe for storage paths
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^a-zA-Z0-9._\- ()]/g, '_');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (fileList: File[]) => {
    if (!user) {
      toast.error("Please sign in to upload files");
      return;
    }

    setUploading(true);
    const uploadedFiles: any[] = [];

    for (const file of fileList) {
      // Create temporary file entry with progress
      const tempFile: UploadedFile = {
        id: `temp-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: '',
        description: '',
        tags: [],
        uploadProgress: 0
      };
      
      setFiles(prev => [...prev, tempFile]);

      try {
        // Generate unique file path
        const safeOriginalName = sanitizeFileName(file.name);
        const uniqueId = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
          .replace(/[^a-zA-Z0-9\-]/g, '');
        // Keep original name for humans; ensure uniqueness and stable paths
        const fileName = `${user.id}/${Date.now()}-${uniqueId}-${safeOriginalName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucketType)
          .upload(fileName, file, {
            cacheControl: '3600',
            // Allow re-uploads with the same chosen file name without hard failure.
            // Our path is already unique, but this prevents edge collisions.
            upsert: true
          });

        if (error) throw error;

        // Get signed URL for private bucket (1 hour expiration)
        const { data: urlData, error: urlError } = await supabase.storage
          .from(bucketType)
          .createSignedUrl(fileName, 3600);
        
        if (urlError) throw urlError;

        // Save file metadata to database with case_id for direct linking
        const insertData: any = {
          user_id: user.id,
          session_id: sessionId,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size,
          bucket_name: bucketType,
          description: '',
          tags: []
        };
        
        // Add case_id if provided for direct case linking
        if (caseId) {
          insertData.case_id = caseId;
        }
        
        const { data: fileRecord, error: dbError } = await supabase
          .from('case_files')
          .insert(insertData)
          .select()
          .single();

        if (dbError) throw dbError;

        // Update file entry with success
        setFiles(prev => prev.map(f => 
          f.id === tempFile.id 
            ? { ...f, id: fileRecord.id, url: urlData.signedUrl, uploadProgress: 100 }
            : f
        ));

        uploadedFiles.push(fileRecord);

        // 🔥 Track evidence_uploaded event for funnel parity
        analytics.evidenceUploaded(file.type, 1);

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error('Upload error:', error);
        const message =
          typeof error === 'object' && error && 'message' in error
            ? String((error as any).message)
            : 'Upload failed';
        toast.error(`Failed to upload ${file.name}: ${message}`);
        
        // Remove failed upload from list
        setFiles(prev => prev.filter(f => f.id !== tempFile.id));
      }
    }

    setUploading(false);
    if (onUploadComplete && uploadedFiles.length > 0) {
      onUploadComplete(uploadedFiles);
    }
  };

  const removeFile = async (fileId: string) => {
    try {
      await supabase.from('case_files').delete().eq('id', fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success("File removed successfully");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to remove file");
    }
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

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Supports: Images, PDFs, Documents, Audio, Video (Max 20MB per file)
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
        >
          Select Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="*/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              Manage your uploaded evidence and documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="secondary" className="text-xs">
                          {file.type.split('/')[0]}
                        </Badge>
                      </div>
                      {file.uploadProgress < 100 && (
                        <Progress value={file.uploadProgress} className="mt-2" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.url && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = file.url;
                            a.download = file.name;
                            a.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};