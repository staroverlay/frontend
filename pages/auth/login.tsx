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
  IconButton,
  Input,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaKickstarter, FaTwitch, FaYoutube } from "react-icons/fa";

export default function Login() {
  const { colorMode } = useColorMode();
  const mainColor = colorMode === "light" ? "white" : "black";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    setError(null);
  }, [email, password]);

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
          <Heading size={"lg"}>Sign in</Heading>

          {error != null && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="john@doe.com"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="********"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormControl>

          <Flex flexDirection={"column"} gap={"10px"}>
            <Button type="submit">Login</Button>

            <Flex justifyContent={"space-between"}>
              <Link
                href={"/auth/recovery"}
                style={{ fontSize: "12px", marginRight: "8px" }}
              >
                Forgot your password?
              </Link>

              <Link
                href={"/auth/register"}
                style={{ fontSize: "12px", marginLeft: "8px" }}
              >
                Register an account.
              </Link>
            </Flex>

            <Flex justifyContent={"space-around"}>
              <IconButton
                aria-label="Login with Kick"
                colorScheme={"green"}
                icon={<FaKickstarter />}
              />
              <IconButton
                aria-label="Login with Twitch"
                colorScheme={"purple"}
                icon={<FaTwitch />}
              />
              <IconButton
                aria-label="Login with YouTube"
                colorScheme={"red"}
                icon={<FaYoutube />}
              />
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}
