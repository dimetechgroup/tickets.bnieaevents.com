import React from "react";
import { getUSDExchangeRate } from "@/utils";
import Group from "@/components/group";

export default async function GroupTicket() {
  const rate = await getUSDExchangeRate();
  return <Group rate={rate} />;
}
