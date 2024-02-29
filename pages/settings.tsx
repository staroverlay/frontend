import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';

import ConnectionsTab from '@/components/editor/settings/ConnectionsTab';
import DangerZoneTab from '@/components/editor/settings/DangerZoneTab';
import OverviewTab from '@/components/editor/settings/OverviewTab';
import ProfileTab from '@/components/editor/settings/ProfileTab';
import SessionsTab from '@/components/editor/settings/SessionsTab';

export default function Settings() {
  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? 'blackAlpha.300' : 'blackAlpha.700';

  return (
    <Flex flexDir={'column'} gap={'10px'} width={'100%'}>
      <Tabs variant="soft-rounded" size={'sm'} width={'100%'}>
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
