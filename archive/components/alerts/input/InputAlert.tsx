import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Input,
} from '@chakra-ui/react';
import {
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';

interface InputAlertProps extends PropsWithChildren {
  title?: string;
  isLoading?: boolean;
  placeholder?: string;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (input: string) => void;
}

export default function InputAlert(props: InputAlertProps) {
  const cancelRef = useRef() as MutableRefObject<null>;
  const [input, setInput] = useState('');
  const trimmedInput = input.trim();

  const handleClick = () => {
    props.onAccept(trimmedInput);
  };

  useEffect(() => {
    if (props.isOpen) {
      setInput('');
    }
  }, [props.isOpen]);

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
        <AlertDialogBody>
          <Flex direction={'column'} gap={'10px'}>
            <Box>{props.children}</Box>
            <Box>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={props.placeholder}
              />
            </Box>
          </Flex>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            ml={3}
            onClick={handleClick}
            disabled={props.isLoading || trimmedInput === ''}
            isLoading={props.isLoading}
          >
            Save
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
