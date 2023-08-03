import { createUser } from "@/lib/services/user-service";
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaKickstarter, FaTwitch, FaYoutube } from "react-icons/fa";

export default function Register() {
  const { colorMode } = useColorMode();
  const mainColor = colorMode === "light" ? "white" : "black";

  const { push: navigateTo } = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    const payload = { email, password, username: email.split("@")[0] };
    const user = await createUser(payload).catch((e) => {
      setError(e.message);
      return null;
    }).finally(() => setLoading(false));

    if (user) {
      navigateTo("/auth/login");
    }
  };

  useEffect(() => {
    setError(null);
  }, [email, password, confirmPassword]);

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
          <Heading size={"lg"}>Sign up</Heading>

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

          <FormControl>
            <FormLabel>Confirm password</FormLabel>
            <Input
              placeholder="********"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </FormControl>

          <Flex flexDirection={"column"} gap={"10px"}>
            <Button type="submit">Register</Button>

            <Flex justifyContent={"center"}>
              <Link href={"/auth/login"} style={{ fontSize: "12px" }}>
                Already registered? Sign in here.
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
