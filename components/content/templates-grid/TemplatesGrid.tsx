import { Flex, Heading, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import ConfirmationAlert from '@/components/alerts/confirmation/ConfirmationAlert';
import InputAlert from '@/components/alerts/input/InputAlert';
import TemplateCard from '@/components/cards/template/TemplateCard';
import useTemplates from '@/hooks/useTemplates';
import useWidgets from '@/hooks/useWidgets';
import ITemplate from '@/lib/interfaces/templates/template';
import { deleteTemplate } from '@/lib/services/template-service';
import { createWidget } from '@/lib/services/widget-service';
import { toastPending } from '@/lib/utils/toasts';

interface TemplatesGridProps {
  search?: string;
  templates: ITemplate[];
}

function NoTemplates({ message }: { message?: string }) {
  return (
    <Flex alignContent={'center'} justifyContent={'center'}>
      <Flex direction={'column'} alignContent={'center'} gap={'10px'}>
        <Heading>{message ? message : 'No templates'}</Heading>
      </Flex>
    </Flex>
  );
}

function TemplatesRender({ templates }: { templates: ITemplate[] }) {
  const {
    isOpen: isCreateOpen,
    onClose: onCreateClose,
    onOpen: onCreateOpen,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const { push: navigateTo } = useRouter();
  const { addWidget } = useWidgets();
  const { removeTemplate } = useTemplates();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null,
  );

  const handleCreateWidget = (name: string) => {
    setLoading(true);
    toastPending(
      createWidget({
        displayName: name,
        template: selectedTemplate?._id as string,
      }),
      {
        pending: 'Creating widget',
        success: 'Widget created',
      },
    )
      .then((widget) => {
        onCreateClose();
        if (widget) {
          addWidget(widget);
          navigateTo(`/widgets/${widget._id}`);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteTemplate = () => {
    setLoading(true);
    toastPending(deleteTemplate(selectedTemplate as ITemplate), {
      pending: 'Deleting template',
      success: 'Template deleted',
    })
      .then(() => {
        onDeleteClose();
        removeTemplate(selectedTemplate as ITemplate);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <InputAlert
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onAccept={handleCreateWidget}
        isLoading={loading}
        title="Create widget"
        placeholder="Widget name"
      >
        Choose a name for your widget. You can change it later.
      </InputAlert>

      <ConfirmationAlert
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onAccept={handleDeleteTemplate}
        isLoading={loading}
        title={`Delete ${selectedTemplate?.name}?`}
      >
        This action can not be undone. Make sure you have a backup in case you
        need this template in the future.
      </ConfirmationAlert>

      <SimpleGrid
        gridTemplateColumns={'repeat(auto-fit, 300px)'}
        spacing="40px"
      >
        {templates.map((template) => (
          <TemplateCard
            key={template._id}
            template={template}
            context={'creator'}
            onCreateWidget={() => {
              onCreateOpen();
              setSelectedTemplate(template);
            }}
            onDelete={() => {
              onDeleteOpen();
              setSelectedTemplate(template);
            }}
          />
        ))}
      </SimpleGrid>
    </>
  );
}

export default function TemplatesGrid({
  search,
  templates,
}: TemplatesGridProps) {
  if (templates.length == 0) {
    return <NoTemplates />;
  }

  const templatesQuery = templates
    .filter((template) =>
      template.name.toLowerCase().includes(search ? search.toLowerCase() : ''),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (templatesQuery.length == 0) {
    return <NoTemplates message={`No templates for query "${search}"`} />;
  }

  return <TemplatesRender templates={templatesQuery} />;
}
