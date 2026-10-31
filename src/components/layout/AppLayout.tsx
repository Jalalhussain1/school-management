import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { useSchool } from '../../context/SchoolContext';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toast, hideToast } = useSchool();

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    if (isAuthPage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthPage]);

  if (isAuthPage) {
    return (
      <>
        {children}
        {toast && (
          <Snackbar
            open={Boolean(toast)}
            autoHideDuration={4000}
            onClose={hideToast}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={hideToast}
              severity={toast.severity}
              variant="filled"
              sx={{
                borderRadius: 2.5,
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        )}
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        <Topbar
          onMobileToggle={() => setMobileOpen((prev) => !prev)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 3.5 }, maxWidth: 1600, width: '100%', mx: 'auto' }}>
          {children}
        </Box>
      </Box>

      {/* Global Search Modal */}
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Notification Toast */}
      {toast && (
        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={4000}
          onClose={hideToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={hideToast}
            severity={toast.severity}
            variant="filled"
            sx={{
              borderRadius: 2.5,
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};
