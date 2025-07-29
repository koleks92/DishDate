const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// ✅ TEMP FIX for Supabase / ws / package.exports issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config;