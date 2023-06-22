import { Box, Flex, Heading, Text, Button, SimpleGrid } from "@chakra-ui/react";
import StatsCard from "../../components/cards/stats/StatsCard";
import TemplateCard from "../../components/cards/template/TemplateCard";
import ITemplate from "../../lib/interfaces/template";

function CreateTemplateButton() {
  return <Button>Create template</Button>;
}

function NoTemplates() {
  return (
    <Flex alignContent={"center"} justifyContent={"center"}>
      <Flex direction={"column"} alignContent={"center"} gap={"10px"}>
        <Heading>No templates</Heading>
        <CreateTemplateButton />
      </Flex>
    </Flex>
  );
}

interface TemplateGridProps {
  templates: ITemplate[];
}

function TemplatesGrid({ templates }: TemplateGridProps) {
  if (templates.length == 0) {
    return <NoTemplates />;
  }

  return (
    <SimpleGrid gridTemplateColumns={"repeat(auto-fit, 300px)"} spacing="40px">
      {templates.map((template) => (
        <TemplateCard
          key={template._id}
          template={template}
          context={"creator"}
        />
      ))}
    </SimpleGrid>
  );
}

export default function Templates() {
  return (
    <>
      <Flex flexDirection={"column"} gap={"30px"} width={"100%"}>
        <Box>
          <Heading>My templates</Heading>
          <Text>
            Create templates, use them for your streams, give them as a
            commission or sell them on the marketplace.
          </Text>
        </Box>

        <Flex gap={"10px"}>
          <StatsCard title="Private" value="0" maxValue="100" bg="#FC5C7D" />
          <StatsCard title="Published" value="0" maxValue="10" bg="#6A82FB" />
        </Flex>

        <TemplatesGrid
          templates={[
            {
              _id: "0",
              author: "Sammwy",
              html: "<div>Hello World</div>",
              name: "My first template",
              scopes: ["platform:storage"],
              service: "twitch",
              description: "This is just an example template",
              visibility: "private",
            },
          ]}
        />
      </Flex>
    </>
  );
}
