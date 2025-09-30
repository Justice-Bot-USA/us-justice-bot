-- Create storage buckets for evidence and case files
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('evidence-files', 'evidence-files', false),
  ('case-documents', 'case-documents', false),
  ('user-uploads', 'user-uploads', false);

-- Create RLS policies for evidence files bucket
CREATE POLICY "Users can view their own evidence files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'evidence-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own evidence files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'evidence-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own evidence files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'evidence-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own evidence files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'evidence-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create RLS policies for case documents bucket
CREATE POLICY "Users can view their own case documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'case-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own case documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'case-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own case documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'case-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own case documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'case-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create RLS policies for user uploads bucket
CREATE POLICY "Users can view their own uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload to user uploads bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own uploads" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table to track uploaded files with metadata
CREATE TABLE public.case_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  bucket_name TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on case_files
ALTER TABLE public.case_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for case_files
CREATE POLICY "Users can view their own case files" 
ON public.case_files 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own case files" 
ON public.case_files 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case files" 
ON public.case_files 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own case files" 
ON public.case_files 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can view all case files
CREATE POLICY "Admins can view all case files" 
ON public.case_files 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_case_files_updated_at
BEFORE UPDATE ON public.case_files
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();