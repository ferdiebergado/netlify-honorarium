import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { toast } from 'sonner';
import App from './App';
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
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
