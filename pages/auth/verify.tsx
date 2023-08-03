import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { verifyEmail } from "@/lib/services/user-service";

export default function Verify() {
  const { colorMode } = useColorMode();
  const mainColor = colorMode === "light" ? "white" : "black";

  const { logout, setUser } = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = await verifyEmail(code).catch((err) => {
      setError(err.message);
      return 
    });

    if (user) {
      setUser(user);
    }
  };

  useEffect(() => {
    setError(null);
  }, [code]);

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
    >
      <form onSubmit={handleSubmit}>
        <Flex
          bg={mainColor}
          borderRadius={"10px"}
          padding={"10px 20px"}
          flexDirection={"column"}
          gap={"15px"}
        >
          <Heading size={"lg"}>Email Verification</Heading>

          {error != null && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}


            <FormControl>
              <FormLabel>Code</FormLabel>
              <Input
                placeholder="ABC123"
                type="text"
                required
                value={code}
                minLength={6}
                maxLength={6}
                onChange={(e) => {
                  setCode(e.target.value.trim());
                }}
              />
            </FormControl>


          <Flex flexDirection={"column"} gap={"10px"}>
            <Button type="submit">Verify Email</Button>

            <Flex justifyContent={"center"}>
              <Button variant={"link"} style={{ fontSize: "12px" }} onClick={() => logout(true)}>
                Logout
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}
