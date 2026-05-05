"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimePickerInput } from "./time-picker-input"
import { useToast } from "@/hooks/use-toast"
import { isWithinSleepHours } from "@/lib/utils"

export default function ReminderSettings() {
  const [isReminderActive, setIsReminderActive] = useState(false)
  const [reminderInterval, setReminderInterval] = useState("60")
  const [sleepStart, setSleepStart] = useState("22:00")
  const [sleepEnd, setSleepEnd] = useState("07:00")
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const { toast } = useToast()

  // For tracking the reminder timer
  // For tracking the reminder timer
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)
  const nextReminderTimeRef = useRef<Date | null>(null)
  const [timeDisplay, setTimeDisplay] = useState<string>("")

  // Detect iOS device and PWA status
  const [isIOS, setIsIOS] = useState(false)
  const [isIOSPWA, setIsIOSPWA] = useState(false)

  // Move calculateNextReminder before other hooks that depend on it
  const calculateNextReminder = useCallback((now: Date, intervalMs: number): Date => {
    let nextTime = new Date(now.getTime() + intervalMs);

    if (isWithinSleepHours(nextTime, sleepStart, sleepEnd)) {
      const [sleepEndHour, sleepEndMinute] = sleepEnd.split(":").map(Number);
      nextTime = new Date(now);
      nextTime.setHours(sleepEndHour, sleepEndMinute, 0, 0);
      if (nextTime < now) {
        nextTime.setDate(nextTime.getDate() + 1);
      }
    }

    return nextTime;
  }, [sleepStart, sleepEnd]);

  // Load saved settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInterval = localStorage.getItem("reminderInterval")
      const savedSleepStart = localStorage.getItem("sleepStart")
      const savedSleepEnd = localStorage.getItem("sleepEnd")
      const savedReminderActive = localStorage.getItem("reminderActive")

      if (savedInterval) setReminderInterval(savedInterval)
      if (savedSleepStart) setSleepStart(savedSleepStart)
      if (savedSleepEnd) setSleepEnd(savedSleepEnd)

      // Get service worker registration
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          setServiceWorkerRegistration(registration)

          // Start the reminder timer if it was active
          if (savedReminderActive === "true") {
            setIsReminderActive(true)
          }
        })
      } else if (savedReminderActive === "true") {
        setIsReminderActive(true)
      }
    }

    // Detect iOS and PWA status
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('ios-app://')

    setIsIOS(iOS)
    setIsIOSPWA(iOS && isStandalone)
  }, [])

  function showLocalNotification(force: boolean) {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted" && !force) return;
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Time to drink water!", {
          body: "Stay hydrated! 🦋",
          icon: "/icon-192x192.png",
          tag: "water-reminder",
          requireInteraction: true,
        });
      });
    } else {
      try {
        new Notification("Time to drink water!", {
          body: "Stay hydrated! 🦋",
          icon: "/icon-192x192.png",
          tag: "water-reminder",
          requireInteraction: true,
        });
      } catch (error) {
        console.error("Notification error:", error);
      }
    }
  }

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  // Handle timer and notifications
  // Handle timer and notifications
  useEffect(() => {
    if (!isReminderActive) {
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      nextReminderTimeRef.current = null;
      setTimeDisplay("");
      return;
    }

    try {
      const now = new Date();
      const intervalMs = parseInt(reminderInterval) * 60 * 1000;
      const nextTime = calculateNextReminder(now, intervalMs);
      nextReminderTimeRef.current = nextTime;

      // Update display immediately
      const diff = nextTime.getTime() - now.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      setTimeDisplay(hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`);

      const timer = setInterval(() => {
        const currentTime = new Date();

        if (nextReminderTimeRef.current && currentTime >= nextReminderTimeRef.current) {
          if (!isWithinSleepHours(currentTime, sleepStart, sleepEnd)) {
            // Show notification
            showLocalNotification(false);
            // Set next reminder time
            const newNextTime = calculateNextReminder(currentTime, intervalMs);
            nextReminderTimeRef.current = newNextTime;
          } else {
            // If in sleep hours, set next time to sleep end
            const newNextTime = calculateNextReminder(currentTime, intervalMs);
            nextReminderTimeRef.current = newNextTime;
          }
        }

        // Update display
        if (nextReminderTimeRef.current) {
          const diff = nextReminderTimeRef.current.getTime() - currentTime.getTime();
          if (diff <= 0) {
            const newNextTime = calculateNextReminder(currentTime, intervalMs);
            nextReminderTimeRef.current = newNextTime;
          }

          // Recalculate diff with potentially updated time
          const currentDiff = nextReminderTimeRef.current.getTime() - currentTime.getTime();
          const minutes = Math.floor(currentDiff / (1000 * 60));
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          setTimeDisplay(hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`);
        }
      }, 1000);

      setTimerId(timer);

      if (!isWithinSleepHours(now, sleepStart, sleepEnd)) {
        showLocalNotification(true);
      }

      return () => clearInterval(timer);
    } catch (error) {
      console.error("Error in reminder timer:", error);
      toast({
        title: "Error",
        description: "Failed to set up reminder timer",
        variant: "destructive",
      });
    }
  }, [isReminderActive, reminderInterval, sleepStart, sleepEnd]);

  // Memoize the toggle handler to prevent recreation on each render
  const handleReminderToggle = useCallback((checked: boolean) => {
    setIsReminderActive(checked);
    localStorage.setItem("reminderActive", String(checked));

    if (checked) {
      toast({
        title: "Reminders activated",
        description: `You'll be reminded every ${reminderInterval} minutes (except during sleep hours)`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Reminders deactivated",
        description: "You won't receive any water reminders",
        duration: 3000,
      });
    }
  }, [reminderInterval, toast]);

  return (
    <Card className="shadow-lg border-sky-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sky-700">Reminder Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isIOS && !isIOSPWA && (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            For better notification support, add this app to your home screen using
            the share menu option "Add to Home Screen".
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            id="reminder-active"
            checked={isReminderActive}
            onCheckedChange={handleReminderToggle}
          />
          <div className="space-y-0.5">
            <Label htmlFor="reminder-toggle">Reminder Active</Label>
            <p className="text-sm text-muted-foreground">
              {isReminderActive
                ? `Reminders are on ${timeDisplay ? `(next ${timeDisplay})` : ""}`
                : "Reminders are off"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interval-select">Reminder Interval</Label>
          <Select value={reminderInterval} onValueChange={setReminderInterval} disabled={!isReminderActive} name="reminder-interval">
            <SelectTrigger id="interval-select" className="w-full">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Every 15 minutes</SelectItem>
              <SelectItem value="30">Every 30 minutes</SelectItem>
              <SelectItem value="60">Every hour</SelectItem>
              <SelectItem value="120">Every 2 hours</SelectItem>
              <SelectItem value="180">Every 3 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sleep Hours (No Reminders)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sleep-start" className="text-xs">
                From
              </Label>
              <TimePickerInput
                id="sleep-start"
                name="sleep-start"
                value={sleepStart}
                onChange={setSleepStart}
                disabled={!isReminderActive}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep-end" className="text-xs">
                To
              </Label>
              <TimePickerInput
                id="sleep-end"
                name="sleep-end"
                value={sleepEnd}
                onChange={setSleepEnd}
                disabled={!isReminderActive}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}