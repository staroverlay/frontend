import ConnectionsTab from "@/components/editor/settings/ConnectionsTab";
import DangerZoneTab from "@/components/editor/settings/DangerZoneTab";
import OverviewTab from "@/components/editor/settings/OverviewTab";
import SessionsTab from "@/components/editor/settings/SessionsTab";
import { Box, Flex, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";

export default function Settings() {
  return (
    <Flex flexDir={"column"} gap={"10px"} width={"100%"}>
      <Tabs variant="soft-rounded" size={"sm"} width={"100%"}>
        <TabList bg={"blackAlpha.700"} borderRadius={"12px"} p={"7px 14px"}>
          <Tab>Overview</Tab>
          <Tab>Connections</Tab>
          <Tab>Sessions</Tab>
          <Tab>Danger Zone</Tab>
        </TabList>

        <Box maxWidth={"650px"} padding={"0"}>
          <TabPanels>
            <OverviewTab />
            <ConnectionsTab />
            <SessionsTab />
            <DangerZoneTab />
          </TabPanels>
        </Box>
      </Tabs>
    </Flex>
  );
}
