import WaterTracker from "@/components/water-tracker"
import ReminderSettings from "@/components/reminder-settings"
import NotificationManager from "@/components/notification-manager"
import AnimatedBackground from "@/components/animated-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-sky-50 relative overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-sky-700 mb-2">Butterfly Water Reminder</h1>
              <p className="text-sky-600">Stay hydrated with gentle reminders</p>
            </div>
            <div className="space-y-6">
              <WaterTracker />
              <NotificationManager />
              <ReminderSettings />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
