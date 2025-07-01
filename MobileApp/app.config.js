export default {
  expo: {
    name: "EduCare Mobile",
    slug: "educare-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "nativewind/babel"
    ],
    experiments: {
      tsconfigPaths: true
    },
    extra: {
      // Environment variables for the app
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5500/api",
      serverUrl: process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:5500",
      debugMode: process.env.EXPO_PUBLIC_DEBUG_MODE === "true",
      enableLogging: process.env.EXPO_PUBLIC_ENABLE_LOGGING === "true",
    }
  }
};
