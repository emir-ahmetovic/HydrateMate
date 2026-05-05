"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationTestPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isSupported, setIsSupported] = useState<boolean | null>(null)
  const [permission, setPermission] = useState<NotificationPermission | null>(null)

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev])
  }

  const checkSupport = () => {
    const supported = typeof window !== "undefined" && "Notification" in window
    setIsSupported(supported)
    addLog(`Notifications supported: ${supported}`)

    if (supported) {
      setPermission(Notification.permission)
      addLog(`Current permission: ${Notification.permission}`)
    }
  }

  const requestPermission = async () => {
    try {
      addLog("Requesting permission...")
      const result = await Notification.requestPermission()
      setPermission(result)
      addLog(`Permission result: ${result}`)
    } catch (error) {
      addLog(`Error requesting permission: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const showNotification = () => {
    try {
      addLog("Attempting to show notification...")
      new Notification("Test Notification", {
        body: "This is a test notification",
        icon: "/icon-192x192.png",
      })
      addLog("Notification shown successfully")
    } catch (error) {
      addLog(`Error showing notification: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notification Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button onClick={checkSupport} className="w-full mb-2">
                Check Notification Support
              </Button>
              {isSupported !== null && (
                <p className={isSupported ? "text-green-600" : "text-red-600"}>
                  Notifications are {isSupported ? "supported" : "not supported"}
                </p>
              )}
            </div>

            <div>
              <Button onClick={requestPermission} className="w-full mb-2" disabled={!isSupported}>
                Request Permission
              </Button>
              {permission && (
                <p className={permission === "granted" ? "text-green-600" : "text-amber-600"}>
                  Permission: {permission}
                </p>
              )}
            </div>

            <div>
              <Button onClick={showNotification} className="w-full" disabled={!isSupported || permission !== "granted"}>
                Show Test Notification
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-2 rounded h-64 overflow-y-auto text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Run a test to see results.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Back to Home
        </Button>
      </div>
    </div>
  )
}
