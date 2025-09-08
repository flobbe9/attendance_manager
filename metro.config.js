const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// enables module import of '.sql' files
config.resolver.sourceExts.push('sql');

module.exports = config;
