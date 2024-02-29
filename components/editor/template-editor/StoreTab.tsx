import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  TabPanel,
  Text,
  Textarea,
  useColorMode,
} from '@chakra-ui/react';

import {
  PriceBadge,
  VisibilityBadge,
} from '@/components/cards/template/TemplateCard';
import MediaInput from '@/components/input/MediaInput';
import MarkdownRenderer from '@/components/utils/MarkdownRenderer';
import TemplateVisibility, {
  TemplateVisibilities,
} from '@/services/templates/template-visibility';

interface StoreTabProps {
  storeDescription: string;
  setStoreDescription: (markdown: string) => void;
  price: number;
  setPrice: (price: number) => void;
  visibility: TemplateVisibility;
  setVisibility: (visibility: TemplateVisibility) => void;
  thumbnail: string | null | undefined;
  setThumbnail: (thumbnail: string) => void;
  name: string;
  description: string;
}

export default function StoreTab(props: StoreTabProps) {
  const { colorMode } = useColorMode();
  const containerBg =
    colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.200';

  return (
    <TabPanel>
      <Flex justifyContent={'space-evenly'} gap={'20px'}>
        <Flex
          flexDirection={'column'}
          gap={'20px'}
          width={'100%'}
          maxWidth={'50%'}
        >
          <Flex gap={'10px'}>
            <FormControl>
              <FormLabel>Visibility</FormLabel>
              <Select
                value={props.visibility}
                onChange={(e) => {
                  props.setVisibility(e.target.value as TemplateVisibility);
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
              <FormLabel>Price</FormLabel>
              <Input
                isRequired={true}
                type={'number'}
                placeholder={'1.23'}
                value={`${props.price}`}
                onChange={(e) => props.setPrice(parseFloat(e.target.value))}
              />
              <FormHelperText>
                Use 0 to create a free-to-use template. If you change the price,
                users who have already purchased your product will NOT need to
                buy it again.
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Thumbnail</FormLabel>
              <MediaInput
                value={props.thumbnail}
                setValue={props.setThumbnail}
                filter={'image'}
              />
            </FormControl>
          </Flex>

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
          bg={containerBg}
          padding={'10px 20px'}
          borderRadius={'10px'}
        >
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            flexDir={'column'}
            gap={'10px'}
          >
            <Heading>{props.name}</Heading>
            <Text>{props.description}</Text>
            <Flex gap={'5px'}>
              <VisibilityBadge visibility={props.visibility} />
              <PriceBadge price={props.price} />
            </Flex>
          </Flex>

          <MarkdownRenderer>{props.storeDescription || ''}</MarkdownRenderer>
        </Flex>
      </Flex>
    </TabPanel>
  );
}
