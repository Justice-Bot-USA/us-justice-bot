import { Helmet } from "react-helmet-async";
import { PLAN } from "@/lib/pricing";

// Structured data for search engines. Keep it to what is true today: legal information and
// official court forms for California and New York, one plan. We are not a law firm, so this
// is an Organization, not a LegalService.
const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Justice Bot USA",
    legalName: "Justice Bot Technologies Inc.",
    description:
      "Legal information and official California and New York court forms, filled in from your own answers. Not a law firm and not legal advice.",
    url: "https://justicebot-usa.com",
    logo: "https://justicebot-usa.com/icon-512.png",
    areaServed: [
      { "@type": "State", name: "California" },
      { "@type": "State", name: "New York" },
    ],
    makesOffer: {
      "@type": "Offer",
      name: PLAN.name,
      description: "Official court forms and filing guides. Court and agency fees are separate.",
      price: String(PLAN.price),
      priceCurrency: "USD",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
