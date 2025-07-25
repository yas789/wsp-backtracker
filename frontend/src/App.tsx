import { Box, ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingSpinner from './components/shared/LoadingSpinner';

// Lazy load pages for better performance
const Layout = lazy(() => import('./components/layout/MainLayout'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ConfigurationPage = lazy(() => import('./pages/ConfigurationPage'));
const AuthorizationPage = lazy(() => import('./pages/AuthorizationPage'));
const ConstraintsPage = lazy(() => import('./pages/ConstraintsPage'));
const AlgorithmPage = lazy(() => import('./pages/AlgorithmPage'));

function App() {
  return (
    <ChakraProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Box minH="100vh" bg="gray.50">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="config" element={<ConfigurationPage />} />
              <Route path="auth" element={<AuthorizationPage />} />
              <Route path="constraints" element={<ConstraintsPage />} />
              <Route path="solver" element={<AlgorithmPage />} />
              {/* Add more routes as they are created */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Box>
      </Suspense>
    </ChakraProvider>
  );
}

export default App;
