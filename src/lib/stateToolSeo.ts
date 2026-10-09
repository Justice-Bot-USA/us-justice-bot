import { states, stateAbbreviations } from './states';

export type StateToolType = 'warrant-lookup' | 'court-forms' | 'arrest-records';

interface StateToolMatch {
  stateName: string;
  stateCode: string;
  toolType: StateToolType;
}

const STATE_SLUG_MAP: Record<string, string> = {};
states.forEach(s => {
  const slug = s.toLowerCase().replace(/\s+/g, '-');
  STATE_SLUG_MAP[slug] = s;
});

const TOOL_SUFFIXES: Record<string, StateToolType> = {
  'warrant-lookup': 'warrant-lookup',
  'court-forms': 'court-forms',
  'arrest-records': 'arrest-records',
};

// Tier 1 states — highest conversion ROI
export const TIER1_STATES = ['Florida', 'Texas', 'California', 'New York', 'Arizona'];
export const TIER2_STATES = ['Georgia', 'Ohio', 'Pennsylvania', 'Illinois', 'North Carolina'];
export const TIER3_STATES = ['New Jersey', 'Washington', 'Colorado', 'Michigan', 'Virginia'];

export function parseStateToolSlug(slug: string): StateToolMatch | null {
  for (const [suffix, toolType] of Object.entries(TOOL_SUFFIXES)) {
    if (slug.endsWith(`-${suffix}`)) {
      const stateSlug = slug.slice(0, -(suffix.length + 1));
      const stateName = STATE_SLUG_MAP[stateSlug];
      if (stateName) {
        return { stateName, stateCode: stateAbbreviations[stateName], toolType };
      }
    }
  }
  return null;
}

export function getStateToolSeo(match: StateToolMatch) {
  const { stateName, stateCode, toolType } = match;
  const slug = stateName.toLowerCase().replace(/\s+/g, '-');

  if (toolType === 'arrest-records') {
    return {
      title: `How to Request Arrest Records in ${stateName} | Justice Bot USA`,
      description: `Request arrest reports, warrant returns, booking records, and court documents in ${stateName} (${stateCode}). Write a public records request letter that cites ${stateName}'s public records law.`,
      h1: `How to Request Arrest Records in ${stateName}`,
      keywords: [
        `${stateName} arrest records request`,
        `${stateName} public records request`,
        `${stateCode} FOIA request`,
        `request arrest report ${stateName}`,
        `${stateName} warrant return records`,
        `${stateName} booking records`,
      ],
      canonical: `https://justicebot-usa.com/${slug}-arrest-records`,
      toolPath: '/public-records-request',
      faqItems: [
        {
          q: `What arrest-related records can I request in ${stateName}?`,
          a: `Under ${stateName} public records law, you may be able to request arrest reports, warrant return records, booking/jail intake records, incident reports, court administrative records, and probable cause affidavits (if unsealed). Some records may be sealed or partially redacted.`,
        },
        {
          q: `Who holds arrest records in ${stateName}?`,
          a: `Arrest records in ${stateName} are typically maintained by local police departments, county sheriff's offices, county jails, and court clerks. Choosing the correct agency is important for a successful request.`,
        },
        {
          q: `How do I request arrest records in ${stateName}?`,
          a: `Submit a written public records request to the appropriate agency. Identify the correct agency, submit your request citing ${stateName}'s public records statute, wait for a response, and review or appeal if denied. Our tool generates a properly worded request letter for you.`,
        },
        {
          q: `Does this check for active warrants in ${stateName}?`,
          a: `No. This tool helps you request public records after the fact. It does not check for active warrants, access law enforcement databases, or determine warrant status. If you believe you have an active warrant, consult an attorney.`,
        },
        {
          q: `How much does it cost to request arrest records in ${stateName}?`,
          a: `Agencies may charge fees set by state law, usually for copies (in California, generally only the direct cost of duplication). Writing the letter with our tool is free with an account; the PDF download is included in the $25/month plan.`,
        },
      ],
    };
  }

  // court-forms
  return {
    title: `${stateName} Court Forms — Free Download | Justice Bot USA`,
    description: `Browse and download official ${stateName} court forms for family, small claims, housing, employment, and more. Free access to ${stateCode} legal documents powered by Justice Bot USA.`,
    h1: `${stateName} Court Forms`,
    keywords: [
      `${stateName} court forms`,
      `${stateCode} court forms free download`,
      `${stateName} legal forms`,
      `${stateName} small claims forms`,
      `${stateName} family court forms`,
    ],
    canonical: `https://justicebot-usa.com/${slug}-court-forms`,
    toolPath: '/usa-forms',
    faqItems: [
      {
        q: `Where can I find official ${stateName} court forms?`,
        a: `Our forms library includes official ${stateName} court documents sourced from state judiciary websites. You can also visit the ${stateName} Courts website directly for the most current versions.`,
      },
      {
        q: `Are ${stateName} court forms free?`,
        a: `Most official ${stateName} court forms are free to download. Our platform provides convenient access to these forms organized by legal area. Some courts may charge filing fees when you submit the forms.`,
      },
      {
        q: `Do I need a lawyer to fill out ${stateName} court forms?`,
        a: `Many ${stateName} residents file court forms without an attorney (pro se). Our platform provides guidance to help you complete forms correctly. For complex cases, consider consulting a licensed ${stateName} attorney.`,
      },
    ],
  };
}

/** Generate all state-tool slugs for sitemap */
export function getAllStateToolSlugs(): string[] {
  const slugs: string[] = [];
  for (const state of states) {
    if (state === 'District of Columbia') continue;
    const slug = state.toLowerCase().replace(/\s+/g, '-');
    slugs.push(`${slug}-court-forms`);
    slugs.push(`${slug}-arrest-records`);
  }
  return slugs;
}
