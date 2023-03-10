import React, { useEffect } from 'react'
import PushNotification ,{PushNotificationIOS}from 'react-native-push-notification'


const getToken = async () => {
  const token = null //await getFcmToken()

  if (!token) {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
          console.log(token)
        //setFcmToken(token)
        //saveFcmToken(token)
      })
  }
}
export const RemotePushController = () => {
  useEffect(() => {
    getToken()
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token)
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('REMOTE NOTIFICATION ==>', notification)

        // process the notification here
        notification.finish(PushNotificationIOS.FetchResult.NoData);

      },
      // Android only: GCM or FCM Sender ID
      senderID: '883312291340',
      permissions: {
        alert: true,
        badge: true,
        sound: true
        },
      popInitialNotification: true,
      requestPermissions: true
    })
  }, [])

  return null
}