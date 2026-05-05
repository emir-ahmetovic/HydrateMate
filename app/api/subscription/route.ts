import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// In a production app, you would store subscriptions in a database
// For this demo, we'll use a server-side variable (note: this resets on server restart)
let subscriptions: PushSubscription[] = []

// This endpoint is called when a user subscribes to push notifications
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

    const data = await request.json()

    if (!data.subscription) {
      return NextResponse.json({ success: false, error: "No subscription provided" }, { status: 400 })
    }

    // Store the subscription
    const exists = subscriptions.some((sub) => JSON.stringify(sub) === JSON.stringify(data.subscription))

    if (!exists) {
      subscriptions.push(data.subscription)
    }

    // Send a welcome notification
    try {
      await webpush.sendNotification(
        data.subscription,
        JSON.stringify({
          title: "Water Reminder Activated",
          body: "You will now receive hydration reminders! 🦋",
          icon: "/icon-192x192.png",
        }),
      )
    } catch (error) {
      console.error("Error sending welcome notification:", error)
      // Continue even if welcome notification fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling subscription:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// This endpoint is called when a user unsubscribes from push notifications
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.subscription) {
      return NextResponse.json({ success: false, error: "No subscription provided" }, { status: 400 })
    }

    // Remove the subscription
    subscriptions = subscriptions.filter((sub) => JSON.stringify(sub) !== JSON.stringify(data.subscription))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling unsubscription:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// This endpoint returns the count of active subscriptions
export async function GET() {
  try {
    return NextResponse.json({ count: subscriptions.length })
  } catch (error) {
    console.error("Error getting subscription count:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
