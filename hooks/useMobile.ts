import { useMediaQuery } from "@chakra-ui/react";

const useMobile = () => {
  const [result] = useMediaQuery("screen and (max-width: 700px)");
  return result;
};

export default useMobile;
