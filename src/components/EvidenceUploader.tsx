import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudStorageIntegration } from './CloudStorageIntegration';
import { FileUpload } from './FileUpload';
import { 
  MessageSquare, 
  Upload, 
  Cloud,
  FileText,
  Camera,
  Paperclip
} from "lucide-react";

interface EvidenceUploaderProps {
  sessionId?: string;
  onFilesUploaded?: (files: any[]) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ 
  sessionId, 
  onFilesUploaded 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Evidence & Document Upload
        </CardTitle>
        <CardDescription>
          Upload photos, documents, contracts, and other evidence to support your legal case
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Evidence Photos
            </TabsTrigger>
            <TabsTrigger value="cloud" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Cloud Storage
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="space-y-4">
            <FileUpload 
              sessionId={sessionId} 
              onUploadComplete={onFilesUploaded}
              bucketType="evidence-files"
            />
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-4">
            <div className="text-center py-8">
              <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Photo Evidence</h3>
              <p className="text-gray-500 mb-4">
                Take photos of documents, property damage, or other evidence
              </p>
              <FileUpload 
                sessionId={sessionId} 
                onUploadComplete={onFilesUploaded}
                bucketType="evidence-files"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="cloud" className="space-y-4">
            <CloudStorageIntegration 
              sessionId={sessionId} 
              onFilesLinked={onFilesUploaded}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">📋 Evidence Collection Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Include contracts, agreements, and legal documents</li>
            <li>• Photograph any physical evidence or property damage</li>
            <li>• Upload correspondence (emails, letters, text messages)</li>
            <li>• Include receipts, bills, and financial documents</li>
            <li>• Take photos of IDs, licenses, or permits if relevant</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};