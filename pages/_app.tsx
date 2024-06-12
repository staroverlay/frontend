import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProgressBar from 'nextjs-progressbar';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { AcquisitionsProvider } from '@/contexts/acquisitions';
import { IntegrationsProvider } from '@/contexts/integrations';
import { MembershipProvider } from '@/contexts/membership';
import { PlanProvider } from '@/contexts/plan/plan-provider';
import { ProfileProvider } from '@/contexts/profile';
import { WidgetsProvider } from '@/contexts/widgets';
import Theme from '@/theme/theme';

import Layout from '../components/layout';
import { AuthProvider } from '../contexts/auth';
import { MediaProvider } from '../contexts/media/media-provider';
import { TemplatesProvider } from '../contexts/templates';
import User from '../services/users/user';

import 'react-toastify/dist/ReactToastify.css';

// App
interface InitialAppProps extends AppProps {
  props: {
    authURL: string;
    user: User | null;
  };
}

export default function App({ Component, pageProps }: InitialAppProps) {
  const [mounted, setMounted] = useState(false);
  const { pathname } = useRouter();

  useEffect(() => {
    if (!mounted) {
      const interval = setInterval(() => {
        if (window) {
          setMounted(true);
        }
      }, 5);

      return () => clearInterval(interval);
    }
  }, [mounted]);

  {
    /* Don't render layout on oauth */
  }
  if (pathname.startsWith('/oauth')) {
    return (
      <ChakraProvider theme={Theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={Theme}>
      <Head>
        <title>StarOverlay</title>
        <meta
          name="description"
          content="Alerts and widget for your live streams. Get ready to take your live streams to the next level!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon@32.png" />
      </Head>

      {/* Analytics from Vercel */}
      {process.env.NODE_ENV === 'production' && <Analytics />}

      {/* Notification toasts */}
      <ToastContainer />

      {/* Loading bar for page switch */}
      <ProgressBar
        color="#BB86FC"
        startPosition={0.5}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />

      {/* TODO: Use fetch in pages instead global contexts. */}
      <AuthProvider>
        <AcquisitionsProvider>
          <IntegrationsProvider>
            <MediaProvider>
              <MembershipProvider>
                <PlanProvider>
                  <ProfileProvider>
                    <TemplatesProvider>
                      <WidgetsProvider>
                        {mounted && (
                          <Layout>
                            <Component {...pageProps} />
                          </Layout>
                        )}
                      </WidgetsProvider>
                    </TemplatesProvider>
                  </ProfileProvider>
                </PlanProvider>
              </MembershipProvider>
            </MediaProvider>
          </IntegrationsProvider>
        </AcquisitionsProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
