export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      case_files: {
        Row: {
          bucket_name: string
          case_id: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          session_id: string | null
          tags: string[] | null
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          bucket_name: string
          case_id?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          session_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          bucket_name?: string
          case_id?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          session_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_files_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_merit_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_files_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      case_law_results: {
        Row: {
          citation: string | null
          cluster_id: number | null
          court: string | null
          created_at: string | null
          decision_date: string | null
          docket_number: string | null
          opinion_id: number
          pdf_url: string | null
          raw_json: Json | null
          summary: string | null
          sweep_id: string | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          citation?: string | null
          cluster_id?: number | null
          court?: string | null
          created_at?: string | null
          decision_date?: string | null
          docket_number?: string | null
          opinion_id: number
          pdf_url?: string | null
          raw_json?: Json | null
          summary?: string | null
          sweep_id?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          citation?: string | null
          cluster_id?: number | null
          court?: string | null
          created_at?: string | null
          decision_date?: string | null
          docket_number?: string | null
          opinion_id?: number
          pdf_url?: string | null
          raw_json?: Json | null
          summary?: string | null
          sweep_id?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      case_merit_scores: {
        Row: {
          archived_at: string | null
          case_description: string | null
          case_title: string
          complexity_score: number | null
          county: string | null
          created_at: string
          estimated_success_rate: number | null
          evidence_to_gather: Json | null
          filing_options: Json | null
          id: string
          improvement_suggestions: Json | null
          last_activity_at: string | null
          legal_area: string
          legal_pathway: Json | null
          merit_score: number
          next_steps: Json | null
          notes: string | null
          relevant_laws: Json | null
          required_forms: Json | null
          session_id: string | null
          settlement_range_max: number | null
          settlement_range_min: number | null
          state: string
          status: string | null
          strength_factors: Json | null
          supporting_evidence: Json | null
          time_to_resolution_months: number | null
          updated_at: string
          user_id: string
          weakness_factors: Json | null
        }
        Insert: {
          archived_at?: string | null
          case_description?: string | null
          case_title: string
          complexity_score?: number | null
          county?: string | null
          created_at?: string
          estimated_success_rate?: number | null
          evidence_to_gather?: Json | null
          filing_options?: Json | null
          id?: string
          improvement_suggestions?: Json | null
          last_activity_at?: string | null
          legal_area: string
          legal_pathway?: Json | null
          merit_score?: number
          next_steps?: Json | null
          notes?: string | null
          relevant_laws?: Json | null
          required_forms?: Json | null
          session_id?: string | null
          settlement_range_max?: number | null
          settlement_range_min?: number | null
          state: string
          status?: string | null
          strength_factors?: Json | null
          supporting_evidence?: Json | null
          time_to_resolution_months?: number | null
          updated_at?: string
          user_id: string
          weakness_factors?: Json | null
        }
        Update: {
          archived_at?: string | null
          case_description?: string | null
          case_title?: string
          complexity_score?: number | null
          county?: string | null
          created_at?: string
          estimated_success_rate?: number | null
          evidence_to_gather?: Json | null
          filing_options?: Json | null
          id?: string
          improvement_suggestions?: Json | null
          last_activity_at?: string | null
          legal_area?: string
          legal_pathway?: Json | null
          merit_score?: number
          next_steps?: Json | null
          notes?: string | null
          relevant_laws?: Json | null
          required_forms?: Json | null
          session_id?: string | null
          settlement_range_max?: number | null
          settlement_range_min?: number | null
          state?: string
          status?: string | null
          strength_factors?: Json | null
          supporting_evidence?: Json | null
          time_to_resolution_months?: number | null
          updated_at?: string
          user_id?: string
          weakness_factors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "case_merit_scores_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      case_sweeps: {
        Row: {
          case_id: string
          completed_at: string | null
          created_at: string
          error: string | null
          id: number
          output: Json | null
          progress: number
          started_at: string | null
          status: Database["public"]["Enums"]["sweep_status"]
          sweep_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id: string
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: number
          output?: Json | null
          progress?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["sweep_status"]
          sweep_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: number
          output?: Json | null
          progress?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["sweep_status"]
          sweep_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      case_timeline_events: {
        Row: {
          case_id: string
          created_at: string
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_timeline_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_merit_scores"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          language: string
          legal_section: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string
          legal_section: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string
          legal_section?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      course_certificates: {
        Row: {
          audit_timestamp: string
          certificate_file_path: string | null
          certificate_hash: string
          certificate_url: string | null
          completion_date: string
          course_title: string
          created_at: string
          enrollment_id: string | null
          hours_completed: number
          id: string
          metadata: Json | null
          provider_name: string
          user_id: string
          verification_link: string | null
        }
        Insert: {
          audit_timestamp?: string
          certificate_file_path?: string | null
          certificate_hash: string
          certificate_url?: string | null
          completion_date: string
          course_title: string
          created_at?: string
          enrollment_id?: string | null
          hours_completed: number
          id?: string
          metadata?: Json | null
          provider_name: string
          user_id: string
          verification_link?: string | null
        }
        Update: {
          audit_timestamp?: string
          certificate_file_path?: string | null
          certificate_hash?: string
          certificate_url?: string | null
          completion_date?: string
          course_title?: string
          created_at?: string
          enrollment_id?: string | null
          hours_completed?: number
          id?: string
          metadata?: Json | null
          provider_name?: string
          user_id?: string
          verification_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          case_id: string | null
          completed_at: string | null
          course_id: string
          created_at: string
          enrolled_at: string
          hours_completed: number | null
          id: string
          metadata: Json | null
          provider_enrollment_id: string | null
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          completed_at?: string | null
          course_id: string
          created_at?: string
          enrolled_at?: string
          hours_completed?: number | null
          id?: string
          metadata?: Json | null
          provider_enrollment_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          completed_at?: string | null
          course_id?: string
          created_at?: string
          enrolled_at?: string
          hours_completed?: number | null
          id?: string
          metadata?: Json | null
          provider_enrollment_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_merit_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          acceptance_label: string
          course_type: string
          created_at: string
          description: string | null
          hours_required: number | null
          id: string
          is_active: boolean
          jurisdictions: string[]
          lms_launch_url: string | null
          lms_type: string | null
          official_registry_url: string | null
          provider_metadata: Json | null
          provider_name: string
          provider_url: string | null
          recognition_source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          acceptance_label: string
          course_type: string
          created_at?: string
          description?: string | null
          hours_required?: number | null
          id?: string
          is_active?: boolean
          jurisdictions?: string[]
          lms_launch_url?: string | null
          lms_type?: string | null
          official_registry_url?: string | null
          provider_metadata?: Json | null
          provider_name: string
          provider_url?: string | null
          recognition_source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          acceptance_label?: string
          course_type?: string
          created_at?: string
          description?: string | null
          hours_required?: number | null
          id?: string
          is_active?: boolean
          jurisdictions?: string[]
          lms_launch_url?: string | null
          lms_type?: string | null
          official_registry_url?: string | null
          provider_metadata?: Json | null
          provider_name?: string
          provider_url?: string | null
          recognition_source?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      court_export_logs: {
        Row: {
          case_id: string | null
          contents_summary: Json | null
          created_at: string
          document_hash: string
          export_type: string
          file_path: string | null
          generation_timestamp_local: string | null
          generation_timestamp_utc: string
          id: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          contents_summary?: Json | null
          created_at?: string
          document_hash: string
          export_type?: string
          file_path?: string | null
          generation_timestamp_local?: string | null
          generation_timestamp_utc?: string
          id?: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          contents_summary?: Json | null
          created_at?: string
          document_hash?: string
          export_type?: string
          file_path?: string | null
          generation_timestamp_local?: string | null
          generation_timestamp_utc?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      form_payments: {
        Row: {
          amount: number
          created_at: string
          form_type: string | null
          id: string
          paypal_payment_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          form_type?: string | null
          id?: string
          paypal_payment_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          form_type?: string | null
          id?: string
          paypal_payment_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      form_sources: {
        Row: {
          category: string | null
          country: string
          created_at: string
          id: string
          is_active: boolean
          jurisdiction_code: string
          last_synced_at: string | null
          source_name: string
          source_type: string
          source_url: string
          sync_error: string | null
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          jurisdiction_code: string
          last_synced_at?: string | null
          source_name: string
          source_type?: string
          source_url: string
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          jurisdiction_code?: string
          last_synced_at?: string | null
          source_name?: string
          source_type?: string
          source_url?: string
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_sources_jurisdiction_code_fkey"
            columns: ["jurisdiction_code"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["code"]
          },
        ]
      }
      forms: {
        Row: {
          category: string | null
          country: string
          created_at: string
          description: string | null
          fee_amount: string | null
          fee_waiver_available: boolean | null
          file_type: string | null
          form_number: string | null
          id: string
          is_active: boolean
          jurisdiction_code: string
          last_verified_at: string | null
          source_id: string | null
          subcategory: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string | null
          country?: string
          created_at?: string
          description?: string | null
          fee_amount?: string | null
          fee_waiver_available?: boolean | null
          file_type?: string | null
          form_number?: string | null
          id?: string
          is_active?: boolean
          jurisdiction_code: string
          last_verified_at?: string | null
          source_id?: string | null
          subcategory?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string | null
          country?: string
          created_at?: string
          description?: string | null
          fee_amount?: string | null
          fee_waiver_available?: boolean | null
          file_type?: string | null
          form_number?: string | null
          id?: string
          is_active?: boolean
          jurisdiction_code?: string
          last_verified_at?: string | null
          source_id?: string | null
          subcategory?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_jurisdiction_code_fkey"
            columns: ["jurisdiction_code"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "forms_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "form_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_analytics: {
        Row: {
          action: string
          created_at: string
          funnel_id: string
          id: string
          metadata: Json | null
          session_id: string
          step: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          funnel_id: string
          id?: string
          metadata?: Json | null
          session_id: string
          step: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          funnel_id?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          step?: string
          user_id?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error: string | null
          id: number
          payload: Json
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: number
          payload: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: number
          payload?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          type?: string
        }
        Relationships: []
      }
      journey_steps: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          journey_id: string
          metadata: Json | null
          status: string
          step_number: number
          step_type: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          journey_id: string
          metadata?: Json | null
          status?: string
          step_number: number
          step_type: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          journey_id?: string
          metadata?: Json | null
          status?: string
          step_number?: number
          step_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_steps_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "legal_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean
          notes: string | null
          priority: string
          step_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          priority?: string
          step_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          priority?: string
          step_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_tasks_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "journey_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      juriscraper_ingest_logs: {
        Row: {
          completed_at: string | null
          court_id: string
          errors: Json | null
          id: string
          metadata: Json | null
          opinions_inserted: number | null
          opinions_received: number | null
          opinions_updated: number | null
          session_id: string
          started_at: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          court_id: string
          errors?: Json | null
          id?: string
          metadata?: Json | null
          opinions_inserted?: number | null
          opinions_received?: number | null
          opinions_updated?: number | null
          session_id: string
          started_at?: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          court_id?: string
          errors?: Json | null
          id?: string
          metadata?: Json | null
          opinions_inserted?: number | null
          opinions_received?: number | null
          opinions_updated?: number | null
          session_id?: string
          started_at?: string
          status?: string | null
        }
        Relationships: []
      }
      juriscraper_opinions: {
        Row: {
          author_judge: string | null
          case_name: string
          citation: string | null
          court_id: string
          court_name: string | null
          date_argued: string | null
          date_filed: string | null
          docket_number: string | null
          download_url: string | null
          id: string
          ingested_at: string
          jurisdiction: string | null
          nature_of_suit: string | null
          opinion_text: string | null
          opinion_type: string | null
          opinion_url: string | null
          per_curiam: boolean | null
          precedential_status: string | null
          raw_metadata: Json | null
          scrape_session_id: string | null
          source_url: string | null
          state: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          author_judge?: string | null
          case_name: string
          citation?: string | null
          court_id: string
          court_name?: string | null
          date_argued?: string | null
          date_filed?: string | null
          docket_number?: string | null
          download_url?: string | null
          id?: string
          ingested_at?: string
          jurisdiction?: string | null
          nature_of_suit?: string | null
          opinion_text?: string | null
          opinion_type?: string | null
          opinion_url?: string | null
          per_curiam?: boolean | null
          precedential_status?: string | null
          raw_metadata?: Json | null
          scrape_session_id?: string | null
          source_url?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          author_judge?: string | null
          case_name?: string
          citation?: string | null
          court_id?: string
          court_name?: string | null
          date_argued?: string | null
          date_filed?: string | null
          docket_number?: string | null
          download_url?: string | null
          id?: string
          ingested_at?: string
          jurisdiction?: string | null
          nature_of_suit?: string | null
          opinion_text?: string | null
          opinion_type?: string | null
          opinion_url?: string | null
          per_curiam?: boolean | null
          precedential_status?: string | null
          raw_metadata?: Json | null
          scrape_session_id?: string | null
          source_url?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      jurisdictions: {
        Row: {
          code: string
          country: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          short_code: string | null
          updated_at: string
        }
        Insert: {
          code: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          short_code?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          short_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      legal_journeys: {
        Row: {
          case_merit_id: string | null
          completed_at: string | null
          created_at: string
          current_step: number
          id: string
          started_at: string
          status: string
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          case_merit_id?: string | null
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          started_at?: string
          status?: string
          total_steps?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          case_merit_id?: string | null
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          started_at?: string
          status?: string
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_journeys_case_merit_id_fkey"
            columns: ["case_merit_id"]
            isOneToOne: false
            referencedRelation: "case_merit_scores"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_sweep_results: {
        Row: {
          content: string | null
          created_at: string
          extracted_data: Json | null
          id: string
          jurisdiction: string | null
          keywords: Json | null
          law_type: string | null
          relevance_score: number | null
          source_url: string
          sweep_id: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          extracted_data?: Json | null
          id?: string
          jurisdiction?: string | null
          keywords?: Json | null
          law_type?: string | null
          relevance_score?: number | null
          source_url: string
          sweep_id: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          extracted_data?: Json | null
          id?: string
          jurisdiction?: string | null
          keywords?: Json | null
          law_type?: string | null
          relevance_score?: number | null
          source_url?: string
          sweep_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_sweep_results_sweep_id_fkey"
            columns: ["sweep_id"]
            isOneToOne: false
            referencedRelation: "legal_sweeps"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_sweeps: {
        Row: {
          created_at: string
          created_by: string
          id: string
          last_run: string | null
          legal_area_filter: string | null
          next_scheduled_run: string | null
          results_count: number | null
          search_terms: Json
          state_filter: string | null
          status: string | null
          sweep_name: string
          target_domains: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          last_run?: string | null
          legal_area_filter?: string | null
          next_scheduled_run?: string | null
          results_count?: number | null
          search_terms?: Json
          state_filter?: string | null
          status?: string | null
          sweep_name: string
          target_domains?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          last_run?: string | null
          legal_area_filter?: string | null
          next_scheduled_run?: string | null
          results_count?: number | null
          search_terms?: Json
          state_filter?: string | null
          status?: string | null
          sweep_name?: string
          target_domains?: Json
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          capture_id: string | null
          created_at: string
          id: string
          paypal_order_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          capture_id?: string | null
          created_at?: string
          id?: string
          paypal_order_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          capture_id?: string | null
          created_at?: string
          id?: string
          paypal_order_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      related_case_references: {
        Row: {
          case_id: string
          case_type: string | null
          county: string | null
          court_name: string | null
          created_at: string
          docket_number: string | null
          id: string
          relationship_description: string | null
          state: string
          supporting_upload_ids: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id: string
          case_type?: string | null
          county?: string | null
          court_name?: string | null
          created_at?: string
          docket_number?: string | null
          id?: string
          relationship_description?: string | null
          state: string
          supporting_upload_ids?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string
          case_type?: string | null
          county?: string | null
          court_name?: string | null
          created_at?: string
          docket_number?: string | null
          id?: string
          relationship_description?: string | null
          state?: string
          supporting_upload_ids?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_case_references_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_merit_scores"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_court_results: {
        Row: {
          absolute_url: string | null
          author: string | null
          case_id: string | null
          case_name: string
          citation: string | null
          court: string | null
          court_id: string | null
          created_at: string
          date_argued: string | null
          date_filed: string | null
          docket_number: string | null
          download_url: string | null
          id: string
          notes: string | null
          search_type: string
          snippet: string | null
          source_id: string | null
          status: string | null
          suit_nature: string | null
          user_id: string
        }
        Insert: {
          absolute_url?: string | null
          author?: string | null
          case_id?: string | null
          case_name: string
          citation?: string | null
          court?: string | null
          court_id?: string | null
          created_at?: string
          date_argued?: string | null
          date_filed?: string | null
          docket_number?: string | null
          download_url?: string | null
          id?: string
          notes?: string | null
          search_type?: string
          snippet?: string | null
          source_id?: string | null
          status?: string | null
          suit_nature?: string | null
          user_id: string
        }
        Update: {
          absolute_url?: string | null
          author?: string | null
          case_id?: string | null
          case_name?: string
          citation?: string | null
          court?: string | null
          court_id?: string | null
          created_at?: string
          date_argued?: string | null
          date_filed?: string | null
          docket_number?: string | null
          download_url?: string | null
          id?: string
          notes?: string | null
          search_type?: string
          snippet?: string | null
          source_id?: string | null
          status?: string | null
          suit_nature?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_court_results_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_merit_scores"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          end_date: string
          id: string
          paypal_subscription_id: string | null
          plan_type: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_date: string
          id?: string
          paypal_subscription_id?: string | null
          plan_type: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string
          id?: string
          paypal_subscription_id?: string | null
          plan_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_staff_response: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_staff_response?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_staff_response?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_archive_deletions: {
        Row: {
          deleted_at: string
          deleted_by: string
          details: Json | null
          id: string
          reason: string | null
          target_id: string
        }
        Insert: {
          deleted_at?: string
          deleted_by: string
          details?: Json | null
          id?: string
          reason?: string | null
          target_id: string
        }
        Update: {
          deleted_at?: string
          deleted_by?: string
          details?: Json | null
          id?: string
          reason?: string | null
          target_id?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action: string
          anonymized_at: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          ip_address_hash: string | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          anonymized_at?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          ip_address_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          anonymized_at?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          ip_address_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_logs_archive: {
        Row: {
          action: string
          anonymized_at: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          details: Json | null
          id: string
          ip_address: unknown
          ip_address_hash: string | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          anonymized_at?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          ip_address_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          anonymized_at?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          ip_address_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferred_language: string | null
          preferred_state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferred_language?: string | null
          preferred_state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferred_language?: string | null
          preferred_state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_export_profiles: {
        Args: { p_filters?: Json; p_reason: string }
        Returns: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          user_id: string
        }[]
      }
      admin_view_profile_access_logs: {
        Args: { p_days_back?: number }
        Returns: {
          accessed_at: string
          action: string
          admin_user_id: string
          details: Json
          log_id: string
        }[]
      }
      admin_view_profiles: {
        Args: { p_limit?: number; p_offset?: number; p_user_id?: string }
        Returns: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
          user_id: string
        }[]
      }
      calculate_case_merit_score: { Args: { case_id: string }; Returns: number }
      compute_ip_hash: { Args: { ip: string }; Returns: string }
      delete_user_activity_archive_tombstone: {
        Args: { admin_user: string; reason: string; target_id: string }
        Returns: undefined
      }
      get_ip_pepper: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_verified_admin: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      job_status: "queued" | "running" | "done" | "error"
      sweep_status: "queued" | "running" | "done" | "error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      job_status: ["queued", "running", "done", "error"],
      sweep_status: ["queued", "running", "done", "error"],
    },
  },
} as const
