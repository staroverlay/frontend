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

import { oauthRegister } from '@/lib/utils/oauth';
import { handlePromise } from '@/lib/utils/promise';
import { IntegrationType } from '@/services/integrations/integration';
import { createUser } from '@/services/users';
import IUser from '@/services/users/user';

export default function Register() {
  const { colorMode } = useColorMode();
  const mainColor = colorMode === 'light' ? 'white' : 'black';

  const { push: navigateTo } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    const user = await createUser({ email, password })
      .catch((e) => {
        setError(e.message);
        return null;
      })
      .finally(() => setLoading(false));

    if (user) {
      navigateTo('/auth/login?register=success');
    }
  };

  useEffect(() => {
    setError(null);
  }, [email, password, confirmPassword]);

  const handleOAuthRegister = async (type: IntegrationType) => {
    setLoading(true);

    const user = await handlePromise<IUser | null>(oauthRegister(type)).finally(
      () => setLoading(false),
    );

    if (user) navigateTo('/login');
  };

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
          <Heading size={'lg'}>Sign up</Heading>

          {error != null && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
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
            />
          </FormControl>

          <FormControl>
            <FormLabel>Confirm password</FormLabel>
            <Input
              placeholder="********"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </FormControl>

          <Flex flexDirection={'column'} gap={'10px'}>
            <Button type="submit">Register</Button>

            <Flex justifyContent={'center'}>
              <Link href={'/auth/login'} style={{ fontSize: '12px' }}>
                Already registered? Sign in here.
              </Link>
            </Flex>

            <Flex justifyContent={'space-around'}>
              {/**
              <IconButton
                aria-label="Register with Kick"
                colorScheme={'green'}
                icon={<FaKickstarter />}
                disabled={loading}
                onClick={() => handleOAuthRegister('kick')}
              />
               */}

              <Button
                aria-label="Register with Twitch"
                colorScheme={'purple'}
                leftIcon={<FaTwitch />}
                disabled={loading}
                onClick={() => handleOAuthRegister('twitch')}
              >
                Register with Twitch
              </Button>

              {/**
                  <IconButton
                    aria-label="Register with YouTube"
                    colorScheme={'red'}
                    icon={<FaYoutube />}
                    disabled={loading}
                    onClick={() => handleOAuthRegister('youtube')}
                  /> 
                 */}
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}
