import { Helmet } from "react-helmet-async";

const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Justice Bot USA",    description: "Justice Bot USA — AI-powered legal form assistance and civic guidance for all 50 US states. Information, not legal advice.",
    url: "https://justicebot-usa.com",
    logo: "https://justicebot-usa.com/icon-512.png",
    priceRange: "$4.99 - $79",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: [
      "Legal Form Assistance",
      "Court Document Preparation",
      "Legal Information Services",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Legal Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Monthly Subscription",
            description: "Unlimited access to all forms and AI tools",
          },
          price: "9.99",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Annual Subscription",
            description: "Best value - save over 30%",
          },
          price: "79",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Individual Form",
            description: "Pay per form access",
          },
          price: "4.99",
          priceCurrency: "USD",
        },
      ],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
