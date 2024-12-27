import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useColorMode
} from '@chakra-ui/react';

import ConnectionsTab from '@/components/editor/settings/ConnectionsTab';
import DangerZoneTab from '@/components/editor/settings/DangerZoneTab';
import OverviewTab from '@/components/editor/settings/OverviewTab';
import ProfileTab from '@/components/editor/settings/ProfileTab';
import SessionsTab from '@/components/editor/settings/SessionsTab';
import useQueryTab from '@/hooks/useQueryTab';

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

  const { tabIndex, setTabIndex } = useQueryTab(TabIndexes);


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
