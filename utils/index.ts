import { OPENSTACK_API_KEY } from "@/config";
import axios from "axios";

export async function getUSDExchangeRate() {
  const res = await axios.get(
    `https://openexchangerates.org/api/latest.json?app_id=${OPENSTACK_API_KEY}&symbols=KES`
  );
  const data: {
    rates: {
      KES: number;
    };
  } = res.data;

  if (!data.rates.KES) {
    return 133;
  }
  return data.rates.KES;
}
