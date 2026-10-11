import { Navigate } from "react-router-dom";

// The in-app CourtListener search was retired (Oct 2026). Old links go to the
// court records page, which links to official California and New York court sites.
export default function CourtListenerSearch() {
  return <Navigate to="/court-records" replace />;
}
