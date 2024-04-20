import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useColorMode,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import TemplateCard from '@/components/cards/template/TemplateCard';
import MediaInput from '@/components/input/MediaInput';
import MarkdownRenderer from '@/components/utils/MarkdownRenderer';
import useTemplates from '@/hooks/useTemplates';
import { hasObjectChanged } from '@/lib/utils/object';
import { toastPending } from '@/lib/utils/toasts';
import Error404 from '@/pages/404';
import ServiceType, { ServiceTypes } from '@/services/shared/service-type';
import { updateTemplate } from '@/services/templates';
import TemplateVisibility, {
  TemplateVisibilities,
} from '@/services/templates/template-visibility';

export default function CreatorTemplatePage() {
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
        <Button
          colorScheme={'green'}
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving || !hasChanges}
        >
          Save
        </Button>
      </Flex>

      {/* Editor */}
      <Tabs>
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Store Page</Tab>
        </TabList>

        <TabPanels mt={'20px'}>
          {/* Tab: Info */}
          <TabPanel>
            <Flex justifyContent={'space-between'} gap={'30px'}>
              {/* Info Tab: Form */}
              <Flex flexDirection={'column'} gap={'20px'} w={'40%'}>
                <FormControl>
                  <FormLabel>Thumbnail</FormLabel>
                  <MediaInput
                    value={thumbnail}
                    setValue={setThumbnail}
                    filter={'image'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    isRequired={true}
                    placeholder={'My cool template'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    isRequired={true}
                    placeholder={'My cool template'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>

                <Flex justifyContent={'space-between'} gap={'20px'}>
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                      isRequired={true}
                      type={'number'}
                      placeholder={'1.23'}
                      value={`${price}`}
                      onChange={(e) => setPrice(parseFloat(e.target.value))}
                    />
                    <FormHelperText>
                      Use 0 to create a free-to-use template.
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      value={visibility}
                      onChange={(e) => {
                        setVisibility(e.target.value as TemplateVisibility);
                      }}
                    >
                      {TemplateVisibilities.map((visibility) => (
                        <option key={visibility.id} value={visibility.id}>
                          {visibility.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Platform</FormLabel>
                    <Select
                      value={service}
                      onChange={(e) => {
                        setService(e.target.value as ServiceType);
                      }}
                    >
                      {ServiceTypes.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Flex>
              </Flex>

              {/* Info Tab: Preview */}
              <Flex
                flexDirection={'column'}
                gap={'20px'}
                w={'60%'}
                alignItems={'center'}
              >
                <Box maxWidth={'350px'} width={'100%'} mt={'30px'}>
                  <TemplateCard
                    context="editor"
                    onCreateWidget={() => {}}
                    onDelete={() => {}}
                    template={{
                      ...template,
                      name,
                      description,
                      price,
                      service,
                      thumbnail,
                      visibility,
                    }}
                  />
                </Box>
              </Flex>
            </Flex>
          </TabPanel>

          {/* Tab: Store Page */}
          <TabPanel>
            <Flex justifyContent={'space-between'} gap={'30px'}>
              {/* Store Page: Form */}
              <Flex flexDirection={'column'} gap={'20px'} w={'40%'}>
                <Heading as={chakra.h2} size={'lg'}>
                  Store Page
                </Heading>

                <FormControl>
                  <Textarea
                    isRequired={true}
                    placeholder={'My cool template'}
                    value={storeDescription}
                    noOfLines={20}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    minHeight={'50vh'}
                  />
                </FormControl>
              </Flex>

              {/* Info Tab: Preview */}
              <Flex flexDirection={'column'} w={'60%'} gap={'20px'}>
                <Heading as={chakra.h2} size={'lg'}>
                  Preview
                </Heading>

                <MarkdownRenderer bg={bg} borderRadius={'10px'} p={'10px 20px'}>
                  {storeDescription}
                </MarkdownRenderer>
              </Flex>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
