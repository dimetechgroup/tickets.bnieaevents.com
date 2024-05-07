"use server";

import { FormData } from "@/components/hero";
import { BASE_URL, PAYSTACK_SECRET_KEY } from "@/config";
import { FormSchema } from "@/schemas";
import { getUSDExchangeRate } from "@/utils";
import axios, { AxiosResponse } from "axios";

interface paystackRequest {
  email: string;
  amount: string;
  currency: string;
  callback_url: string;
  reference?: string;
  metadata?: {
    name: string;
    email: string;
    chapter?: string;
  };
}

interface paystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export const handleBuyingTicket = async (data: FormData) => {
  let ticketAmountUSD = 100; //usd
  const paystack_secret = PAYSTACK_SECRET_KEY;

  const paystackUrl = "https://api.paystack.co/transaction/initialize";

  //use zod to validate the data
  const validatedData = FormSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      status: false,
      message: "Invalid data Try again later!",
    };
  }

  if (!paystack_secret) {
    return {
      status: false,
      message: "Payment failed Try again later!",
    };
  }

  const { name, numberOfTickets, chapter, email, currency } =
    validatedData.data;

  const metadata: {
    custom_fields: {
      display_name: string;
      variable_name: string;
      value: string;
    }[];
  } = {
    custom_fields: [
      {
        display_name: "Name",
        variable_name: "name",
        value: name,
      },
      {
        display_name: "Email",
        variable_name: "email",
        value: email,
      },
    ],
  };

  if (chapter) {
    const data = {
      display_name: "BNI Chapter",
      variable_name: "chapter",
      value: chapter,
    };
    metadata.custom_fields.push(data);
  }

  console.log(ticketAmountUSD, "before");

  if (currency === "KES") {
    const rateInKes = await getUSDExchangeRate();

    ticketAmountUSD *= rateInKes;
  }

  console.log(ticketAmountUSD);

  const postData = {
    email,
    amount: numberOfTickets * ticketAmountUSD + "00",
    callback_url: BASE_URL + "/success",
    currency: currency,
    metadata,
  };

  try {
    const response = await axios.post<
      paystackRequest,
      AxiosResponse<paystackResponse>
    >(paystackUrl, postData, {
      headers: {
        Authorization: `Bearer ${paystack_secret}`,
        "Content-Type": "application/json",
      },
    });

    const {
      status,
      message,
      data: { authorization_url },
    } = response.data;

    return {
      status,
      message,
      authorization_url,
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data);
      let message = e.response?.data.message;

      return {
        status: false,
        message,
      };
    } else {
      return {
        status: false,
        message: "Payment failed Try again later!",
      };
    }
  }
};
