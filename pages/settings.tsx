import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ConnectionsTab from '@/components/editor/settings/ConnectionsTab';
import DangerZoneTab from '@/components/editor/settings/DangerZoneTab';
import OverviewTab from '@/components/editor/settings/OverviewTab';
import ProfileTab from '@/components/editor/settings/ProfileTab';
import SessionsTab from '@/components/editor/settings/SessionsTab';

const TabIndexes: { [key in string]: number } = {
  overview: 0,
  profile: 1,
  connections: 2,
  sessions: 3,
  danger: 4,
};

/**
 * Todo: Merge overview and profile tabs into one
 */
export default function Settings() {
  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? 'blackAlpha.300' : 'blackAlpha.700';

  const searchParams = useSearchParams();
  const { query, push: navigateTo } = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  // Control query.
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      const newIndex = TabIndexes[tab] || 0;
      setTabIndex(newIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    for (const [key, value] of Object.entries(TabIndexes)) {
      if (value === tabIndex) {
        const newQuery = createQueryString(
          'tab',
          key === 'overview' ? null : key,
        );
        navigateTo({ search: newQuery });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  return (
    <Flex flexDir={'column'} gap={'10px'} width={'100%'}>
      <Tabs
        variant="soft-rounded"
        size={'sm'}
        width={'100%'}
        onChange={(index) => setTabIndex(index)}
        index={tabIndex}
      >
        <TabList bg={bg} borderRadius={'12px'} p={'7px 14px'}>
          <Tab>Overview</Tab>
          <Tab>Profile</Tab>
          <Tab>Connections</Tab>
          <Tab>Sessions</Tab>
          <Tab>Danger Zone</Tab>
        </TabList>

        <Box maxWidth={'650px'} padding={'0'}>
          <TabPanels>
            <OverviewTab />
            <ProfileTab />
            <ConnectionsTab />
            <SessionsTab />
            <DangerZoneTab />
          </TabPanels>
        </Box>
      </Tabs>
    </Flex>
  );
}
