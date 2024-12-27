import {
  chakra,
  Flex,
  FormControl,
  Heading,
  TabPanel,
  Textarea,
  useColorMode,
} from '@chakra-ui/react';

import MarkdownRenderer from '@/components/utils/MarkdownRenderer';

type Dispatcher<T> = (state: T) => unknown;

export interface StoreTabProps {
  storeDescription: string;
  setStoreDescription: Dispatcher<string>;
}

export default function StoreTab({
  storeDescription,
  setStoreDescription,
}: StoreTabProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const bg = isDark ? 'gray.800' : 'gray.100';

  return (
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
  );
}
