import {
  Button,
  Flex,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CodeEditorTab from '@/components/editor/template-version-editor/CodeEditorTab';
import FieldsTab from '@/components/editor/template-version-editor/FieldsTab';
import ScopesTab from '@/components/editor/template-version-editor/ScopesTab';
import Loading from '@/components/layout/loading';
import useTemplates from '@/hooks/useTemplates';
import { hasObjectChanged } from '@/lib/utils/object';
import { toastPending } from '@/lib/utils/toasts';
import Error404 from '@/pages/404';
import {
  getLastTemplateVersion,
  postTemplateUpdate,
} from '@/services/template-versions';
import TemplateVersion from '@/services/template-versions/template-version';

export default function CreatorTemplateUpdateSourcePage() {
  const { userTemplates, updateTemplate: updateUserTemplate } = useTemplates();
  const { query } = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Theming.
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const bg = isDark ? 'gray.800' : 'gray.100';

  // Find template by ID in query.
  const templateId = query.id as string;
  const template = userTemplates.find((t) => t._id === templateId);

  // Find last version.
  const [lastVersion, setLastVersion] = useState<
    undefined | null | TemplateVersion
  >(undefined);

  useEffect(() => {
    template
      ? getLastTemplateVersion(template).then(setLastVersion)
      : setLastVersion(null);
  }, [template]);

  useEffect(() => {
    setFields(lastVersion?.fields || []);
    setScopes(lastVersion?.scopes || []);
    setHTML(lastVersion?.html || '');
    setVersion(lastVersion?.version || '0.0.0');
  }, [lastVersion]);

  // Payload.
  const [fields, setFields] = useState(lastVersion?.fields || []);
  const [scopes, setScopes] = useState(lastVersion?.scopes || []);
  const [html, setHTML] = useState(lastVersion?.html || '');
  const [version, setVersion] = useState(lastVersion?.version || '0.0.0');

  const updatePayload = {
    fields,
    scopes,
    html,
    version,
  };
  const hasChanges =
    lastVersion == null
      ? true
      : hasObjectChanged(lastVersion || {}, updatePayload);

  // If template not found, render 404 error page.
  if (!template) {
    return <Error404 />;
  }

  if (lastVersion === undefined) {
    return <Loading loaded={false} message={"Retrieving template's data..."} />;
  }

  // Handlers
  const handlePostUpdate = async () => {
    const newVersion = await postTemplateUpdate(template, updatePayload);
    setLastVersion(newVersion);
  };

  const postUpdate = async () => {
    setIsSaving(true);
    await toastPending(handlePostUpdate, {
      success: 'Template version updated successfully!',
      pending: 'Updating template version...',
    });
    setIsSaving(false);
  };

  // Otherwise, render template editor.
  return (
    <Flex flexDirection={'column'} gap={'30px'} width={'100%'}>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Heading>Post a Template Update</Heading>
        <Flex gap={'10px'}>
          <Input
            placeholder="0.0.0"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            w={'fit-content'}
          />

          <Button
            colorScheme={'blue'}
            onClick={postUpdate}
            isLoading={isSaving}
            disabled={isSaving || !hasChanges}
          >
            Post update
          </Button>
        </Flex>
      </Flex>

      {/* Editor */}
      <Tabs>
        <TabList>
          <Tab>Scopes</Tab>
          <Tab>Settings</Tab>
          <Tab>Code Editor</Tab>
        </TabList>

        <TabPanels>
          {/* Tab: Scopes */}
          <ScopesTab
            scopes={scopes}
            setScopes={setScopes}
            service={template.service || 'twitch'}
          />

          {/* Tab: Settings */}
          <FieldsTab fields={fields || []} setFields={setFields} />

          {/* Tab: Code Editor */}
          <CodeEditorTab code={html} setCode={setHTML} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
