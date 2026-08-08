import React from 'react';
import ReactDOM from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// AWS CloudWatch RUM — Real User Monitoring
import { AwsRum, type AwsRumConfig } from 'aws-rum-web';

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    identityPoolId: 'ap-south-1:402c08ea-e7d6-442d-8901-0df3443fcce6',
    endpoint: 'https://dataplane.rum.ap-south-1.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: true,
    enableXRay: false,
    signing: true,
  };

  const APPLICATION_ID = 'e8fd7e3e-cd26-4588-b8c5-519f3a6d7fdb';
  const APPLICATION_VERSION = '1.0.0';
  const APPLICATION_REGION = 'ap-south-1';

  new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config);
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

// Remove static SEO content once React hydrates (it's only for crawlers)
const seoContent = document.getElementById('seo-content');
if (seoContent) {
  seoContent.remove();
}

const rootElement = document.getElementById('root') as HTMLElement;

// If the page was pre-rendered by react-snap, hydrate instead of render.
// This preserves the static HTML for SEO while making the page interactive.
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
