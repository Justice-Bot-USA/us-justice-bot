
-- Course Hub: External courses catalog
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  provider_name TEXT NOT NULL,
  provider_url TEXT,
  provider_metadata JSONB DEFAULT '{}',
  course_type TEXT NOT NULL CHECK (course_type IN ('parenting', 'reunification', 'supplementary', 'skill-building')),
  acceptance_label TEXT NOT NULL CHECK (acceptance_label IN (
    'Court-Ordered (External Provider Required)',
    'Commonly Accepted in Some Jurisdictions',
    'Supplementary / Skill-Building'
  )),
  jurisdictions TEXT[] NOT NULL DEFAULT '{}',
  hours_required NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  lms_launch_url TEXT,
  lms_type TEXT CHECK (lms_type IN ('lti', 'api', 'manual', 'link')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enrollments: parent enrollment tracking
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  case_id UUID REFERENCES public.case_merit_scores(id),
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'withdrawn')),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  hours_completed NUMERIC DEFAULT 0,
  provider_enrollment_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Certificates: completion proof storage
CREATE TABLE public.course_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id),
  user_id UUID NOT NULL,
  provider_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  hours_completed NUMERIC NOT NULL,
  completion_date DATE NOT NULL,
  certificate_hash TEXT NOT NULL,
  certificate_url TEXT,
  certificate_file_path TEXT,
  verification_link TEXT,
  audit_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Court export audit log (immutable)
CREATE TABLE public.court_export_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  case_id UUID,
  export_type TEXT NOT NULL DEFAULT 'pdf',
  document_hash TEXT NOT NULL,
  generation_timestamp_utc TIMESTAMPTZ NOT NULL DEFAULT now(),
  generation_timestamp_local TEXT,
  contents_summary JSONB DEFAULT '{}',
  file_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_export_logs ENABLE ROW LEVEL SECURITY;

-- Courses: public read
CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Enrollments: user owns
CREATE POLICY "Users view own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own enrollments" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own enrollments" ON public.course_enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Certificates: user owns
CREATE POLICY "Users view own certificates" ON public.course_certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own certificates" ON public.course_certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Export logs: user owns, immutable (no update/delete)
CREATE POLICY "Users view own export logs" ON public.court_export_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create export logs" ON public.court_export_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
