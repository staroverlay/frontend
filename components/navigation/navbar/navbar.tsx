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
import { BsTwitch } from "react-icons/bs";

import NavbarButton from "./navbar-button/navbar-button";
import NavbarDropdown from "./navbar-dropdown/navbar-dropdown";

import useAuth from "../../../hooks/useAuth";

import User from "../../../lib/interfaces/user";

function NavbarAsGuest({ onLogin }: { onLogin: () => Promise<User> }) {
  return (
    <Button onClick={onLogin} leftIcon={<BsTwitch />}>
      Login with Twitch
    </Button>
  );
}

function NavbarAsLogged({ user }: { user: User }) {
  return (
    <>
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
    </>
  );
}

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, login } = useAuth();

  return (
    <Box width={"100%"} height={"65px"} padding={"15px 30px"}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        {/* Branding */}
        <Flex>
          <Image
            src={"/icon@32.png"}
            alt={"Logo"}
            height={"100%"}
            marginRight={"5px"}
          />
          <Heading color={"purple.400"} fontSize={"2xl"}>
            StreamOverlay
          </Heading>
        </Flex>

        {/* Buttons */}
        <Flex alignItems={"center"} gap={"8px"}>
          <NavbarButton
            label="Toggle color mode"
            icon={colorMode === "dark" ? <BiMoon /> : <BiSun />}
            onClick={toggleColorMode}
          />

          {user == null && <NavbarAsGuest onLogin={login} />}
          {user != null && <NavbarAsLogged user={user} />}
        </Flex>
      </Flex>
    </Box>
  );
}
