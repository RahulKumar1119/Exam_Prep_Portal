import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Remove static SEO content once React hydrates (it's only for crawlers)
const seoContent = document.getElementById('seo-content');
if (seoContent) {
  seoContent.remove();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
