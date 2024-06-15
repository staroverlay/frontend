import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode
} from '@chakra-ui/react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { IconType } from 'react-icons';
import { BiChevronDown } from 'react-icons/bi';

interface NavbarDropdownItem {
  icon?: IconType;
  label: string;
  link?: string;
  onClick?: () => unknown;
  color?: 'normal' | 'critical';
}

export interface NavbarDropdown extends PropsWithChildren {
  content: NavbarDropdownItem[];
}

export default function NavbarDropdown({ children, content }: NavbarDropdown) {
  const { colorMode } = useColorMode();

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<BiChevronDown />}
        variant={'unstyled'}
        textAlign={'center'}
        height={'100%'}
        color={'#777'}
      >
        {children}
      </MenuButton>
      <MenuList
        display={'block'}
        bg={colorMode === 'dark' ? 'blackAlpha.500' : 'blackAlpha.100'}
      >
        {content.map(
          ({ link, icon: IconElement, label, color, onClick }, key) => (
            <Link href={link || '#'} onClick={onClick}>
              <MenuItem
                key={key}
                bg={'transparent'}
                color={(color || 'normal') === 'normal' ? 'inherit' : 'red.500'}
              >
                <Text>
                  {IconElement && (
                    <Icon fontSize={'20px'} mr={'5px'}>
                      <IconElement />
                    </Icon>
                  )}
                  {label}
                </Text>
              </MenuItem>
            </Link>
          ),
        )}
      </MenuList>
    </Menu>
  );
}
