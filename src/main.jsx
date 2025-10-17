import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './components/auth/AuthContext.jsx';
import { TimerProvider } from './components/auth/TimerContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TimerProvider> {/* ✅ Envuelve la app con TimerProvider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TimerProvider>
    </AuthProvider>
  </StrictMode>
);
