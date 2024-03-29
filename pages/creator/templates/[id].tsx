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

import CodeEditorTab from '@/components/editor/template-editor/CodeEditorTab';
import FieldsTab from '@/components/editor/template-editor/FieldsTab';
import OverviewTab from '@/components/editor/template-editor/OverviewTab';
import StoreTab from '@/components/editor/template-editor/StoreTab';
import useTemplates from '@/hooks/useTemplates';
import { updateTemplate } from '@/lib/services/template-service';
import { hasObjectChanged } from '@/lib/utils/object';
import { toastPending } from '@/lib/utils/toasts';
import Error404 from '@/pages/404';

const TabIndexes: { [key in string]: number } = {
  overview: 0,
  store: 1,
  code: 2,
  fields: 3,
};

export default function CreatorTemplatePage() {
  const { userTemplates, updateTemplate: updateUserTemplate } = useTemplates();
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

  // Find template by ID in query.
  const templateId = query.id as string;
  const template = userTemplates.find((t) => t._id === templateId);

  // Input fields.
  const [name, setName] = useState(template?.name);
  const [description, setDescription] = useState(template?.description);
  const [storeDescription, setStoreDescription] = useState(
    template?.storeDescription,
  );
  const [price, setPrice] = useState(template?.price || 0);
  const [thumbnail, setThumbnail] = useState(template?.thumbnail);
  const [scopes, setScopes] = useState(template?.scopes);
  const [service, setService] = useState(template?.service || 'twitch');
  const [html, setHTML] = useState(template?.html);
  const [fields, setFields] = useState(template?.fields);
  const [visibility, setVisibility] = useState(
    template?.visibility || 'public',
  );

  // Payload.
  const updatePayload = {
    name,
    description,
    storeDescription,
    scopes,
    service,
    html,
    fields,
    visibility,
    price,
    thumbnail,
  };
  const hasChanges = hasObjectChanged(template, updatePayload);

  // If template not found, render 404 error page.
  if (!template) {
    return <Error404 />;
  }

  // Handlers
  const handleSaveTemplate = async () => {
    const newTemplate = await updateTemplate(template, updatePayload);
    updateUserTemplate(newTemplate);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await toastPending(handleSaveTemplate, {
      success: 'Template updated successfully!',
      pending: 'Updating template...',
    });
    setIsSaving(false);
  };

  // Otherwise, render template editor.
  return (
    <Flex flexDirection={'column'} gap={'30px'} width={'100%'}>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Heading>Editing template</Heading>
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
          <Tab>Store Page</Tab>
          <Tab>Code editor</Tab>
          <Tab>Fields</Tab>
        </TabList>

        <TabPanels>
          <OverviewTab
            // Editable
            name={name || ''}
            setName={setName}
            description={description || ''}
            setDescription={setDescription}
            scopes={scopes || []}
            setScopes={setScopes}
            service={service || 'twitch'}
            setService={setService}
            // Information
            id={templateId}
            visibility={visibility}
            price={price}
          />

          <StoreTab
            // Information
            name={name || ''}
            description={description || ''}
            // Editable
            storeDescription={storeDescription || ''}
            setStoreDescription={setStoreDescription}
            visibility={visibility}
            setVisibility={setVisibility}
            price={price}
            setPrice={setPrice}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
          />

          <CodeEditorTab code={html || ''} setCode={setHTML} />
          <FieldsTab categories={fields || []} setCategories={setFields} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
