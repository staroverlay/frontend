import {
  Button,
  Flex,
  Heading,
  Skeleton,
  Text,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import InputAlert from '@/components/alerts/input/InputAlert';
import MarkdownRenderer from '@/components/utils/MarkdownRenderer';
import useWidgets from '@/hooks/useWidgets';
import ITemplate from '@/lib/interfaces/templates/template';
import { getTemplateByID } from '@/lib/services/template-service';
import { createWidget } from '@/lib/services/widget-service';
import { toastPending } from '@/lib/utils/toasts';

import Error404 from '../404';

type TemplateStatus = 'unknown' | 'owned' | 'not-owned';

function getTemplateStatus(template: ITemplate | null): TemplateStatus {
  if (!template) {
    return 'unknown';
  }
  return template.price && template.price > 0 ? 'not-owned' : 'owned';
}

// Buttons
function CreateWidgetButton({ templateId }: { templateId: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { push: navigateTo } = useRouter();
  const { addWidget } = useWidgets();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (name: string) => {
    setIsCreating(true);
    toastPending(
      createWidget({
        displayName: name,
        template: templateId,
      }),
      {
        pending: 'Creating widget',
        success: 'Widget created',
      },
    )
      .then((widget) => {
        onClose();
        if (widget) {
          addWidget(widget);
          navigateTo(`/widgets/${widget._id}`);
        }
      })
      .finally(() => setIsCreating(false));
  };

  return (
    <>
      <InputAlert
        isOpen={isOpen}
        isLoading={isCreating}
        onClose={onClose}
        onAccept={handleCreate}
        title="Create Widget"
        placeholder="Widget name"
      >
        Choose a name for your widget. You can change it later.
      </InputAlert>
      <Button
        onClick={onOpen}
        isLoading={isOpen}
        disabled={isOpen || isCreating}
        colorScheme={'purple'}
      >
        Use this
      </Button>
    </>
  );
}

function BuyTemplateButton({ price }: { price: number }) {
  return <Button colorScheme={'green'}>Buy for ${price.toFixed(2)}</Button>;
}

// Page
export default function StoreTemplatePage() {
  const { query } = useRouter();
  const { colorMode } = useColorMode();
  const templateId = query.templateId as string;

  const [template, setTemplate] = useState<ITemplate | null>(null);
  const [fetching, setFetching] = useState(true);
  const templateStatus = getTemplateStatus(template);

  useEffect(() => {
    getTemplateByID(templateId).then((template) => {
      setTemplate(template);
      setFetching(false);
    });
  }, [templateId]);

  if (!fetching && !template) {
    return <Error404 />;
  }

  const handleUse = () => {};

  const handleAction = () => {
    if (templateStatus === 'owned') {
      handleUse();
    } else if (templateStatus === 'not-owned') {
      // Buy template.
    }
  };

  return (
    <Flex
      justifyContent={'center'}
      gap={'20px'}
      padding={'20px 40px'}
      width={'100%'}
    >
      <Flex flexDir={'column'} gap={'20px'} maxWidth={'70%'} width={'100%'}>
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          gap={'10px'}
          borderRadius={'20px'}
        >
          <Flex
            flexDir={'column'}
            gap={'10px'}
            color={colorMode == 'dark' ? 'gray.200' : 'gray.700'}
          >
            {template ? <Heading>{template.name}</Heading> : <Skeleton />}
            {template ? <Text>{template.description}</Text> : <Skeleton />}
          </Flex>

          {templateStatus === 'owned' && (
            <CreateWidgetButton templateId={templateId} />
          )}

          {templateStatus === 'not-owned' && (
            <BuyTemplateButton price={template?.price || 0} />
          )}
        </Flex>

        <Flex
          flexDir={'column'}
          gap={'20px'}
          padding={'10px 40px'}
          bg={colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.200'}
          borderRadius={'20px'}
        >
          {template ? (
            <MarkdownRenderer>
              {template.storeDescription || 'No description provided'}
            </MarkdownRenderer>
          ) : (
            <Skeleton />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
