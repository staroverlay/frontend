import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import WidgetOverviewTab from '@/components/editor/widget-editor/WidgetOverviewTab';
import WidgetSettingsTab from '@/components/editor/widget-editor/WidgetSettingsTab';
import useWidgets from '@/hooks/useWidgets';
import IDictionary from '@/lib/IDictionary';
import { hasObjectChanged } from '@/lib/utils/object';
import { toastPending } from '@/lib/utils/toasts';
import SettingsScope from '@/services/shared/settings-scope';
import { getTemplateByID, getTemplateVersion } from '@/services/templates';
import ITemplate from '@/services/templates/template';
import TemplateVersion from '@/services/templates/template-version';
import { updateWidget } from '@/services/widgets';

import Error404 from '../404';

const TabIndexes: { [key in string]: number } = {
  overview: 0,
  settings: 1,
};

export default function WidgetPage() {
  const { widgets, updateWidget: updateWidgetHook } = useWidgets();
  const searchParams = useSearchParams();
  const { query, push: navigateTo } = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  // Control query.
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      const newIndex = TabIndexes[tab] || 0;
      setTabIndex(newIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    for (const [key, value] of Object.entries(TabIndexes)) {
      if (value === tabIndex) {
        const newQuery = createQueryString(
          'tab',
          key === 'overview' ? null : key,
        );
        navigateTo({ search: newQuery });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  // Find widget by ID in query.
  const widgetId = query.widgetId as string;
  const widget = widgets.find((w) => w._id === widgetId);

  // Find template by widget.
  const [template, setTemplate] = useState<ITemplate | null>(null);
  const [templateVersion, setTemplateVersion] =
    useState<TemplateVersion | null>(null);

  useEffect(() => {
    if (widget) {
      getTemplateByID(widget.templateId).then(setTemplate);
    }
  }, [widget]);

  useEffect(() => {
    if (template) {
      const widgetLockedVersion = widget?.templateVersion;
      const templateLastVersion = template.lastVersionId;
      const desiredVersionId =
        !widget?.autoUpdate && widgetLockedVersion
          ? widgetLockedVersion
          : templateLastVersion;
      getTemplateVersion(desiredVersionId).then(setTemplateVersion);
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
