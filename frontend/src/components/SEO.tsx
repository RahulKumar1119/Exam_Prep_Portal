import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage = 'https://mockmaster.fun/og-image.png',
  type = 'website',
  keywords,
}) => {
  const fullTitle = title.includes('MockMaster') ? title : `${title} | MockMaster`;
  // The site is served as static prerendered files, so every route resolves to
  // its trailing-slash URL (e.g. /blog/x/ ; /blog/x 301s to it). Normalize the
  // canonical to the trailing-slash form so it matches the actually-served URL
  // and never points at a redirecting URL. Leaves query/hash-less paths only.
  const normalizeCanonical = (u: string): string => {
    try {
      const parsed = new URL(u);
      if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/')) {
        parsed.pathname += '/';
      }
      return parsed.toString();
    } catch {
      return u;
    }
  };
  const url = normalizeCanonical(canonical || 'https://mockmaster.fun/');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={type} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
