import { useState } from 'react'
import { TextInput } from 'react-native-paper'
import { authRequest, POST } from '../api'
import { APP_FEE_PERCENTAGE } from '../utils/constants'
import {
  getRegistrationToken,
  requestFirebaseNotificationPermission,
} from '../utils/fcmHandler'
import { StyleSheet, Text, View,  Button, TouchableOpacity, ScrollView, ActivityIndicator} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
export const NewBidModal = ({ offer }) => {
  const [modalMessage, setModalMessage] = useState('')
  const[loading,setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState(null)
  const [newBid, setNewBid] = useState({
    pricePerUnit: '',
  })
  const [breakDowns, setBreakdowns] = useState({
    finalPayable: 0,
    appFee: 0,
    subTotal: 0,
  })

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (event) => {
    console.log(event)
    const name = 'pricePerUnit'
    const value = event

    const newState = { ...newBid }
    newState[name] = value
    console.log(newState)
    setNewBid(newState)
    calTotalPayable(newState.pricePerUnit * +offer.amount)
  }

  const submitNewBid = async (newBid) => {
    try {
      const { err, res } = await authRequest('/bids/addNewBid', POST, newBid)
      if (err) {
        setLoading(false)
        return setModalMessage(`${err.status}: ${err.message}`)
      }
      if(res){
        console.log(res)
        if (res.paymentUrl) { 
          setPaymentUrl(res.paymentUrl)
          setLoading(false)
          setOpen(false)
          return alert(`Bid submitted successfully: Your payment URl: ${res.paymentUrl}`)
        }
        setLoading(false)
        setOpen(false)
        return alert('Bid submitted successfully')
      }

      
    } catch (err) {
      console.log(err)
      setModalMessage(err.message || 'Something went wrong')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const fcmRegTokens = "FCM.NOTIFICATION.TOKEN"//getRegistrationToken()
    console.log(fcmRegTokens)
    // data validation
    if (!newBid.pricePerUnit) return setModalMessage('All fields are required')
    if (!fcmRegTokens) {
      requestFirebaseNotificationPermission()
      return setModalMessage('Notification is not on')
    }

    setModalMessage('')

    await submitNewBid({ ...newBid, offer: offer._id, fcmRegTokens})
  }

  const calTotalPayable = (subTotal) => {
    const finalPayable = subTotal + subTotal * APP_FEE_PERCENTAGE
    const appFee = subTotal * APP_FEE_PERCENTAGE
    console.log(appFee)
    setBreakdowns({ finalPayable, appFee, subTotal })
  }

  return (
    <>
      <View >
       
       <TouchableOpacity
        style={{width:wp(15), height:hp(3), backgroundColor:'blue', borderRadius:10, alignItems:'center'}}
        onPress={handleOpen}
        >
        <Text style={{fontSize:13, color:'white'}}>Bid</Text> 
       </TouchableOpacity>
      <Modal
       animationIn="slideInRight"
       animationOut="slideOutRight"
       animationInTiming={100}
       animationOutTiming={200}
       isVisible={open}
       useNativeDriver={true}
       onBackdropPress={()=>{
        setOpen(false)
      }}
       onBackButtonPress={() => {
         //setShowModal(!showModal);
         setOpen(false)
       }}
      >
        <View style={{
          display:'flex',
          alignItems:'center',
      height: hp(50),
      width:wp(80),
      backgroundColor:'white',
      borderTopRightRadius:10,
      borderTopLeftRadius:10}} >
          <Text >
            Bid on {offer.amount} {offer.assetName} for {offer.pricePerUnit}{' '}
            <Text >{offer.currencyName} unit price</Text> 
          </Text>
          <Text>{modalMessage}</Text>
          < View>
            <TextInput
            
              placeholder="Unit Price"
              value={newBid.pricePerUnit}
              onChangeText={(e)=>handleChange(e)}
              style={{width:wp(50)}}
             // onChange={handleChange}
            />
          </View>
          <View >
            <Text style={{fontSize:18}} >Subtotal:</Text>
            <Text>
              {breakDowns.subTotal}{' '}
              {offer.currencyName}
            </Text>
            <Text style={{fontSize:18}}>App Fee:</Text>
            <View>
              <Text>{breakDowns.appFee}{' '}</Text>
              <Text>{offer.currencyName} {100 * APP_FEE_PERCENTAGE} %</Text>
            </View>
            < Text style={{fontSize:18}}>Total:</Text>
            <Text>
              {breakDowns.finalPayable}{' '}
              <Text>{offer.currencyName}</Text>
            </Text>
          </View>
          <View>
         {loading? <ActivityIndicator size="large" color="blue" />:<View></View>}
            <Button title='Bid' onPress={()=>{
             setLoading(true)
             handleSubmit()
              }} color='green'>
              Bid 
            </Button>
          </View>
          
        </View>
      </Modal>
      </View>
    </>
  )
}
