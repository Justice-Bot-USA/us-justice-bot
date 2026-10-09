import { states, stateAbbreviations } from './states';
import { launchStateOf } from './stateRouting';
import { PLAN } from './pricing';

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
  // Only California and New York are live. Other states get honest "coming soon" copy:
  // no forms library, no paid plan, no request-letter tool.
  const launch = launchStateOf(stateCode);
  const launched = launch !== null;

  if (toolType === 'arrest-records') {
    return {
      launched,
      title: `How to Request Arrest Records in ${stateName} | Justice Bot USA`,
      description: launched
        ? `Request arrest reports, warrant returns, booking records, and court documents in ${stateName} (${stateCode}). Write a public records request letter that cites ${stateName}'s public records law.`
        : `General information on requesting arrest reports, booking records, and court documents in ${stateName}. Justice Bot USA is live in California and New York; ${stateName} is coming soon.`,
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
      toolPath: launched ? '/public-records-request' : null,
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
          a: launched
            ? `Submit a written public records request to the appropriate agency. Identify the correct agency, submit your request citing ${stateName}'s public records statute, wait for a response, and review or appeal if denied. Our tool generates a properly worded request letter for you.`
            : `Submit a written public records request to the agency that holds the records. Identify the records clearly, wait for the agency's response, and ask how to appeal if the request is denied.`,
        },
        {
          q: `Does Justice Bot USA check for active warrants in ${stateName}?`,
          a: `No. We do not check for active warrants, access law enforcement databases, or determine warrant status. If you believe you have an active warrant, consult an attorney.`,
        },
        {
          q: `How much does it cost to request arrest records in ${stateName}?`,
          a: launched
            ? `Agencies may charge fees set by state law, usually for copies (in California, generally only the direct cost of duplication). Writing the letter with our tool is free with an account; the PDF download is included in the ${PLAN.priceLabel} plan.`
            : `Agencies may charge fees set by ${stateName} law, usually for copies. Ask the agency about its fees before you send your request.`,
        },
      ],
    };
  }

  // court-forms
  if (!launched) {
    return {
      launched,
      title: `${stateName} Court Forms: Coming Soon | Justice Bot USA`,
      description: `Where to find official ${stateName} court forms. Justice Bot USA's form filling is live in California and New York; ${stateName} is coming soon.`,
      h1: `${stateName} Court Forms`,
      keywords: [
        `${stateName} court forms`,
        `${stateName} legal forms`,
        `${stateName} small claims forms`,
        `${stateName} family court forms`,
      ],
      canonical: `https://justicebot-usa.com/${slug}-court-forms`,
      toolPath: null,
      faqItems: [
        {
          q: `Where can I find official ${stateName} court forms?`,
          a: `On the ${stateName} court system's website, or from the clerk of the court where your case is filed. Justice Bot USA does not have ${stateName} forms yet; ${stateName} is coming soon.`,
        },
        {
          q: `Do I have to pay court fees in ${stateName}?`,
          a: `Courts charge their own filing fees. If you can't afford them, ask the court clerk whether you can apply for a fee waiver.`,
        },
        {
          q: `Do I need a lawyer to fill out ${stateName} court forms?`,
          a: `Not always. Many people file court forms without a lawyer. The court's self-help center or a local legal aid office is a good place to start, and for complex cases consider consulting a licensed ${stateName} attorney.`,
        },
      ],
    };
  }

  const isCA = launch === 'CA';
  return {
    launched,
    title: `${stateName} Court Forms | Justice Bot USA`,
    description: `Find official ${stateName} court forms for family, small claims, housing, and more, with filling instructions. Forms and filling instructions are included in the ${PLAN.priceLabel} plan; fee waiver forms are free.`,
    h1: `${stateName} Court Forms`,
    keywords: [
      `${stateName} court forms`,
      `${stateName} legal forms`,
      `${stateName} small claims forms`,
      `${stateName} family court forms`,
    ],
    canonical: `https://justicebot-usa.com/${slug}-court-forms`,
    toolPath: isCA ? '/fill/ca' : '/fill/ny',
    faqItems: [
      {
        q: `Where can I find official ${stateName} court forms?`,
        a: isCA
          ? 'Official California court forms are published by the Judicial Council of California on the California Courts website. Our California legal center links to the official versions and explains each one.'
          : 'Official New York court forms are published by the New York State Unified Court System. Our New York legal center links to the official versions and explains each one.',
      },
      {
        q: `Are ${stateName} court forms free?`,
        a: `The official forms are free to download from the court's website. Courts charge their own filing fees, and you can ask for a fee waiver if you can't afford them. On Justice Bot USA, fee waiver forms are free; other forms and filling instructions are included in the ${PLAN.priceLabel} plan.`,
      },
      {
        q: `Do I need a lawyer to fill out ${stateName} court forms?`,
        a: `No. Many people in ${stateName} file court forms without a lawyer. Our filling instructions are legal information, not legal advice; you check, sign and file the forms yourself. For complex cases, consider consulting a licensed ${stateName} attorney.`,
      },
    ],
  };
}

/** Generate state-tool slugs for the sitemap: launched states only (California and New York). */
export function getAllStateToolSlugs(): string[] {
  const slugs: string[] = [];
  for (const state of states) {
    if (!launchStateOf(stateAbbreviations[state])) continue;
    const slug = state.toLowerCase().replace(/\s+/g, '-');
    slugs.push(`${slug}-court-forms`);
    slugs.push(`${slug}-arrest-records`);
  }
  return slugs;
}
