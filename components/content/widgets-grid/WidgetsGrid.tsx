import WidgetCard from "@/components/cards/widget/WidgetCard";
import IWidget from "@/lib/interfaces/widget";
import { Flex, Heading, SimpleGrid } from "@chakra-ui/react";

interface WidgetsGridProps {
  search?: string;
  widgets: IWidget[];
}

function NoWidgets({ message }: { message?: string }) {
  return (
    <Flex alignContent={"center"} justifyContent={"center"}>
      <Flex direction={"column"} alignContent={"center"} gap={"10px"}>
        <Heading>{message ? message : "No templates"}</Heading>
      </Flex>
    </Flex>
  );
}

function WidgetsRender({ widgets }: { widgets: IWidget[] }) {
  return (
    <>
      <SimpleGrid
        gridTemplateColumns={"repeat(auto-fit, 300px)"}
        spacing="40px"
      >
        {widgets.map((widget) => (
          <WidgetCard
            key={widget._id}
            widget={widget}
            onClone={() => {}}
            onDelete={() => {}}
          />
        ))}
      </SimpleGrid>
    </>
  );
}

export default function WidgetsGrid({ search, widgets }: WidgetsGridProps) {
  if (widgets.length == 0) {
    return <NoWidgets />;
  }

  const widgetsQuery = widgets
    .filter((widget) =>
      widget.displayName
        .toLowerCase()
        .includes(search ? search.toLowerCase() : "")
    )
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  if (widgetsQuery.length == 0) {
    return <NoWidgets message={`No widgets for query "${search}"`} />;
  }

  return <WidgetsRender widgets={widgetsQuery} />;
}
