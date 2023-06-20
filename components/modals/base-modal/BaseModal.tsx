import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface BaseModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
}: BaseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
