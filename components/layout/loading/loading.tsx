import { Flex, Spinner, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import ErrorPage from "../error/error";

interface LoadingProps extends PropsWithChildren {
  loaded: boolean;
  message?: string;
  error?: string;
}

export default function Loading({
  children,
  loaded,
  message,
  error,
}: LoadingProps) {
  if (error) return <ErrorPage message={error} />;
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
