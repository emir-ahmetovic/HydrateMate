"use client"

import { useEffect, useState } from "react"

export default function RegisterServiceWorker() {
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          await navigator.serviceWorker.register("/sw.js")
          console.log("Service Worker registered successfully")
        } catch (error) {
          setRegistrationError(`Registration failed: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
      window.addEventListener("load", registerSW)
      return () => window.removeEventListener("load", registerSW)
    } else {
      setRegistrationError("Service workers are not supported in this browser")
    }
  }, [])

  if (registrationError) {
    return <div className="text-red-600">{registrationError}</div>
  }
  return null
}
