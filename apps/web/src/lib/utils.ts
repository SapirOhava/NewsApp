import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

//this is a shadcn utility function to merge class names to conditionally add tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
