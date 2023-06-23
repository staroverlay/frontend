import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { BsTwitch } from "react-icons/bs";

import useAuth from "../hooks/useAuth";

export default function Login() {
  const { loginWithCode, loginWithToken, redirectToLogin } = useAuth();
  const { query } = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function login(code: string) {
      const user = await loginWithCode(code);
      if (!user) {
        setError("Unknown error");
      }
    }

    if (query.code) {
      login(query.code as string).catch((e) => {
        setError(e.message);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.code]);

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
      flexDirection={"column"}
    >
      <BsTwitch fontSize={"6em"} />

      {error == null ? (
        <>
          <Heading my={"10px"}>Please wait...</Heading>
          <Text fontSize={"18px"}>Authenticating with twitch</Text>
        </>
      ) : (
        <>
          <Heading my={"10px"}>Error</Heading>
          <Text fontSize={"18px"}>{error}</Text>
        </>
      )}
    </Flex>
  );
}
