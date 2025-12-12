import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import App from './App.jsx';

// Create QueryClient with default options
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <ModalsProvider>
                    <Notifications position='top-right' />
                    <App />
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    </StrictMode>
);
