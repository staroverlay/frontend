import { Button, Flex, Heading, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';

import TemplateCard from '@/components/cards/template/TemplateCard';
import useTemplates from '@/hooks/useTemplates';

export default function Home() {
  const { sharedTemplates } = useTemplates();
  const { colorMode } = useColorMode();

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
        bg={`url("/assets/images/galaxy-bg.png")`}
        bgPos={'center'}
        color={'white'}
      >
        <Heading>Welcome to StarOverlay</Heading>
        <Text size={'md'}>
          Remember that we are in beta phase! Join our Discord server.
        </Text>
        <Link href={'https://discord.gg/qh2H8Ws4'} target={'_blank'}>
          <Button colorScheme={'purple'}>Discord</Button>
        </Link>
      </Flex>

      {/* Gallery */}
      <Flex flexDir={'column'} gap={'20px'}>
        <Heading>✨ Recently added</Heading>
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
