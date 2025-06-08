# Environment Setup Guide

## Overview

This guide explains how to configure environment variables for the EduCare Mobile app to connect to your local backend server.

## Quick Setup

1. **Copy the example file:**

   ```bash
   cp .env.example .env
   ```

2. **Choose your configuration based on your setup:**

### For Android Emulator (Default)

The default configuration is already set for Android emulator:

```
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5000/api
EXPO_PUBLIC_SERVER_URL=http://10.0.2.2:5000
```

### For iOS Simulator

Update your `.env` file:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_SERVER_URL=http://localhost:5000
```

### For Physical Device

1. Find your computer's IP address:

   - **Windows:** Open Command Prompt and run `ipconfig`
   - **Mac/Linux:** Open Terminal and run `ifconfig` or `ip addr`
   - Look for your local network IP (usually starts with 192.168.x.x)

2. Update your `.env` file with your IP:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000/api
   EXPO_PUBLIC_SERVER_URL=http://192.168.1.100:5000
   ```

## Environment Variables

| Variable                     | Description                                          | Example                    |
| ---------------------------- | ---------------------------------------------------- | -------------------------- |
| `EXPO_PUBLIC_API_BASE_URL`   | Base URL for API calls                               | `http://10.0.2.2:5000/api` |
| `EXPO_PUBLIC_SERVER_URL`     | Base URL for media files (images, videos, documents) | `http://10.0.2.2:5000`     |
| `EXPO_PUBLIC_APP_NAME`       | App display name                                     | `EduCare Mobile`           |
| `EXPO_PUBLIC_APP_VERSION`    | App version                                          | `1.0.0`                    |
| `EXPO_PUBLIC_DEBUG_MODE`     | Enable debug features                                | `true`                     |
| `EXPO_PUBLIC_ENABLE_LOGGING` | Enable console logging                               | `true`                     |

## Usage in Code

```typescript
import { ENV, buildApiUrl, buildMediaUrl, buildImageUrl } from "./src/config";

// Get environment variables
console.log(ENV.API_BASE_URL);
console.log(ENV.SERVER_URL);

// Build API URLs
const loginUrl = buildApiUrl("/auth/login");

// Build media URLs (images, videos, documents)
const imageUrl = buildMediaUrl("/uploads/profile.jpg");
const videoUrl = buildMediaUrl("/uploads/video.mp4");
const documentUrl = buildMediaUrl("/uploads/document.pdf");

// buildImageUrl is still available for backward compatibility
const legacyImageUrl = buildImageUrl("/uploads/profile.jpg");
```

## Troubleshooting

### Can't connect to backend?

1. Make sure your backend is running on port 5000
2. Check your IP address is correct (for physical device)
3. Ensure your device and computer are on the same network
4. Try disabling firewall temporarily

### Environment variables not loading?

1. Make sure variables start with `EXPO_PUBLIC_`
2. Restart the Expo development server
3. Clear Expo cache: `npx expo start --clear`

## Network Configuration

### Android Emulator

- Uses `10.0.2.2` to access host machine's localhost
- No additional network configuration needed

### iOS Simulator

- Can use `localhost` or `127.0.0.1`
- Shares network with host machine

### Physical Device

- Must use computer's actual IP address
- Device and computer must be on same WiFi network
- May need to configure firewall/antivirus settings
