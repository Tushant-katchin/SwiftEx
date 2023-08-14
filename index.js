import "@ethersproject/shims"
import 'text-encoding-polyfill'
import { registerRootComponent } from 'expo';
// import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import App from './App';
//import { SendNotification } from './src/Dashboard/notifications/pushController';
//import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
import { NavigationController } from './src/utilities/utilities';

// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log('Message handled in the background!', remoteMessage);
//     SendNotification(remoteMessage.notification.title,remoteMessage.notification.body)
// });

// notifee.onBackgroundEvent(async ({type, detail}) => {
//     const {notification, pressAction} = detail;
//     console.log(JSON.stringify(detail, null, 2));
//     if (type === EventType.PRESS) {
//     //console.log('BACKGROUND CLICK EVENT', detail);
//     NavigationController('exchange')
//     }
//     // this.cancelNotification(notification.id);
//     });
    
//     notifee.onForegroundEvent(({type, detail}) => {
//     switch (type) {
//     case EventType.DISMISSED:
//     break;
//     case EventType.PRESS:
//     //console.log('FOREGROUND CLICK EVENT', detail);
//     NavigationController('exchange')
//     break;
//     }
//     });



// PushNotification.getChannels(function (channel_ids) {
//     console.log(channel_ids); // ['channel_id_1']
//   });

  // PushNotification.configure({
  //   // (required) Called when a remote or local notification is opened or received
  //   onNotification: function(notification) {
  //     console.log('LOCAL NOTIFICATION ==>', notification)
  //     if(notification.userInteraction){
  //       //Navigation.navigate('exchange')
  //       NavigationController('exchange')
  //     }
  //     console.log("Actions",notification.actions)
  //   },
  //  onAction:function(notification){

  //   console.log("My actions",notification)
  //   if(notification.action==='Yes'){
  //     console.log('Yes clicked')
  //   }
  //  },
  //   popInitialNotification: true,
  //   requestPermissions: true
  // })

  
  // PushNotification.createChannel(
  //   {
  //     channelId: "1", // (required)
  //     channelName: "My channel", // (required)
  //     channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
  //     playSound: true, // (optional) default: true
  //     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //   },
  //   (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  // );


// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log('Message handled in the background!', remoteMessage);
//     firebaseNotification(remoteMessage.notification.title,'MunziDapp',remoteMessage.notification.message,remoteMessage.notification.body)
// });


registerRootComponent(App);
