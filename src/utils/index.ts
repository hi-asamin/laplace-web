import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFlagIcon(market: string) {
  switch (market?.toLowerCase()) {
    case 'japan':
      return '/flags/japan.svg';
    case 'us':
      return '/flags/us.svg';
    default:
      return '/flags/global.svg';
  }
}
