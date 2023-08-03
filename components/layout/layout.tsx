import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import useAuth from "../../hooks/useAuth";
import Navbar from "../navigation/navbar";
import Sidebar from "../navigation/sidebar";

import styles from "./layout.module.css";

interface LayoutProps {
  children: React.ReactElement;
}

function AuthenticatedLayout({ children }: LayoutProps) {
  const { pathname, push } = useRouter();

  if (pathname.startsWith("/auth")) {
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
  const { pathname, push } = useRouter();
  const { isLogged, user } = useAuth();
  const isEmailVerified = user?.isEmailVerified;

  if (!pathname.startsWith("/auth/verify") && isLogged() && !isEmailVerified) {
    push("/auth/verify");
    return <></>;
  }

  if (pathname.startsWith("/auth/verify") && !isLogged()) {
    push("/auth/login");
    return <></>;
  }

  if (pathname.startsWith("/auth")) {
    return <Box className={styles["guess-bg"]}>{children}</Box>;
  }

  push("/auth/login");
  return <></>;
}

export function Layout(props: LayoutProps) {
  const { isLogged, user } = useAuth();
  const isEmailVerified = user?.isEmailVerified;

  return isEmailVerified && isLogged() ? (
    <AuthenticatedLayout {...props} />
  ) : (
    <GuestLayout {...props} />
  );
}
