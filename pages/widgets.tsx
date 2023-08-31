import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";

import IWidget from "@/lib/interfaces/widget";
import { getMyWidgets } from "@/lib/services/widget-service";
import Loading from "@/components/layout/loading";
import WidgetsGrid from "@/components/content/widgets-grid/WidgetsGrid";

export default function Widgets() {
  const [widgets, setWidgets] = useState<IWidget[]>();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    getMyWidgets()
      .then(setWidgets)
      .finally(() => setFetched(true));
  }, []);

  return (
    <Flex flexDirection={"column"} gap={"30px"} width={"100%"}>
      <Loading loaded={fetched} message="Loading widgets">
        <WidgetsGrid widgets={widgets as IWidget[]} />
      </Loading>
    </Flex>
  );
}
