-- Add case_id column to case_files for direct case linking
ALTER TABLE public.case_files 
ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.case_merit_scores(id) ON DELETE SET NULL;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_case_files_case_id ON public.case_files(case_id);

-- Update RLS policies to allow users to query by case_id
-- (Existing policies already check user_id so no changes needed)