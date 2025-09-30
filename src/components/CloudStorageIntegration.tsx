import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUpload } from './FileUpload';
import { 
  Cloud, 
  FolderOpen, 
  Link as LinkIcon, 
  ExternalLink,
  Download,
  Upload,
  Settings
} from "lucide-react";

interface CloudStorageProps {
  sessionId?: string;
  onFilesLinked?: (files: any[]) => void;
}

export const CloudStorageIntegration: React.FC<CloudStorageProps> = ({ 
  sessionId, 
  onFilesLinked 
}) => {
  const { user } = useAuth();
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');
  const [dropboxUrl, setDropboxUrl] = useState('');
  const [oneDriveUrl, setOneDriveUrl] = useState('');
  const [linking, setLinking] = useState(false);

  const handleGoogleDriveLink = async () => {
    if (!googleDriveUrl) {
      toast.error("Please enter a Google Drive share link");
      return;
    }

    setLinking(true);
    try {
      // Extract file ID from Google Drive URL
      const fileIdMatch = googleDriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!fileIdMatch) {
        throw new Error("Invalid Google Drive URL format");
      }

      const fileId = fileIdMatch[1];
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      // Save cloud link to database
      const { data, error } = await supabase
        .from('case_files')
        .insert({
          user_id: user?.id,
          session_id: sessionId,
          file_name: `Google Drive File - ${fileId}`,
          file_path: downloadUrl,
          file_type: 'cloud/google-drive',
          file_size: 0,
          bucket_name: 'user-uploads',
          description: 'Linked from Google Drive',
          tags: ['google-drive', 'cloud']
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Google Drive file linked successfully");
      setGoogleDriveUrl('');
      
      if (onFilesLinked) {
        onFilesLinked([data]);
      }
    } catch (error) {
      console.error('Google Drive link error:', error);
      toast.error("Failed to link Google Drive file");
    } finally {
      setLinking(false);
    }
  };

  const handleDropboxLink = async () => {
    if (!dropboxUrl) {
      toast.error("Please enter a Dropbox share link");
      return;
    }

    setLinking(true);
    try {
      // Convert Dropbox share URL to direct download URL
      const directUrl = dropboxUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');

      const { data, error } = await supabase
        .from('case_files')
        .insert({
          user_id: user?.id,
          session_id: sessionId,
          file_name: `Dropbox File - ${Date.now()}`,
          file_path: directUrl,
          file_type: 'cloud/dropbox',
          file_size: 0,
          bucket_name: 'user-uploads',
          description: 'Linked from Dropbox',
          tags: ['dropbox', 'cloud']
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Dropbox file linked successfully");
      setDropboxUrl('');
      
      if (onFilesLinked) {
        onFilesLinked([data]);
      }
    } catch (error) {
      console.error('Dropbox link error:', error);
      toast.error("Failed to link Dropbox file");
    } finally {
      setLinking(false);
    }
  };

  const handleOneDriveLink = async () => {
    if (!oneDriveUrl) {
      toast.error("Please enter a OneDrive share link");
      return;
    }

    setLinking(true);
    try {
      const { data, error } = await supabase
        .from('case_files')
        .insert({
          user_id: user?.id,
          session_id: sessionId,
          file_name: `OneDrive File - ${Date.now()}`,
          file_path: oneDriveUrl,
          file_type: 'cloud/onedrive',
          file_size: 0,
          bucket_name: 'user-uploads',
          description: 'Linked from OneDrive',
          tags: ['onedrive', 'cloud']
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("OneDrive file linked successfully");
      setOneDriveUrl('');
      
      if (onFilesLinked) {
        onFilesLinked([data]);
      }
    } catch (error) {
      console.error('OneDrive link error:', error);
      toast.error("Failed to link OneDrive file");
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Evidence & Document Management
          </CardTitle>
          <CardDescription>
            Upload files directly or link from cloud storage services for case building and legal analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Direct Upload
              </TabsTrigger>
              <TabsTrigger value="cloud" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Cloud Storage
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <FileUpload 
                sessionId={sessionId} 
                onUploadComplete={onFilesLinked}
                bucketType="evidence-files"
              />
            </TabsContent>
            
            <TabsContent value="cloud" className="space-y-6">
              {/* Google Drive */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    Google Drive
                  </CardTitle>
                  <CardDescription>
                    Link documents directly from your Google Drive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="google-drive-url">Google Drive Share Link</Label>
                    <Input
                      id="google-drive-url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={googleDriveUrl}
                      onChange={(e) => setGoogleDriveUrl(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleGoogleDriveLink}
                    disabled={linking || !googleDriveUrl}
                    className="w-full"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link Google Drive File
                  </Button>
                  <div className="text-xs text-gray-500">
                    <strong>How to get the link:</strong> Right-click on any file in Google Drive → Get link → Copy link
                  </div>
                </CardContent>
              </Card>

              {/* Dropbox */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FolderOpen className="h-5 w-5 text-blue-500" />
                    Dropbox
                  </CardTitle>
                  <CardDescription>
                    Link documents from your Dropbox account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dropbox-url">Dropbox Share Link</Label>
                    <Input
                      id="dropbox-url"
                      placeholder="https://www.dropbox.com/s/..."
                      value={dropboxUrl}
                      onChange={(e) => setDropboxUrl(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleDropboxLink}
                    disabled={linking || !dropboxUrl}
                    className="w-full"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link Dropbox File
                  </Button>
                  <div className="text-xs text-gray-500">
                    <strong>How to get the link:</strong> Right-click on any file in Dropbox → Share → Copy link
                  </div>
                </CardContent>
              </Card>

              {/* OneDrive */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cloud className="h-5 w-5 text-blue-400" />
                    Microsoft OneDrive
                  </CardTitle>
                  <CardDescription>
                    Link documents from your OneDrive account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="onedrive-url">OneDrive Share Link</Label>
                    <Input
                      id="onedrive-url"
                      placeholder="https://1drv.ms/..."
                      value={oneDriveUrl}
                      onChange={(e) => setOneDriveUrl(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleOneDriveLink}
                    disabled={linking || !oneDriveUrl}
                    className="w-full"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link OneDrive File
                  </Button>
                  <div className="text-xs text-gray-500">
                    <strong>How to get the link:</strong> Right-click on any file in OneDrive → Share → Copy link
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips for Evidence Collection:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Organize files by case topic or legal area</li>
                  <li>• Include dates and descriptions for better case building</li>
                  <li>• Use cloud links for large files to save storage space</li>
                  <li>• Tag files with relevant keywords for easy searching</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};