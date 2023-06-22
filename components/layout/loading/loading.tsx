import { Flex, Spinner, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface LoadingProps extends PropsWithChildren {
  loaded: boolean;
  message?: string;
}

export default function Loading({ children, loaded, message }: LoadingProps) {
  if (loaded) return <>{children}</>;

  return (
    <Flex
      alignItems={"center"}
      direction={"column"}
      justifyContent={"center"}
      gap={"20px"}
      width={"100%"}
      height={"100vh"}
    >
      <Spinner size={"lg"} />
      <Text fontSize={"22px"}>{message}</Text>
    </Flex>
  );
}
