import { Helmet } from "react-helmet-async";

// Structured data for search engines. Keep it to what is true today: legal information and
// official court forms for California and New York, free. We are not a law firm, so this
// is an Organization, not a LegalService.
const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Justice Bot USA",
    legalName: "Justice Bot Technologies Inc.",
    description:
      "Legal information and official California and New York court forms that you fill in with your own answers and file yourself. Not a law firm and not legal advice.",
    url: "https://justicebot-usa.com",
    logo: "https://justicebot-usa.com/icon-512.png",
    areaServed: [
      { "@type": "State", name: "California" },
      { "@type": "State", name: "New York" },
    ],
    makesOffer: {
      "@type": "Offer",
      name: "Court forms and form guides",
      description: "Official California and New York court forms, free to fill in and download, with form guides. Court and agency fees are separate.",
      price: "0",
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
