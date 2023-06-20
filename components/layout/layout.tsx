import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";

import Navbar from "../navigation/navbar";
import Sidebar from "../navigation/sidebar";

interface LayoutProps {
  children: React.ReactElement;
}

function AuthenticatedLayout({ children }: LayoutProps) {
  const { pathname, push } = useRouter();

  if (pathname == "/login") {
    push("/");
    return <></>;
  }

  return (
    <Box>
      <Navbar />
      <Flex height={"calc(100vh - 65px)"} width={"100%"} padding={"10px"}>
        <Sidebar />
        {children}
      </Flex>
    </Box>
  );
}

function GuestLayout({ children }: LayoutProps) {
  const { redirectToLogin } = useAuth();
  const { pathname } = useRouter();

  if (pathname == "/login") {
    return children;
  }

  redirectToLogin();
  return <></>;
}

export function Layout(props: LayoutProps) {
  const { isLogged } = useAuth();

  return isLogged() ? (
    <AuthenticatedLayout {...props} />
  ) : (
    <GuestLayout {...props} />
  );
}
