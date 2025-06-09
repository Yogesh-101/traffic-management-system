# Google Maps API Setup Guide

## Issue
The error message `Google Maps JavaScript API error: RefererNotAllowedMapError` occurs when your site URL is not authorized to use the Google Maps API key. This is a security feature of Google Maps to prevent unauthorized usage of your API key.

## How to Fix

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to your project or create a new one

2. **Enable the Maps JavaScript API**
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API" and enable it

3. **Configure API Key Restrictions**
   - Go to "APIs & Services" > "Credentials"
   - Find your API key and click "Edit"
   - Under "Application restrictions", select "HTTP referrers (websites)"
   - Add your domain: `https://traffic-management-system.windsurf.build/*`
   - Click "Save"

4. **Update Environment Variables (Optional)**
   - The project has been configured to use environment variables
   - The API key is now stored in `.env` and `netlify.toml`
   - For local development, create a `.env.local` file with your API key

## Verifying the Fix

After making these changes, redeploy your application. The Google Maps should load correctly without the RefererNotAllowedMapError.

## Security Best Practices

1. **Always restrict API keys** by domain/referrer
2. **Use environment variables** instead of hardcoding API keys
3. **Set quotas** on your API key to prevent unexpected billing
4. **Monitor usage** regularly in the Google Cloud Console
