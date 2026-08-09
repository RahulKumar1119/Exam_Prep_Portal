import React from 'react';
import ReactDOM from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// AWS CloudWatch RUM — Real User Monitoring (lazy-loaded to prevent blocking)
setTimeout(() => {
  try {
    import('aws-rum-web').then(({ AwsRum }) => {
      const config = {
        sessionSampleRate: 1,
        identityPoolId: 'ap-south-1:402c08ea-e7d6-442d-8901-0df3443fcce6',
        endpoint: 'https://dataplane.rum.ap-south-1.amazonaws.com',
        telemetries: ['performance', 'errors', 'http'],
        allowCookies: true,
        enableXRay: false,
        signing: true,
      };
      new AwsRum('e8fd7e3e-cd26-4588-b8c5-519f3a6d7fdb', '1.0.0', 'ap-south-1', config);
    }).catch(() => {});
  } catch (e) {}
}, 3000);

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
