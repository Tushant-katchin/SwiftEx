import React, {Component} from "react";
import PushNotification from "react-native-push-notification";
// var PushNotification = require("react-native-push-notification");
import firebase from '@react-native-firebase/app'

PushNotification.getChannels(function (channel_ids) {
    console.log(channel_ids); // ['channel_id_1']
  });

/*const firebaseConfig = {
    apiKey: 'AIzaSyAexERzPR03F38U5IYCRwWx1MVP9jBOCGw',
    authDomain: 'crypto-exchange-poc.firebaseapp.com',
    projectId: 'crypto-exchange-poc',
    storageBucket: 'crypto-exchange-poc.appspot.com',
    messagingSenderId: '883312291340',
    appId: '1:883312291340:web:1cc47b592fd08bf9a74829',
    measurementId: 'G-1VQJ9XNECH',
  }
  const config = {
    name: 'munziDapp',
  };
  const app = firebase.initializeApp(firebaseConfig, config)*/
  PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
      console.log('LOCAL NOTIFICATION ==>', notification)
    },
  
    popInitialNotification: true,
    requestPermissions: true
  })

  PushNotification.createChannel(
    {
      channelId: "1", // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

export default function PushNotifications(){
    
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
              console.log("TOKEN:", token);
            },
          
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
              console.log("NOTIFICATION:", notification);
          
              // process the notification here
          
              // required on iOS only 
              notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            // Android only
            senderID: "1090501687137",
            // iOS only
            permissions: {
              alert: true,
              badge: true,
              sound: true
            },
            popInitialNotification: true,
            requestPermissions: true
          });
    

          
    
}

export const LocalNotification = () => {
    
    PushNotification.localNotification({
        channelId: "1",
      autoCancel: true,
      bigText:
        'You recieved a new token from talib',
      subText: 'Local Notification Demo',
      title: 'MunziDapp',
      message: 'Expand me to see more',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      actions: '["Yes", "No"]'
    })
  }