import React from 'react';
import ReactDOM from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

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
