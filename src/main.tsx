import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router';
import { toast } from 'sonner';
import App from './App';
import FallbackPage from './components/FallbackPage';
import './index.css';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: data => {
      toast.success((data as { message: string }).message);
      queryClient.invalidateQueries();
    },
    onError: (err: Error) => toast.error(err.message),
  }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <FallbackPage resetErrorBoundary={resetErrorBoundary} />
              )}
            >
              <App />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
