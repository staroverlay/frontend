import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { MutableRefObject, PropsWithChildren, useRef } from "react";

interface ConfirmationAlertProps extends PropsWithChildren {
  title?: string;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function ConfirmationAlert(props: ConfirmationAlertProps) {
  const cancelRef = useRef() as MutableRefObject<null>;

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={props.isOpen}
      onClose={props.onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{props.title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{props.children}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={props.onClose}>
            No
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            onClick={props.onAccept}
            disabled={props.isLoading}
            isLoading={props.isLoading}
          >
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
