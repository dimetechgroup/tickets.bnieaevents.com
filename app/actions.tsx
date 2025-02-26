"use server";

import { FormSchema, GroupSchema } from "@/schemas";
import { BASE_URL, PAYSTACK_SECRET_KEY } from "@/config";
import { getUSDExchangeRate } from "@/utils";
import axios from "axios";
import {
  ZodObject,
  ZodString,
  ZodEffects,
  ZodNumber,
  ZodOptional,
  ZodEnum,
  ZodTypeAny,
} from "zod";

const PAYSTACK_URL = "https://api.paystack.co/transaction/initialize";

const validateData = (
  schema: ZodObject<
    {
      name: ZodString;
      email: ZodString;
      numberOfTickets: ZodEffects<ZodNumber, number, number>;
      chapter: ZodOptional<ZodString>;
      ticketoptions: ZodString;
      currency: ZodEffects<
        ZodEnum<["KES", "USD"]>,
        "KES" | "USD",
        "KES" | "USD"
      >;
    },
    "strip",
    ZodTypeAny,
    {
      name: string;
      email: string;
      numberOfTickets: number;
      currency: "KES" | "USD";
      chapter?: string | undefined;
      ticketoptions: string;
    },
    {
      name: string;
      email: string;
      numberOfTickets: number;
      currency: "KES" | "USD";
      chapter?: string | undefined;
      ticketoptions: string;
    }
  >,
  data: any
) => {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
};

const buildMetadata = (
  baseFields: { key: string; value: any }[],
  extraFields: { key: string; value: any }[] = []
) => {
  return {
    custom_fields: [
      ...baseFields,
      ...extraFields.map(({ key, value }) => ({
        display_name: key.replace("_", " "),
        variable_name: key,
        value,
      })),
    ],
  };
};

const convertCurrency = async (amount: number, currency: string) => {
  if (currency === "KES") {
    const rate = await getUSDExchangeRate();
    return Math.ceil(amount * rate);
  }
  return amount;
};

const processPayment = async (
  email: any,
  amount: string | number,
  currency: any,
  metadata: { custom_fields: any[] }
) => {
  if (!PAYSTACK_SECRET_KEY) {
    return { status: false, message: "Payment failed. Try again later!" };
  }

  const postData = {
    email,
    amount: amount + "00", // Convert to smallest currency unit
    callback_url: `${BASE_URL}/success`,
    currency,
    metadata,
  };

  try {
    const response = await axios.post(PAYSTACK_URL, postData, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return {
      status: response.data.status,
      message: response.data.message,
      authorization_url: response.data.data.authorization_url,
    };
  } catch (e) {
    return {
      status: false,
      message: axios.isAxiosError(e)
        ? e.response?.data.message
        : "Payment failed. Try again later!",
    };
  }
};

export const handleBuyingTicket = async (data: { ticketAmount: any }) => {
  const validatedData = validateData(FormSchema, data);
  if (!validatedData)
    return { status: false, message: "Invalid data. Try again later!" };

  let ticketAmountUSD = await convertCurrency(
    data.ticketAmount || 0,
    validatedData.currency
  );

  const metadata = buildMetadata(
    [
      { key: "name", value: validatedData.name },
      { key: "email", value: validatedData.email },
      { key: "ticketoptions", value: validatedData.ticketoptions },
      { key: "numberOfTickets", value: validatedData.numberOfTickets },
    ],
    [
      { key: "chapter", value: validatedData.chapter },
      { key: "Ticket Options", value: validatedData.ticketoptions },
    ]
  );

  return processPayment(
    validatedData.email,
    validatedData.numberOfTickets * ticketAmountUSD,
    validatedData.currency,
    metadata
  );
};

export const handleGroupTicket = async (data: {
  name: string;
  email: string;
  numberOfTickets: number;
  currency: "KES" | "USD";
  first_name: string;
  second_name: string;
  third_name: string;
  fourth_name: string;
  fifth_name: string;
  chapter?: string | undefined;
  ticketAmount: number;
}) => {
  const validatedData = validateData(GroupSchema, data);
  if (!validatedData)
    return { status: false, message: "Invalid data. Try again later!" };

  let ticketAmountUSD = await convertCurrency(
    data.ticketAmount || 0,
    validatedData.currency
  );

  const baseFields = [
    { key: "name", value: validatedData.name },
    { key: "email", value: validatedData.email },
  ];
  const extraFields = [
    "first_name",
    "second_name",
    "third_name",
    "fourth_name",
    "fifth_name",
  ]
    .map((key) => ({ key, value: (validatedData as any)[key] }))
    .filter(({ value }) => value);

  if (validatedData.chapter) {
    extraFields.push({ key: "chapter", value: validatedData.chapter });
  }

  const metadata = buildMetadata(baseFields, extraFields);

  return processPayment(
    validatedData.email,
    validatedData.numberOfTickets * ticketAmountUSD,
    validatedData.currency,
    metadata
  );
};
