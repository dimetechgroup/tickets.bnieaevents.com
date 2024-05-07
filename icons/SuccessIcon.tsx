"use client";

import { ChakraProps, Icon } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa6";

const SuccessIcon = (props: ChakraProps) => {
  return <Icon as={FaCheck} {...props} />;
};

export default SuccessIcon;
