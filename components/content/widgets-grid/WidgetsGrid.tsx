import ConfirmationAlert from "@/components/alerts/confirmation/ConfirmationAlert";
import WidgetCard from "@/components/cards/widget/WidgetCard";
import useWidgets from "@/hooks/useWidgets";
import ITemplate from "@/lib/interfaces/template";
import IWidget from "@/lib/interfaces/widget";
import { deleteWidget } from "@/lib/services/widget-service";
import { toastPending } from "@/lib/utils/toasts";
import { Flex, Heading, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

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
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const { removeWidget } = useWidgets();
  const [selectedWidget, setSelectedWidget] = useState<IWidget | null>(null);

  const handleDeleteWidget = () => {
    setLoading(true);
    toastPending(deleteWidget(selectedWidget as IWidget), {
      pending: "Deleting widget",
      success: "Widget deleted",
    })
      .then(() => {
        onDeleteClose();
        removeWidget(selectedWidget as IWidget);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <ConfirmationAlert
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onAccept={handleDeleteWidget}
        isLoading={loading}
        title={`Delete ${selectedWidget?.displayName}?`}
      >
        This action can not be undone. Make sure you have a backup in case you
        need this widget in the future.
      </ConfirmationAlert>

      <SimpleGrid
        gridTemplateColumns={"repeat(auto-fit, 300px)"}
        spacing="40px"
      >
        {widgets.map((widget) => (
          <WidgetCard
            key={widget._id}
            widget={widget}
            onClone={() => {}}
            onDelete={() => {
              onDeleteOpen();
              setSelectedWidget(widget);
            }}
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
