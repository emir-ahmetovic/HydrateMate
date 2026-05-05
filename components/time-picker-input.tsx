"use client"

import { Input } from "@/components/ui/input"

interface TimePickerInputProps {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TimePickerInput({ id, name, value, onChange, disabled = false }: TimePickerInputProps) {
  // Generate a unique ID if none provided
  const inputId = id || `time-input-${Math.random().toString(36).substring(2, 9)}`
  const inputName = name || inputId

  return (
    <Input
      id={inputId}
      name={inputName}
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full"
    />
  )
}
