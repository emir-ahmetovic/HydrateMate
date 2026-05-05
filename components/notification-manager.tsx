"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Restore the original showLocalNotification function with service worker and renotify support
function showLocalNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  // Try to use Service Worker if available
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: "/icon-192x192.png",
        tag: "water-reminder",
        renotify: true,
      } as NotificationOptions);
    });
    return true;
  }

  // Fallback to direct notification
  try {
    new Notification(title, {
      body,
      icon: "/icon-192x192.png",
      tag: "water-reminder",
      renotify: true,
    } as NotificationOptions);
    return true;
  } catch (error) {
    console.error("Notification error:", error);
    return false;
  }
}

export default function NotificationManager() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if browser supports notifications
    if (typeof window !== "undefined") {
      if (!("Notification" in window)) {
        setIsSupported(false)
        return
      }

      // Check if already enabled
      if (Notification.permission === "granted") {
        setIsNotificationsEnabled(true)
      }
    }
  }, [])

  const handleEnableNotifications = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      if (!("Notification" in window)) throw new Error("Notifications not supported");
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const notificationShown = showLocalNotification(
          "Water Reminder Activated",
          "You will now receive hydration reminders! 🦋"
        );
        if (notificationShown) {
          setIsNotificationsEnabled(true);
          localStorage.setItem("notificationsEnabled", "true");
          toast({
            title: "Notifications enabled",
            description: "You'll now receive water reminders",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to show notification");
        }
      } else {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Error enabling notifications",
        description: "There was an error enabling notifications. Please check the console for details.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDisableNotifications = () => {
    setIsNotificationsEnabled(false)
    localStorage.setItem("notificationsEnabled", "false")

    toast({
      title: "Notifications disabled",
      description: "You won't receive any more water reminders",
      duration: 3000,
    })
  }

  if (!isSupported) {
    return (
      <Card className="shadow-lg border-sky-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sky-700">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600">Notifications are not supported in your browser.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-sky-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sky-700">Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          {isNotificationsEnabled ? (
            <>
              <Bell className="h-12 w-12 text-sky-500 mx-auto mb-2" />
              <p className="text-sky-700 mb-4">Notifications are enabled</p>
              <Button variant="outline" className="w-full" onClick={handleDisableNotifications} disabled={isLoading}>
                Disable Notifications
              </Button>
            </>
          ) : (
            <>
              <BellOff className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 mb-4">Enable notifications to receive water reminders</p>
              <Button
                className="w-full bg-sky-500 hover:bg-sky-600"
                onClick={handleEnableNotifications}
                disabled={isLoading}
              >
                {isLoading ? "Enabling..." : "Enable Notifications"}
              </Button>

              {errorMessage && (
                <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 text-left">
                  <p className="font-semibold">Error:</p>
                  <p className="break-words">{errorMessage}</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
