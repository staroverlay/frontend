import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Navbar from "../navigation/navbar";
import Sidebar from "../navigation/sidebar";

interface LayoutProps {
  children: React.ReactElement;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useRouter();

  if (pathname == "/login") {
    return children;
  }

  return (
    <Box>
      <Navbar />
      <Flex height={"calc(100vh - 65px)"} width={"100%"} padding={"10px"}>
        <Sidebar />
        <Box>{children}</Box>
      </Flex>
    </Box>
  );
}
