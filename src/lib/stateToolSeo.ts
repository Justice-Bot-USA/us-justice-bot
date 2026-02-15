import { states, stateAbbreviations } from './states';

export type StateToolType = 'warrant-lookup' | 'court-forms';

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
};

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

  if (toolType === 'warrant-lookup') {
    return {
      title: `${stateName} Warrant Lookup — Free Search | Veritas Path`,
      description: `Search for active warrants in ${stateName} (${stateCode}). Free public records lookup with links to official ${stateName} court portals. Powered by Veritas Path.`,
      h1: `${stateName} Warrant Lookup`,
      keywords: [
        `${stateName} warrant lookup`,
        `${stateName} active warrants`,
        `${stateCode} outstanding warrant search`,
        `${stateName} warrant search free`,
        `check warrants ${stateName}`,
      ],
      canonical: `https://justicebot-usa.com/${slug}-warrant-lookup`,
      toolPath: '/warrant-lookup',
      faqItems: [
        {
          q: `How do I check for warrants in ${stateName}?`,
          a: `Use our free warrant lookup tool above to search ${stateName} public records. You can also visit official ${stateName} court portals linked in the results. Contact your local ${stateName} courthouse clerk for the most up-to-date information.`,
        },
        {
          q: `Are ${stateName} warrant records public?`,
          a: `Yes, most warrant records in ${stateName} are public information. However, sealed warrants or certain juvenile records may not appear in public searches. Official court or law enforcement databases have the most complete records.`,
        },
        {
          q: `What should I do if I have a warrant in ${stateName}?`,
          a: `If you discover you have an active warrant in ${stateName}, consult a licensed attorney immediately. You may be able to arrange a voluntary surrender or have the warrant recalled through proper legal channels.`,
        },
      ],
    };
  }

  // court-forms
  return {
    title: `${stateName} Court Forms — Free Download | Veritas Path`,
    description: `Browse and download official ${stateName} court forms for family, small claims, housing, employment, and more. Free access to ${stateCode} legal documents powered by Veritas Path.`,
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
    if (state === 'District of Columbia') continue; // skip DC for cleaner URLs
    const slug = state.toLowerCase().replace(/\s+/g, '-');
    slugs.push(`${slug}-warrant-lookup`);
    slugs.push(`${slug}-court-forms`);
  }
  return slugs;
}
