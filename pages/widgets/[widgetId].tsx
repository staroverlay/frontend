import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import WidgetOverviewTab from '@/components/editor/widget-editor/WidgetOverviewTab';
import WidgetSettingsTab from '@/components/editor/widget-editor/WidgetSettingsTab';
import Loading from '@/components/layout/loading';
import useWidgets from '@/hooks/useWidgets';
import IDictionary from '@/lib/IDictionary';
import { hasObjectChanged } from '@/lib/utils/object';
import { toastPending } from '@/lib/utils/toasts';
import SettingsScope from '@/services/shared/settings-scope';
import { getTemplateVersion } from '@/services/template-versions';
import TemplateVersion from '@/services/template-versions/template-version';
import { getTemplateByID } from '@/services/templates';
import ITemplate from '@/services/templates/template';
import { updateWidget } from '@/services/widgets';

import useQueryTab from '@/hooks/useQueryTab';
import Error404 from '../404';

const TabIndexes: { [key in string]: number } = {
  overview: 0,
  settings: 1,
};

export default function WidgetPage() {
  const { widgets, updateWidget: updateWidgetHook } = useWidgets();
  const router = useRouter();
  const { query } = router;
  const [isSaving, setIsSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const {tabIndex, setTabIndex} = useQueryTab(TabIndexes);


  // Find widget by ID in query.
  const widgetId = query.widgetId as string;
  const widget = widgets.find((w) => w._id === widgetId);

  // Find template by widget.
  const [template, setTemplate] = useState<ITemplate | null>(null);
  const [templateVersion, setTemplateVersion] =
    useState<TemplateVersion | null>(null);

  useEffect(() => {
    if (widgetId && widget) {
      getTemplateByID(widget.templateId).then(setTemplate);
    } else {
      setFetching(false);
    }
  }, [widgetId, widget]);

  useEffect(() => {
    if (template) {
      const widgetLockedVersion = widget?.templateVersion;
      const templateLastVersion = template.lastVersionId;
      const desiredVersionId =
        !widget?.autoUpdate && widgetLockedVersion
          ? widgetLockedVersion
          : templateLastVersion;
      getTemplateVersion(template, desiredVersionId)
        .then(setTemplateVersion)
        .finally(() => {
          setFetching(false);
        });
    }
  }, [widget, template]);

  // Input fields.
  const [displayName, setDisplayName] = useState('');
  const [scopes, setScopes] = useState<SettingsScope[]>([]);
  const [settings, setSettings] = useState<IDictionary>({});
  const [enabled, setEnabled] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);

  useEffect(() => {
    if (widget) {
      setDisplayName(widget.displayName);
      setScopes(widget.scopes || []);
      setSettings(JSON.parse(widget.settings || '{}'));
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

  // If still fetching.
  if (fetching) {
    return <Loading loaded={false} message="Loading widget"></Loading>;
  }

  // If widget not found, render 404 error page.
  if (!widget || !template || !templateVersion) {
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

      <Tabs
        variant={'enclosed'}
        onChange={(index) => setTabIndex(index)}
        index={tabIndex}
      >
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
            template={template}
            widget={widget}
            version={templateVersion}
            enabled={enabled}
            setEnabled={setEnabled}
          />

          <WidgetSettingsTab
            setSettings={setSettings}
            settings={settings}
            widget={widget}
            version={templateVersion}
          />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
