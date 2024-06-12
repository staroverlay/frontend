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
import useAcquisitions from '@/hooks/useAcquisitions';
import useWidgets from '@/hooks/useWidgets';
import { toastPending } from '@/lib/utils/toasts';
import { createAcquisition } from '@/services/acquisition';
import { getTemplateByID } from '@/services/templates';
import ITemplate from '@/services/templates/template';
import { createWidget } from '@/services/widgets';

import Error404 from '../404';

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

function BuyTemplateButton({
  price,
  templateId,
}: {
  price: number;
  templateId: string;
}) {
  const [isAcquiring, setIsAcquiring] = useState(false);
  const { addAcquisition } = useAcquisitions();

  const acquire = () => {
    setIsAcquiring(true);
    createAcquisition({
      productId: templateId,
      productType: 'template',
    })
      .then(addAcquisition)
      .finally(() => setIsAcquiring(false));
  };

  const text = price === 0 ? 'Use Free' : `Buy $${price.toFixed(2)}`;
  return (
    <Button colorScheme={'green'} onClick={acquire} isLoading={isAcquiring}>
      {text}
    </Button>
  );
}

// Page
export default function StoreTemplatePage() {
  const { query } = useRouter();
  const { colorMode } = useColorMode();
  const templateId = query.templateId as string;
  const { isAcquired } = useAcquisitions();
  const isTemplateAcquired = isAcquired('template', templateId);

  const [template, setTemplate] = useState<ITemplate | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getTemplateByID(templateId).then((template) => {
      setTemplate(template);
      setFetching(false);
    });
  }, [templateId]);

  if (!fetching && !template) {
    return <Error404 />;
  }

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

          {isTemplateAcquired && <CreateWidgetButton templateId={templateId} />}

          {!isTemplateAcquired && (
            <BuyTemplateButton
              price={template?.price || 0}
              templateId={templateId}
            />
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
