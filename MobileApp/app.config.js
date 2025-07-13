export default {
  expo: {
    owner: 'kalim22',
    name: 'EduCare Mobile',
    slug: 'educare-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      // Add this line:
      package: 'com.kairos.educaremobile', // <--- REPLACE 'com.yourcompany.educaremobile' with your desired package name
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": true,
          "supportsPictureInPicture": true
        }
      ]
    ],
    experiments: {
      tsconfigPaths: true,
    },

    updates: {
      url: 'https://u.expo.dev/38e814ab-3415-4e03-a2d9-0ff4e02eea98', // Use the exact URL provided in your console output!
    },
    runtimeVersion: {
      policy: 'appVersion',
    },

    extra: {
      // Environment variables for the app
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5500/api',
      serverUrl: process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:5500',
      debugMode: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
      enableLogging: process.env.EXPO_PUBLIC_ENABLE_LOGGING === 'true',
      eas: {
        projectId: '38e814ab-3415-4e03-a2d9-0ff4e02eea98',
      },
    },
  },
};
