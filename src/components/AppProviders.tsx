
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/use-auth';
import { SubscriptionProvider } from '@/hooks/use-subscription';
import { FeatureAccessProvider } from '@/hooks/use-feature-access';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <FeatureAccessProvider>
            {children}
            <Toaster />
          </FeatureAccessProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
