import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import WidgetsGrid from "@/components/content/widgets-grid/WidgetsGrid";
import StatsCard from "@/components/cards/stats/StatsCard";
import usePlan from "@/hooks/usePlan";
import useWidgets from "@/hooks/useWidgets";

export default function Widgets() {
  const { activePlan } = usePlan();
  const { widgets } = useWidgets();

  return (
    <Flex flexDirection={"column"} gap={"30px"} width={"100%"}>
      <Box>
        <Heading>Media</Heading>
        <Text>
          All media files available for your account widgets can be managed
          here.
        </Text>
      </Box>

      <Flex gap={"10px"}>
        <StatsCard
          title="Widgets"
          value={`${widgets.length}`}
          maxValue={`${activePlan.maxWidgets}`}
          bg="#A770EF"
        />
      </Flex>

      <WidgetsGrid widgets={widgets} />
    </Flex>
  );
}
