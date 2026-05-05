"use client"

import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from './error-boundary'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
