import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsTwitch } from 'react-icons/bs';

import Error from '@/components/layout/error';
import Loading from '@/components/layout/loading';
import { postOAuthSignal } from '@/lib/utils/oauth';
import twitch from '@/lib/utils/twitch';


export default function TwitchOAuth() {
  const { query } = useRouter();
  const { code, action } = query;

  const [error, setError] = useState<string | null>(null);

  const message = code
    ? 'Authenticating with Twitch...'
    : action === 'redirect'
    ? 'Redirecting to Twitch...'
    : 'Loading...';

  useEffect(() => {
    if (action === 'redirect') {
      const url = twitch.authenticate();
      window.location.href = url;
    }

    if (code) {
      postOAuthSignal<string>(code as string);
    }
  }, [code, action]);

  return (
    <Loading loaded={error != null} message={message}>
      <Error message={error || 'Unknown Error'}>
        <BsTwitch fontSize={'48px'} />
      </Error>
    </Loading>
  );
}
