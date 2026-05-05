import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"
import { isWithinSleepHours } from "@/lib/utils"

// This endpoint is called to send push notifications to all subscribed users
export async function POST(request: NextRequest) {
  try {
    // Check if VAPID keys are available
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error(
        "VAPID keys are not set. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.",
      )
      return NextResponse.json({ success: false, error: "VAPID keys are not configured" }, { status: 500 })
    }

    // Set VAPID details for web push
    webpush.setVapidDetails(
      "mailto:example@example.com", // Replace with your email
      vapidPublicKey,
      vapidPrivateKey,
    )

    // Get sleep hours from request headers or use defaults
    const sleepStart = request.headers.get("x-sleep-start") || "22:00"
    const sleepEnd = request.headers.get("x-sleep-end") || "07:00"

    // Check if it's during sleep hours
    const now = new Date()

    // Skip if it's during sleep hours
    if (isWithinSleepHours(now, sleepStart, sleepEnd)) {
      return NextResponse.json({
        success: false,
        message: "Skipped notification during sleep hours",
      })
    }

    // Get the subscription from the request body
    const { subscription } = await request.json().catch(() => ({ subscription: null }))

    if (!subscription) {
      return NextResponse.json({ success: false, error: "No subscription provided" }, { status: 400 })
    }

    // Send the notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Butterfly Water Reminder",
        body: "Time to drink water! Stay hydrated! 💧🦋",
      }),
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending reminder:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
