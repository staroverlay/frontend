import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  TabPanel,
  Textarea,
} from '@chakra-ui/react';

import TemplateCard from '@/components/cards/template/TemplateCard';
import MediaInput from '@/components/input/MediaInput';
import ServiceType, { ServiceTypes } from '@/services/shared/service-type';
import TemplateVisibility, {
  TemplateVisibilities,
} from '@/services/templates/template-visibility';

type Dispatcher<T> = (state: T) => unknown;

export interface SummaryTabProps {
  thumbnail: string | undefined;
  setThumbnail: Dispatcher<string>;
  name: string;
  setName: Dispatcher<string>;
  description: string;
  setDescription: Dispatcher<string>;
  price: number;
  setPrice: Dispatcher<number>;
  visibility: TemplateVisibility;
  setVisibility: Dispatcher<TemplateVisibility>;
  service: ServiceType;
  setService: Dispatcher<ServiceType>;
}

export default function SummaryTab({
  thumbnail,
  setThumbnail,
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  visibility,
  setVisibility,
  service,
  setService,
}: SummaryTabProps) {
  return (
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
                _id: '123',
                creatorId: '123',
                lastVersionId: '123',
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
  );
}
