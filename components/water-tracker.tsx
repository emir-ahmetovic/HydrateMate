"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet } from "lucide-react"
import dynamic from 'next/dynamic'

function WaterTracker() {
  const [cups, setCups] = useState<boolean[]>(Array(8).fill(false))

  const toggleCup = (index: number) => {
    setCups(prev => {
      const newCups = [...prev]
      newCups[index] = !newCups[index]
      return newCups
    })
  }

  return (
    <Card className="shadow-lg border-sky-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sky-700 flex items-center justify-between">
          <span>Daily Water Intake</span>
          <span className="text-sm font-normal text-sky-600">{cups.filter(Boolean).length}/8 cups</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {cups.map((filled, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-16 w-full transition-all duration-300 ${filled
                  ? "bg-sky-400 border-sky-500 text-white"
                  : "bg-white border-sky-200 text-sky-400 hover:bg-sky-100"
                }`}
              onClick={() => toggleCup(index)}
            >
              <Droplet className={`h-6 w-6 ${filled ? "fill-white" : ""}`} />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default dynamic(() => Promise.resolve(WaterTracker), { ssr: false })
