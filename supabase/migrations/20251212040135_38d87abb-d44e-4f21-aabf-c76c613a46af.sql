-- Add notes and archiving columns to case_merit_scores
ALTER TABLE public.case_merit_scores 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS archived_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_activity_at timestamp with time zone DEFAULT now();

-- Update the status column to have more states
-- Current default is 'pending', we'll add more states
COMMENT ON COLUMN public.case_merit_scores.status IS 'Case status: draft, pending, in_progress, filed, resolved, archived';

-- Create an index for faster dashboard queries
CREATE INDEX IF NOT EXISTS idx_case_merit_scores_user_status 
ON public.case_merit_scores(user_id, status, archived_at);

CREATE INDEX IF NOT EXISTS idx_case_merit_scores_created_at 
ON public.case_merit_scores(user_id, created_at DESC);

-- Create a case_timeline_events table for tracking case history
CREATE TABLE IF NOT EXISTS public.case_timeline_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id uuid NOT NULL REFERENCES public.case_merit_scores(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    event_type text NOT NULL,
    title text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on timeline events
ALTER TABLE public.case_timeline_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own case timeline events
CREATE POLICY "Users can view their own timeline events"
ON public.case_timeline_events
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own timeline events
CREATE POLICY "Users can insert their own timeline events"
ON public.case_timeline_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all timeline events
CREATE POLICY "Admins can view all timeline events"
ON public.case_timeline_events
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));