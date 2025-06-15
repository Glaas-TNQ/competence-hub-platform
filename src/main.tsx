
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';

// Set the page title
document.title = 'FairMind Academy';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="fairmind-academy-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
