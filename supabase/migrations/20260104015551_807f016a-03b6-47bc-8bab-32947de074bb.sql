-- Create funnel_analytics table for tracking funnel events
CREATE TABLE public.funnel_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id UUID,
  step TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('start', 'complete', 'drop', 'skip')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for common queries
CREATE INDEX idx_funnel_analytics_funnel_id ON public.funnel_analytics(funnel_id);
CREATE INDEX idx_funnel_analytics_created_at ON public.funnel_analytics(created_at);
CREATE INDEX idx_funnel_analytics_step ON public.funnel_analytics(step);
CREATE INDEX idx_funnel_analytics_action ON public.funnel_analytics(action);
CREATE INDEX idx_funnel_analytics_session ON public.funnel_analytics(session_id);

-- Enable RLS
ALTER TABLE public.funnel_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for anonymous tracking)
CREATE POLICY "Anyone can insert funnel analytics" 
ON public.funnel_analytics 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view all analytics
CREATE POLICY "Admins can view all funnel analytics" 
ON public.funnel_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own analytics
CREATE POLICY "Users can view their own analytics" 
ON public.funnel_analytics 
FOR SELECT 
USING (auth.uid() = user_id);