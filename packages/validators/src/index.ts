import { z } from "zod";

export const AVAILABLE_CURRENCIES = [
  "USD",
  "CAD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "NZD",
] as const;

export const zCurrencyEnum = z.enum(AVAILABLE_CURRENCIES);
