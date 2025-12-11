import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface JourneyStep {
  id: string;
  journey_id: string;
  step_number: number;
  title: string;
  description: string | null;
  step_type: 'form' | 'evidence' | 'filing' | 'appearance' | 'deadline' | 'review' | 'notification';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  due_date: string | null;
  completed_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface JourneyTask {
  id: string;
  step_id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LegalJourney {
  id: string;
  user_id: string;
  case_merit_id: string | null;
  current_step: number;
  total_steps: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CaseMeritData {
  id: string;
  case_title: string;
  legal_area: string;
  state: string;
  county: string | null;
  merit_score: number;
  legal_pathway: unknown;
  required_forms: unknown;
  evidence_to_gather: unknown;
  filing_options: unknown;
  next_steps: unknown;
}

export function useLegalJourney(journeyId?: string) {
  const { user } = useAuth();
  const [journey, setJourney] = useState<LegalJourney | null>(null);
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [tasks, setTasks] = useState<JourneyTask[]>([]);
  const [caseData, setCaseData] = useState<CaseMeritData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch journey data
  const fetchJourney = useCallback(async () => {
    if (!user || !journeyId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch journey
      const { data: journeyData, error: journeyError } = await supabase
        .from('legal_journeys')
        .select('*')
        .eq('id', journeyId)
        .single();

      if (journeyError) throw journeyError;
      setJourney(journeyData as LegalJourney);

      // Fetch case merit data if linked
      if (journeyData.case_merit_id) {
        const { data: meritData, error: meritError } = await supabase
          .from('case_merit_scores')
          .select('id, case_title, legal_area, state, county, merit_score, legal_pathway, required_forms, evidence_to_gather, filing_options, next_steps')
          .eq('id', journeyData.case_merit_id)
          .single();

        if (!meritError && meritData) {
          setCaseData(meritData as CaseMeritData);
        }
      }

      // Fetch steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('journey_steps')
        .select('*')
        .eq('journey_id', journeyId)
        .order('step_number');

      if (stepsError) throw stepsError;
      setSteps(stepsData as JourneyStep[]);

      // Fetch tasks for all steps
      if (stepsData && stepsData.length > 0) {
        const stepIds = stepsData.map(s => s.id);
        const { data: tasksData, error: tasksError } = await supabase
          .from('journey_tasks')
          .select('*')
          .in('step_id', stepIds)
          .order('created_at');

        if (!tasksError && tasksData) {
          setTasks(tasksData as JourneyTask[]);
        }
      }
    } catch (err) {
      console.error('Error fetching journey:', err);
      setError(err instanceof Error ? err.message : 'Failed to load journey');
    } finally {
      setIsLoading(false);
    }
  }, [user, journeyId]);

  useEffect(() => {
    fetchJourney();
  }, [fetchJourney]);

  // Create a new journey from case analysis
  const createJourneyFromCase = async (caseMeritId: string): Promise<string | null> => {
    if (!user) {
      toast({ title: 'Please sign in', variant: 'destructive' });
      return null;
    }

    try {
      // Fetch case data to generate steps
      const { data: caseData, error: caseError } = await supabase
        .from('case_merit_scores')
        .select('*')
        .eq('id', caseMeritId)
        .single();

      if (caseError) throw caseError;

      // Parse legal pathway and forms to generate steps
      const legalPathway = Array.isArray(caseData.legal_pathway) ? caseData.legal_pathway : [];
      const requiredForms = Array.isArray(caseData.required_forms) ? caseData.required_forms : [];
      const evidenceToGather = Array.isArray(caseData.evidence_to_gather) ? caseData.evidence_to_gather : [];
      
      // Calculate total steps
      const totalSteps = Math.max(1, legalPathway.length + requiredForms.length + evidenceToGather.length);

      // Create the journey
      const { data: newJourney, error: journeyError } = await supabase
        .from('legal_journeys')
        .insert({
          user_id: user.id,
          case_merit_id: caseMeritId,
          total_steps: totalSteps,
          status: 'in_progress'
        })
        .select()
        .single();

      if (journeyError) throw journeyError;

      // Generate steps from case data
      interface StepInsert {
        journey_id: string;
        step_number: number;
        title: string;
        description: string | null;
        step_type: string;
        status: string;
        due_date: string | null;
        completed_at: string | null;
        metadata: Record<string, unknown>;
      }
      const stepsToInsert: StepInsert[] = [];
      let stepNumber = 1;

      // Add evidence gathering steps first
      evidenceToGather.forEach((evidence: { item?: string; description?: string; deadline?: string }) => {
        stepsToInsert.push({
          journey_id: newJourney.id,
          step_number: stepNumber++,
          title: `Gather: ${evidence.item || 'Evidence'}`,
          description: evidence.description || null,
          step_type: 'evidence',
          status: 'pending',
          due_date: evidence.deadline || null,
          completed_at: null,
          metadata: { evidence }
        });
      });

      // Add form steps
      requiredForms.forEach((form: { formName?: string; formNumber?: string; purpose?: string; filingDeadline?: string }) => {
        stepsToInsert.push({
          journey_id: newJourney.id,
          step_number: stepNumber++,
          title: form.formName || form.formNumber || 'Complete Form',
          description: form.purpose || null,
          step_type: 'form',
          status: 'pending',
          due_date: form.filingDeadline || null,
          completed_at: null,
          metadata: { form }
        });
      });

      // Add legal pathway steps
      legalPathway.forEach((step: { step?: string; action?: string; timeline?: string; description?: string }) => {
        const stepType = determineStepType(step.step || step.action || '');
        stepsToInsert.push({
          journey_id: newJourney.id,
          step_number: stepNumber++,
          title: step.step || step.action || 'Legal Step',
          description: step.description || null,
          step_type: stepType,
          status: 'pending',
          due_date: null,
          completed_at: null,
          metadata: { pathway: step }
        });
      });

      // Insert all steps
      if (stepsToInsert.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: stepsError } = await supabase
          .from('journey_steps')
          .insert(stepsToInsert as any);

        if (stepsError) throw stepsError;

        // Update journey with correct total steps
        await supabase
          .from('legal_journeys')
          .update({ total_steps: stepsToInsert.length })
          .eq('id', newJourney.id);
      }

      toast({ title: 'Legal journey created!', description: 'Your step-by-step guide is ready.' });
      return newJourney.id;
    } catch (err) {
      console.error('Error creating journey:', err);
      toast({ title: 'Failed to create journey', variant: 'destructive' });
      return null;
    }
  };

  // Update step status
  const updateStepStatus = async (stepId: string, status: JourneyStep['status']) => {
    try {
      const updates: { status: string; completed_at?: string | null } = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('journey_steps')
        .update(updates)
        .eq('id', stepId);

      if (error) throw error;

      setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status, completed_at: updates.completed_at ?? s.completed_at } : s));

      // Update journey progress
      if (journey) {
        const completedSteps = steps.filter(s => 
          s.id === stepId ? status === 'completed' : s.status === 'completed'
        ).length;
        
        const newCurrentStep = completedSteps + 1;
        const journeyStatus = completedSteps >= journey.total_steps ? 'completed' : 'in_progress';

        await supabase
          .from('legal_journeys')
          .update({ 
            current_step: newCurrentStep,
            status: journeyStatus,
            completed_at: journeyStatus === 'completed' ? new Date().toISOString() : null
          })
          .eq('id', journey.id);

        setJourney(prev => prev ? { 
          ...prev, 
          current_step: newCurrentStep, 
          status: journeyStatus 
        } : null);
      }

      toast({ title: 'Step updated' });
    } catch (err) {
      console.error('Error updating step:', err);
      toast({ title: 'Failed to update step', variant: 'destructive' });
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updates = {
        is_completed: !task.is_completed,
        completed_at: !task.is_completed ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('journey_tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    } catch (err) {
      console.error('Error toggling task:', err);
      toast({ title: 'Failed to update task', variant: 'destructive' });
    }
  };

  // Add a new task
  const addTask = async (stepId: string, title: string, priority: JourneyTask['priority'] = 'medium') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journey_tasks')
        .insert({
          step_id: stepId,
          user_id: user.id,
          title,
          priority
        })
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [...prev, data as JourneyTask]);
      toast({ title: 'Task added' });
    } catch (err) {
      console.error('Error adding task:', err);
      toast({ title: 'Failed to add task', variant: 'destructive' });
    }
  };

  return {
    journey,
    steps,
    tasks,
    caseData,
    isLoading,
    error,
    refetch: fetchJourney,
    createJourneyFromCase,
    updateStepStatus,
    toggleTask,
    addTask
  };
}

// Helper function to determine step type from text
function determineStepType(text: string): JourneyStep['step_type'] {
  const lower = text.toLowerCase();
  if (lower.includes('form') || lower.includes('document') || lower.includes('paperwork')) return 'form';
  if (lower.includes('evidence') || lower.includes('gather') || lower.includes('collect')) return 'evidence';
  if (lower.includes('file') || lower.includes('submit') || lower.includes('send')) return 'filing';
  if (lower.includes('court') || lower.includes('hearing') || lower.includes('appear') || lower.includes('trial')) return 'appearance';
  if (lower.includes('deadline') || lower.includes('due')) return 'deadline';
  if (lower.includes('review') || lower.includes('check')) return 'review';
  return 'notification';
}
