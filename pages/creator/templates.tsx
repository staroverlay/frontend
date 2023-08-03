import {
  Box,
  Flex,
  Heading,
  Input,
  Text,
  Button,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import InputAlert from "../../components/alerts/input/InputAlert";
import StatsCard from "../../components/cards/stats/StatsCard";
import TemplateCard from "../../components/cards/template/TemplateCard";
import useTemplates from "../../hooks/useTemplates";
import ITemplate from "../../lib/interfaces/template";
import { createTemplate } from "../../lib/services/template-service";
import { toastPending } from "../../lib/utils/toasts";

function CreateTemplateButton() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { addTemplate } = useTemplates();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTemplate = async (input: string) => {
    const template = await createTemplate(input);
    if (!template) throw new Error("Template not created");
    addTemplate(template);
    onClose();
  };

  const handleCreate = async (input: string) => {
    setIsCreating(true);
    await toastPending(handleCreateTemplate(input), {
      pending: "Creating template...",
      success: "Template created!",
    });
    setIsCreating(false);
  };

  return (
    <>
      <InputAlert
        isOpen={isOpen}
        isLoading={isCreating}
        onClose={onClose}
        onAccept={handleCreate}
        title="Create template"
        placeholder="Template name"
      >
        Choose a name for your template. You can change it later.
      </InputAlert>
      <Button
        onClick={onOpen}
        isLoading={isOpen}
        disabled={isOpen || isCreating}
      >
        Create template
      </Button>
    </>
  );
}

function NoTemplates({ message }: { message?: string }) {
  return (
    <Flex alignContent={"center"} justifyContent={"center"}>
      <Flex direction={"column"} alignContent={"center"} gap={"10px"}>
        <Heading>{message ? message : "No templates"}</Heading>
        <CreateTemplateButton />
      </Flex>
    </Flex>
  );
}

interface TemplateGridProps {
  templates: ITemplate[];
}

function TemplatesGrid({ templates }: TemplateGridProps) {
  const [search, setSearch] = useState("");
  const templatesQuery = templates
    .filter((template) =>
      template.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (templates.length == 0) return <NoTemplates />;

  return (
    <Flex direction={"column"} gap={"10px"}>
      <Flex gap={"5px"}>
        <CreateTemplateButton />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width={"initial"}
        />
      </Flex>

      <SimpleGrid
        gridTemplateColumns={"repeat(auto-fit, 300px)"}
        spacing="40px"
      >
        {templatesQuery.map((template) => (
          <TemplateCard
            key={template._id}
            template={template}
            context={"creator"}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
}

export default function Templates() {
  const { userTemplates } = useTemplates();

  const publics = userTemplates.filter(
    (template) => template.visibility == "public"
  ).length;

  const privates = userTemplates.filter(
    (template) =>
      template.visibility == "private" || template.visibility == "unlisted"
  ).length;

  return (
    <Flex flexDirection={"column"} gap={"30px"} width={"100%"}>
      <Box>
        <Heading>My templates</Heading>
        <Text>
          Create templates, use them for your streams, give them as a commission
          or sell them on the marketplace.
        </Text>
      </Box>

      <Flex gap={"10px"}>
        <StatsCard
          title="Private"
          value={privates.toString()}
          maxValue="100"
          bg="#FC5C7D"
        />
        <StatsCard
          title="Published"
          value={publics.toString()}
          maxValue="10"
          bg="#6A82FB"
        />
      </Flex>

      <TemplatesGrid templates={userTemplates} />
    </Flex>
  );
}
