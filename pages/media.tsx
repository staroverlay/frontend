import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';

import MediasGrid from '@/components/content/medias-grid/MediasGrid';
import usePlan from '@/hooks/usePlan';

import StatsCard from '../components/cards/stats/StatsCard';
import useMedia from '../hooks/useMedia';
import IMedia, { FileType } from '../lib/interfaces/media';

interface MediaFilesProps {
  files: IMedia[];
  filter?: FileType;
}

function UploadContentButton() {
  const { openUploadModal } = useMedia();
  return <Button onClick={openUploadModal}>Upload content</Button>;
}

function MediaFilesTab({ files, filter }: MediaFilesProps) {
  return (
    <TabPanel>
      <MediasGrid medias={files} filter={filter} />
    </TabPanel>
  );
}

export default function Media() {
  const { medias, storageUsage } = useMedia();
  const { activePlan } = usePlan();

  return (
    <Flex flexDirection={'column'} gap={'30px'} width={'100%'}>
      <Box>
        <Heading>Media</Heading>
        <Text>
          All media files available for your account widgets can be managed
          here.
        </Text>
      </Box>

      <Flex gap={'10px'}>
        <StatsCard
          title="Storage Quota"
          value={`${(storageUsage / 1024 / 1024).toFixed(2)}`}
          maxValue={`${activePlan.maxStorageSize / 1024 / 1024}`}
          unit="MB"
          bg="#A770EF"
        />
        <StatsCard
          title="Saved items"
          value={medias.length.toString()}
          maxValue={`${activePlan.maxStorageItems}`}
          bg="#fc67fa"
        />
      </Flex>

      <Tabs variant="soft-rounded">
        <Flex justifyContent={'space-between'}>
          <TabList gap={'10px'}>
            <Tab>Image</Tab>
            <Tab>Sounds</Tab>
            <Tab>Video</Tab>
          </TabList>

          <UploadContentButton />
        </Flex>

        <TabPanels mt={'20px'}>
          <MediaFilesTab files={medias} filter={'image'} />
          <MediaFilesTab files={medias} filter={'audio'} />
          <MediaFilesTab files={medias} filter={'video'} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
