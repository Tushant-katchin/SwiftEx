import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { authRequest, POST } from '../api'
import { APP_FEE_PERCENTAGE } from '../utils/constants'
import { isWalletConnected, transfer } from '../web3'
import { StyleSheet, Text, View,  Button, TouchableOpacity, ScrollView, ActivityIndicator} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import {DropDown} from './dropDown'
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
export const NewOfferModal = ({ user, open,setOpen }) => {
  const state =  useSelector( (state) =>  state)
  const navigation = useNavigation()
  const [modalMessage, setModalMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const[loading, setLoading] = useState(false)
  const [breakDowns, setBreakdowns] = useState({
    finalPayable: 0,
    appFee: 0,
    subTotal: 0,
  })
  const [newOffer, setNewOffer] = useState({
    amount: '',
    assetName: '',
    pricePerUnit: '',
    currencyName: '',
  })

  const assetData = [
    { label: 'ETH', value: 'ETH' },
    { label: 'USDT', value: 'USDT' },
    { label: 'DAI', value: 'DAI' },
  ]

  const currencyData = [
    
   {label:'US Dollar', value:'USD'},
   { label:'EURO', value:'EUR'},
   { label:'Indian Rupee', value:'INR'}
  ]

  const handleChange = (input,type) => {
    const name = type
    const value = input

    const newState = { ...newOffer }
    newState[name] = value
    setNewOffer(newState)

    // Calculate break down
    if (name === 'amount' || name === 'pricePerUnit')
      if (newState.amount && newState.pricePerUnit)
        calTotalPayable(newState.amount * newState.pricePerUnit)
  }

  const submitNewOffer = async (newOffer) => {
    try {
      const { err } = await authRequest('/offers/addNewOffer', POST, newOffer)
      if (err) return setModalMessage(`${err.status}: ${err.message}`)

      setOpen(false)
    } catch (err) {
      setOpen(false)
      console.log(err)
      setModalMessage(err.message || 'Something went wrong')
    }
  }

  const signAssetTransfer = async () => {
    // connection validation
    if (!state.wallet.address) {
      throw new Error('You are not connected to a wallet')
    }
   const receiver = '0x70200Cf83DB1a2d7c18F089E86a6faA98bFbADAE'//await state.wallet.address
    // Get signed transfer
    const { signedTx, err } = await transfer(
      newOffer.assetName,
      receiver,
      newOffer.amount,
    )

    return { signedTx, err }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setLoading(true)
      console.log(newOffer)
      // data validation
      const { amount, assetName, pricePerUnit, currencyName } = newOffer
      if (!amount || !assetName || !pricePerUnit || !currencyName)
        throw new Error('All fields are required')

      const { signedTx, err } = await signAssetTransfer()
      if (err) throw new Error(err.message || 'transaction failed')

      const newOfferBody = { ...newOffer, signedTx }

      await submitNewOffer(newOfferBody)
    } catch (err) {
      console.log(err)
      setModalMessage(err.message || 'transaction failed')
    } finally {
      setIsSubmitting(false)
      setLoading(false)
      setOpen(false)
    }
  }

  const calTotalPayable = (subTotal) => {
    const finalPayable = subTotal + subTotal * APP_FEE_PERCENTAGE
    const appFee = subTotal * APP_FEE_PERCENTAGE
    setBreakdowns({ finalPayable, appFee, subTotal })
  }

  return (

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
        }} >
        <View
        style={{
          height: hp(90),
          width:wp(90),
          backgroundColor:'white',
          borderTopRightRadius:10,
          borderTopLeftRadius:10,
          display:'flex',
          alignItems:'center'
        }}
          >
            <View style={{
           display:'flex',
          alignItems:'center'
          }}>

            <Text>

              Add New Offer
            </Text>
            
            <Text>{modalMessage}</Text>
            <View
            style={{
              display:'flex',
             alignItems:'center'
             }}
            >

            <Text>Enter Amount</Text>
              <TextInput
        style={styles.input}
        theme={{colors: {text: 'white' }}}
        value={newOffer.amount}
        placeholder="Amount"
        onChangeText={(text) => {
          const type = 'amount'
          handleChange(text,type)
        
        }}
        autoCapitalize={"none"}
        placeholderTextColor="#FFF"
        
        />
         <Text>Enter Price</Text>
        <TextInput
        style={styles.input}
        theme={{colors: {text: 'white' }}}
        placeholder="Unit Price"
        value={newOffer.pricePerUnit}
        onChangeText={(text) => {
          const type = 'pricePerUnit'
          handleChange(text,type)
        
        }}
        autoCapitalize={"none"}
        placeholderTextColor="#FFF"
        
        />
        
        
        </View>
        <View
            style={{
              display:'flex',
              alignItems:'center',
              marginTop:hp(2)
            }}
            >
             <DropDown Title='Choose Asset' dropdownData={assetData} setNewOffer={setNewOffer} newOffer={newOffer} />

           
              
              <DropDown Title='Choose Currency' dropdownData={currencyData} setNewOffer={setNewOffer}newOffer={newOffer}/>
        </View>
       
       
            
        </View>
            <View
            style={{
              display:'flex',
             alignItems:'center',
             marginTop:hp(2)
             }}
            >
              <Text>Subtotal Payable:</Text>
              <Text>
                {breakDowns.subTotal}{' '}
              </Text>
              <Text>
                {newOffer.currencyName}
              </Text>
              <Text>App Fee:</Text>
              <Text>
                {breakDowns.appFee}
                </Text>
                <Text>{newOffer.currencyName}</Text> 
                <Text>({100 * APP_FEE_PERCENTAGE}%)</Text>
              
              <Text>Total Payable Price:</Text>
              <Text>
                {breakDowns.finalPayable}
              </Text>
              <Text>
                {newOffer.currencyName}
              </Text>
            
          </View>
         <View>
          <View>
          <Button
            title='Submit'
            onPress={handleSubmit}
            color='green'
            />
            
              </View>
             {loading? <ActivityIndicator size="small" color="blue" />:<View></View>}
              <View
              style={{marginTop:hp(1)}}
              >
                <Button
              title="Cancel"
              color='red'
              onPress={()=>setOpen(false)}
              />
           
            </View>
            </View>
              
           
         
      </View>
    </Modal>

  )
}

const styles = StyleSheet.create({
  input: {
    height: hp('5%'),
    marginBottom: hp('2'),
    color:'#fff',
    marginTop:hp('1'),
    width:wp('60'),
    backgroundColor:'#131E3A',
    
  },
  content: {
    display: 'flex',
    alignItems:'center',
    textAlign:'center',
    justifyContent:'space-evenly',
    marginTop:hp('1'),
    color:'white'
    
  }

})
