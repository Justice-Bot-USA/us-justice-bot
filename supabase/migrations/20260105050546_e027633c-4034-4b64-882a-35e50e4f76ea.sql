-- Add supporting_upload_ids column to related_case_references table
ALTER TABLE public.related_case_references 
ADD COLUMN IF NOT EXISTS supporting_upload_ids uuid[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.related_case_references.supporting_upload_ids IS 'Array of case_files IDs that support this related case reference';