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

// Keyword → legal-center tab. Order matters: the first match the state has a tab for wins.
// A rule marked with a state applies only there. A null tab means no tab fits, so the caller
// shows its generic next steps.
// Matching runs on lowercased text with hyphens/underscores turned into spaces, so slugs
// such as "child-support" or "small_claims" hit the same terms as free text.

// Words for a child, as whole words so "person", "prison" or "kidney" do not count.
const CHILD = String.raw`\b(?:child|children|kids?|sons?|daughters?|bab(?:y|ies)|grand(?:child|children|kids?|sons?|daughters?))\b`;

// Harassment, stalking or a restraining order within 30 characters of one of these people.
const harassedBy = (who: string) => {
  const act = '(?:harass|stalk|restraining order)';
  return String.raw`\b(?:${who})s?\b.{0,30}${act}|${act}.{0,30}\b(?:${who})`;
};

const AREA_RULES: [RegExp, string | null, LaunchState?][] = [
  [/divorce|dissolution|separation(?!.{0,30}\b(?:employ\w*|job|company|severance)\b)|matrimonial/, 'divorce'],
  // Child-specific terms only: "domestic abuse" or "elder abuse" is not a dependency case.
  [new RegExp([
    String.raw`\bcps\b|\bacs\b|\bdcfs\b|dependency|child protect|child welfare|child (?:abuse|neglect)`,
    String.raw`(?:abuse|neglect)\w* (?:of )?(?:my |a |the |our )?${CHILD}`,
    String.raw`neglect (?:petition|case|finding|allegation|investigation)|educational neglect`,
    String.raw`\bfoster (?:care|parent|home|placement|famil|child|children|kids?|youth)|kinship (?:care|foster)`,
    String.raw`article 10|termination of parental rights|reunification (?:services|plan|hearing)`,
    // Removal by an agency, or a child removed from the home. Not a landlord lockout, a parent
    // keeping a child (custody) or a move-away request.
    String.raw`(?:removed|taken)(?: away)? (?:by|into) (?:social services|child(?:ren's)? services|(?:a |the )?social workers?|foster care|protective custody)`,
    String.raw`${CHILD} (?:was |were |got |has been |have been |being )?(?:removed|taken)(?: away)?(?: from (?:me|us|my home|our home|the home))? by (?:the )?(?:county|state)\b`,
    String.raw`${CHILD} (?:was |were |got |has been |have been |being )?removed from (?:my |our |the )?(?:home|house|care|custody)`,
    String.raw`removed from (?:my |our )(?:care|custody)|emergency removal|child removal`,
    String.raw`(?:social workers?|social services|child(?:ren's)? services|the county|the state) (?:took|removed|has taken|have taken) (?:my |our |the )?${CHILD}`,
  ].join('|')), 'cps'],
  // Sexual or racial harassment is a civil rights complaint even when a landlord does it
  // (CA Gov. Code § 12955), so this runs before the civil harassment rules.
  [/discriminat|(?:sexual|workplace|work place|racial) harass|harass\w* (?:at|in the) work|hostile work environment|\beeoc\b/, 'human-rights'],
  // Landlord or roommate: a California civil harassment order (CH-100, Code Civ. Proc.
  // § 527.6), or a New York Housing Court case (harassment claim, roommate holdover).
  [new RegExp(harassedBy('landlord|room ?mate')), 'civil'],
  // Neighbor, coworker, stranger or a more distant relative: CH-100 in California.
  [new RegExp(`civil harassment|${harassedBy('neighbou?r|co ?worker|stranger|aunt|uncle|cousin|niece|nephew')}`), 'civil', 'CA'],
  [/wage theft|unpaid wages?|(?:wrongful|constructive|unfair|unlawful) (?:termination|dismissal|discharge|firing)|(?:family|parental|maternity|paternity) leave|\bfmla\b|whistle ?blow/, 'workplace'],
  // "ICE" the agency, but not ice on the stairs, an ice storm or ice cream.
  [/immigra|deport|removal (?:proceeding|order|defense|hearing|case)|(?:order|cancellation|withholding) of removal|reopen\w* (?:my |a |the |our )?removal|asylum|\bdaca\b|\bvawa\b|\btps\b|\bead\b|work permit|citizenship|\bvisas?\b(?! (?:card|credit|debit|gift|charges?|statement|transactions?|purchases?))|uscis|\beoir\b|green card|naturaliz|\bi\.c\.e\b|^(?!.*\b(?:slip\w*|fell|fall\w*|skid\w*|trip\w*|walk\w*) (?:on )?(?:the |some )?ice\b|.*\b(?:patch of|sheet of|bag of|possession of|black|dry|shaved) ice\b).*\bice\b(?! (?:storm|rink|cream|machine|maker|skat|hockey|cube|dam|pack|chest|water|tea|cold|fishing|on (?:the |my |our )?(?:stairs|steps|sidewalk|driveway|road|porch|floor|walkway|parking|ground|path)))/, 'immigration'],
  // Domestic violence covers a spouse, a partner, an ex and your child's other parent. Other
  // restraining orders (coworker, elder abuse, gun violence, workplace violence) are not
  // family cases, so a bare "restraining order" is not matched here.
  [new RegExp([
    String.raw`custody|visitation|child support|spousal support|family|paternity|parentage|parenting|parental`,
    String.raw`protective order|order of protection|domestic|\bdv\b|\bex (?:husband|wife|boyfriend|girlfriend|partner|spouse)`,
    String.raw`\b(?:spous\w*|partner|dating) (?:abuse|violence)\b|restraining order (?:against|on) (?:my |our )?(?:ex|husband|wife|spouse|partner|boyfriend|girlfriend|fianc\w*|brother|sister|sibling|mother|father|mom|dad|parent|son|daughter|grand\w+|\w+ in law)\b`,
    harassedBy(String.raw`ex|ex husband|ex wife|husband|wife|spouse|boyfriend|girlfriend|partner|fianc\w*|brother|sister|sibling|mother|father|mom|dad|parent|grand\w+|\w+ in law`),
    String.raw`\b(?:child|children|kids?|bab(?:y|ies))(?:['’]s|s['’]|['’])? (?:father|mother|dad|daddy|mom|mama|other parent)\b`,
    // A parent taking or keeping a child is a custody matter, not a CPS removal.
    String.raw`${CHILD}.{0,25}\b(?:taken|kept|hidden|abducted|kidnapped)(?: away)? by (?:my |our |their |his |her |the )?(?:ex|father|mother|dad|mom|other parent)\b|child abduction`,
    String.raw`\b(?:ex|father|mother|dad|mom|other parent) (?:took|kept|hid|is keeping|won'?t return) (?:my |our |the )?${CHILD}`,
  ].join('|')), 'family'],
  [/criminal|arrest|sealing|seal (?:my |a |the )?(?:record|conviction|case)|expunge|record clear|clean (?:my |your )?record|clean slate|petition for dismissal|1203\.4|prop(?:osition)? 47|conviction|\bparole\b|\bprobation\b|\bdui\b|\bdwi\b|\bdrugs? (?:crimes?|charges?|possession|offen|traffick|sales?|dealing|arrest|court|case)|controlled substance|(?:petty|grand|felony|misdemeanor|retail) theft|theft (?:crimes?|charges?|case|arrest|offen|conviction)|charged with (?:\w+ )?theft|property crimes?|shoplift|assault|\bbattery (?:charges?|arrest|case|offen)|(?:domestic|sexual) battery|traffic (?:ticket|violation|citation|court|infraction|offen)|speeding|misdemeanor|felony|white collar/, 'criminal'],
  // Debt (a debt collector, wage garnishment for a debt) is a consumer matter, not a job one.
  [/\bdebts?\b|collection agenc/, 'civil'],
  [/employ|workplace|wage|worker|unemploy|workers.?comp|osha|labor|\bfired\b|laid off|\blayoff|(?:injur\w*|hurt|accident) (?:at|on the) (?:work|job)|(?:work|job) (?:injur|accident)/, 'workplace'],
  // New York Family Court covers anyone related by blood or marriage (Family Ct Act § 812(1)(a)).
  [new RegExp(harassedBy('aunt|uncle|cousin|niece|nephew')), 'family', 'NY'],
  // In New York a Family Court order of protection needs a family or intimate relationship
  // (Family Ct Act § 812) and the Civil tab has no harassment remedy, so these get the
  // generic next steps. A coworker falls through to Workplace.
  [new RegExp(`civil harassment|${harassedBy('neighbou?r|stranger')}`), null, 'NY'],
  [/human.?rights|civil.?rights|harass|disab|police (?:misconduct|brutality)|excessive force/, 'human-rights'],
  [/housing|evict|landlord|tenant|\brent(?:s|al|als|er|ers|ing|ed)?\b|small.?claims|consumer|debt|personal.?injury|\binjur(?:y|ies|ed)\b|defective|product liability|slip (?:and|&) fall|slip(?:ped|s)? (?:on|and fell)|trip (?:and|&) fall|insurance|neighbou?r|malpractice|contract dispute|breach of contract|agency|civil|bankrupt/, 'civil'],
];

// Categories users pick (case analyzer, funnels, legal-center tabs) map straight to a tab, so
// words in a case title ("custody" in "taken into custody") cannot override the choice.
const CATEGORY_TAB: Record<string, string | null> = {
  'criminal-defense': 'criminal', 'dui-dwi': 'criminal', 'drug-crimes': 'criminal', 'theft-crimes': 'criminal',
  'assault-battery': 'criminal', 'white-collar': 'criminal', 'traffic-violations': 'criminal', expungement: 'criminal', criminal: 'criminal',
  'domestic-violence': 'family', 'family-law': 'family', 'child-custody': 'family', 'child-support': 'family', family: 'family',
  divorce: 'divorce',
  'cps-child-welfare': 'cps', cps: 'cps',
  employment: 'workplace', 'wage-theft': 'workplace', 'workers-comp': 'workplace', 'workers-rights': 'workplace', workplace: 'workplace',
  discrimination: 'human-rights', 'human-rights': 'human-rights',
  immigration: 'immigration',
  'small-claims': 'civil', 'housing-tenant': 'civil', 'eviction-defense': 'civil', housing: 'civil', 'contract-dispute': 'civil',
  'consumer-protection': 'civil', 'debt-collection': 'civil', 'personal-injury': 'civil', 'medical-malpractice': 'civil',
  bankruptcy: 'civil', 'agency-complaints': 'civil', civil: 'civil',
  'social-security': null, 'veterans-benefits': null,
};

export function legalCenterArea(state: LaunchState, area?: string | null, detail?: string | null): string | null {
  if (!area && !detail) return null;
  const allowed: readonly string[] = state === 'NY' ? NY_AREAS : CA_AREAS;
  // The whole area is a category ("employment"), or it starts with a hyphenated category slug
  // ("criminal-defense Person taken into custody"). Plain text that merely starts with a
  // category word ("housing discrimination") is matched as text instead.
  const norm = (area ?? '').trim().toLowerCase();
  const [first, ...rest] = norm.split(/\s+/);
  const isCategory = norm in CATEGORY_TAB || (first.includes('-') && first in CATEGORY_TAB);
  if (isCategory) {
    const tab = CATEGORY_TAB[first];
    const text = [rest.join(' '), detail ?? ''].join(' ');
    // Within family, a divorce or separation story belongs on the Divorce tab.
    if (tab === 'family' && legalCenterArea(state, text) === 'divorce') return 'divorce';
    return tab && allowed.includes(tab) ? tab : null;
  }
  return matchText(state, [area ?? '', detail ?? ''].join(' '));
}

function matchText(state: LaunchState, area: string): string | null {
  if (!area.trim()) return null;
  const a = area.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
  const allowed: readonly string[] = state === 'NY' ? NY_AREAS : CA_AREAS;
  const rule = AREA_RULES.find(
    ([re, key, only]) => (!only || only === state) && (key === null || allowed.includes(key)) && re.test(a),
  );
  return rule?.[1] ?? null;
}

export interface StateRoute {
  state: LaunchState;
  stateName: string;
  centerPath: string;
  fillPath: string;
  areaKey: string | null;
}

export function stateRouteFor(state?: string | null, area?: string | null, detail?: string | null): StateRoute | null {
  const st = launchStateOf(state);
  if (!st) return null;
  const areaKey = legalCenterArea(st, area, detail);
  const base = st === 'CA' ? '/ca/legal-center' : '/ny/legal-center';
  return {
    state: st,
    stateName: st === 'CA' ? 'California' : 'New York',
    centerPath: areaKey ? `${base}?area=${areaKey}` : base,
    fillPath: st === 'CA' ? '/fill/ca' : '/fill/ny',
    areaKey,
  };
}
