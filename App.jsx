import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useUIStore } from './stores/uiStore';
import AppRoutes from './routes';
import Toast from './components/ui/Toast';

function App() {
  const { checkAuth } = useAuthStore();
  const { initTheme } = useUIStore();
  
  useEffect(() => {
    // Initialize theme
    initTheme();
    
    // Check auth state
    checkAuth();
  }, []);
  
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toast />
    </BrowserRouter>
  );
}

export default App;
