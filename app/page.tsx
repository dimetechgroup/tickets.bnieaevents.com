import { Hero } from "@/components";
import { getUSDExchangeRate } from "@/utils";

export default async function Home() {
  const rate = await getUSDExchangeRate();
  return <Hero rate={rate} />;
}
