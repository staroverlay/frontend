import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { IconType } from 'react-icons';
import { BsHouse, BsImage, BsPalette, BsWindowSidebar } from 'react-icons/bs';

import useAuth from '../../../hooks/useAuth';

interface SidebarItemProps {
  icon: IconType;
  to: string;
  label: string;
}

function SidebarSection({ children }: PropsWithChildren) {
  return <Box marginBottom={'22px'}>{children}</Box>;
}

function SidebarHeader({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();
  return (
    <Text
      color={colorMode === 'dark' ? 'gray.300' : 'gray.800'}
      display={'block'}
      fontSize={'14px'}
      fontWeight={'bold'}
      padding={'5px 15px'}
    >
      {children}
    </Text>
  );
}

function SidebarItem({ icon: IconElement, to, label }: SidebarItemProps) {
  const { colorMode } = useColorMode();
  const { pathname } = useRouter();
  const isActive = pathname === to;

  const hoverColor = colorMode === 'dark' ? 'white' : 'black';
  const inactiveColor = colorMode === 'dark' ? 'gray.400' : 'gray.500';
  const activeColor = colorMode === 'dark' ? 'purple.300' : 'purple.500';
  const color = isActive ? activeColor : inactiveColor;

  return (
    <Text
      as={Link}
      href={to}
      color={color}
      _hover={{ color: isActive ? color : hoverColor }}
      display={'block'}
      fontSize={'14px'}
      padding={'5px 15px'}
    >
      <Flex alignItems={'center'} gap={'6px'}>
        {IconElement != null && (
          <Box fontSize={'16px'}>
            <IconElement />
          </Box>
        )}
        {label}
      </Flex>
    </Text>
  );
}

export function Sidebar() {
  const { user } = useAuth();

  return (
    <Box
      borderRadius={'7px'}
      padding={'5px'}
      marginRight={'15px'}
      minWidth={'180px'}
    >
      <SidebarSection>
        <SidebarHeader>Overview</SidebarHeader>
        <SidebarItem to="/" icon={BsHouse} label="Home" />

        {/*
          <SidebarItem to="/" icon={BsStar} label="Membership" />
          <SidebarItem to="/" icon={BsShop} label="Marketplace" />
        */}
      </SidebarSection>

      {user?.isCreator && (
        <SidebarSection>
          <SidebarHeader>Creator</SidebarHeader>
          <SidebarItem
            to="/creator/templates"
            icon={BsPalette}
            label="My templates"
          />
        </SidebarSection>
      )}

      <SidebarSection>
        <SidebarHeader>Streaming</SidebarHeader>
        <SidebarItem to="/widgets" icon={BsWindowSidebar} label="My widgets" />
        <SidebarItem to="/media" icon={BsImage} label="Manage media" />
        {/*
        <SidebarItem to="/" icon={BsAppIndicator} label="Dashboard" />
        <SidebarItem to="/" icon={BsClockHistory} label="Activity feed" />
        
        <SidebarItem to="/" icon={BsShield} label="Editors & Moderators" />
        <SidebarItem to="/" icon={BiBot} label="Chatbot" />
        */}
      </SidebarSection>
    </Box>
  );
}
