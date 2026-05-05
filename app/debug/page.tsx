export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p>NEXT_PUBLIC_VAPID_PUBLIC_KEY: {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? "✅ Set" : "❌ Not set"}</p>
        <p>VAPID_PRIVATE_KEY: {process.env.VAPID_PRIVATE_KEY ? "✅ Set (value hidden)" : "❌ Not set"}</p>
        {/* Only show first few characters of public key for verification */}
        {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && (
          <p className="mt-2">Public Key starts with: {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY.substring(0, 10)}...</p>
        )}
      </div>
    </div>
  )
}
