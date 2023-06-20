import { PropsWithChildren } from "react";
import { Box, Flex, Icon, Text, useColorMode } from "@chakra-ui/react";
import {
  BsHouse,
  BsStar,
  BsShop,
  BsPalette,
  BsAppIndicator,
  BsClockHistory,
  BsWindowSidebar,
  BsImage,
  BsShield,
} from "react-icons/bs";
import { BiBot } from "react-icons/bi";
import { IconType } from "react-icons";
import Link from "next/link";

interface SidebarItemProps {
  icon: IconType;
  to: string;
  label: string;
}

function SidebarSection({ children }: PropsWithChildren) {
  return <Box marginBottom={"22px"}>{children}</Box>;
}

function SidebarHeader({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();
  return (
    <Text
      color={colorMode === "dark" ? "gray.300" : "gray.800"}
      display={"block"}
      fontSize={"14px"}
      fontWeight={"bold"}
      padding={"5px 15px"}
    >
      <Flex>
        <Text>{children}</Text>
      </Flex>
    </Text>
  );
}

function SidebarItem({ icon: IconElement, to, label }: SidebarItemProps) {
  const { colorMode } = useColorMode();
  return (
    <Text
      as={Link}
      href={to}
      color={colorMode === "dark" ? "gray.400" : "gray.700"}
      _hover={{ color: colorMode === "dark" ? "white" : "black" }}
      display={"block"}
      fontSize={"14px"}
      padding={"5px 15px"}
    >
      <Flex alignItems={"center"}>
        {IconElement != null && (
          <Icon fontSize={"20px"}>
            <IconElement />
          </Icon>
        )}
        <Text ml={IconElement != null ? "5px" : "0px"}>{label}</Text>
      </Flex>
    </Text>
  );
}

export function Sidebar() {
  return (
    <Box
      borderRadius={"7px"}
      padding={"5px"}
      marginRight={"15px"}
      minWidth={"180px"}
    >
      <SidebarSection>
        <SidebarHeader>Overview</SidebarHeader>
        <SidebarItem to="/" icon={BsHouse} label="Home" />

        {/*
          <SidebarItem to="/" icon={BsStar} label="Membership" />
          <SidebarItem to="/" icon={BsShop} label="Marketplace" />
        */}
      </SidebarSection>

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
