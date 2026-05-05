"use client"

import { useEffect, useRef } from "react"

interface Butterfly {
  x: number
  y: number
  size: number
  speed: number
  angle: number
  wingPosition: number
  wingDirection: number
  color: string
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Create butterflies
    const butterflies: Butterfly[] = []
    const butterflyCount = Math.min(15, Math.floor(window.innerWidth / 100))

    const colors = [
      "#60a5fa", // blue-400
      "#38bdf8", // sky-400
      "#a5b4fc", // indigo-300
      "#93c5fd", // blue-300
    ]

    for (let i = 0; i < butterflyCount; i++) {
      butterflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 5 + Math.random() * 10,
        speed: 0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        wingPosition: 0,
        wingDirection: Math.random() > 0.5 ? 0.1 : -0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw butterflies
      butterflies.forEach((butterfly) => {
        // Update position
        butterfly.x += Math.cos(butterfly.angle) * butterfly.speed
        butterfly.y += Math.sin(butterfly.angle) * butterfly.speed

        // Randomly change direction occasionally
        if (Math.random() < 0.02) {
          butterfly.angle += (Math.random() - 0.5) * 0.5
        }

        // Bounce off edges
        if (butterfly.x < 0 || butterfly.x > canvas.width) {
          butterfly.angle = Math.PI - butterfly.angle
        }
        if (butterfly.y < 0 || butterfly.y > canvas.height) {
          butterfly.angle = -butterfly.angle
        }

        // Update wing position for flapping effect
        butterfly.wingPosition += butterfly.wingDirection
        if (Math.abs(butterfly.wingPosition) > 1) {
          butterfly.wingDirection *= -1
        }

        // Draw butterfly
        ctx.save()
        ctx.translate(butterfly.x, butterfly.y)
        ctx.rotate(butterfly.angle)

        // Draw wings
        ctx.fillStyle = butterfly.color

        // Left wing
        ctx.beginPath()
        ctx.ellipse(
          -butterfly.size * 0.5,
          0,
          butterfly.size * Math.abs(butterfly.wingPosition),
          butterfly.size * 1.5,
          Math.PI / 4,
          0,
          Math.PI * 2,
        )
        ctx.fill()

        // Right wing
        ctx.beginPath()
        ctx.ellipse(
          butterfly.size * 0.5,
          0,
          butterfly.size * Math.abs(butterfly.wingPosition),
          butterfly.size * 1.5,
          -Math.PI / 4,
          0,
          Math.PI * 2,
        )
        ctx.fill()

        // Body
        ctx.fillStyle = "#0369a1" // sky-700
        ctx.beginPath()
        ctx.ellipse(0, 0, butterfly.size * 0.2, butterfly.size, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
}
