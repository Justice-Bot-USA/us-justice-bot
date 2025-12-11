-- Create legal journey tracking table
CREATE TABLE public.legal_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  case_merit_id UUID REFERENCES public.case_merit_scores(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journey steps table
CREATE TABLE public.journey_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES public.legal_journeys(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  step_type TEXT NOT NULL CHECK (step_type IN ('form', 'evidence', 'filing', 'appearance', 'deadline', 'review', 'notification')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create action items/checklist table
CREATE TABLE public.journey_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id UUID NOT NULL REFERENCES public.journey_steps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.legal_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for legal_journeys
CREATE POLICY "Users can view their own journeys" ON public.legal_journeys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journeys" ON public.legal_journeys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journeys" ON public.legal_journeys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all journeys" ON public.legal_journeys
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for journey_steps
CREATE POLICY "Users can view steps of their journeys" ON public.journey_steps
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.legal_journeys 
    WHERE legal_journeys.id = journey_steps.journey_id 
    AND legal_journeys.user_id = auth.uid()
  ));

CREATE POLICY "Users can update steps of their journeys" ON public.journey_steps
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.legal_journeys 
    WHERE legal_journeys.id = journey_steps.journey_id 
    AND legal_journeys.user_id = auth.uid()
  ));

CREATE POLICY "System can insert journey steps" ON public.journey_steps
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.legal_journeys 
    WHERE legal_journeys.id = journey_steps.journey_id 
    AND legal_journeys.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all steps" ON public.journey_steps
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for journey_tasks
CREATE POLICY "Users can view their own tasks" ON public.journey_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" ON public.journey_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.journey_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.journey_tasks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tasks" ON public.journey_tasks
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_legal_journeys_updated_at
  BEFORE UPDATE ON public.legal_journeys
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_journey_steps_updated_at
  BEFORE UPDATE ON public.journey_steps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_journey_tasks_updated_at
  BEFORE UPDATE ON public.journey_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();