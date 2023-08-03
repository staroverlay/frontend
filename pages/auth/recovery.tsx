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
import { BiCheckCircle } from "react-icons/bi";
import Link from "next/link";
import { useEffect, useState } from "react";

type RecoveryStep = "email" | "code" | "password";

export default function Recovery() {
  const { colorMode } = useColorMode();
  const mainColor = colorMode === "light" ? "white" : "black";

  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step == "email") {
      setStep("code");
      setSuccess(`Email sent to ${email}`);
    } else if (step == "code") {
      setStep("password");
      setSuccess(null);
    } else if (step == "password") {
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    setError(null);
  }, [email, code, password]);

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
          <Heading size={"lg"}>Password Recovery</Heading>

          {error != null && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success != null && (
            <Alert status="success">
              <AlertTitle>
                <BiCheckCircle />
              </AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === "email" && (
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
          )}

          {step === "code" && (
            <FormControl>
              <FormLabel>Code</FormLabel>
              <Input
                placeholder="123456"
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
          )}

          {step === "password" && (
            <FormControl>
              <FormLabel>New Password</FormLabel>
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
          )}

          <Flex flexDirection={"column"} gap={"10px"}>
            <Button type="submit">
              {step === "email" && "Send email"}
              {step === "code" && "Submit code"}
              {step === "password" && "Change password"}
            </Button>

            <Flex justifyContent={"center"}>
              <Link href={"/auth/login"} style={{ fontSize: "12px" }}>
                Try login instead
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}
