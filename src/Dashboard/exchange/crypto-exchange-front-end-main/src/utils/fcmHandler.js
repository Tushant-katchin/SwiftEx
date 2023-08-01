//import { initializeApp } from 'react-native-firebase/app'
//import { getToken } from 'react-native-firebase/app'
//import firebase from '@react-native-firebase/app'
//import messaging from '@react-native-firebase/messaging'
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import { authRequest, GET, getAuth, getToken } from '../api'
import { REACT_APP_FCM_TOKEN_KEY , REACT_APP_GOOGLE_VPID_KEY} from '../ExchangeConstants'
const REGISTERATION_TOKEN = REACT_APP_FCM_TOKEN_KEY
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
};*/
//const app = firebase.initializeApp(firebaseConfig, config)
//const app = initializeApp(firebaseConfig)
//export const messaging = getMessaging(app)

export const requestFirebaseNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: REACT_APP_GOOGLE_VPID_KEY,
    })
    saveRegistrationToken(token)
    console.log("Token saved") // test...
  } catch (err) {
    console.log(err)
  }
}

export const setMessaging = () =>{
  
}

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
   messaging.onMessage(async (payload) => {
      // Check if anyone is logged in
      const auth = getAuth()
      if (!auth) return reject()

      // Check if user is the bidder
      const { targetUser } = payload.data
      const { err, res } = await authRequest('/users/getUserDetails', GET)
      if (err) return reject(err.message)
      if (res._id !== targetUser) return reject()

      resolve(payload)
    })
  })

export const saveRegistrationToken = (token) =>
AsyncStorageLib.setItem(REGISTERATION_TOKEN, token)

export const getRegistrationToken = async () =>{
  const token = await AsyncStorageLib.getItem('fcmtoken')
  return JSON.parse(token)
}
