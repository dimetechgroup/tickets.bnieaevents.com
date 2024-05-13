"use client";
import { handleBuyingTicket } from "@/app/actions";
import { CancelIcon } from "@/icons";
import { FormSchema } from "@/schemas";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Spinner,
  Stack,
  StackDivider,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "./loader";

const currencyOptions = [
  {
    label: "KES",
    value: "KES",
  },
  {
    label: "USD",
    value: "USD",
  },
];

export type FormData = z.infer<typeof FormSchema>;

const HeroPage = ({ rate }: { rate: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const toast = useToast();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });
  const selectedCurrency = watch("currency");
  const noOfTickets = watch("numberOfTickets");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const res = await handleBuyingTicket(data);

    if (res.status && res.authorization_url) {
      reset();
      router.push(res.authorization_url);
      setPageLoading(true);

      setTimeout(() => {
        setPageLoading(false);
      }, 3000);

      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast({
        title: "Error",
        description: res.message,
        status: "error",
        position: "top",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  function getHeading() {
    if (noOfTickets) {
      switch (selectedCurrency) {
        case "KES":
          return `${noOfTickets} x ${Math.ceil(rate) * 100}= KSH ${(
            noOfTickets *
            Math.ceil(rate) *
            100
          ).toLocaleString()}`;
        default:
          return `${noOfTickets} x 100 = $ ${noOfTickets * 100}`;
      }
    } else {
      switch (selectedCurrency) {
        case "KES":
          return `@ KSH ${rate * 100}`;
        default:
          return `$ 100`;
      }
    }
  }

  return (
    <Grid
      width="100vw"
      minH="100vh"
      bgImage="/hero-bg.jpg"
      backgroundSize="cover"
      backgroundPosition="center"
      placeItems="center"
    >
      {pageLoading ? (
        <Loading />
      ) : (
        <Stack
          my="2rem"
          as="form"
          w={{ base: "95%", sm: "md" }}
          borderRadius="md"
          bg="brand.white"
          p="1.5rem"
          pt="2rem"
          gap="1rem"
          position="relative"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Heading fontSize="xl" color="brand.main" fontStyle="italic">
            <Box as="span" color="brand.black">
              Early Bird {"->"}
            </Box>{" "}
            {getHeading()}
          </Heading>
          <StackDivider h=".1rem" bg="brand.main" />
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel
              fontWeight="semibold"
              fontSize={{ base: "md", sm: "lg" }}
            >
              Full Name
            </FormLabel>
            <Input
              {...register("name")}
              type="text"
              placeholder="Enter your Full Name"
              size="lg"
              border="3px solid var(--chakra-colors-brand-black)"
              borderRadius="none"
              _active={{ border: "none" }}
              _hover={{ border: "3px solid var(--chakra-colors-brand-yellow)" }}
              _focus={{
                border: "3px solid var(--chakra-colors-brand-yellow)",
              }}
            />
            {errors.name && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.name.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel
              fontWeight="semibold"
              fontSize={{ base: "md", sm: "lg" }}
            >
              Email
            </FormLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email address"
              size="lg"
              border="3px solid var(--chakra-colors-brand-black)"
              borderRadius="none"
              _active={{ border: "none" }}
              _hover={{ border: "3px solid var(--chakra-colors-brand-yellow)" }}
              _focus={{
                border: "3px solid var(--chakra-colors-brand-yellow)",
              }}
            />
            {errors.email && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.email.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.numberOfTickets}>
            <FormLabel
              fontWeight="semibold"
              fontSize={{ base: "md", sm: "lg" }}
            >
              Number of Tickets (Max 20)
            </FormLabel>

            <Input
              {...register("numberOfTickets", {
                value: 1,
                valueAsNumber: true,
              })}
              type="number"
              placeholder="Enter number of tickets"
              border="3px solid var(--chakra-colors-brand-black)"
              borderRadius="none"
              _active={{ border: "none" }}
              _hover={{ border: "3px solid var(--chakra-colors-brand-yellow)" }}
              _focus={{
                border: "3px solid var(--chakra-colors-brand-yellow)",
              }}
            />

            {errors.numberOfTickets ? (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.numberOfTickets.message}
              </FormErrorMessage>
            ) : (
              <FormHelperText>Each ticket costs $100</FormHelperText>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.currency}>
            <FormLabel
              fontWeight="semibold"
              fontSize={{ base: "md", sm: "lg" }}
            >
              Select Currency ( {selectedCurrency || "USD"} ){" "}
            </FormLabel>
            <Select
              placeholder="Select"
              size="lg"
              focusBorderColor="brand.yellow"
              border="3px solid var(--chakra-colors-brand-black)"
              _active={{ border: "none" }}
              _hover={{ border: "3px solid var(--chakra-colors-brand-yellow)" }}
              borderRadius="none"
              fontWeight={600}
              defaultValue="USD"
              {...register("currency")}
            >
              {currencyOptions.map((option) => (
                <Box
                  as="option"
                  fontWeight={600}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Box>
              ))}
            </Select>
            {errors.currency && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.currency.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <Flex
            gap={2}
            align="center"
            fontWeight="semibold"
            fontSize={{ base: "md", sm: "lg" }}
          >
            <Text fontWeight={600}>Are you a BNI Member?</Text>{" "}
            <Switch onChange={() => setIsMember(!isMember)} />
          </Flex>
          {isMember && (
            <AnimatePresence>
              <motion.div
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "100px" }}
                exit={{ opacity: 1, height: "1px" }}
              >
                <FormControl isRequired isInvalid={!!errors.chapter}>
                  <FormLabel
                    fontWeight="semibold"
                    fontSize={{ base: "md", sm: "lg" }}
                  >
                    Which Chapter?
                  </FormLabel>
                  <Input
                    {...register("chapter")}
                    type="text"
                    placeholder="Enter your Chapter name"
                    size="lg"
                    border="3px solid var(--chakra-colors-brand-black)"
                    borderRadius="none"
                    _active={{ border: "none" }}
                    _hover={{
                      border: "3px solid var(--chakra-colors-brand-yellow)",
                    }}
                    _focus={{
                      border: "3px solid var(--chakra-colors-brand-yellow)",
                    }}
                  />
                  {errors.chapter ? (
                    <FormErrorMessage>
                      <FormErrorIcon />
                      {errors.chapter.message}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText>
                      If you are a member, Enter your chapter.
                    </FormHelperText>
                  )}
                </FormControl>
              </motion.div>
            </AnimatePresence>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            isDisabled={isLoading}
            bg="brand.main"
            color="brand.white"
            borderRadius="none"
            transition="all 0.3s ease-in-out"
            border="3px solid"
            borderColor="transparent"
            py="1.3rem"
            _hover={{
              bg: "brand.black",
            }}
          >
            GET TICKET
          </Button>
          <Link href="https://bnieaevents.com">
            <Stack
              pos="absolute"
              borderRadius="full"
              bg="rgba(207, 32, 48,0.2)"
              top={1}
              right={3}
              p=".1rem"
              _hover={{ cursor: "pointer" }}
            >
              <CancelIcon boxSize={7} color="brand.main" />
            </Stack>{" "}
          </Link>
        </Stack>
      )}
    </Grid>
  );
};

export default HeroPage;
