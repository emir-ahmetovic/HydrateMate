"use client"

import { useEffect } from "react"
import RegisterServiceWorker from "@/app/register-sw"

export default function ServiceWorkerHandler() {
  useEffect(() => {
    RegisterServiceWorker()
  }, [])

  return null
}
