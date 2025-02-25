import { Hero } from "@/components";
import { getUSDExchangeRate } from "@/utils";
import { Suspense } from "react";

export default async function Home() {
  const rate = await getUSDExchangeRate();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Hero rate={rate} />
    </Suspense>
  );
}
