// Shared prompts for sweep edge functions

export const SWEEP_SYSTEM_PROMPT = `You organize what a person in the United States has told us about their legal situation, and give general, plain-language legal information. You are not a lawyer and you do not give legal advice.

Never give a score, rating, probability, chance of success or likely outcome; never estimate money (settlement, damages, fees, costs) or how long anything will take; never suggest a strategy, claim, defense or argument; never choose, recommend or order court forms for the person.

CRITICAL: Always respond with valid JSON only. No markdown, no explanation outside the JSON structure.`;

// Shared list of things no sweep may produce (founder decision, Oct 2026).
const NO_ADVICE_RULES = `YOU MUST NOT:
- Give any score, rating, grade, percentage, probability, chance of success, likely outcome, or say whether the person has a good or strong case.
- Estimate any amount of money (settlement, damages, award, fees, costs) or how long anything will take.
- Suggest a strategy, argument, claim, defense, motion, remedy to seek, or what the person should do in their case.
- Choose, recommend, list as required, or put in order any court forms for this person.
- Apply case law or statutes to these facts.`;

export function getIntakePrompt(userStory: string, documentTexts: string[]): string {
  const docsContext = documentTexts.length > 0 
    ? `\n\nUPLOADED DOCUMENTS TEXT:\n${documentTexts.join('\n---\n')}`
    : '';
    
  return `Analyze this legal intake and normalize the information.

USER'S STORY:
${userStory}
${docsContext}

Extract and return JSON with this exact structure:
{
  "issueSummary": "1-3 sentence summary of the core legal issue",
  "keyDates": [{"date": "YYYY-MM-DD or descriptive", "description": "what happened", "source": "user_statement" or "document"}],
  "parties": [{"role": "plaintiff/defendant/petitioner/etc", "name": "name or description", "relationship": "optional relationship"}],
  "locationHints": {"country": "US assumed", "state": "if mentioned", "county": "if mentioned", "city": "if mentioned"},
  "urgentFlags": [{"type": "deadline|eviction|protection_order|court_date|arrest|custody", "description": "why urgent", "date": "if known", "severity": "critical|high|medium"}],
  "confidence": 0.0-1.0
}`;
}

export function getEvidenceIndexPrompt(documents: Array<{id: string, filename: string, fileType: string, text?: string}>): string {
  const docsText = documents.map(d => 
    `[Document: ${d.filename} (${d.fileType}), ID: ${d.id}]\n${d.text || 'No text extracted'}`
  ).join('\n\n---\n\n');

  return `List these uploaded documents and the facts each one contains.

DOCUMENTS:
${docsText}

For each document, return JSON with this structure:
{
  "items": [
    {
      "docId": "document ID",
      "filename": "filename",
      "fileType": "file type",
      "docType": "notice|email|lease|order|police_report|contract|receipt|photo|text_message|letter|medical_record|financial|other",
      "extractedText": "key excerpts from document",
      "entities": [{"type": "name|address|case_number|date|amount|phone|email", "value": "extracted value", "context": "surrounding context"}],
      "keyDates": [{"date": "YYYY-MM-DD", "description": "what the date represents"}],
      "credibility": {"isOfficial": boolean, "isSigned": boolean, "isScreenshot": boolean, "hasNotarization": boolean}
    }
  ],
  "totalDocuments": number
}

Describe only what is in each document. Do not rate documents, rank them, or say what other evidence the person should get.`;
}

export function getClassificationPrompt(intake: string, evidenceText: string): string {
  return `Based on this intake and evidence, classify the legal issue.

INTAKE DATA:
${intake}

EVIDENCE SUMMARY:
${evidenceText}

Return JSON with this structure:
{
  "primaryCategory": "housing|family|consumer|employment|civil_rights|immigration|criminal|small_claims|personal_injury|bankruptcy|other",
  "subIssues": ["specific sub-issues like 'wrongful eviction', 'custody modification', etc"],
  "forumType": "state_court|federal_court|tribunal|small_claims|housing_court|family_court|administrative|arbitration",
  "courtLevel": "specific court level name",
  "confidence": 0.0-1.0,
  "reasoning": "why this classification was chosen",
  "alternativeClassifications": [{"category": "alternative", "confidence": 0.0-1.0, "reason": "why this could also apply"}]
}`;
}

export function getVenuePrompt(intake: string, classification: string, state: string, county?: string): string {
  return `Give general information about which courts usually hear this kind of matter in ${state}.

INTAKE:
${intake}

CLASSIFICATION:
${classification}

KNOWN LOCATION: ${state}${county ? `, ${county} County` : ''}

Return JSON with this structure:
{
  "jurisdiction": {"country": "US", "state": "${state}", "county": "${county || 'to be determined'}", "city": "if relevant"},
  "venueType": "the kind of court that usually hears this kind of matter (general information)",
  "courtName": "",
  "courtAddress": "",
  "courtWebsite": "official ${state} court self-help website URL",
  "eFilingUrl": "",
  "localRulesUrl": "",
  "status": "needs_verification",
  "notes": "general information; the person should confirm with the court clerk or self-help center which court applies to them"
}

Do not decide which court this person must file in. Leave a field empty rather than guess.`;
}

export function getTimelinePrompt(intake: string, evidenceIndex: string): string {
  return `Build a comprehensive timeline from the intake and evidence.

INTAKE:
${intake}

EVIDENCE INDEX:
${evidenceIndex}

Return JSON with this structure:
{
  "events": [
    {
      "date": "YYYY-MM-DD or approximate",
      "dateType": "exact|approximate|range",
      "endDate": "if range",
      "eventType": "notice_served|repair_request|payment|threat|inspection|hearing|filing|incident|communication|other",
      "description": "what happened",
      "source": {"type": "document|user_statement", "docId": "if from document", "quote": "relevant quote"},
      "importance": "critical|high|medium|low"
    }
  ],
  "upcomingDeadlines": [{"deadline": "YYYY-MM-DD", "description": "a date the person or one of their documents mentions", "source": "how we know"}]
}

Use only dates and events the person or their documents gave. Do not work out legal deadlines or limitation periods.`;
}

export function getAuthorityPrompt(classification: string, venue: string, timeline: string, state: string): string {
  return `List general ${state} legal sources for this area of law, as background reading. Do not apply them to the person's facts.

CLASSIFICATION:
${classification}

VENUE:
${venue}

TIMELINE SUMMARY:
${timeline}

Return JSON:
{
  "searchQueries": ["queries used to find relevant law"],
  "results": [
    {
      "id": "unique ID",
      "caseName": "real case name from ${state}",
      "citation": "proper Bluebook citation",
      "court": "${state} court name",
      "year": YYYY,
      "holdings": ["key holdings, stated generally"],
      "keyQuotes": ["relevant quotes"]
    }
  ],
  "statutes": [{"citation": "full citation", "title": "statute name", "relevance": "what the statute covers, in general terms", "fullText": "if brief"}],
  "regulations": [{"citation": "regulation cite", "agency": "agency name", "relevance": "what the regulation covers, in general terms"}],
  "notes": "general description of this area of ${state} law",
  "source": "live_search|cached_library|fallback"
}

Only include sources you are confident are real. Do not label any source favorable or unfavorable to the person.

${NO_ADVICE_RULES}`;
}

export function getAnalysisPrompt(caseProfile: string): string {
  return `Write a neutral, plain-language summary of this person's situation from the gathered data.

COMPLETE CASE PROFILE:
${caseProfile}

Return JSON:
{
  "summary": "2-4 short sentences, in the second person, restating only the facts the person and their documents gave. No judgment of those facts.",
  "legalArea": "the general area of law (a short label such as 'Housing / eviction' or 'Family law')",
  "generalInfo": ["3-6 short points of general information about how matters in this area usually work in the person's state, as a court self-help center would explain it to anyone. Include that free legal aid may be available and that the person can talk to a lawyer."],
  "officialSources": [{"name": "official court self-help page, state code site, state agency or recognized legal aid organization", "url": "https://..."}]
}

Only include a URL you are confident is correct.

${NO_ADVICE_RULES}`;
}

export interface PlainSummary {
  summary: string;
  legalArea: string;
  generalInfo: string[];
  officialSources: Array<{ name: string; url: string }>;
  analyzedAt: string;
}

/**
 * Keep only the plain-language fields of an analysis-sweep result. A score,
 * estimate, strategy or form list returned by the model is dropped here, so it
 * is never stored or sent to the browser.
 */
export function pickPlainSummary(raw: unknown): PlainSummary {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const sources = Array.isArray(r.officialSources) ? r.officialSources : [];
  return {
    summary: typeof r.summary === 'string' ? r.summary : '',
    legalArea: typeof r.legalArea === 'string' ? r.legalArea : '',
    generalInfo: Array.isArray(r.generalInfo)
      ? r.generalInfo.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
      : [],
    officialSources: sources
      .filter((src): src is { name: string; url: string } =>
        !!src && typeof src === 'object' &&
        typeof (src as { name?: unknown }).name === 'string' &&
        typeof (src as { url?: unknown }).url === 'string' &&
        /^https?:\/\//.test((src as { url: string }).url))
      .map((src) => ({ name: src.name, url: src.url })),
    analyzedAt: new Date().toISOString(),
  };
}
