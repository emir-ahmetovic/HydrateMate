import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        ? "Set (starts with: " + process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY.substring(0, 10) + "...)"
        : "Not set",
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY ? "Set (hidden)" : "Not set",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
