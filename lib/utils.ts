import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrencySymbol(currency: string) {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "JPY":
      return "¥";
    case "GBP":
      return "£";
    default:
      return "$";
  }
}
