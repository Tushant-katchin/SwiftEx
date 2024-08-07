// NotificationCOM.js
import React, { useEffect } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';

const NotificationCOM = () => {
  useEffect(() => {
    // Configure push notifications
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });
  }, []);

  const scheduleNotification = () => {
    PushNotification.localNotificationSchedule({
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + 5 * 1000), // in 5 secs
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Push Notification Example</Text>
      <Button title="Schedule Notification" onPress={scheduleNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default NotificationCOM;
