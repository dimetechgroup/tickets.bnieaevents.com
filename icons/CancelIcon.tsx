"use client";

import { ChakraProps, Icon } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
const CancelIcon = (props: ChakraProps) => {
  return <Icon as={IoMdClose} {...props} />;
};

export default CancelIcon;
