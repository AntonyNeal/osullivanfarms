import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { TenantProvider } from './core/providers/TenantProvider';
import { FarmDataProvider } from './core/context/FarmDataContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TenantProvider>
          <FarmDataProvider>
            <App />
          </FarmDataProvider>
        </TenantProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);
