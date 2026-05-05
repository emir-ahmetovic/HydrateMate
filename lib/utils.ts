import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to check if a time is within sleep hours
export function isWithinSleepHours(currentTime: Date, sleepStart: string, sleepEnd: string): boolean {
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()
  const currentTimeMinutes = currentHour * 60 + currentMinute

  const [sleepStartHour, sleepStartMinute] = sleepStart.split(":").map(Number)
  const [sleepEndHour, sleepEndMinute] = sleepEnd.split(":").map(Number)

  const sleepStartMinutes = sleepStartHour * 60 + sleepStartMinute
  const sleepEndMinutes = sleepEndHour * 60 + sleepEndMinute

  if (sleepStartMinutes < sleepEndMinutes) {
    // Normal case (e.g., 22:00 to 07:00)
    return currentTimeMinutes >= sleepStartMinutes && currentTimeMinutes < sleepEndMinutes
  } else {
    // Overnight case (e.g., 22:00 to 07:00)
    return currentTimeMinutes >= sleepStartMinutes || currentTimeMinutes < sleepEndMinutes
  }
}
