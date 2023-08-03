import useIntegrations from "@/hooks/useIntegrations";
import IIntegration, { IntegrationType } from "@/lib/interfaces/integration";
import { capitalize } from "@/lib/utils/strings";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  TabPanel,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons";
import { FaKickstarter } from "react-icons/fa";
import {
  BsCheck,
  BsTrash,
  BsTwitch,
  BsPlusLg,
  BsYoutube,
} from "react-icons/bs";
import { toastError } from "@/lib/utils/toasts";

const URLS: Record<IntegrationType, string> = {
  kick: "https://kick.com/",
  twitch: "https://twitch.tv/",
  youtube: "https://youtube.com/c/",
};

const COLORS: Record<IntegrationType, string> = {
  kick: "green",
  twitch: "purple",
  youtube: "red",
};

const ConnectionButton = ({
  type,
  Icon,
  onConnect,
}: {
  type: IntegrationType;
  Icon: IconType;
  onConnect: (type: IntegrationType) => Promise<IIntegration>;
}) => {
  const { addIntegration } = useIntegrations();
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);

  const bg = colorMode == "dark" ? "blackAlpha.500" : "blackAlpha.300";
  const fg = colorMode == "dark" ? "whiteAlpha.500" : "blackAlpha.900";

  const handleConnect = async () => {
    setLoading(true);

    const integration = await onConnect(type)
      .catch((e) => {
        toastError(e.message);
        return null;
      })
      .finally(() => setLoading(false));

    if (integration) {
      addIntegration(integration);
    }
  };

  return (
    <Flex
      bg={bg}
      p={"14px 28px"}
      borderRadius={"10px"}
      alignItems="center"
      justifyContent="space-between"
      width={"100%"}
      color={fg}
    >
      <Flex alignItems={"center"} gap={"8px"}>
        <Icon fontSize={"40px"} />

        <Box>
          <Text fontSize={"md"} fontWeight={"bold"}>
            {capitalize(type)}
          </Text>
          <Text fontSize="sm">No connected</Text>
        </Box>
      </Flex>

      <Box>
        <Button
          colorScheme={"pink"}
          size="sm"
          disabled={loading}
          isLoading={loading}
          onClick={handleConnect}
        >
          <BsPlusLg />
          <Text ml={"5px"}>Connect</Text>
        </Button>
      </Box>
    </Flex>
  );
};

const ConnectionItem = ({
  integration,
  Icon,
}: {
  integration: IIntegration;
  Icon: IconType;
}) => {
  const { colorMode } = useColorMode();
  const [hover, setHover] = useState(false);

  const bg = colorMode == "dark" ? "blackAlpha.700" : "blackAlpha.200";
  const accent = colorMode == "dark" ? "purple.200" : "purple.500";
  const link = URLS[integration.type] + integration.username;

  return (
    <Flex
      bg={bg}
      p={"14px 28px"}
      borderRadius={"10px"}
      alignItems="center"
      justifyContent="space-between"
      width={"100%"}
    >
      <Flex alignItems={"center"} gap={"8px"}>
        <Icon fill={COLORS[integration.type]} fontSize={"45px"} />
        <Avatar size={"md"} src={integration.avatar} />

        <Box>
          <Text fontSize={"md"} fontWeight={"bold"}>
            {integration.username}
          </Text>

          <Text fontSize={"sm"}>
            <Link
              color={accent}
              target="_blank"
              referrerPolicy="no-referrer"
              href={link}
            >
              {link.split("://")[1]}
            </Link>
          </Text>
        </Box>
      </Flex>

      <Box>
        <Button
          colorScheme={hover ? "red" : "green"}
          size="sm"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover ? <BsTrash /> : <BsCheck />}
          {hover ? "Disconnect" : "Connected"}
        </Button>
      </Box>
    </Flex>
  );
};

const ConnectionProvider = ({
  type,
  Icon,
  onConnect,
}: {
  type: IntegrationType;
  Icon: IconType;
  onConnect: (type: IntegrationType) => Promise<IIntegration>;
}) => {
  const { getIntegration } = useIntegrations();
  const integration = getIntegration(type);

  if (integration) {
    return <ConnectionItem integration={integration} Icon={Icon} />;
  } else {
    return <ConnectionButton type={type} Icon={Icon} onConnect={onConnect} />;
  }
};

export default function ConnectionsTab() {
  const onConnect = async (type: IntegrationType): Promise<IIntegration> => {
    const username = prompt("Enter your username");
    if (!username) throw new Error("Username is required");

    const integration: IIntegration = {
      type,
      username,
      avatar: "https://via.placeholder.com/150",
      _id: "",
      integrationId: "",
    };

    return integration;
  };

  return (
    <TabPanel>
      <Flex flexDir={"column"} gap={"10px"}>
        <ConnectionProvider
          onConnect={onConnect}
          Icon={FaKickstarter}
          type={"kick"}
        />
        <ConnectionProvider
          onConnect={onConnect}
          Icon={BsTwitch}
          type={"twitch"}
        />
        <ConnectionProvider
          onConnect={onConnect}
          Icon={BsYoutube}
          type={"youtube"}
        />
      </Flex>
    </TabPanel>
  );
}
