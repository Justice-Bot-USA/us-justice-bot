-- Create case merit scoring table
CREATE TABLE public.case_merit_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  case_title TEXT NOT NULL,
  case_description TEXT,
  state TEXT NOT NULL,
  county TEXT,
  legal_area TEXT NOT NULL,
  merit_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  strength_factors JSONB DEFAULT '[]'::jsonb,
  weakness_factors JSONB DEFAULT '[]'::jsonb,
  relevant_laws JSONB DEFAULT '[]'::jsonb,
  supporting_evidence JSONB DEFAULT '[]'::jsonb,
  estimated_success_rate DECIMAL(5,2),
  settlement_range_min DECIMAL(12,2),
  settlement_range_max DECIMAL(12,2),
  time_to_resolution_months INTEGER,
  complexity_score INTEGER DEFAULT 1 CHECK (complexity_score BETWEEN 1 AND 10),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzed', 'updated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('technical', 'billing', 'legal', 'general')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_response', 'resolved', 'closed')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create support messages table  
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_staff_response BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal sweeps table
CREATE TABLE public.legal_sweeps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sweep_name TEXT NOT NULL,
  target_domains JSONB NOT NULL DEFAULT '[]'::jsonb,
  search_terms JSONB NOT NULL DEFAULT '[]'::jsonb,
  state_filter TEXT,
  legal_area_filter TEXT,
  last_run TIMESTAMP WITH TIME ZONE,
  next_scheduled_run TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'running', 'completed', 'failed')),
  results_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal sweep results table
CREATE TABLE public.legal_sweep_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sweep_id UUID NOT NULL REFERENCES public.legal_sweeps(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  law_type TEXT CHECK (law_type IN ('statute', 'regulation', 'case_law', 'form', 'procedure')),
  jurisdiction TEXT,
  relevance_score DECIMAL(5,2) DEFAULT 0.00,
  keywords JSONB DEFAULT '[]'::jsonb,
  extracted_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user activity logs table
CREATE TABLE public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.case_merit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_sweeps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_sweep_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for case_merit_scores
CREATE POLICY "Users can view their own merit scores" ON public.case_merit_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own merit scores" ON public.case_merit_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own merit scores" ON public.case_merit_scores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all merit scores" ON public.case_merit_scores
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for support_tickets
CREATE POLICY "Users can view their own support tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create support tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Staff can view assigned tickets" ON public.support_tickets
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Staff can update any ticket" ON public.support_tickets
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Create RLS policies for support_messages
CREATE POLICY "Users can view messages for their tickets" ON public.support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_id AND user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role)
  );

CREATE POLICY "Users can create messages for their tickets" ON public.support_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can create messages for any ticket" ON public.support_messages
  FOR INSERT WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role)
  );

-- Create RLS policies for legal_sweeps
CREATE POLICY "Admins can manage legal sweeps" ON public.legal_sweeps
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view legal sweep results" ON public.legal_sweep_results
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage sweep results" ON public.legal_sweep_results
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for user_activity_logs
CREATE POLICY "Users can view their own activity logs" ON public.user_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs" ON public.user_activity_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert activity logs" ON public.user_activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_case_merit_scores_user_id ON public.case_merit_scores(user_id);
CREATE INDEX idx_case_merit_scores_state ON public.case_merit_scores(state);
CREATE INDEX idx_case_merit_scores_legal_area ON public.case_merit_scores(legal_area);
CREATE INDEX idx_case_merit_scores_merit_score ON public.case_merit_scores(merit_score DESC);

CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX idx_support_tickets_assigned_to ON public.support_tickets(assigned_to);

CREATE INDEX idx_support_messages_ticket_id ON public.support_messages(ticket_id);
CREATE INDEX idx_support_messages_created_at ON public.support_messages(created_at);

CREATE INDEX idx_legal_sweeps_status ON public.legal_sweeps(status);
CREATE INDEX idx_legal_sweeps_next_run ON public.legal_sweeps(next_scheduled_run);

CREATE INDEX idx_legal_sweep_results_sweep_id ON public.legal_sweep_results(sweep_id);
CREATE INDEX idx_legal_sweep_results_relevance ON public.legal_sweep_results(relevance_score DESC);
CREATE INDEX idx_legal_sweep_results_jurisdiction ON public.legal_sweep_results(jurisdiction);

CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);

-- Create triggers for updated_at
CREATE TRIGGER update_case_merit_scores_updated_at
  BEFORE UPDATE ON public.case_merit_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_legal_sweeps_updated_at
  BEFORE UPDATE ON public.legal_sweeps
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create function to calculate merit score
CREATE OR REPLACE FUNCTION public.calculate_case_merit_score(
  case_id UUID
) RETURNS DECIMAL(5,2)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_score DECIMAL(5,2) := 0.00;
  evidence_count INTEGER := 0;
  strength_count INTEGER := 0;
  weakness_count INTEGER := 0;
  final_score DECIMAL(5,2);
BEGIN
  -- Get case data
  SELECT 
    COALESCE(array_length(supporting_evidence::text[], 1), 0),
    COALESCE(array_length(strength_factors::text[], 1), 0),
    COALESCE(array_length(weakness_factors::text[], 1), 0)
  INTO evidence_count, strength_count, weakness_count
  FROM case_merit_scores 
  WHERE id = case_id;
  
  -- Base scoring algorithm
  base_score := 50.00; -- Start at neutral
  
  -- Add points for strengths (max 30 points)
  base_score := base_score + LEAST(strength_count * 5, 30);
  
  -- Subtract points for weaknesses (max 25 points)
  base_score := base_score - LEAST(weakness_count * 4, 25);
  
  -- Add points for evidence (max 20 points)
  base_score := base_score + LEAST(evidence_count * 2, 20);
  
  -- Ensure score is between 0 and 100
  final_score := GREATEST(0.00, LEAST(100.00, base_score));
  
  RETURN final_score;
END;
$$;