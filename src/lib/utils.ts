import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Korean Won currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

/**
 * Format a date string to Korean locale date format
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

/**
 * Check if a Notion page ID is valid format
 * Notion IDs are 32 hex characters, optionally with hyphens
 */
export function isValidNotionId(id: string): boolean {
  const cleanId = id.replace(/-/g, "");
  return /^[a-f0-9]{32}$/i.test(cleanId);
}

/**
 * Normalize a Notion page ID (remove hyphens, lowercase)
 */
export function normalizeNotionId(id: string): string {
  return id.replace(/-/g, "").toLowerCase();
}
