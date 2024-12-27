import { useState } from 'react';

export interface DisclosureHandler {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const useDisclosure = (): DisclosureHandler => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
  };
};

export default useDisclosure;
