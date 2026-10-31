import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SchoolProvider } from './context/SchoolContext';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AppThemeProvider>
        <AuthProvider>
          <SchoolProvider>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </SchoolProvider>
        </AuthProvider>
      </AppThemeProvider>
    </BrowserRouter>
  );
}

export default App;

