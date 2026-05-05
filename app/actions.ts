"use server"

import webpush from "web-push"

// Set VAPID details for web push
webpush.setVapidDetails(
  "mailto:example@example.com", // Replace with your email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

// In a production app, you would store subscriptions in a database
// For this demo, we'll use a server-side variable (note: this resets on server restart)
let subscriptions: PushSubscription[] = []

/**
 * Subscribe a user to push notifications
 */
export async function subscribeUser(subscription: PushSubscription) {
  try {
    // Store the subscription
    const exists = subscriptions.some((sub) => JSON.stringify(sub) === JSON.stringify(subscription))

    if (!exists) {
      subscriptions.push(subscription)
    }

    // Send a welcome notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Water Reminder Activated",
        body: "You will now receive hydration reminders! 🦋",
        icon: "/icon-192x192.png",
      }),
    )

    return { success: true }
  } catch (error) {
    console.error("Error subscribing user:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Unsubscribe a user from push notifications
 */
export async function unsubscribeUser(subscription: PushSubscription) {
  try {
    // Remove the subscription
    subscriptions = subscriptions.filter((sub) => JSON.stringify(sub) !== JSON.stringify(subscription))

    return { success: true }
  } catch (error) {
    console.error("Error unsubscribing user:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Send a notification to a specific subscription
 */
export async function sendNotificationToSubscription(
  subscription: PushSubscription,
  message = "Time to drink water! Stay hydrated! 💧🦋",
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Butterfly Water Reminder",
        body: message,
        icon: "/icon-192x192.png",
      }),
    )
    return { success: true }
  } catch (error) {
    console.error("Error sending notification:", error)

    // If the subscription is invalid (gone), remove it
    if (error instanceof Error && error.message.includes("subscription has unsubscribed")) {
      subscriptions = subscriptions.filter((sub) => JSON.stringify(sub) !== JSON.stringify(subscription))
    }

    return { success: false, error: String(error) }
  }
}

/**
 * Send a notification to all subscribed users
 */
export async function sendNotificationToAll(message = "Time to drink water! Stay hydrated! 💧🦋") {
  if (subscriptions.length === 0) {
    return { success: false, error: "No subscriptions available" }
  }

  try {
    const results = await Promise.allSettled(
      subscriptions.map((subscription) => sendNotificationToSubscription(subscription, message)),
    )

    // Filter out failed subscriptions
    const successCount = results.filter((result) => result.status === "fulfilled" && result.value.success).length

    return {
      success: successCount > 0,
      count: successCount,
      total: subscriptions.length,
    }
  } catch (error) {
    console.error("Error sending notifications:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Get the count of active subscriptions
 */
export async function getSubscriptionCount() {
  return { count: subscriptions.length }
}
