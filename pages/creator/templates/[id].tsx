import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { updateTemplate } from "@/lib/services/templates";
import OverviewTab from "../../../components/editor/template-editor/OverviewTab";

import useTemplates from "../../../hooks/useTemplates";

import Error404 from "../../404";
import { toastPending } from "@/lib/utils/toasts";
import { hasObjectChanged } from "@/lib/utils/object";
import ITemplate from "@/lib/interfaces/template";

export default function CreatorTemplatePage() {
  const { userTemplates, updateTemplate: updateUserTemplate } = useTemplates();
  const { query } = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Find template by ID in query.
  const templateId = query.id as string;
  const template = userTemplates.find((t) => t._id === templateId);

  // Input fields.
  const [name, setName] = useState(template?.name);
  const [description, setDescription] = useState(template?.description);
  const [scopes, setScopes] = useState(template?.scopes);
  const [service, setService] = useState(template?.service);
  const [html, setHTML] = useState(template?.html);
  const [fields, setFields] = useState(template?.fields);
  const [visibility, setVisibility] = useState(
    template?.visibility || "public"
  );

  // Payload.
  const updatePayload = {
    name,
    description,
    scopes,
    service,
    html,
    fields,
    visibility,
  };
  const hasChanges = hasObjectChanged(template, updatePayload);

  // If template not found, render 404 error page.
  if (!template) {
    return <Error404 />;
  }

  // Handlers
  const handleSaveTemplate = async () => {
    const newTemplate = await updateTemplate(template, {
      name,
      description,
      scopes,
      service,
      html,
      fields,
      visibility,
    });

    if (newTemplate) {
      updateUserTemplate(newTemplate);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await toastPending(handleSaveTemplate, {
      success: "Template updated successfully!",
      pending: "Updating template...",
    });
    setIsSaving(false);
  };

  // Otherwise, render template editor.
  return (
    <Flex flexDirection={"column"} gap={"30px"} width={"100%"}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Heading>Editing template</Heading>
        <Button
          colorScheme={"green"}
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving || !hasChanges}
        >
          Save
        </Button>
      </Flex>

      <Tabs variant={"enclosed"}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Code editor</Tab>
          <Tab>Fields</Tab>
        </TabList>

        <TabPanels>
          <OverviewTab
            name={name || ""}
            setName={setName}
            description={description || ""}
            setDescription={setDescription}
            scopes={scopes || []}
            setScopes={setScopes}
            service={service || "twitch"}
            setService={setService}
            visibility={visibility}
            setVisibility={setVisibility}
          />
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
