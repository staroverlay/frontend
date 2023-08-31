import { useState } from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Heading,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
} from "@chakra-ui/react";

import useWidgets from "@/hooks/useWidgets";
import ITemplate from "@/lib/interfaces/template";
import { hasObjectChanged } from "@/lib/utils/object";
import { toastPending } from "@/lib/utils/toasts";

import Error404 from "../404";
import WidgetOverviewTab from "@/components/editor/widget-editor/WidgetOverviewTab";
import WidgetSettingsTab from "@/components/editor/widget-editor/WidgetSettingsTab";
import IDictionary from "@/lib/interfaces/shared/IDictionary";

export default function WidgetPage() {
  const { widgets, updateWidget } = useWidgets();
  const { query } = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Find widget by ID in query.
  const widgetId = query.widgetId as string;
  const widget = widgets.find((w) => w._id === widgetId);

  // Find template by widget.
  const currentTemplate = JSON.parse(widget?.templateRaw || "{}") as ITemplate;

  // Input fields.
  const [name, setName] = useState(widget?.displayName || "");
  const [scopes, setScopes] = useState(widget?.scopes || []);
  const [settings, setSettings] = useState<IDictionary>(widget?.settings || {});

  // Payload.
  const updatePayload = {
    name,
    scopes,
  };
  const hasChanges = hasObjectChanged(widget, updatePayload);

  // If widget not found, render 404 error page.
  if (!widget) {
    return <Error404 />;
  }

  // Handlers
  const handleSaveWidget = async () => {};

  const handleSave = async () => {
    setIsSaving(true);
    await toastPending(handleSaveWidget, {
      success: "Widget updated successfully!",
      pending: "Updating widget...",
    });
    setIsSaving(false);
  };

  // Otherwise, render widget editor.
  return (
    <Flex flexDirection={"column"} gap={"30px"} width={"100%"}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Heading>Editing widget</Heading>
        <Button
          colorScheme={"green"}
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving || !hasChanges}
        >
          Save
        </Button>
      </Flex>

      <Tabs variant={"enclosed"}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <WidgetOverviewTab
            name={name}
            scopes={scopes}
            setName={setName}
            setScopes={setScopes}
            template={currentTemplate}
            widget={widget}
          />

          <WidgetSettingsTab
            setSettings={setSettings}
            settings={settings}
            template={currentTemplate}
            widget={widget}
          />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
