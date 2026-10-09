import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Justice Bot USA - Fight ICE | Immigration Defense & Legal Help",
  description = "Fight ICE. Know your rights. Justice Bot USA provides AI-powered immigration defense, asylum help, deportation defense, and affordable legal guidance for all 50 US states. A Justice Bot USA Platform.",
  keywords = "fight ICE, ICE defense, immigration lawyer alternative, deportation defense, asylum application, know your rights ICE, DACA renewal, U-visa, VAWA, sanctuary city, affordable legal assistance, human rights, workers compensation, workers rights, family law, small claims court, employment law, housing rights, civil rights, legal AI",
  image = "https://justicebot-usa.com/icon-512.png",
  url = "https://justicebot-usa.com",
  type = "website"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* hreflang: EN + ES are served at the same URLs via language toggle */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="es" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Justice Bot USA" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="es_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
    </Helmet>
  );
};
