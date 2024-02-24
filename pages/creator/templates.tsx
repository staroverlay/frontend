import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import InputAlert from '@/components/alerts/input/InputAlert';
import StatsCard from '@/components/cards/stats/StatsCard';
import TemplatesGrid from '@/components/content/templates-grid/TemplatesGrid';
import useTemplates from '@/hooks/useTemplates';
import { createTemplate } from '@/lib/services/template-service';
import { toastPending } from '@/lib/utils/toasts';

function CreateTemplateButton() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { addTemplate } = useTemplates();
  const { push: navigateTo } = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTemplate = async (input: string) => {
    const template = await createTemplate(input);
    if (!template) throw new Error('Template not created');
    addTemplate(template);
    navigateTo(`/creator/templates/${template._id}`);
    onClose();
  };

  const handleCreate = async (input: string) => {
    setIsCreating(true);
    await toastPending(handleCreateTemplate(input), {
      pending: 'Creating template...',
      success: 'Template created!',
    });
    setIsCreating(false);
  };

  return (
    <>
      <InputAlert
        isOpen={isOpen}
        isLoading={isCreating}
        onClose={onClose}
        onAccept={handleCreate}
        title="Create template"
        placeholder="Template name"
      >
        Choose a name for your template. You can change it later.
      </InputAlert>
      <Button
        onClick={onOpen}
        isLoading={isOpen}
        disabled={isOpen || isCreating}
      >
        Create template
      </Button>
    </>
  );
}

function NoTemplates({ message }: { message?: string }) {
  return (
    <Flex alignContent={'center'} justifyContent={'center'}>
      <Flex direction={'column'} alignContent={'center'} gap={'10px'}>
        <Heading>{message ? message : 'No templates'}</Heading>
        <CreateTemplateButton />
      </Flex>
    </Flex>
  );
}

export default function Templates() {
  const { userTemplates } = useTemplates();
  const [search, setSearch] = useState('');

  const publics = userTemplates.filter(
    (template) => template.visibility == 'public',
  ).length;

  const privates = userTemplates.filter(
    (template) =>
      template.visibility == 'private' || template.visibility == 'unlisted',
  ).length;

  return (
    <Flex flexDirection={'column'} gap={'30px'} width={'100%'}>
      <Box>
        <Heading>My templates</Heading>
        <Text>
          Create templates, use them for your streams, give them as a commission
          or sell them on the marketplace.
        </Text>
      </Box>
      <Flex gap={'10px'}>
        <StatsCard
          title="Private"
          value={privates.toString()}
          maxValue="100"
          bg="#FC5C7D"
        />
        <StatsCard
          title="Published"
          value={publics.toString()}
          maxValue="10"
          bg="#6A82FB"
        />
      </Flex>

      <Flex direction={'column'} gap={'10px'}>
        <Flex gap={'5px'}>
          <CreateTemplateButton />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            width={'initial'}
          />
        </Flex>

        <TemplatesGrid templates={userTemplates} search={search} />
      </Flex>
    </Flex>
  );
}
