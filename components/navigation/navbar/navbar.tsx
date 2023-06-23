import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { BiBell, BiMoon, BiSun, BiCog, BiExit } from "react-icons/bi";

import NavbarButton from "./navbar-button/navbar-button";
import NavbarDropdown from "./navbar-dropdown/navbar-dropdown";

import useAuth from "../../../hooks/useAuth";
import Link from "next/link";

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = useAuth();

  if (!user) return <></>;

  return (
    <Box width={"100%"} height={"65px"} padding={"15px 30px"}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        {/* Branding */}
        <Link href="/">
          <Flex alignItems={"center"}>
            <Image
              src={colorMode === "dark" ? "/icon@32.png" : "/black@64.png"}
              alt={"Logo"}
              height={"32px"}
              marginRight={"5px"}
            />
            <Heading fontSize={"2xl"}>StarOverlay</Heading>
          </Flex>
        </Link>

        {/* Buttons */}
        <Flex alignItems={"center"} gap={"8px"}>
          <NavbarButton
            label="Toggle color mode"
            icon={colorMode === "dark" ? <BiMoon /> : <BiSun />}
            onClick={toggleColorMode}
          />

          <NavbarButton label="Notifications" icon={<BiBell />} />

          <NavbarDropdown
            content={[
              {
                label: "Settings",
                icon: BiCog,
                link: "/settings",
              },
              {
                label: "Logout",
                icon: BiExit,
                link: "/logout",
                color: "critical",
              },
            ]}
          >
            <Avatar name={user.username} size={"sm"} src={user.avatar} />
          </NavbarDropdown>
        </Flex>
      </Flex>
    </Box>
  );
}
