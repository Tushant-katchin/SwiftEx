import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { NativeRouter, Route, Link } from "react-router-native";
import { HomeView } from './pages/home'
import { ProfileView } from './pages/profile'
import { OfferView } from './pages/offers'
import { LoginView } from './pages/auth/login'
import { getAuth } from './api'
import { SignUpView } from './pages/auth/signup'
import { AccountView } from './pages/account'
import {
  onMessageListener,
  requestFirebaseNotificationPermission,
} from './utils/fcmHandler'
import { useEffect, useState } from 'react'
import { OnScreenNotification } from './components/onScreenNotification'
import { TransactionView } from './pages/transaction'

const isAuth = getAuth()

const router = createBrowserRouter([
  { path: '/', element: isAuth ? <HomeView /> : <LoginView /> },
  { path: '/offers', element: isAuth ? <OfferView /> : <LoginView /> },
  { path: '/profile', element: isAuth ? <ProfileView /> : <LoginView /> },
  {
    path: '/transactions',
    element: isAuth ? <TransactionView /> : <LoginView />,
  },
  { path: '/signUp', element: isAuth ? <HomeView /> : <SignUpView /> },
  { path: '/account', element: isAuth ? <AccountView /> : <LoginView /> },
  { path: '/login', element: isAuth ? <HomeView /> : <LoginView /> },
])

function App() {
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    requestFirebaseNotificationPermission()
  }, [])

  onMessageListener()
    .then((payload) => {
      console.log('Notification', payload)
      setNotification(payload.data)
    })
    .catch((err) => console.log('recieve failed: ', err))

  return (
    <div className="container">
      <OnScreenNotification
        notification={notification}
        setNotification={setNotification}
      />
      <RouterProvider router={router} />
    </div>
  )
}

export default App
