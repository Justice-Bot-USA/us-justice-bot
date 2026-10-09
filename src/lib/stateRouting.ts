// Where a user's story should lead: the dedicated California and New York legal centers
// (opened on the matching legal area) and their form filler. Other states have no
// dedicated pages yet, so callers get null and show their generic next steps.

export type LaunchState = 'CA' | 'NY';

const STATE_ALIASES: Record<string, LaunchState> = {
  ca: 'CA', california: 'CA', 'us-ca': 'CA',
  ny: 'NY', 'new york': 'NY', 'new-york': 'NY', newyork: 'NY', 'us-ny': 'NY',
};

export function launchStateOf(state?: string | null): LaunchState | null {
  if (!state) return null;
  return STATE_ALIASES[state.trim().toLowerCase()] ?? null;
}

// Category keys used by CaliforniaLegalCenter / NewYorkLegalCenter tabs.
const CA_AREAS = ['criminal', 'family', 'divorce', 'cps', 'workplace', 'civil', 'human-rights'] as const;
const NY_AREAS = [...CA_AREAS, 'immigration'] as const;

// Keyword → legal-center tab. Order matters: the first match wins.
const AREA_RULES: [RegExp, string][] = [
  [/divorce|dissolution|separation|matrimonial/, 'divorce'],
  [/\bcps\b|dependency|child protect|neglect|abuse|foster|acs\b|article 10/, 'cps'],
  [/custody|visitation|child support|family|paternity|protective order|order of protection|domestic/, 'family'],
  [/immigra|deport|removal|asylum|daca|visa|uscis|ice\b/, 'immigration'],
  [/criminal|arrest|sealing|expunge|record clear|dismissal|1203\.4|conviction|parole|probation/, 'criminal'],
  [/employ|workplace|wage|worker|unemploy|workers.?comp|osha|labor/, 'workplace'],
  [/human.?rights|civil.?rights|discriminat|harass|eeoc|disab/, 'human-rights'],
  [/housing|evict|landlord|tenant|rent|small.?claims|consumer|debt|personal.?injury|agency|civil|bankrupt/, 'civil'],
];

export function legalCenterArea(state: LaunchState, area?: string | null): string | null {
  if (!area) return null;
  const a = area.toLowerCase();
  const hit = AREA_RULES.find(([re]) => re.test(a))?.[1] ?? null;
  const allowed: readonly string[] = state === 'NY' ? NY_AREAS : CA_AREAS;
  return hit && allowed.includes(hit) ? hit : null;
}

export interface StateRoute {
  state: LaunchState;
  stateName: string;
  centerPath: string;
  fillPath: string;
  areaKey: string | null;
}

export function stateRouteFor(state?: string | null, area?: string | null): StateRoute | null {
  const st = launchStateOf(state);
  if (!st) return null;
  const areaKey = legalCenterArea(st, area);
  const base = st === 'CA' ? '/ca/legal-center' : '/ny/legal-center';
  return {
    state: st,
    stateName: st === 'CA' ? 'California' : 'New York',
    centerPath: areaKey ? `${base}?area=${areaKey}` : base,
    fillPath: st === 'CA' ? '/fill/ca' : '/fill/ny',
    areaKey,
  };
}
