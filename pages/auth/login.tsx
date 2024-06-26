import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorMode,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaTwitch } from 'react-icons/fa';

import useAuth from '@/hooks/useAuth';
import { oauthLogin } from '@/lib/utils/oauth';
import { handlePromise } from '@/lib/utils/promise';
import { IntegrationType } from '@/services/integrations/integration';
import { createSession } from '@/services/sessions';
import ISessionAndUser from '@/services/sessions/session-and-user';

export default function Login() {
  const { colorMode } = useColorMode();
  const mainColor = colorMode === 'light' ? 'white' : 'black';

  const { login } = useAuth();
  const { query } = useRouter();
  const registered = query['register'] == 'success';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = { email, password };
    const session = await createSession(payload)
      .catch((e) => {
        setError(e.message);
        return null;
      })
      .finally(() => setLoading(false));

    if (session) {
      login(session);
    }
  };

  const handleOAuthLogin = async (type: IntegrationType) => {
    setLoading(true);

    const session = await handlePromise<ISessionAndUser | null>(
      oauthLogin(type),
    ).finally(() => setLoading(false));

    if (session) login(session);
  };

  useEffect(() => {
    setError(null);
  }, [email, password]);

  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      height={'100vh'}
    >
      <form onSubmit={handleSubmit}>
        <Flex
          bg={mainColor}
          borderRadius={'10px'}
          padding={'10px 20px'}
          flexDirection={'column'}
          gap={'15px'}
        >
          <Heading size={'lg'}>Sign in</Heading>

          {error != null && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {error == null && registered && (
            <Alert status="success">
              <AlertTitle>Success:</AlertTitle>
              <AlertDescription>Log in with your new account</AlertDescription>
            </Alert>
          )}

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="john@doe.com"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              disabled={loading}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="********"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              disabled={loading}
            />
          </FormControl>

          <Flex flexDirection={'column'} gap={'10px'}>
            <Button type="submit" disabled={loading} isLoading={loading}>
              Login
            </Button>

            <Flex justifyContent={'space-between'}>
              <Link
                href={'/auth/recovery'}
                style={{ fontSize: '12px', marginRight: '8px' }}
              >
                Forgot your password?
              </Link>

              <Link
                href={'/auth/register'}
                style={{ fontSize: '12px', marginLeft: '8px' }}
              >
                Register an account.
              </Link>
            </Flex>

            <Flex justifyContent={'space-around'}>
              {/**
              <IconButton
                aria-label="Login with Kick"
                colorScheme={'green'}
                icon={<FaKickstarter />}
                disabled={loading}
                onClick={() => handleOAuthLogin('kick')}
              />
               */}

              <Button
                aria-label="Login with Twitch"
                colorScheme={'purple'}
                leftIcon={<FaTwitch />}
                disabled={loading}
                onClick={() => handleOAuthLogin('twitch')}
              >
                Log in with Twitch
              </Button>

              {/**
                  <IconButton
                    aria-label="Login with YouTube"
                    colorScheme={'red'}
                    icon={<FaYoutube />}
                    disabled={loading}
                    onClick={() => handleOAuthLogin('youtube')}
                  /> 
                 */}
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}
