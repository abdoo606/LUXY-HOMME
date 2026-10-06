import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { siteConfig } from './config/site.config';

// Inject brand colors from site.config.ts as CSS variables (rebrand in 1 file)
const rootStyle = document.documentElement.style;
rootStyle.setProperty('--brand-primary', siteConfig.theme.primary);
rootStyle.setProperty('--brand-deep', siteConfig.theme.primaryDeep);
rootStyle.setProperty('--brand-accent', siteConfig.theme.accent);
rootStyle.setProperty('--brand-cream', siteConfig.theme.cream);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
