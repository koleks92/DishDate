// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ✅ TEMP FIX for Supabase / ws / package.exports issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
