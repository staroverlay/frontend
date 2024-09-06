import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import StoreTab from '@/components/editor/template-editor/StoreTab';
import SummaryTab from '@/components/editor/template-editor/SummaryTab';
import useQueryTab from '@/hooks/useQueryTab';
import useTemplates from '@/hooks/useTemplates';
import { hasObjectChanged } from '@/lib/utils/object';
import { toastPending } from '@/lib/utils/toasts';
import Error404 from '@/pages/404';
import { updateTemplate } from '@/services/templates';

const TabIndexes: { [key in string]: number } = {
  summary: 0,
  store: 1,
};

export default function CreatorTemplatePage() {
  const { userTemplates, updateTemplate: updateUserTemplate } = useTemplates();
  const { query } = useRouter();
  const {tabIndex, setTabIndex} = useQueryTab(TabIndexes);
  const [isSaving, setIsSaving] = useState(false);

  // Find template by ID in query.
  const templateId = query.id as string;
  const template = userTemplates.find((t) => t._id === templateId);

  // Payload.
  const [thumbnail, setThumbnail] = useState(template?.thumbnail);
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [service, setService] = useState(template?.service || 'twitch');
  const [price, setPrice] = useState(template?.price || 0);
  const [visibility, setVisibility] = useState(
    template?.visibility || 'private',
  );
  const [storeDescription, setStoreDescription] = useState(
    template?.storeDescription || '',
  );

  const updatePayload = {
    name,
    description,
    service,
    visibility,
    storeDescription,
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

        <Flex gap={'20px'} alignItems={'center'}>
          <Link href={`/creator/templates/${templateId}/update`}>
            <Button variant={'link'}>Edit source code</Button>
          </Link>

          <Button
            colorScheme={'green'}
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaving || !hasChanges}
          >
            Save
          </Button>
        </Flex>
      </Flex>

      {/* Editor */}
      <Tabs
        onChange={(index) => setTabIndex(index)}
        index={tabIndex}>
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Store Page</Tab>
        </TabList>

        <TabPanels mt={'20px'}>
          {/* Tab: Info */}
          <SummaryTab
            description={description}
            name={name}
            price={price}
            service={service}
            thumbnail={thumbnail}
            visibility={visibility}
            setName={setName}
            setDescription={setDescription}
            setPrice={setPrice}
            setService={setService}
            setThumbnail={setThumbnail}
            setVisibility={setVisibility}
          />

          {/* Tab: Store Page */}
          <StoreTab
            storeDescription={storeDescription}
            setStoreDescription={setStoreDescription}
          />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
