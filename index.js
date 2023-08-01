import "@ethersproject/shims"
import 'text-encoding-polyfill'
import { registerRootComponent } from 'expo';
// import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { SendNotification } from './src/Dashboard/notifications/pushController';
import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
import { NavigationController } from './src/utilities/utilities';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    SendNotification(remoteMessage.notification.title,remoteMessage.notification.body)
});

notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail;
    console.log(JSON.stringify(detail, null, 2));
    if (type === EventType.PRESS) {
    //console.log('BACKGROUND CLICK EVENT', detail);
    NavigationController('exchange')
    }
    // this.cancelNotification(notification.id);
    });
    
    notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
    case EventType.DISMISSED:
    break;
    case EventType.PRESS:
    //console.log('FOREGROUND CLICK EVENT', detail);
    NavigationController('exchange')
    break;
    }
    });
registerRootComponent(App);
