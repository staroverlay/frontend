import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import WidgetOverviewTab from '@/components/editor/widget-editor/WidgetOverviewTab';
import WidgetSettingsTab from '@/components/editor/widget-editor/WidgetSettingsTab';
import useWidgets from '@/hooks/useWidgets';
import IDictionary from '@/lib/interfaces/shared/IDictionary';
import ITemplate from '@/lib/interfaces/templates/template';
import TemplateScope from '@/lib/interfaces/templates/template-scope';
import { updateWidget } from '@/lib/services/widget-service';
import { hasObjectChanged } from '@/lib/utils/object';
import { toastPending } from '@/lib/utils/toasts';

import Error404 from '../404';

export default function WidgetPage() {
  const { widgets, updateWidget: updateWidgetHook } = useWidgets();
  const { query } = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Find widget by ID in query.
  const widgetId = query.widgetId as string;
  const widget = widgets.find((w) => w._id === widgetId);

  // Find template by widget.
  const cachedTemplate = widget?.template as ITemplate;

  // Input fields.
  const [displayName, setDisplayName] = useState('');
  const [scopes, setScopes] = useState<TemplateScope[]>([]);
  const [settings, setSettings] = useState<IDictionary>({});
  const [enabled, setEnabled] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);

  useEffect(() => {
    if (widget) {
      setDisplayName(widget.displayName);
      setScopes(widget.scopes || []);
      setSettings(widget.settings || {});
      setEnabled(widget.enabled);
      setAutoUpdate(widget.autoUpdate);
    }
  }, [widget]);

  // Payload.
  const updatePayload = {
    displayName,
    scopes,
    settings,
    enabled,
    autoUpdate,
  };

  const hasChanges = hasObjectChanged(
    {
      ...widget,
      settings: widget?.settings || {},
    },
    updatePayload,
  );

  // If widget not found, render 404 error page.
  if (!widget) {
    return <Error404 />;
  }

  // Handlers
  const handleSaveWidget = async () => {
    const newWidget = await updateWidget(widget, updatePayload);
    updateWidgetHook(newWidget);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await toastPending(handleSaveWidget, {
      success: 'Widget updated successfully!',
      pending: 'Updating widget...',
    });
    setIsSaving(false);
  };

  // Otherwise, render widget editor.
  return (
    <Flex flexDirection={'column'} gap={'30px'} width={'100%'}>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Heading>Editing widget</Heading>
        <Button
          colorScheme={'green'}
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving || !hasChanges}
        >
          Save
        </Button>
      </Flex>

      <Tabs variant={'enclosed'}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <WidgetOverviewTab
            name={displayName}
            scopes={scopes}
            autoUpdate={autoUpdate}
            setName={setDisplayName}
            setScopes={setScopes}
            setAutoUpdate={setAutoUpdate}
            template={cachedTemplate}
            widget={widget}
          />

          <WidgetSettingsTab
            setSettings={setSettings}
            settings={settings}
            template={cachedTemplate}
            widget={widget}
          />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
