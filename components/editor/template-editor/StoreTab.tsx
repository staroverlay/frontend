import {
  Flex,
  FormControl,
  FormLabel,
  TabPanel,
  Textarea,
} from '@chakra-ui/react';

import MarkdownRenderer from '@/components/utils/MarkdownRenderer';
import useAuth from '@/hooks/useAuth';

interface StoreTabProps {
  storeDescription: string;
  setStoreDescription: (markdown: string) => void;
}

export default function StoreTab(props: StoreTabProps) {
  const { user } = useAuth();

  return (
    <TabPanel>
      <Flex justifyContent={'space-evenly'} gap={'20px'}>
        <Flex
          flexDirection={'column'}
          gap={'20px'}
          width={'100%'}
          maxWidth={'50%'}
        >
          <FormControl>
            <FormLabel>Page Content</FormLabel>
            <Textarea
              isRequired={true}
              placeholder={'My cool template'}
              value={props.storeDescription}
              noOfLines={20}
              onChange={(e) => props.setStoreDescription(e.target.value)}
            />
          </FormControl>
        </Flex>

        <Flex
          flexDirection={'column'}
          gap={'20px'}
          width={'100%'}
          maxWidth={'50%'}
        >
          <MarkdownRenderer>{props.storeDescription || ''}</MarkdownRenderer>
        </Flex>
      </Flex>
    </TabPanel>
  );
}
