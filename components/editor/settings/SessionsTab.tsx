import {
  Box,
  Button,
  Flex,
  Heading,
  TabPanel,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { UAParser } from 'ua-parser-js';

import useAuth from '@/hooks/useAuth';
import ISession from '@/lib/interfaces/sessions/session';
import {
  getSessions,
  invalidateAllSessions,
  invalidateSessionByID,
} from '@/lib/services/session-service';
import { toastError } from '@/lib/utils/toasts';

const SessionItem = ({
  session,
  onRemove,
}: {
  session: ISession;
  onRemove: (isSame: boolean) => Promise<unknown>;
}) => {
  const { colorMode } = useColorMode();
  const { sessionId } = useAuth();
  const [isLoading, setLoading] = useState(false);

  const same = session._id == sessionId;

  const bg = colorMode == 'dark' ? 'blackAlpha.700' : 'blackAlpha.200';

  const parser = new UAParser(session.device);
  const device = parser.getResult();

  const handleRemove = () => {
    setLoading(true);
    onRemove(same)
      .catch((e) => {
        toastError(e.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Flex
      bg={bg}
      p={'7px 14px'}
      borderRadius={same ? '0 10px 10px 0' : '10px'}
      alignItems="center"
      justifyContent="space-between"
      width={'100%'}
      borderLeft={same ? '4px solid green' : 'none'}
    >
      <Flex alignItems={'center'} gap={'8px'}>
        <Box>
          <Text fontSize={'md'} fontWeight={'bold'}>
            {device.browser.name} for {device.os.name} {device.os.version}
          </Text>

          <Text fontSize={'sm'}>From {session.location}.</Text>

          <Text fontSize={'xs'}>
            Using {session.method || 'password'} at{' '}
            {new Date(session.date).toLocaleString()}
          </Text>
        </Box>
      </Flex>

      <Box>
        <Button
          colorScheme={same ? 'orange' : 'red'}
          size="xs"
          disabled={isLoading}
          isLoading={isLoading}
          onClick={handleRemove}
        >
          {!same && (
            <>
              <BsTrash /> Disconnect
            </>
          )}

          {same && 'Logout'}
        </Button>
      </Box>
    </Flex>
  );
};

export default function SessionsTab() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [fetched, setFetched] = useState(false);
  const { logout } = useAuth();

  const logoutAll = async () => {
    await invalidateAllSessions();
    logout(false);
  };

  const logoutSession = async (same: boolean, session: ISession) => {
    await invalidateSessionByID(session._id);

    if (same) logout(false);
    const newSessions = sessions.filter((s) => s._id != session._id);
    setSessions(newSessions);
  };

  useEffect(() => {
    if (!fetched) {
      setFetched(true);

      getSessions().then(setSessions);
    }
  }, [fetched, sessions]);

  return (
    <TabPanel>
      <Flex alignItems={'center'} gap={'10px'} mb={'20px'}>
        <Heading size={'md'}>Active Sessions ({sessions.length})</Heading>

        <Button colorScheme={'red'} size={'xs'} onClick={logoutAll}>
          Disconnect all
        </Button>
      </Flex>

      <Flex flexDir={'column-reverse'} gap={'10px'}>
        {sessions.map((session, index) => (
          <SessionItem
            key={index}
            session={session}
            onRemove={async (same) => {
              logoutSession(same, session);
            }}
          />
        ))}
      </Flex>
    </TabPanel>
  );
}
