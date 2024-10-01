// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const extraNodeModules = require('node-libs-browser');


module.exports = {
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'mjs','cjs'], // Add 'cjs' here
    extraNodeModules,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};