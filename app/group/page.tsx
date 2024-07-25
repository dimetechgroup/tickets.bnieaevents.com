"use client";
import { handleBuyingTicket } from "@/app/actions";
import Loading from "@/components/loader";
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

const Group = ({ rate }: { rate: number }) => {
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
  const noOfTickets = 6;

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
          return `6 x ${Math.ceil(rate) * 100}= KSH ${(
            noOfTickets *
            Math.ceil(rate) *
            150
          ).toLocaleString()}`;
        default:
          //   return `${noOfTickets} x 100 = $ ${noOfTickets * 100}`;
          return `$600`;
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
              Group Ticket {"->"}
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
              placeholder="Ticket Buyer Name"
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
              Number of Tickets (5)
            </FormLabel>

            <Input
              {...register("numberOfTickets", {
                value: 6,
                valueAsNumber: true,
              })}
              type="hidden"
              defaultValue={6}
              readOnly
              placeholder="Enter number of tickets"
              border="3px solid var(--chakra-colors-brand-black)"
              borderRadius="none"
              _active={{ border: "none" }}
              _hover={{ border: "3px solid var(--chakra-colors-brand-yellow)" }}
              _focus={{
                border: "3px solid var(--chakra-colors-brand-yellow)",
              }}
            />

            {/* ticket holder no 1 */}

            {errors.numberOfTickets ? (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.numberOfTickets.message}
              </FormErrorMessage>
            ) : (
              <FormHelperText>Group Ticket costs $600</FormHelperText>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel
              fontWeight="semibold"
              fontSize={{ base: "md", sm: "lg" }}
            >
              Ticket Holder Names
            </FormLabel>
            <Input
              {...register("name")}
              type="text"
              placeholder="First ticket holder name"
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

            {/* second ticket holder */}

            <Input
              {...register("name")}
              type="text"
              placeholder="Second ticket holder name"
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

            {/* third ticket holder */}

            <Input
              {...register("name")}
              type="text"
              placeholder="Third ticket holder name"
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

            {/* fourth ticket holder */}
            <Input
              {...register("name")}
              type="text"
              placeholder="Fourth ticket holder name"
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

            {/* fifth ticket holder */}

            <Input
              {...register("name")}
              type="text"
              placeholder="Fifth ticket holder name"
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

export default Group;
