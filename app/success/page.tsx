import SuccessIcon from "@/icons/SuccessIcon";
import { Button, Grid, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const SuccessCallBackPage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const trxref = searchParams?.trxref;
  const reference = searchParams?.reference;

  if (!trxref || !reference) {
    redirect("https://bnieaevents.com");
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
      <Stack
        bg="brand.white"
        w={{ base: "90%", sm: "md" }}
        p="2rem"
        borderRadius="md"
        align="center"
        textAlign="center"
        gap={4}
      >
        <SuccessIcon color="green.400" boxSize={12} />
        <Text fontSize="xl" fontWeight="bold" color="brand.main">
          Thank you for your payment
        </Text>
        <Text fontSize="lg">You will receive confirmation Email Shortly</Text>
        <Button
          bg="brand.main"
          color="brand.white"
          transition="all 0.3s ease-in-out"
          _hover={{
            bg: "brand.black",
          }}
          fontSize="xl"
          w={{ base: "100%", sm: "fit-content" }}
        >
          <Link href="https://bnieaevents.com">Go Home </Link>
        </Button>
      </Stack>
    </Grid>
  );
};

export default SuccessCallBackPage;
