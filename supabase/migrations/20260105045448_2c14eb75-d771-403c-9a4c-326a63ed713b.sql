-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = 'public';

-- Create table for storing related court case references
CREATE TABLE public.related_case_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.case_merit_scores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  court_name TEXT,
  state TEXT NOT NULL,
  county TEXT,
  docket_number TEXT,
  case_type TEXT,
  relationship_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.related_case_references ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own related case references" 
ON public.related_case_references 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own related case references" 
ON public.related_case_references 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own related case references" 
ON public.related_case_references 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own related case references" 
ON public.related_case_references 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admin access
CREATE POLICY "Admins can manage all related case references" 
ON public.related_case_references 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for faster lookups
CREATE INDEX idx_related_case_references_case_id ON public.related_case_references(case_id);
CREATE INDEX idx_related_case_references_user_id ON public.related_case_references(user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_related_case_references_updated_at
BEFORE UPDATE ON public.related_case_references
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();