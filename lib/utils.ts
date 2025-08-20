// lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- NOWA FUNKCJA DO ODMIANY SŁÓW ---
export function pluralizePolish(number: number, forms: [string, string, string]): string {
  const absNumber = Math.abs(number);
  
  if (absNumber === 1) {
    return `${number} ${forms[0]}`; // np. 1 kliknięcie
  }
  
  const lastDigit = absNumber % 10;
  const lastTwoDigits = absNumber % 100;

  if (lastTwoDigits >= 12 && lastTwoDigits <= 14) {
    return `${number} ${forms[2]}`; // np. 12, 13, 14 kliknięć
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${number} ${forms[1]}`; // np. 2, 3, 4 kliknięcia
  }

  return `${number} ${forms[2]}`; // np. 0, 5, 25 kliknięć
}