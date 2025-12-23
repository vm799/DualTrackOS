import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initSentry } from './sentry';

// Initialize Sentry as early as possible
initSentry();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
