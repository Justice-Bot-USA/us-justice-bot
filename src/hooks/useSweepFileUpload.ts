import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SweepName, SWEEP_ORDER } from '@/lib/sweeps/types';
import { toast } from 'sonner';

/**
 * Sweeps that must be re-run when new evidence is uploaded
 * Evidence invalidates everything from evidenceIndex onward
 */
const DOWNSTREAM_SWEEPS: SweepName[] = [
  'evidenceIndex',
  'classification',
  'venue',
  'timeline',
  'authority',
  'analysis',
];

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  storagePath: string;
}

export function useSweepFileUpload(caseId: string | null, userId: string | null) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  /**
   * Upload a file and invalidate downstream sweeps
   */
  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    if (!caseId || !userId) {
      toast.error('Case ID and User ID are required');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // 1) Upload to Supabase Storage bucket
      const storagePath = `${caseId}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('evidence-files')
        .upload(storagePath, file, { contentType: file.type });

      if (uploadError) throw uploadError;
      setUploadProgress(40);

      // 2) Save file record to case_files
      const { data: fileRecord, error: dbError } = await supabase
        .from('case_files')
        .insert({
          case_id: caseId,
          user_id: userId,
          file_path: storagePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          bucket_name: 'evidence-files',
        })
        .select()
        .single();

      if (dbError) throw dbError;
      setUploadProgress(60);

      // 3) Invalidate downstream sweeps (set back to queued)
      for (const sweepName of DOWNSTREAM_SWEEPS) {
        await supabase
          .from('case_sweeps')
          .update({ 
            status: 'queued', 
            progress: 0, 
            error: null, 
            output: null,
            started_at: null,
            completed_at: null,
          })
          .eq('case_id', caseId)
          .eq('sweep_name', sweepName);
      }
      setUploadProgress(80);

      // 4) Queue a new job for the worker
      await supabase.from('jobs').insert({
        type: 'RUN_SWEEPS',
        status: 'queued',
        payload: { case_id: caseId, user_id: userId, trigger: 'file_upload' },
      });
      setUploadProgress(100);

      const uploadedFile: UploadedFile = {
        id: fileRecord.id,
        name: file.name,
        size: file.size,
        type: file.type,
        storagePath,
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      toast.success(`${file.name} uploaded - reanalyzing case...`);
      
      return uploadedFile;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Upload multiple files
   */
  const uploadFiles = async (files: File[]): Promise<UploadedFile[]> => {
    const results: UploadedFile[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  };

  /**
   * Fetch existing files for the case
   */
  const fetchCaseFiles = async () => {
    if (!caseId) return;

    const { data, error } = await supabase
      .from('case_files')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching case files:', error);
      return;
    }

    setUploadedFiles(
      (data || []).map(f => ({
        id: f.id,
        name: f.file_name,
        size: f.file_size,
        type: f.file_type,
        storagePath: f.file_path,
      }))
    );
  };

  /**
   * Remove a file and re-trigger analysis
   */
  const removeFile = async (fileId: string) => {
    if (!caseId || !userId) return;

    try {
      // Get file record for storage path
      const { data: fileRecord } = await supabase
        .from('case_files')
        .select('file_path')
        .eq('id', fileId)
        .single();

      if (fileRecord?.file_path) {
        // Delete from storage
        await supabase.storage
          .from('evidence-files')
          .remove([fileRecord.file_path]);
      }

      // Delete from database
      await supabase.from('case_files').delete().eq('id', fileId);

      // Invalidate downstream sweeps
      for (const sweepName of DOWNSTREAM_SWEEPS) {
        await supabase
          .from('case_sweeps')
          .update({ 
            status: 'queued', 
            progress: 0, 
            error: null, 
            output: null 
          })
          .eq('case_id', caseId)
          .eq('sweep_name', sweepName);
      }

      // Queue re-analysis job
      await supabase.from('jobs').insert({
        type: 'RUN_SWEEPS',
        status: 'queued',
        payload: { case_id: caseId, user_id: userId, trigger: 'file_removed' },
      });

      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File removed - reanalyzing case...');
    } catch (error) {
      console.error('Remove file error:', error);
      toast.error('Failed to remove file');
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadedFiles,
    uploadFile,
    uploadFiles,
    fetchCaseFiles,
    removeFile,
  };
}
