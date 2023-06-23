import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Flex,
  Heading,
  Stack,
  Text,
  Badge,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaEye,
  FaLock,
  FaLink,
  FaEllipsisV,
  FaDollarSign,
  FaDownload,
} from "react-icons/fa";

import ITemplate from "../../../lib/interfaces/template";
import { toastPending } from "../../../lib/utils/toasts";
import ConfirmationAlert from "../../alerts/confirmation/ConfirmationAlert";

import styles from "./TemplateCard.module.css";

interface TemplateCardProps {
  template: ITemplate;
  context?: "explorer" | "creator" | "editor";
}

const icons = {
  public: <FaEye />,
  private: <FaLock />,
  unlisted: <FaLink />,
};

const colors = {
  public: "green",
  private: "red",
  unlisted: "orange",
};

export default function TemplateCard(props: TemplateCardProps) {
  const {
    isOpen: isDeleteOpen,
    onOpen: openDeleteDialog,
    onClose: onCloseDelete,
  } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const { template } = props;
  const context = props.context || "explorer";
  const isEditor = props.context == "editor";
  const isExplorer = context === "explorer";
  const isEditorOrExplorer = isEditor || isExplorer;

  const VisibilityBadge = () => (
    <Badge colorScheme={colors[template.visibility]}>
      <Flex className={styles.flex}>
        {icons[template.visibility]} {template.visibility}
      </Flex>
    </Badge>
  );

  const PriceBadge = () => (
    <Badge colorScheme={"green"}>
      <Flex alignItems={"center"}>
        <FaDollarSign /> 5.00
      </Flex>
    </Badge>
  );

  const OptionsButton = () => (
    <Menu>
      <MenuButton as={IconButton} icon={<FaEllipsisV />} variant={"ghost"} />
      <MenuList>
        <Link href={`/creator/templates/${template._id}`}>
          <MenuItem>Edit</MenuItem>
        </Link>
        <Link href={`/marketplace/templates/${template._id}`}>
          <MenuItem>View store page</MenuItem>
        </Link>
        <MenuItem>Clone</MenuItem>
        <MenuDivider />
        <MenuItem color={"cyan.400"}>Copy link</MenuItem>
        <MenuItem color={"red.400"} onClick={openDeleteDialog}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );

  async function handleDelete() {
    onCloseDelete();
  }

  const DeleteModal = () => {
    return (
      <ConfirmationAlert
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        onAccept={async () => {
          setIsDeleting(true);
          await toastPending(handleDelete, {
            pending: "Deleting template",
            success: "Template deleted",
          });
          setIsDeleting(false);
        }}
        isLoading={isDeleting}
        title={`Delete ${template.name}?`}
      >
        This action can not be undone. Make sure you have a backup in case you
        need this template in the future.
      </ConfirmationAlert>
    );
  };

  return (
    <Card className={styles.card}>
      <DeleteModal />

      <CardBody>
        <Stack spacing="2">
          <Flex className={styles.flex} justifyContent={"space-between"}>
            <Heading size="md">{template.name || "Unnamed Template"}</Heading>
            {!isEditorOrExplorer && <OptionsButton />}
          </Flex>

          {!isExplorer && (
            <Flex className={styles.flex}>
              <VisibilityBadge />
              {!isEditor && <PriceBadge />}
            </Flex>
          )}

          <Text>{template.description || "No description provided"}</Text>

          <Flex className={styles.author}>
            {isExplorer && (
              <Link href={`/creators/${template.author.toLowerCase()}`}>
                By {template.author}
              </Link>
            )}

            {isEditor && <Text>By you ({template.author})</Text>}

            <Flex className={styles.flex} gap={"10px"}>
              <Flex className={styles.flex}>
                <FaEye /> 0
              </Flex>
              <Flex className={styles.flex}>
                <FaDownload /> 0
              </Flex>
            </Flex>
          </Flex>

          {isEditorOrExplorer && (
            <Flex className={styles.flex}>
              <Button size={"xs"} colorScheme={"pink"}>
                Use
              </Button>

              <Button size={"xs"} colorScheme={"green"}>
                Buy $5.00
              </Button>
            </Flex>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
