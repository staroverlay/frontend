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
  Toast,
  SimpleGrid,
  Card,
} from "@chakra-ui/react";
import MediaCard from "../components/cards/media-card/MediaCard";
import StatsCard from "../components/cards/stats-card/StatsCard";
import useMedia from "../hooks/useMedia";
import IMedia, { FileType } from "../lib/interfaces/media";

interface MediaFilesProps {
  files: IMedia[];
  filter?: FileType;
}

function UploadContentButton() {
  const { openUploadModal } = useMedia();
  return <Button onClick={openUploadModal}>Upload content</Button>;
}

function NoMediaTab() {
  return (
    <TabPanel>
      <Flex alignContent={"center"} justifyContent={"center"}>
        <Flex direction={"column"} alignContent={"center"} gap={"10px"}>
          <Heading>No media files</Heading>
          <UploadContentButton />
        </Flex>
      </Flex>
    </TabPanel>
  );
}

function MediaFilesTab({ files, filter }: MediaFilesProps) {
  const filteredFiles = files.filter((file) =>
    filter ? file.type == filter : true
  );
  const isEmpty = filteredFiles.length === 0;

  return (
    <TabPanel>
      <SimpleGrid minChildWidth="120px" spacing="40px">
        {filteredFiles.map((file) => (
          <MediaCard key={file.resourceId} media={file} />
        ))}

        {isEmpty && <NoMediaTab />}
      </SimpleGrid>
    </TabPanel>
  );
}

const files: IMedia[] = [
  {
    _id: "1",
    name: "Test",
    type: "image",
    resourceId: "1",
    size: 0,
    uploadId: "",
    userId: "",
  },
];

export default function Media() {
  return (
    <Flex flexDirection={"column"} gap={"30px"} width={"100%"}>
      <Box>
        <Heading>Media</Heading>
        <Text>
          All media files available for your account widgets can be managed
          here.
        </Text>
      </Box>

      <Flex gap={"10px"}>
        <StatsCard
          title="Storage Quota"
          value="0"
          maxValue="10"
          unit="GB"
          bg="#A770EF"
        />
        <StatsCard title="Saved items" value="0" maxValue="10" bg="#fc67fa" />
      </Flex>

      <Tabs variant="soft-rounded">
        <Flex justifyContent={"space-between"}>
          <TabList gap={"10px"}>
            <Tab>Image</Tab>
            <Tab>Sounds</Tab>
            <Tab>Video</Tab>
          </TabList>

          <UploadContentButton />
        </Flex>

        <TabPanels mt={"20px"}>
          <MediaFilesTab files={files} filter={"image"} />
          <MediaFilesTab files={files} filter={"sound"} />
          <MediaFilesTab files={files} filter={"video"} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
