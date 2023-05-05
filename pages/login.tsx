import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { BsTwitch } from "react-icons/bs";

import useFetch from "../hooks/useFetch";
import { ResponseError } from "../lib/interfaces/response";

export default function Login() {
  const { error, ...loginQuery } = useFetch("post", "/api/login");
  const { query } = useRouter();

  useEffect(() => {
    const code = query.code;

    if (code) {
      loginQuery.sendOnce(null, { code });
    }
  }, [loginQuery, query.code]);

  useEffect(() => {
    const data = loginQuery.data;
    if (data) {
      window?.opener.postMessage({ channel: "so_auth", data }, "*");
    }
  }, [loginQuery.data]);

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
          <Heading my={"10px"}>Error ({error.kind})</Heading>
          <Text fontSize={"18px"}>{error.message}</Text>
        </>
      )}
    </Flex>
  );
}
