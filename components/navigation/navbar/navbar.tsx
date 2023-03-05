import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { BiBell, BiMoon, BiSun } from "react-icons/bi";
import NavbarButton from "./navbar-button/navbar-button";

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

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
        <Flex alignItems={"center"}>
          <NavbarButton label="Notifications" icon={<BiBell />} />
          <NavbarButton
            label="Toggle color mode"
            icon={colorMode === "dark" ? <BiMoon /> : <BiSun />}
            onClick={toggleColorMode}
          />
          <Avatar
            name={"Sammwy"}
            size={"sm"}
            src={
              "https://static-cdn.jtvnw.net/jtv_user_pictures/a286eed0-c827-4215-b4cc-36cdce07c6db-profile_image-300x300.png"
            }
          />
        </Flex>
      </Flex>
    </Box>
  );
}