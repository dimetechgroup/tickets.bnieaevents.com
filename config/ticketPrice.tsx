import { useSearchParams } from "next/navigation";
import React from "react";

const TicketPrice = () => {
  const searchParams = useSearchParams();

  const price = searchParams.get("price");

  const ticketprice = () => {
    if (price === "JDUw") {
      return 50;
    } else {
      return 120;
    }
  };
  const TICKET_AMOUNT = ticketprice();
  return;
  <>{TICKET_AMOUNT}</>;
};

export default TicketPrice;
