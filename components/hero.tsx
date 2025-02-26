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
  Stack,
  StackDivider,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import Loading from "./loader";

const currencyOptions = [
  { label: "KES", value: "KES" },
  { label: "USD", value: "USD" },
];

const TicketOptions = [
  {
    id: 1,
    label: "$50 23rd April (Only BNI Members)",
    value: "50",
  },
  { id: 2, label: "$50 24th April (Only BNI Members)", value: "50" },
  { id: 3, label: "$50 25th April", value: "50" },
  { id: 4, label: "$120 All Days", value: "120" },
];

export type FormData = z.infer<typeof FormSchema>;

const HeroPage = ({ rate }: { rate: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [ticketAmount, setTicketAmount] = useState<number>(0);
  const [selectedTicketOption, setSelectedTicketOption] = useState<any>();

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
  const selectedTicket = watch("ticketoptions");
  const noOfTickets = watch("numberOfTickets") || 1;

  useEffect(() => {
    if (selectedTicket) {
      const ticket = TicketOptions.find((t) => t.id === Number(selectedTicket));
      if (ticket) {
        setTicketAmount(Number(ticket.value));
        setSelectedTicketOption(ticket);
      }
    }
  }, [selectedTicket]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    data.ticketAmount = ticketAmount;
    data.ticketoptions = selectedTicketOption?.label;

    const res = await handleBuyingTicket(data);

    if (res.status && res.authorization_url) {
      reset();
      router.push(res.authorization_url);
      setPageLoading(true);
      setTimeout(() => setPageLoading(false), 3000);
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
    if (!ticketAmount) return "Select a ticket";

    if (selectedCurrency === "KES") {
      return `${noOfTickets} x ${ticketAmount} x ${rate} = KSH ${(
        noOfTickets *
        rate *
        ticketAmount
      ).toLocaleString()}`;
    } else {
      return `${noOfTickets} x ${ticketAmount} = $ ${
        noOfTickets * ticketAmount
      }`;
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
          method="POST"
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
              Ticket Price {"->"}
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
          {/* Ticket Selection */}
          <FormControl isRequired isInvalid={!!errors.ticketoptions}>
            <FormLabel
              fontWeight="semibold"
              fontSize={{ base: "md", sm: "lg" }}
            >
              Select ticket
            </FormLabel>
            <Select
              placeholder="Select"
              size="lg"
              focusBorderColor="brand.yellow"
              border="3px solid var(--chakra-colors-brand-black)"
              _hover={{ border: "3px solid var(--chakra-colors-brand-yellow)" }}
              borderRadius="none"
              {...register("ticketoptions")}
            >
              {TicketOptions.map((option) => (
                <option key={option.value} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
            {errors.ticketoptions && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.ticketoptions.message}
              </FormErrorMessage>
            )}
          </FormControl>

          {/* Number of Tickets */}
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
              min={1}
              max={20}
              border="3px solid var(--chakra-colors-brand-black)"
              borderRadius="none"
              _hover={{ border: "3px solid var(--chakra-colors-brand-yellow)" }}
            />
            {errors.numberOfTickets ? (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.numberOfTickets.message}
              </FormErrorMessage>
            ) : (
              <FormHelperText>Each ticket costs ${ticketAmount}</FormHelperText>
            )}
          </FormControl>

          {/* Currency Selection */}
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
              _hover={{ border: "3px solid var(--chakra-colors-brand-yellow)" }}
              borderRadius="none"
              {...register("currency")}
              defaultValue={"USD"}
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
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
            {/* link to /group */}
            {/* <Link href="/group">
              <Text
                color="brand.main"
                fontWeight="semibold"
                fontSize={{ base: "md", sm: "lg" }}
                _hover={{ cursor: "pointer" }}
              >
                Group Ticket?
              </Text>
            </Link> */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            isDisabled={isLoading}
            bg="brand.main"
            color="brand.white"
            borderRadius="none"
            _hover={{ bg: "brand.black" }}
          >
            GET TICKET
          </Button>
        </Stack>
      )}
    </Grid>
  );
};

export default HeroPage;
