import { Box, IconButton } from '@chakra-ui/react';
import { ReactElement } from 'react';

interface NavbarButtonProps {
  icon: ReactElement;
  label: string;
  onClick?: () => void;
  children?: ReactElement;
}

export default function NavbarButton(props: NavbarButtonProps) {
  return (
    <Box>
      <IconButton
        aria-label={props.label}
        icon={props.icon}
        onClick={props.onClick}
        variant={'ghost'}
      />
      {props.children !== undefined && props.children}
    </Box>
  );
}
