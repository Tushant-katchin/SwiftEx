Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js (v14) installed.

React Native expo installed globally:

npm install -g react-native-cli

Watchman installed (for macOS users):

brew install watchman

Android Studio (for Android development) or Xcode (for iOS development).

Installation

Clone the repository:

https://github.com/Tushant-katchin/SwiftEx

Navigate to the project directory:

cd SwiftEx

Install the dependencies:

npm install

iOS Setup (macOS only):

Navigate to the ios directory and run:

cd ios && pod install && cd ..

Running the Application

iOS

Ensure Xcode is installed and configured.

Run the following command to start the app on an iOS simulator:

npm run ios

Android

Make sure you have an Android emulator running or connect an Android device via USB.
Run the app on an Android emulator or device with:

npm run android

Debugging
Shake your device or press Cmd + D (iOS) or Cmd + M (Android) to open the Developer Menu.
Select "Debug JS Remotely" to debug JavaScript code in Chrome.
You can also use React Native Debugger or Reactotron for enhanced debugging and state inspection.

Testing
To run the tests, use:

npm test
This will execute unit tests using Jest, which is the default test runner in React Native.

Troubleshooting
Metro Bundler Issue: If you face issues with the bundler, try resetting it:

npx react-native start --reset-cache

Android Emulator Issues: Make sure you have configured the Android SDK and have an emulator running. You can create one using Android Studio.
