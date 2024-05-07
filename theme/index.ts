import { Checkbox, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    //overide checkbox colors

    brand: {
      white: "#FFFFFF",
      black: "#000000",
      gray: "#5D5D5D",
      lightGray: "#F1F1F1",
      main: "#CF2030",
      yellow: "#f6bf58",
    },
  },
});

export default theme;
