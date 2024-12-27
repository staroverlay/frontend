import { cardAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const Card = defineMultiStyleConfig({
  baseStyle: definePartsStyle((props) => ({
    container: {
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
      backgroundColor: mode('blackAlpha.200', 'whiteAlpha.200')(props),
    },
  })),
});

export default Card;
