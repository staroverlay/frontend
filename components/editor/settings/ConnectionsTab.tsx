import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  TabPanel,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IconType } from 'react-icons';
import {
  BsCheck,
  BsPlusLg,
  BsTrash,
  BsTwitch,
  BsYoutube,
} from 'react-icons/bs';
import { FaKickstarter } from 'react-icons/fa';

import useIntegrations from '@/hooks/useIntegrations';
import useProfile from '@/hooks/useProfile';
import { oauthIntegration } from '@/lib/utils/oauth';
import { capitalize } from '@/lib/utils/strings';
import { toastError, toastSuccess } from '@/lib/utils/toasts';
import { disconnectIntegration } from '@/services/integrations';
import IIntegration, {
  IntegrationType,
} from '@/services/integrations/integration';
import { syncProfileWithIntegration } from '@/services/profile';

const URLS: Record<IntegrationType, string> = {
  kick: 'https://kick.com/',
  twitch: 'https://twitch.tv/',
  youtube: 'https://youtube.com/c/',
};

const COLORS: Record<IntegrationType, string> = {
  kick: 'green',
  twitch: 'purple',
  youtube: 'red',
};

const ConnectionButton = ({
  type,
  Icon,
  onConnect,
}: {
  type: IntegrationType;
  Icon: IconType;
  onConnect: (type: IntegrationType) => Promise<void>;
}) => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);

  const bg = colorMode == 'dark' ? 'blackAlpha.500' : 'blackAlpha.300';
  const fg = colorMode == 'dark' ? 'whiteAlpha.500' : 'blackAlpha.900';

  const handleConnect = async () => {
    setLoading(true);
    await onConnect(type)
      .catch((e) => {
        toastError(e.message);
        return null;
      })
      .finally(() => setLoading(false));
  };

  return (
    <Flex
      bg={bg}
      p={'14px 28px'}
      borderRadius={'10px'}
      alignItems="center"
      justifyContent="space-between"
      width={'100%'}
      color={fg}
    >
      <Flex alignItems={'center'} gap={'8px'}>
        <Icon fontSize={'40px'} />

        <Box>
          <Text fontSize={'md'} fontWeight={'bold'}>
            {capitalize(type)}
          </Text>
          <Text fontSize="sm">No connected</Text>
        </Box>
      </Flex>

      <Box>
        <Button
          colorScheme={'pink'}
          size="sm"
          disabled={loading}
          isLoading={loading}
          onClick={handleConnect}
        >
          <BsPlusLg />
          <Text ml={'5px'}>Connect</Text>
        </Button>
      </Box>
    </Flex>
  );
};

const ConnectionItem = ({
  integration,
  Icon,
  onDisconnect,
}: {
  integration: IIntegration;
  Icon: IconType;
  onDisconnect: (integration: IIntegration) => Promise<void>;
}) => {
  const { colorMode } = useColorMode();
  const { setProfile } = useProfile();

  const bg = colorMode == 'dark' ? 'blackAlpha.700' : 'blackAlpha.200';
  const accent = colorMode == 'dark' ? 'purple.200' : 'purple.500';
  const link = URLS[integration.type] + integration.username;

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [hover, setHover] = useState(false);

  const handleDisconnect = () => {
    setLoading(true);
    onDisconnect(integration)
      .catch((e) => toastError(e.message))
      .finally(() => setLoading(false));
  };

  const handleSync = () => {
    setSyncing(true);
    syncProfileWithIntegration(integration._id)
      .then((profile) => {
        setProfile(profile);
        toastSuccess('Successfully synced profile');
      })
      .catch((e) => toastError(e.message))
      .finally(() => setSyncing(false));
  };

  return (
    <Flex
      bg={bg}
      p={'14px 28px'}
      borderRadius={'10px'}
      alignItems="center"
      justifyContent="space-between"
      width={'100%'}
    >
      <Flex alignItems={'center'} gap={'8px'}>
        <Icon fill={COLORS[integration.type]} fontSize={'30px'} />
        <Avatar size={'md'} src={integration.avatar} />

        <Box>
          <Text fontSize={'md'} fontWeight={'bold'}>
            {integration.username}
          </Text>

          <Text fontSize={'sm'}>
            <Link
              color={accent}
              target="_blank"
              referrerPolicy="no-referrer"
              href={link}
            >
              {link.split('://')[1]}
            </Link>
          </Text>
        </Box>
      </Flex>

      <Flex alignItems={'center'} gap={'7px'}>
        <Button
          onClick={handleSync}
          size="sm"
          isLoading={syncing}
          disabled={syncing}
        >
          Sync
        </Button>

        <Button
          colorScheme={hover ? 'red' : 'green'}
          size="sm"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleDisconnect}
          isLoading={loading}
          disabled={loading}
        >
          {hover ? <BsTrash /> : <BsCheck />}
          {hover ? 'Disconnect' : 'Connected'}
        </Button>
      </Flex>
    </Flex>
  );
};

const ConnectionProvider = ({
  type,
  Icon,
  onConnect,
  onDisconnect,
}: {
  type: IntegrationType;
  Icon: IconType;
  onConnect: (type: IntegrationType) => Promise<void>;
  onDisconnect: (integration: IIntegration) => Promise<void>;
}) => {
  const { getIntegration } = useIntegrations();
  const integration = getIntegration(type);

  if (integration) {
    return (
      <ConnectionItem
        integration={integration}
        Icon={Icon}
        onDisconnect={onDisconnect}
      />
    );
  } else {
    return <ConnectionButton type={type} Icon={Icon} onConnect={onConnect} />;
  }
};

export default function ConnectionsTab() {
  const { addIntegration, removeIntegration } = useIntegrations();

  const onConnect = async (type: IntegrationType): Promise<void> => {
    const integration = await oauthIntegration(type);
    if (integration) {
      addIntegration(integration);
      toastSuccess('Successfully connected ' + capitalize(type));
    }
  };

  const onDisconnect = async (integration: IIntegration): Promise<void> => {
    const success = await disconnectIntegration(integration._id);
    if (success) {
      removeIntegration(integration);
      toastSuccess('Successfully disconnected ' + capitalize(integration.type));
    }
  };

  return (
    <TabPanel>
      <Flex flexDir={'column'} gap={'10px'}>
        <ConnectionProvider
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          Icon={FaKickstarter}
          type={'kick'}
        />
        <ConnectionProvider
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          Icon={BsTwitch}
          type={'twitch'}
        />
        <ConnectionProvider
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          Icon={BsYoutube}
          type={'youtube'}
        />
      </Flex>
    </TabPanel>
  );
}
