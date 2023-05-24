import { useState, useEffect } from 'react'
 import { authRequest, POST, GET } from '../api'
 import { TextInput } from "react-native-paper";
import { APP_FEE_PERCENTAGE, TX_FEE_IN_USD } from "../utils/constants";
import {
  getRegistrationToken,
  requestFirebaseNotificationPermission,
} from "../utils/fcmHandler";
import { convertCurrencies } from "../utils/currencyConversion";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
//import Snackbar from 'react-native-snackbar';
import SnackBar from 'react-native-snackbar-component'
import WebView from "react-native-webview";
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { SelectView, _getCurrencyOptions } from './newAccount.model'
import { useNavigation } from '@react-navigation/native';
import { getCurrentChain } from '../utils/chainHandler'
import { useSelector } from 'react-redux';
import { useToast } from 'native-base';
import { ShowToast } from '../../../../reusables/Toasts';

export const NewBidModal = ({ offer }) => {
  const state = useSelector((state) => state)
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [txFeeInUsd, setTxFeeInUsd] = useState(TX_FEE_IN_USD)
  const [txModal, setTxModal] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState(null);
  const[walletType, setWalletType] = useState(null)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [selected,setSelected] = useState([])
  const[currencyData, setCurrencyData] = useState([])
  const[disable, setDisable] = useState(true)
  const [balance, setBalance] = useState(0)
  const toast = useToast()
  const [newBid, setNewBid] = useState({
    pricePerUnit: null,
    currencyName: offer.currencyName,

  });
  const [breakDowns, setBreakdowns] = useState({
    finalPayable: 0,
    appFee: 0,
    subTotal: 0,
    convertedTxFee: null,
    convertedUnitPrice: null,

  });
  const navigation = useNavigation()

  

  const getTxFeeData = async (txName, chainId) => {
    try {
      const { err, res: { gasPriceInUsd = TX_FEE_IN_USD } = {} } =
      await authRequest(`/users/getTxFeeData/${txName}/${chainId}`, GET)
      if (err) return setModalMessage(`${err.status}: ${err.message}`)

      return setTxFeeInUsd(Number(gasPriceInUsd))
    } catch (err) {
      console.log(err)
      setModalMessage(err.message || 'Something went wrong')
    }
  }


  const SeeTransactions = () => {
    return (
      <View>
        <Modal
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={100}
          animationOutTiming={200}
          isVisible={txModal}
          useNativeDriver={true}
          onBackdropPress={() => {
            setTxModal(false);
          }}
          onBackButtonPress={() => {
            //setShowModal(!showModal);
            setTxModal(false);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 50,
              height: 10,
            }}
          >
            <WebView
              source={{ uri: `${paymentUrl}` }}
              onNavigationStateChange={(data) => {
                if (data.url.includes(`offers?session_id`)) {
                  ///do if payment successfull
                  setTxModal(false)
                  alert('Payment Successful')
                  setPressed('4')
                  navigation.navigate('/Transactions')
                }

                if (data.url.includes("offers?payFailed=true")) {
                  ///do if payment is cancelled
                  setTxModal(false)
                  alert('Payment failed. Please try again')
                }
              }}
            />
          </View>
        </Modal>
      </View>
    );
  };

  const handleChange = async (event) => {
    console.log(event);
    const name = "pricePerUnit";
    const value = event;

    const newState = { ...newBid };
    newState[name] = value;
    console.log(newState)
    console.log(newState);
    setNewBid(newState);
    calTotalPayable(+newState.pricePerUnit, newState.currencyName)
  };

  const handleChangeBid = async (event) => {
    console.log(event);
    const name = "currencyName";
    const value = event.value;

    const newState = { ...newBid };
    newState[name] = value;
    console.log(newState);
    setNewBid(newState);
    calTotalPayable(+newState.pricePerUnit, newState.currencyName)
  };

  const submitNewBid = async (newBid) => {
    try {
      const { err, res } = await authRequest("/bids/addNewBid", POST, newBid);
      if (err) {
        setLoading(false);
        console.log(err);
        alert(err.message)
        return setModalMessage(`${err.message}`);
      }
      if (res) {
        console.log(res);
        if (res.paymentUrl) {
          setPaymentUrl(res.paymentUrl);
          setLoading(false);
          setSnackbarVisible(true)
         // setLoading(false);
          setOpen(false);
         /* return alert(
            `Bid submitted successfully: Your payment URl: ${res.paymentUrl}`
          );*/
          return     
          
         }
          
        setLoading(false);
        setOpen(false);

        //alert("Bid submitted successfully");
        return ShowToast(toast,"Bid submitted successfully")
      }
    } catch (err) {
      console.log(err);
      setModalMessage(err.message || "Something went wrong");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const fcmRegTokens = "FCM.NOTIFICATION.TOKEN"; //await getRegistrationToken()
    console.log(fcmRegTokens);
    // data validation
    if (!newBid.pricePerUnit) return setModalMessage("All fields are required");
    if (!fcmRegTokens) {
      requestFirebaseNotificationPermission();
      return setModalMessage("Notification is not on");
    }

    setModalMessage("");

    await submitNewBid({ ...newBid, offer: offer._id, fcmRegTokens });
  };

  const calTotalPayable = async (pricePerUnit, currencyName) => {
    const subTotal = pricePerUnit * offer.amount
    const convertedUnitPrice =
      currencyName !== offer.currencyName
        ? await convertCurrencies(
            currencyName,
            offer.currencyName,
            pricePerUnit
          )
        : null
 const appFee = (subTotal * APP_FEE_PERCENTAGE).toFixed(2);
    let convertedTxFee = txFeeInUsd / 2
    if (currencyName !== "USD")
      convertedTxFee = await convertCurrencies(
        "USD",
        currencyName,
        txFeeInUsd / 2
      );
    const finalPayable =
      subTotal + subTotal * APP_FEE_PERCENTAGE + convertedTxFee;
      setBreakdowns({
        finalPayable,
        appFee,
        subTotal,
        convertedTxFee,
        convertedUnitPrice,
      })  };

      const getBalance = async (assetName)=>{
        const walletType = await AsyncStorageLib.getItem('walletType')
        const walletAdress = await state.wallet.address
        console.log(walletType)
         if(assetName=='ETH')
         {
           if(JSON.parse(walletType)=="Ethereum" || JSON.parse(walletType)=="Multi-coin")
           {
             const balance = await state.EthBalance
             console.log(balance)
             setBalance(balance)
             setModalMessage('')
             return
           }
           setDisable(true)
           return setModalMessage('You need an ethereum or Multi-coin wallet to do this transaction')
         }
         else if(assetName=="BNB")
         {
           if(JSON.parse(walletType)!=='BNB' || JSON.parse(walletType)!== "Multi-coin"){
             const balance = await state.walletBalance
             console.log(balance)
             setBalance(balance)
             setModalMessage('')
             return
           }
           setDisable(true)
           return setModalMessage('You need a BNB or Multi-coin wallet to do this transaction')
          
         }
         else if(assetName=="MATIC")
         {
           if(JSON.parse(walletType)=='Matic' || JSON.parse(walletType)=='Multi-coin'){
           const balance = await state.MaticBalance
           console.log(balance)
           setBalance(balance)
           setModalMessage('')
           return
           }
           setDisable(true)
           return setModalMessage('You need a Matic wallet to do this transaction')
           
         }
         else if(assetName =="WBTC")
         {
           if(JSON.parse(walletType)=="Ethereum" || JSON.parse(walletType)=="Multi-coin")
           {
             const balance = await getEthTokenBalance(walletAdress,WBTC)
             console.log("hi",balance)            
            setBalance(balance)
            setModalMessage('')
            return  
          }
           setDisable(true)
           return setModalMessage('You need a ETH or Multi-coin wallet to do this transaction')
           
         }
         else if(assetName =="DAI")
         {
           if(JSON.parse(walletType)=="Ethereum" || JSON.parse(walletType)=="Multi-coin")
           {
             const balance = await getEthTokenBalance(walletAdress,DAI)
             console.log(balance)
             setBalance(balance)
             setModalMessage('')
             return  
           }
           setDisable(true)
           return setModalMessage('You need a ETH or Multi-coin wallet to do this transaction')
           
         }
         else if(assetName =="USDT")
         {
           if(JSON.parse(walletType)=="Ethereum" || JSON.parse(walletType)=="Multi-coin")
           {
             const balance = await getEthTokenBalance(walletAdress,USDT)
             console.log(balance)
             setBalance(balance)
             setModalMessage('')
             return  
           }
           setDisable(true)
           return setModalMessage('You need a ETH or Multi-coin wallet to do this transaction')
           
         }
     
       }
  const enableValidation = ()=>{
    console.log(newBid.pricePerUnit, offer)
    if(newBid.pricePerUnit!=null && newBid.pricePerUnit!="" && newBid.pricePerUnit <= offer.pricePerUnit && offer.amount<balance){
      setDisable(false)
    }
    else{
      setDisable(true)
    }

    if(offer.amount>balance)
    {
      setDisable(true)
      setModalMessage('Low Balance')
    }
   else if(newBid.pricePerUnit > offer.pricePerUnit)
    {
      setDisable(true)
      setModalMessage('Bid price cannot be greater than offer price')
    }
    else{
     // setDisable(false)

      setModalMessage('')
    }
  }

  useEffect(()=>{
    const data =_getCurrencyOptions()
    console.log(data)
    setCurrencyData(data)
  },[])

  useEffect(() => {
    getTxFeeData(offer.assetName, offer.chainId)
  }, [])

  useEffect(()=>{
    AsyncStorageLib.getItem('walletType')
    .then((walletType)=>{
      setWalletType(JSON.parse(walletType))
    })
  },[])

  useEffect(()=>{
    console.log(newBid.pricePerUnit)
    enableValidation()
  },[newBid.pricePerUnit, newBid])

useEffect(()=>{
getBalance(offer.assetName)
},[])
  
  return (
    <>
    
    <View>
      <View>
        <TouchableOpacity
          style={{
            width: wp(15),
            height: hp(3),
            backgroundColor: "blue",
            borderRadius: 10,
            alignItems: "center",
          }}

          onPress={()=>{
            if(walletType==='Ethereum' || walletType ==='Multi-coin'){

              setOpen(true)
            }else{
              alert('Only Ethereum based Wallet is allowed for now.')
            }
          }}
        >
          <Text style={{ fontSize: 13, color: "white" }}>Bid</Text>
        </TouchableOpacity>
        <Modal
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={100}
          animationOutTiming={200}
          isVisible={open}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating  
          onBackdropPress={() => {
            setOpen(false);
          }}
          onBackButtonPress={() => {
            //setShowModal(!showModal);
            setOpen(false);
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              height: hp(80),
              width: wp(90),
              backgroundColor: "white",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
          >
            <Text>
              Bid on {offer.amount} {offer.assetName} for {offer.pricePerUnit}{" "}
              <Text>{offer.currencyName} unit price</Text>
            </Text>
            <Text style={{color:'red'}}>{modalMessage}</Text>
            <View style={{display:'flex', alignContent:'center', alignItems:'center', alignSelf:'center',width:wp(25), margin:20}}>

            <SelectView
             options={currencyData?currencyData:[]}
             value={newBid.currencyName}
             onChange={handleChangeBid}
             name='currencyName'
             inputLabel='Choose a Currency'
             selected={selected}
             />
             </View>
            <View>
              <TextInput
                placeholder="Unit Price"
                keyboardType='numeric'
                value={newBid.pricePerUnit}
                onChangeText={(e) => handleChange(e)}
                style={{ width: wp(50) }}
                // onChange={handleChange}
              />
            </View>
            <View style={{display:'flex', alignContent:'center', alignItems:'center', alignSelf:'center'}}>
              <Text>Balance: {balance}</Text>
            </View>
            <View style={{display:'flex', alignContent:'center', alignItems:'center', alignSelf:'center'}}>
            {breakDowns.convertedUnitPrice !== 0 &&
               breakDowns.convertedUnitPrice && (
                 <>
                   <Text>
                     Converted Unit Price:
                   </Text>
                   <Text>
                     {breakDowns.convertedUnitPrice}{' '}
                     <Text>{offer.currencyName}</Text>
                   </Text>
                 </>
               )}
            </View>
            <View style={{display:'flex', alignContent:'center', alignItems:'center', alignSelf:'center'}}>
              <Text style={{ fontSize: 18 }}>Subtotal:</Text>
              <Text>
                {breakDowns.subTotal} {newBid.currencyName}
              </Text>
              <Text style={{ fontSize: 18 }}>App Fee:</Text>
              <View>
                <Text>{breakDowns.appFee} </Text>
                <Text>
                  {offer.currencyName} {100 * APP_FEE_PERCENTAGE} %
                </Text>
              </View>
              <View style={{display:'flex', alignContent:'center', alignItems:'center', alignSelf:'center'}} >
                <Text>Transaction Fee:</Text>
                <Text>{txFeeInUsd / 2} USD</Text>
                <Text>
                  {breakDowns.convertedTxFee && (
                    <>
                      (
                      <Text>
                        {breakDowns.convertedTxFee} {newBid.currencyName}
                      </Text>
                      )
                    </>
                  )}
                </Text>
              </View>
              <Text style={{ fontSize: 18 }}>Total:</Text>
              <Text>
                {breakDowns.finalPayable} <Text>{newBid.currencyName}</Text>
              </Text>
              <Text>
                Note: The above totals are just estimations that can vary
                depending on currency rates.
              </Text>
            </View>
            <View>
              {loading ? (
                <ActivityIndicator size="large" color="blue" />
              ) : (
                <View></View>
              )}
              <Button
                title="Bid"
                disabled={disable}
                onPress={() => {
                  setLoading(true);
                  handleSubmit();
                }}
                color="green"
              >
                Bid
              </Button>
            </View>
          </View>
          
        </Modal>
        
      </View>
     
      </View>
      <View style={{width:wp(95),position:'absolute',top:hp(5), right:wp(-62)}}>
          <SnackBar visible={snackbarVisible} position={'bottom'} textMessage="Bid is an exact match. Proceed to complete the transaction" 
          actionHandler={()=>{
            //Linking.openURL(paymentUrl)
            setTxModal(true)
            SeeTransactions()
            setSnackbarVisible(false)
          }} actionText="Proceed"/>
    </View>
    <SeeTransactions/>
    </>
  );
};
