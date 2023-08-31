import { Flex, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface ErrorPageProps extends PropsWithChildren {
  message?: string;
}

export default function ErrorPage({ children, message }: ErrorPageProps) {
  return (
    <Flex
      alignItems={"center"}
      direction={"column"}
      justifyContent={"center"}
      gap={"20px"}
      width={"100%"}
      height={"100vh"}
    >
      {children}
      <Text fontSize={"22px"}>{message}</Text>
    </Flex>
  );
}
