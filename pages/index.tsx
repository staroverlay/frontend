import { Flex, Heading } from '@chakra-ui/react';

import TemplateCard from '@/components/cards/template/TemplateCard';
import useTemplates from '@/hooks/useTemplates';

export default function Home() {
  const { sharedTemplates } = useTemplates();

  return (
    <Flex flexDir={'column'} gap={'50px'} width={'100%'}>
      {/* Hero */}
      <Flex
        flexDir={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={'20px'}
        padding={'40px 20px'}
        borderRadius={'25px'}
        width={'100%'}
        bg={'whiteAlpha.200'}
      >
        <Heading>Welcome to StarOverlay</Heading>
        <Heading size={'md'}>
          Y aqui pondria una noticia, SI TUVIERA UNA!
        </Heading>
      </Flex>

      {/* Gallery */}
      <Flex flexDir={'column'} gap={'20px'}>
        <Heading>🔥 Trending</Heading>
        <Flex gap={'10px'} alignItems={'center'} width={'100%'}>
          {sharedTemplates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onDelete={() => null}
              context={'explorer'}
              onCreateWidget={() => null}
            />
          ))}
        </Flex>
      </Flex>

      {/* Gallery */}
      <Flex flexDir={'column'} gap={'20px'}>
        <Heading>✨ Recently</Heading>
        <Flex gap={'10px'} alignItems={'center'} width={'100%'}>
          {sharedTemplates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onDelete={() => null}
              context={'explorer'}
              onCreateWidget={() => null}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
