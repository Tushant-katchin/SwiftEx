import { useState, useEffect } from 'react'
import { authRequest, GET, POST } from '../api'
import { NewOfferModal } from '../components/newOffer.modal'
import { Navbar } from '../components/nav'
import { FieldView } from './profile'
import { OfferListView } from './offers'
import { ConnectToWallet} from '../web3'
import { StyleSheet, Text, View,  Button} from "react-native";
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import { useSelector } from 'react-redux'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { getRegistrationToken } from '../utils/fcmHandler'

export const HomeView = (props) => {

  const state = useSelector((state) => state)
  const[open, setOpen] = useState(false)
  const [message, setMessage] = useState()
  const [profile, setProfile] = useState({
    isVerified:false,
    firstName:'tushant',
    lastName:'chakravarty',
    email:'tushant@gmail.com',
    phoneNumber:'9340079982',
    isEmailVerified:true
  })
  const [offers, setOffers] = useState()
  const bootstrapStyleSheet = new BootstrapStyleSheet();
  const { s, c } = bootstrapStyleSheet;
  useEffect(() => {
   fetchProfileData()
    getOffersData()
   // syncDevice()
  }, [])

  const syncDevice = async () => {
    try {
      const { res } = await authRequest(
        `/bids/getInSyncedBids/${getRegistrationToken()}`,
        GET,
      )
      if (res.lenght) {
        const { err } = await authRequest('/bids/syncDevice', POST, {
          fcmRegToken: getRegistrationToken(),
        })
        if (err) return setMessage(`${err.status}: ${err.message}`)
        return setMessage('Your is synced')
      }

      return setMessage('')
    } catch (err) {
      console.log(err)
      setMessage(err.message || 'Something went wrong')
    }
  }

  const fetchProfileData = async () => {
    try {
      const { res, err } = await authRequest('/users/getUserDetails', GET)
      if (err) return setMessage(`${err.status}: ${err.message}`)
      setProfile(res)
    } catch (err) {
      console.log(err)
      setMessage(err.message || 'Something went wrong')
    }
  }

  const getOffersData = async () => {
    try {
      const { res, err } = await authRequest('/offers', GET)
      if (err) return setMessage(`${err.status}: ${err.message}`)
      setOffers(res)
    } catch (err) {
      console.log(err)
      setMessage(err.message || 'Something went wrong')
    }
  }

  const applyForKyc = async () => {
    try {
      const { err } = await authRequest('/users/kyc', POST)
      if (err) return setMessage(`${err.status}: ${err.message}`)

      await fetchProfileData()
      return setMessage('KYC success')
    } catch (err) {
      console.log(err)
      setMessage(err.message || 'Something went wrong')
    }
  }

  return (
    <>
    
      
      <View style={styles.container} >
        <View style={styles.container}>{message?<Text>{message}</Text>:<Text>No Messages!</Text>}</View>
        <View style={styles.container}>
        {state.wallet?
        <View>
        <Text>Wallet Connected</Text>
        <Text >{state.wallet.address}</Text>
        </View>
        :<ConnectToWallet setMessage={setMessage} />}
        </View>
        <Text style={styles.container}>Actions</Text>
        {profile && (
          <View style={styles.container}>
            <FieldView
              title="KYC Status"
              value={profile.isVerified}
              applyForKyc={applyForKyc}
              type="kyc"
              
            />
            <View style={styles.container} >
              {profile.isVerified ? (
                <>
                  <Button title='offer' color={'green'} onPress={()=>setOpen(true)}
                  >
                   
                  </Button>
                  <NewOfferModal setMessage={setMessage} user={profile} open={open} setOpen={setOpen}/>
                </>
              ) : (
                <Text>Please do KYC to start adding offers</Text>
              )}
            </View>
          </View>
        )}
        <View style={styles.container}>

        <Text >Your Offers</Text>
        
          <OfferListView self={true} profile={profile} offers={offers} />
          </View>
        <View style={{marginTop:offers?hp(36):0}}>
        <Text>Your Bids</Text>

        </View>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  container:{
    display:'flex',
    alignContent:'center',
    alignItems:'center',
    textAlign:'center',
    margin:5
  }
})
