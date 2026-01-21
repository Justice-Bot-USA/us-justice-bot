// Shared prompts for sweep edge functions

export const SWEEP_SYSTEM_PROMPT = `You are an expert US legal analyst with comprehensive knowledge of all 50 state court systems, federal courts, criminal and civil procedure, and legal precedents. You provide structured, accurate legal analysis.

CRITICAL: Always respond with valid JSON only. No markdown, no explanation outside the JSON structure.`;

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

  return `Analyze these uploaded documents and create an evidence index.

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
      "credibility": {"isOfficial": boolean, "isSigned": boolean, "isScreenshot": boolean, "hasNotarization": boolean, "notes": "credibility assessment"},
      "relevanceScore": 0.0-1.0
    }
  ],
  "totalDocuments": number,
  "strongestEvidence": ["doc IDs of most important evidence"],
  "gapsIdentified": ["what evidence is missing that would strengthen the case"]
}`;
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
  return `Determine the correct venue for this case.

INTAKE:
${intake}

CLASSIFICATION:
${classification}

KNOWN LOCATION: ${state}${county ? `, ${county} County` : ''}

Return JSON with this structure:
{
  "jurisdiction": {"country": "US", "state": "${state}", "county": "${county || 'to be determined'}", "city": "if relevant"},
  "venueType": "specific venue type",
  "courtName": "full official court name",
  "courtAddress": "if known",
  "courtWebsite": "official court website URL",
  "eFilingUrl": "e-filing portal URL if available",
  "localRulesUrl": "local rules URL",
  "filingFees": {"amount": number, "description": "fee description", "waiverAvailable": boolean},
  "status": "confirmed|uncertain|needs_verification",
  "notes": "important venue-specific information"
}`;
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
      "importance": "critical|high|medium|low",
      "legalSignificance": "why this matters legally"
    }
  ],
  "statuteOfLimitationsDeadlines": [
    {"claimType": "type of claim", "deadline": "YYYY-MM-DD", "daysRemaining": number, "status": "expired|critical|approaching|safe"}
  ],
  "upcomingDeadlines": [{"deadline": "YYYY-MM-DD", "description": "what's due", "source": "how we know"}]
}`;
}

export function getAuthorityPrompt(classification: string, venue: string, timeline: string, state: string): string {
  return `Search for relevant legal authorities for this case in ${state}.

CLASSIFICATION:
${classification}

VENUE:
${venue}

TIMELINE SUMMARY:
${timeline}

Find and return relevant case law, statutes, and regulations. Return JSON:
{
  "searchQueries": ["queries used to find relevant law"],
  "results": [
    {
      "id": "unique ID",
      "caseName": "real case name from ${state}",
      "citation": "proper Bluebook citation",
      "court": "${state} court name",
      "year": YYYY,
      "relevanceScore": 0.0-1.0,
      "holdings": ["key holdings"],
      "outcome": "favorable|unfavorable|mixed|neutral",
      "remediesAwarded": ["if applicable"],
      "keyQuotes": ["relevant quotes"],
      "howItApplies": "how this precedent applies to current case"
    }
  ],
  "statutes": [{"citation": "full citation", "title": "statute name", "relevance": "how it applies", "fullText": "if brief"}],
  "regulations": [{"citation": "regulation cite", "agency": "agency name", "relevance": "how it applies"}],
  "favorablePrecedentCount": number,
  "unfavorablePrecedentCount": number,
  "notes": "overall assessment of legal landscape",
  "source": "live_search|cached_library|fallback"
}`;
}

export function getAnalysisPrompt(caseProfile: string): string {
  return `Generate the final comprehensive analysis report based on all gathered data.

COMPLETE CASE PROFILE:
${caseProfile}

Return the final analysis as JSON:
{
  "meritScore": 0-100,
  "meritScoreJustification": "detailed explanation referencing specific evidence and precedents",
  "estimatedSuccessRate": 0-100,
  "strongestClaims": [
    {
      "claim": "the claim",
      "evidenceReferences": ["doc IDs supporting this"],
      "legalBasis": "statutory/case law basis",
      "precedentSupport": ["case citations"],
      "strength": "strong|moderate|weak"
    }
  ],
  "weakestPoints": [
    {"issue": "the weakness", "impact": "how it hurts the case", "mitigation": "how to address", "missingProof": ["what's needed"]}
  ],
  "likelyRemedies": [
    {"remedy": "type of remedy", "likelihood": 0-100, "estimatedValue": number if applicable, "conditions": "if any"}
  ],
  "riskWarnings": [
    {"risk": "the risk", "severity": "critical|high|medium|low", "deadline": "if time-sensitive", "mitigation": "how to mitigate"}
  ],
  "nextSteps": [
    {"step": 1, "action": "what to do", "deadline": "if any", "priority": "immediate|soon|when_ready", "details": "more info"}
  ],
  "settlementRange": {"min": number, "max": number, "likely": number, "basis": "how calculated"},
  "timeToResolution": {"minMonths": number, "maxMonths": number, "factors": ["factors affecting timeline"]},
  "requiredForms": [
    {"formName": "form name", "formNumber": "form number", "purpose": "why needed", "filingOrder": number, "url": "where to get", "fee": number, "deadline": "if any"}
  ]
}`;
}
