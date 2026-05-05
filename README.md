# HydrateMate 💧

A beautiful, progressive web app (PWA) designed to help you stay hydrated throughout the day with gentle, intelligent reminders. HydrateMate combines an elegant butterfly-themed interface with smart notification scheduling to make drinking water a delightful daily habit.

## ✨ Features

### Core Functionality
- **Daily Water Intake Tracker**: Visual 8-cup daily tracker with an intuitive click-to-fill interface
- **Smart Push Notifications**: Customizable reminders that intelligently respect your sleep schedule
- **Sleep Hours Scheduling**: Configure custom sleep hours to avoid notifications during rest
- **Adjustable Reminder Intervals**: Set reminders anywhere from 15 to 120 minutes apart
- **Real-time Countdown**: View the exact time until your next reminder

### Technical Features
- **Progressive Web App (PWA)**: Install as a native app on iOS, Android, and desktop
- **Offline Support**: Continues to work with cached assets even without internet
- **Service Worker**: Background processing for notifications and caching
- **Push Notifications API**: Uses Web Push for reliable notifications across devices
- **Responsive Design**: Fully responsive UI that adapts to all screen sizes
- **Theme Support**: Dark and light mode with automatic theme detection

### User Experience
- **Animated Background**: Beautiful, subtle butterfly-themed background animation
- **Smooth Transitions**: Polished animations for all interactive elements
- **Toast Notifications**: Immediate feedback for user actions
- **iOS PWA Support**: Full PWA support on iOS including splash screens
- **Snooze Functionality**: Quick 15-minute snooze option from notifications
- **One-click Actions**: Direct "Drink" button in push notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun package manager
- Modern browser with PWA and Push API support

## 📱 Installation as PWA

### On Android
1. Open HydrateMate in Chrome or any Chromium-based browser
2. Tap the menu icon (three dots) in the top-right corner
3. Select "Install app" or "Add to Home screen"
4. Confirm the installation

### On iOS
1. Open HydrateMate in Safari
2. Tap the share button at the bottom
3. Select "Add to Home Screen"
4. Name your app and tap "Add"

### On Desktop
- **Chrome/Edge**: Click the install icon in the address bar
- **Firefox**: Supported through manifest file

## 🎯 How to Use

### Setting Up Reminders
1. **Enable Notifications**: Click the bell icon in the "Enable Notifications" card
2. **Set Reminder Interval**: Choose how often you want reminders (default: 60 minutes)
3. **Configure Sleep Hours**: Set your sleep start and end times to avoid nighttime notifications
4. **Save Settings**: All settings are automatically saved to your device

### Tracking Water Intake
1. **Log Cups**: Click each water cup button to mark as consumed
2. **View Progress**: See your progress with the "X/8 cups" counter
3. **Reset Daily**: The tracker resets automatically at midnight

### Managing Notifications
- **Test Notification**: Use the "Send Test Notification" button to verify notifications work
- **Snooze Reminders**: Tap "Later" on any notification to snooze for 15 minutes
- **Quick Log**: Tap "Drink" on notifications to log water intake directly

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4 (React 19)
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Radix UI (comprehensive component library)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Themes**: Next-themes for light/dark mode

### Backend & APIs
- **Runtime**: Next.js Server Actions and API Routes
- **Push Notifications**: Web Push API (web-push library)
- **Storage**: Browser LocalStorage for user preferences
- **Service Worker**: Custom service worker for offline support

### Build Tools
- **Package Manager**: pnpm
- **Type Checking**: TypeScript
- **Linting**: ESLint

## 📁 Project Structure

```
WaterReminder/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── send-reminder/     # Push notification endpoint
│   │   ├── subscription/      # Push subscription management
│   │   └── debug/             # Debug endpoints
│   ├── actions.ts             # Server actions for notifications
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── manifest.ts            # PWA manifest
├── components/
│   ├── water-tracker.tsx      # Main water intake tracker
│   ├── reminder-settings.tsx  # Reminder configuration UI
│   ├── notification-manager.tsx # Notification controls
│   ├── animated-background.tsx # Background animation
│   └── ui/                    # Radix UI components
├── hooks/
│   ├── use-mobile.tsx         # Mobile detection hook
│   └── use-toast.ts           # Toast notifications hook
├── lib/
│   ├── notifications.ts       # Notification utilities
│   └── utils.ts               # General utilities
├── public/
│   └── sw.js                  # Service Worker
├── styles/
│   └── globals.css            # Global styles
└── package.json               # Dependencies
```
## 📊 Key Components Explained

### WaterTracker
Displays 8 water cup buttons representing daily intake. Users click to log consumption. State is managed locally (resets daily).

### ReminderSettings
- Manages push notification subscriptions
- Configures reminder intervals (15-120 minutes)
- Sets sleep hours to pause notifications
- Persists settings to LocalStorage
- Handles service worker registration

### NotificationManager
- Requests notification permissions
- Sends test notifications
- Handles notification UI state
- Shows browser compatibility warnings

### Service Worker (sw.js)
- Listens for push events and displays notifications
- Handles notification clicks (Drink/Snooze actions)
- Caches app assets for offline use
- Manages notification renotification for repeated alerts

## 🔐 Privacy & Security

- **No Backend Storage**: All data is stored locally on your device
- **No Tracking**: HydrateMate doesn't track or collect usage data
- **Encrypted Push**: Push notifications use secure Web Push protocol
- **Open Source**: All code is transparent and auditable

## 🐛 Troubleshooting

### Notifications Not Working
1. **Check Browser Support**: Ensure your browser supports Web Push
2. **Grant Permissions**: Allow notifications in browser settings
3. **Verify VAPID Keys**: Ensure environment variables are correctly set
4. **Clear Cache**: Try clearing browser cache and reinstalling the PWA
5. **Service Worker**: Check if service worker is registered (DevTools → Application → Service Workers)

### App Not Installing as PWA
- Ensure HTTPS is enabled (required for PWA)
- Check manifest.json is loading correctly
- Clear browser cache
- Try a different browser if available

### Reminders During Sleep Hours Still Appearing
- Verify sleep times are set correctly (24-hour format)
- Check system time is accurate
- Restart the app to reload settings

### iOS Push Notifications Not Working
- Note: iOS PWA has limited push notification support
- Local notifications will still work within the app
- For full push support on iOS, consider native app development

## 📈 Future Enhancements

Potential features for future versions:
- [ ] Cloud sync across devices
- [ ] Water intake goals by weight
- [ ] Hydration history and statistics
- [ ] Integration with health apps
- [ ] Multi-language support
- [ ] Custom reminder messages
- [ ] Buddy/social features for group hydration challenges
- [ ] Hydration tips and facts
- [ ] Accessibility improvements (voice commands)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips for Best Experience

1. **Add to Home Screen**: Install the app for the best experience and faster access
2. **Allow Notifications**: Grant notification permissions to receive reminders
3. **Adjust Sleep Hours**: Set realistic sleep hours for better reminder timing
4. **Test First**: Use the test notification button to verify everything works
5. **Keep Browser Updated**: Ensure your browser is up-to-date for best PWA support

## 🎨 UI/UX Features

- **Butterfly Theme**: Beautiful butterfly-inspired design with sky blue color scheme
- **Animated Background**: Subtle, non-distracting background animations
- **Dark Mode**: Automatic theme detection with manual override
- **Accessible**: Built with accessibility in mind using Radix UI components
- **Mobile-First**: Optimized for mobile devices with responsive layout

---

**Stay Hydrated! 💧** 

HydrateMate helps you build healthy hydration habits. Remember to drink water regularly and enjoy your journey to better health!
