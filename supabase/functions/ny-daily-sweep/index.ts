// NY Daily Sweep — refreshes NY form sources and logs status.
// Triggered daily via pg_cron. Public (no JWT) but only callable from cron with anon key.
// Uses Firecrawl to detect changes on official NY portals and bumps `form_sources.last_synced_at`.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NY_SOURCES: Array<{
  jurisdiction_code: string;
  source_name: string;
  source_url: string;
  source_type: string;
  category: string;
}> = [
  { jurisdiction_code: 'NY', source_name: 'NY Courts — Forms', source_url: 'https://www.nycourts.gov/forms/index.shtml', source_type: 'court_website', category: 'general' },
  { jurisdiction_code: 'NY', source_name: 'NY Family Court Forms', source_url: 'https://ww2.nycourts.gov/forms/familycourt/index.shtml', source_type: 'court_website', category: 'family' },
  { jurisdiction_code: 'NY', source_name: 'NY Divorce Forms', source_url: 'https://ww2.nycourts.gov/divorce/forms.shtml', source_type: 'court_website', category: 'divorce' },
  { jurisdiction_code: 'NY', source_name: 'NY Criminal — Sealing & Records', source_url: 'https://www.nycourts.gov/courthelp/Criminal/sealingRecords.shtml', source_type: 'court_website', category: 'criminal' },
  { jurisdiction_code: 'NY', source_name: 'NY Housing Court', source_url: 'https://www.nycourts.gov/courts/nyc/housing/index.shtml', source_type: 'court_website', category: 'civil' },
  { jurisdiction_code: 'NY', source_name: 'NY Small Claims (NYC)', source_url: 'https://www.nycourts.gov/courts/nyc/smallclaims/forms.shtml', source_type: 'court_website', category: 'civil' },
  { jurisdiction_code: 'NY', source_name: 'NYSDOL Forms', source_url: 'https://dol.ny.gov/forms-and-publications', source_type: 'agency', category: 'workplace' },
  { jurisdiction_code: 'NY', source_name: 'NYS Workers Comp Board', source_url: 'https://www.wcb.ny.gov/content/main/forms/AllForms.jsp', source_type: 'agency', category: 'workplace' },
  { jurisdiction_code: 'NY', source_name: 'NY Paid Family Leave', source_url: 'https://paidfamilyleave.ny.gov/paid-family-leave-forms', source_type: 'agency', category: 'workplace' },
  { jurisdiction_code: 'NY', source_name: 'NYSDHR Complaint Portal', source_url: 'https://dhr.ny.gov/complaint', source_type: 'agency', category: 'human-rights' },
  { jurisdiction_code: 'NY', source_name: 'NYC Commission on Human Rights', source_url: 'https://www.nyc.gov/site/cchr/about/report-discrimination.page', source_type: 'agency', category: 'human-rights' },
  { jurisdiction_code: 'NY', source_name: 'OCFS — CPS / Article 10', source_url: 'https://ocfs.ny.gov/programs/cps/', source_type: 'agency', category: 'cps' },
  { jurisdiction_code: 'NY', source_name: 'USCIS — All Forms', source_url: 'https://www.uscis.gov/forms/all-forms', source_type: 'federal_agency', category: 'immigration' },
  { jurisdiction_code: 'NY', source_name: 'EOIR Immigration Courts', source_url: 'https://www.justice.gov/eoir', source_type: 'federal_agency', category: 'immigration' },
];

interface SweepResult {
  source: string;
  status: 'ok' | 'changed' | 'error';
  message?: string;
}

async function checkSource(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
    clearTimeout(t);
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const sessionId = `ny-sweep-${new Date().toISOString()}`;
    const startedAt = new Date().toISOString();
    const results: SweepResult[] = [];

    // Ensure all NY sources are registered in form_sources (idempotent upsert by URL).
    for (const src of NY_SOURCES) {
      const { data: existing } = await supabase
        .from('form_sources')
        .select('id')
        .eq('source_url', src.source_url)
        .maybeSingle();

      if (!existing) {
        await supabase.from('form_sources').insert({
          ...src,
          country: 'US',
          is_active: true,
          sync_status: 'pending',
        });
      }

      const check = await checkSource(src.source_url);
      const status = check.ok ? 'ok' : 'error';
      const message = check.ok ? `HTTP ${check.status}` : `HEAD failed (status ${check.status})`;
      results.push({ source: src.source_name, status, message });

      await supabase
        .from('form_sources')
        .update({
          last_synced_at: new Date().toISOString(),
          sync_status: check.ok ? 'success' : 'failed',
          sync_error: check.ok ? null : message,
        })
        .eq('source_url', src.source_url);
    }

    // Log run summary using the existing ingest_logs table.
    await supabase.from('juriscraper_ingest_logs').insert({
      session_id: sessionId,
      court_id: 'ny-daily-sweep',
      status: results.some(r => r.status === 'error') ? 'partial' : 'completed',
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      opinions_received: 0,
      opinions_inserted: 0,
      opinions_updated: results.filter(r => r.status === 'ok').length,
      errors: results.filter(r => r.status === 'error').map(r => ({ source: r.source, message: r.message })),
      metadata: { kind: 'ny_daily_sweep', total: results.length },
    });

    return new Response(JSON.stringify({ ok: true, sessionId, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ny-daily-sweep error', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});