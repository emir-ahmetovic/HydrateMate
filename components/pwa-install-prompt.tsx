"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

export default function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOS)

    // Check if already installed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches
    if (isInstalled) {
      return
    }

    // Check if user has already dismissed the prompt
    const hasPromptBeenDismissed = localStorage.getItem("pwaPromptDismissed") === "true"
    if (hasPromptBeenDismissed) {
      return
    }

    // For non-iOS devices, listen for the beforeinstallprompt event
    if (!isIOS) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Stash the event so it can be triggered later
        setDeferredPrompt(e)
        // Show our custom install prompt
        setShowPrompt(true)
      })
    } else {
      // For iOS, show the prompt after a delay
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      // We no longer need the prompt
      setDeferredPrompt(null)
    }
    // Hide the prompt
    setShowPrompt(false)
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    localStorage.setItem("pwaPromptDismissed", "true")
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="shadow-lg border-sky-200 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-sky-700">Install Water Reminder App</h3>
            <Button variant="ghost" size="icon" onClick={dismissPrompt} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isIOS ? (
            <div className="space-y-2">
              <p className="text-sm text-sky-600">To install this app on your iPhone:</p>
              <ol className="text-sm text-sky-600 list-decimal pl-5 space-y-1">
                <li>Tap the Share button</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top right</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-sky-600">
                Install this app on your device for a better experience and offline access.
              </p>
              <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={handleInstall}>
                <Download className="mr-2 h-4 w-4" /> Install App
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
