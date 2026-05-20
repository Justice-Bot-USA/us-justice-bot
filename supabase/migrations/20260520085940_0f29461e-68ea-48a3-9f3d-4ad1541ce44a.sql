-- Enable extensions for scheduled HTTP invocations
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove prior schedule if it exists (idempotent reseed)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'ny-daily-sweep') THEN
    PERFORM cron.unschedule('ny-daily-sweep');
  END IF;
END $$;

-- Schedule the NY daily sweep at 06:00 UTC every day
SELECT cron.schedule(
  'ny-daily-sweep',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://jhgkshjqgagxfllgvhco.supabase.co/functions/v1/ny-daily-sweep',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZ2tzaGpxZ2FneGZsbGd2aGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTM0NjAsImV4cCI6MjA3NDY4OTQ2MH0.v-w_WlZnzX690On8tBZB7pQCZ6i-I6jR6gtbtL-25cM"}'::jsonb,
    body := jsonb_build_object('scheduled_at', now())
  );
  $$
);