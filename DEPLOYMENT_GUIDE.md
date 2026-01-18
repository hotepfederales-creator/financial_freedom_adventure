
# FinMon Deployment Guide

## 1. Web Deployment (Vercel)
1. Push your code to GitHub.
2. Go to [Vercel.com](https://vercel.com) -> "Add New Project".
3. Import your repository.
4. **Critical:** Add your Environment Variables (`API_KEY` for Google Gemini) in the Vercel Dashboard under Settings > Environment Variables.
5. Click "Deploy". 

## 2. Android Deployment (Capacitor)

### Prerequisites
- Android Studio installed.
- Developer Account on Google Play Console ($25 fee).

### Build Steps
1. **Build the Next.js app:**
   ```bash
   npm run build
   npx cap sync
   ```
2. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```
3. **Test on Emulator:** Click the green "Play" button in Android Studio.
4. **Build APK for Phone:**
   - Go to `Build` -> `Generate Signed Bundle / APK`.
   - Choose `APK` (or `Android App Bundle` for Play Store).
   - Create a KeyStore (keep this file safe!).
   - Select `Release` build variant.

## 3. Distribution (Google Play)
1. Create an app in **Google Play Console**.
2. Go to **Testing** -> **Internal Testing**.
3. Upload your `.apk` or `.aab` file.
4. Add tester email addresses.
5. Copy the invite link and send it to your phone.

## 4. Gathering Feedback
- Users can use the Floating 📣 button to submit issues directly in the app.
- Monitor **Vercel Analytics** for web usage stats.
