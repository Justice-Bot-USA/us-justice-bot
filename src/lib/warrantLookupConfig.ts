export interface WarrantStateConfig {
  stateCode: string;
  stateName: string;
  sheriffDirectory: string;
  sheriffLabel: string;
  courtSearchInfo: string;
  courtSearchLabel: string;
  notes?: string[];
}

export const warrantLookupConfig: Record<string, WarrantStateConfig> = {
  alabama: { stateCode: "AL", stateName: "Alabama", sheriffDirectory: "https://www.alabamasheriffs.com/", sheriffLabel: "Alabama Sheriffs' Association", courtSearchInfo: "https://pa.alacourt.com/", courtSearchLabel: "Alacourt Public Access" },
  alaska: { stateCode: "AK", stateName: "Alaska", sheriffDirectory: "https://dps.alaska.gov/AST/prior/prior-home", sheriffLabel: "Alaska State Troopers", courtSearchInfo: "https://records.courts.alaska.gov/eaccess/", courtSearchLabel: "Alaska Court Records", notes: ["Alaska uses state troopers, not county sheriffs."] },
  arizona: { stateCode: "AZ", stateName: "Arizona", sheriffDirectory: "https://www.azsheriffs.org/", sheriffLabel: "Arizona Sheriffs' Association", courtSearchInfo: "https://www.azcourts.gov/AZCourts/PublicAccess", courtSearchLabel: "AZ Courts Public Access" },
  arkansas: { stateCode: "AR", stateName: "Arkansas", sheriffDirectory: "https://www.arkansassheriffsassociation.com/", sheriffLabel: "Arkansas Sheriffs' Association", courtSearchInfo: "https://caseinfo.arcourts.gov/cconnect/", courtSearchLabel: "Arkansas CourtConnect" },
  california: { stateCode: "CA", stateName: "California", sheriffDirectory: "https://www.calsheriffs.org/sheriffs-directory", sheriffLabel: "California Sheriffs' Association Directory", courtSearchInfo: "https://www.courts.ca.gov/find-my-court.htm", courtSearchLabel: "Find My Court (CA Courts)" },
  colorado: { stateCode: "CO", stateName: "Colorado", sheriffDirectory: "https://www.csacolorado.net/", sheriffLabel: "Colorado Sheriffs' Association", courtSearchInfo: "https://www.courts.state.co.us/dockets/", courtSearchLabel: "Colorado Court Dockets" },
  connecticut: { stateCode: "CT", stateName: "Connecticut", sheriffDirectory: "https://portal.ct.gov/DESPP/Division-of-State-Police", sheriffLabel: "CT State Police", courtSearchInfo: "https://jud.ct.gov/jud2.htm", courtSearchLabel: "CT Judicial Branch Case Look-up", notes: ["Connecticut does not have county sheriffs. Law enforcement is handled by state and local police."] },
  delaware: { stateCode: "DE", stateName: "Delaware", sheriffDirectory: "https://courts.delaware.gov/", sheriffLabel: "Delaware Courts (Sheriff Info)", courtSearchInfo: "https://courts.delaware.gov/", courtSearchLabel: "Delaware Courts" },
  florida: { stateCode: "FL", stateName: "Florida", sheriffDirectory: "https://www.flsheriffs.org/sheriffs-offices", sheriffLabel: "Florida Sheriffs' Association", courtSearchInfo: "https://www.flcourts.gov/", courtSearchLabel: "Florida Courts" },
  georgia: { stateCode: "GA", stateName: "Georgia", sheriffDirectory: "https://www.georgiasheriffs.org/", sheriffLabel: "Georgia Sheriffs' Association", courtSearchInfo: "https://ody.dekalbcountyga.gov/portal/Home/Dashboard/29", courtSearchLabel: "GA Court Case Search" },
  hawaii: { stateCode: "HI", stateName: "Hawaii", sheriffDirectory: "https://dps.hawaii.gov/", sheriffLabel: "Hawaii Dept. of Public Safety", courtSearchInfo: "https://www.courts.state.hi.us/", courtSearchLabel: "Hawaii State Judiciary", notes: ["Hawaii uses a state sheriff division, not county sheriffs."] },
  idaho: { stateCode: "ID", stateName: "Idaho", sheriffDirectory: "https://www.idahosheriffs.org/", sheriffLabel: "Idaho Sheriffs' Association", courtSearchInfo: "https://mycourts.idaho.gov/", courtSearchLabel: "Idaho Court Portal" },
  illinois: { stateCode: "IL", stateName: "Illinois", sheriffDirectory: "https://www.ilsheriff.org/", sheriffLabel: "Illinois Sheriffs' Association", courtSearchInfo: "https://www.illinoiscourts.gov/", courtSearchLabel: "Illinois Courts" },
  indiana: { stateCode: "IN", stateName: "Indiana", sheriffDirectory: "https://www.indianasheriffs.org/", sheriffLabel: "Indiana Sheriffs' Association", courtSearchInfo: "https://public.courts.in.gov/mycase", courtSearchLabel: "Indiana MyCase" },
  iowa: { stateCode: "IA", stateName: "Iowa", sheriffDirectory: "https://www.iowasheriffs.com/", sheriffLabel: "Iowa State Sheriffs' Association", courtSearchInfo: "https://www.iowacourts.gov/for-the-public/court-case-information", courtSearchLabel: "Iowa Courts Case Search" },
  kansas: { stateCode: "KS", stateName: "Kansas", sheriffDirectory: "https://www.kansassheriffs.org/", sheriffLabel: "Kansas Sheriffs' Association", courtSearchInfo: "https://www.kscourts.org/", courtSearchLabel: "Kansas Courts" },
  kentucky: { stateCode: "KY", stateName: "Kentucky", sheriffDirectory: "https://www.kysheriffs.org/", sheriffLabel: "Kentucky Sheriffs' Association", courtSearchInfo: "https://kcoj.kycourts.net/", courtSearchLabel: "Kentucky Court of Justice" },
  louisiana: { stateCode: "LA", stateName: "Louisiana", sheriffDirectory: "https://www.lsa.org/", sheriffLabel: "Louisiana Sheriffs' Association", courtSearchInfo: "https://www.lasc.org/", courtSearchLabel: "Louisiana Supreme Court" },
  maine: { stateCode: "ME", stateName: "Maine", sheriffDirectory: "https://www.mainecountysheriffs.org/", sheriffLabel: "Maine Sheriffs' Association", courtSearchInfo: "https://www.courts.maine.gov/", courtSearchLabel: "Maine Courts" },
  maryland: { stateCode: "MD", stateName: "Maryland", sheriffDirectory: "https://www.mdsheriffs.com/", sheriffLabel: "Maryland Sheriffs' Association", courtSearchInfo: "https://casesearch.courts.state.md.us/casesearch/", courtSearchLabel: "Maryland Case Search" },
  massachusetts: { stateCode: "MA", stateName: "Massachusetts", sheriffDirectory: "https://www.mass.gov/orgs/massachusetts-sheriffs-association", sheriffLabel: "MA Sheriffs' Association", courtSearchInfo: "https://www.mass.gov/orgs/trial-court", courtSearchLabel: "Massachusetts Trial Court" },
  michigan: { stateCode: "MI", stateName: "Michigan", sheriffDirectory: "https://www.misheriff.org/", sheriffLabel: "Michigan Sheriffs' Association", courtSearchInfo: "https://micourt.courts.michigan.gov/case-search/", courtSearchLabel: "Michigan Court Case Search" },
  minnesota: { stateCode: "MN", stateName: "Minnesota", sheriffDirectory: "https://www.mnsheriffs.org/", sheriffLabel: "Minnesota Sheriffs' Association", courtSearchInfo: "https://pa.courts.state.mn.us/", courtSearchLabel: "Minnesota Court Records" },
  mississippi: { stateCode: "MS", stateName: "Mississippi", sheriffDirectory: "https://www.mssheriffs.com/", sheriffLabel: "Mississippi Sheriffs' Association", courtSearchInfo: "https://courts.ms.gov/", courtSearchLabel: "Mississippi Courts" },
  missouri: { stateCode: "MO", stateName: "Missouri", sheriffDirectory: "https://www.mosheriffs.com/", sheriffLabel: "Missouri Sheriffs' Association", courtSearchInfo: "https://www.courts.mo.gov/cnet/", courtSearchLabel: "Missouri Case.net" },
  montana: { stateCode: "MT", stateName: "Montana", sheriffDirectory: "https://www.montanasheriffs.org/", sheriffLabel: "Montana Sheriffs & Peace Officers Association", courtSearchInfo: "https://courts.mt.gov/", courtSearchLabel: "Montana Courts" },
  nebraska: { stateCode: "NE", stateName: "Nebraska", sheriffDirectory: "https://www.nesheriffsassoc.org/", sheriffLabel: "Nebraska Sheriffs' Association", courtSearchInfo: "https://www.nebraska.gov/courts/", courtSearchLabel: "Nebraska Court Case Search" },
  nevada: { stateCode: "NV", stateName: "Nevada", sheriffDirectory: "https://www.nvsa.us/", sheriffLabel: "Nevada Sheriffs' and Chiefs' Association", courtSearchInfo: "https://nvcourts.gov/", courtSearchLabel: "Nevada Courts" },
  "new-hampshire": { stateCode: "NH", stateName: "New Hampshire", sheriffDirectory: "https://www.courts.nh.gov/", sheriffLabel: "NH Courts (Sheriff Info)", courtSearchInfo: "https://www.courts.nh.gov/", courtSearchLabel: "New Hampshire Courts" },
  "new-jersey": { stateCode: "NJ", stateName: "New Jersey", sheriffDirectory: "https://www.njsheriffs.org/", sheriffLabel: "NJ Sheriffs' Association", courtSearchInfo: "https://portal.njcourts.gov/", courtSearchLabel: "NJ Courts Online" },
  "new-mexico": { stateCode: "NM", stateName: "New Mexico", sheriffDirectory: "https://www.nmsheriffs.org/", sheriffLabel: "New Mexico Sheriffs' Association", courtSearchInfo: "https://caselookup.nmcourts.gov/caselookup/", courtSearchLabel: "NM Case Lookup" },
  "new-york": { stateCode: "NY", stateName: "New York", sheriffDirectory: "https://www.nysheriffs.org/", sheriffLabel: "NY Sheriffs' Association", courtSearchInfo: "https://iapps.courts.state.ny.us/webcivil/ecourtsMain", courtSearchLabel: "NY eCourts" },
  "north-carolina": { stateCode: "NC", stateName: "North Carolina", sheriffDirectory: "https://ncsheriffs.org/", sheriffLabel: "NC Sheriffs' Association", courtSearchInfo: "https://www.nccourts.gov/court-dates", courtSearchLabel: "NC Courts Date Search" },
  "north-dakota": { stateCode: "ND", stateName: "North Dakota", sheriffDirectory: "https://www.ndsheriffs.org/", sheriffLabel: "ND Sheriffs' Association", courtSearchInfo: "https://www.ndcourts.gov/", courtSearchLabel: "North Dakota Courts" },
  ohio: { stateCode: "OH", stateName: "Ohio", sheriffDirectory: "https://www.ohiosheriffs.org/", sheriffLabel: "Ohio Sheriffs' Association", courtSearchInfo: "https://www.supremecourt.ohio.gov/", courtSearchLabel: "Ohio Court Records" },
  oklahoma: { stateCode: "OK", stateName: "Oklahoma", sheriffDirectory: "https://www.ok.gov/sheriff/", sheriffLabel: "Oklahoma Sheriffs", courtSearchInfo: "https://www.oscn.net/", courtSearchLabel: "Oklahoma State Courts Network (OSCN)" },
  oregon: { stateCode: "OR", stateName: "Oregon", sheriffDirectory: "https://www.oregonsheriffs.org/", sheriffLabel: "Oregon State Sheriffs' Association", courtSearchInfo: "https://www.courts.oregon.gov/", courtSearchLabel: "Oregon Courts" },
  pennsylvania: { stateCode: "PA", stateName: "Pennsylvania", sheriffDirectory: "https://www.pasheriffs.org/", sheriffLabel: "PA Sheriffs' Association", courtSearchInfo: "https://ujsportal.pacourts.us/", courtSearchLabel: "PA Unified Judicial System Portal" },
  "rhode-island": { stateCode: "RI", stateName: "Rhode Island", sheriffDirectory: "https://www.courts.ri.gov/", sheriffLabel: "RI Courts (Sheriff Info)", courtSearchInfo: "https://www.courts.ri.gov/", courtSearchLabel: "Rhode Island Courts" },
  "south-carolina": { stateCode: "SC", stateName: "South Carolina", sheriffDirectory: "https://www.sheriffsc.org/", sheriffLabel: "SC Sheriffs' Association", courtSearchInfo: "https://www.sccourts.org/caseSearch/", courtSearchLabel: "SC Court Case Search" },
  "south-dakota": { stateCode: "SD", stateName: "South Dakota", sheriffDirectory: "https://www.sdsheriffs.org/", sheriffLabel: "SD Sheriffs' Association", courtSearchInfo: "https://ujs.sd.gov/", courtSearchLabel: "South Dakota Courts" },
  tennessee: { stateCode: "TN", stateName: "Tennessee", sheriffDirectory: "https://www.tnsheriffs.com/", sheriffLabel: "Tennessee Sheriffs' Association", courtSearchInfo: "https://www.tncourts.gov/", courtSearchLabel: "Tennessee Courts" },
  texas: { stateCode: "TX", stateName: "Texas", sheriffDirectory: "https://www.txsheriffs.org/", sheriffLabel: "Texas Sheriffs' Association", courtSearchInfo: "https://www.txcourts.gov/", courtSearchLabel: "Texas Courts" },
  utah: { stateCode: "UT", stateName: "Utah", sheriffDirectory: "https://www.utahsheriffs.org/", sheriffLabel: "Utah Sheriffs' Association", courtSearchInfo: "https://www.utcourts.gov/", courtSearchLabel: "Utah Courts" },
  vermont: { stateCode: "VT", stateName: "Vermont", sheriffDirectory: "https://vtsheriffs.com/", sheriffLabel: "Vermont Sheriffs' Association", courtSearchInfo: "https://www.vermontjudiciary.org/", courtSearchLabel: "Vermont Judiciary" },
  virginia: { stateCode: "VA", stateName: "Virginia", sheriffDirectory: "https://vasheriff.org/", sheriffLabel: "Virginia Sheriffs' Association", courtSearchInfo: "https://www.vacourts.gov/", courtSearchLabel: "Virginia Courts" },
  washington: { stateCode: "WA", stateName: "Washington", sheriffDirectory: "https://www.washeriffs.org/", sheriffLabel: "Washington State Sheriffs' Association", courtSearchInfo: "https://www.courts.wa.gov/", courtSearchLabel: "Washington Courts" },
  "west-virginia": { stateCode: "WV", stateName: "West Virginia", sheriffDirectory: "https://www.wvsheriffs.org/", sheriffLabel: "WV Sheriffs' Association", courtSearchInfo: "https://www.courtswv.gov/", courtSearchLabel: "West Virginia Courts" },
  wisconsin: { stateCode: "WI", stateName: "Wisconsin", sheriffDirectory: "https://www.wsa.net/", sheriffLabel: "Wisconsin Sheriffs' Association", courtSearchInfo: "https://wcca.wicourts.gov/", courtSearchLabel: "WI Circuit Court Access (CCAP)" },
  wyoming: { stateCode: "WY", stateName: "Wyoming", sheriffDirectory: "https://www.wysheriff.org/", sheriffLabel: "Wyoming Sheriffs' Association", courtSearchInfo: "https://www.courts.state.wy.us/", courtSearchLabel: "Wyoming Courts" },
};

/** Convert state name to URL slug */
export function stateToSlug(stateName: string): string {
  return stateName.toLowerCase().replace(/\s+/g, '-');
}

/** Look up config by stateCode (e.g. "CA") */
export function getConfigByCode(code: string): WarrantStateConfig | undefined {
  return Object.values(warrantLookupConfig).find(c => c.stateCode === code);
}
