# Quench Mobile — Expo SDK 54

## Quick Start

```bash
cd mobile
npm install
npx expo start
```

## Environment

Copy `.env` is already included. Two extra backend vars needed in the web `.env`:

```
MOBILE_JWT_SECRET=any-random-secret-string
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Get TWILIO_VERIFY_SERVICE_SID
1. Go to [Twilio Console](https://console.twilio.com) → Verify → Services
2. Create a new service named "Quench"
3. Copy the Service SID (starts with `VA`)

### Google OAuth on native devices
Add these to `mobile/.env` (create iOS/Android OAuth Client IDs in Google Cloud Console):
```
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxx.apps.googleusercontent.com
```
Phone OTP works without these — Google is optional.

## Features
- Phone OTP login (Twilio Verify) + Google OAuth
- Browse & search all services
- City + price range filters
- Listing detail with booking form
- Stripe payment via in-app browser
- Provider profiles with reviews
- My Bookings screen
- Profile screen with sign-out

## Architecture
- **Expo Router v4** — file-based navigation
- **expo-secure-store** — JWT stored securely on device
- **expo-web-browser** — opens Stripe checkout; deep-links back via `quench://`
- **Same backend** — all API calls go to `https://quenchnew.vercel.app/api/`
- Bearer JWT sent on every request via axios interceptor
