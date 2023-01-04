import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import type { AppProps } from "next/app";

// Theme
const colors = {
  transparent: "transparent",
};

const styles = {
  global: {
    "html, body": {
      background: "#0B0916", // #11101D
      color: "gray.200",
    },
  },
};

const theme = extendTheme({
  colors,
  styles,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
