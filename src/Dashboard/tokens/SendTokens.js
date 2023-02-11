import React,{useRef, useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Animated} from 'react-native';
import title_icon from '../../../assets/title_icon.png'
import { useDispatch, useSelector } from "react-redux";
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getBalance, getEthBalance, getMaticBalance , getXrpBalance} from "../../components/Redux/actions/auth";
import { SendCrypto } from './sendFunctions';
import "react-native-get-random-values"
import "@ethersproject/shims"
var ethers = require('ethers');
const xrpl = require("xrpl")
//'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850'
const SendTokens = (props) => {
    const EthBalance =  useSelector((state) =>   state.EthBalance)
    const MaticBalance =  useSelector((state) =>   state.MaticBalance)
    const type = useSelector((state) =>  state.walletType)
    const[address, setAddress] = useState('')
    const[amount, setAmount] = useState('')
    const[Loading, setLoading] = useState(false)
    const[balance, setBalance]=useState()
    const[walletType, setWallettype] = useState('')
    const [disable, setDisable] = useState(false)

    const state = useSelector((state) => state);
    const dispatch = useDispatch();

    const navigation = useNavigation();

    const fadeAnim = useRef(new Animated.Value(0)).current

    const Balance = async (Type) => {
      const wallet = await AsyncStorageLib.getItem('wallet')
     const address =  await state.wallet.address?await state.wallet.address:JSON.parse(wallet).address
      console.log(state.wallet.address)
      if(!state.wallet.address){
       setBalance(0)
       alert('please select a wallet first')
      }else{

      

     if(Type){
       if(Type=="Ethereum"){
         await dispatch(getEthBalance(state.wallet.address?state.wallet.address:address))
         .then((res)=>{
           console.log(res.EthBalance)
           setBalance(res.EthBalance)
         })
       }
       else if(Type=="Matic"){
        await dispatch(getMaticBalance(state.wallet.address?state.wallet.address:address))
         .then((res)=>{
           console.log(res.MaticBalance)
           setBalance(res.MaticBalance)
         })
       }else if(Type=="Xrp"){
         await AsyncStorageLib.getItem('wallet').then(async(wallet)=>{
          await dispatch(getXrpBalance(JSON.parse(wallet).classicAddress))
         .then((res)=>{
           console.log(res.XrpBalance)
           setBalance(res.XrpBalance)
         })

       })}
       else if(Type=="BNB"){
         
          await dispatch(getBalance(state.wallet.address))
         .then(async (response) => {
           
           console.log(response)
           const res = await response
           if (res.status == "success") {
             
           console.log(res)
           setBalance(res.walletBalance)
           console.log('success')
           
         }
       })
       .catch((error) => {
         console.log(error)
         alert(error)
         
       });
     }
       
       
     }
     }};

    useEffect(async () => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 1000,
          }
        ).start();
      console.log(props.route.params.token)
      const Type = await AsyncStorageLib.getItem('walletType')
      setWallettype(JSON.parse(Type))
      await Balance(props.route.params.token)
        
      }, [fadeAnim])
    

  return (
    <Animated.View                 // Special animatable View
      style={{opacity:fadeAnim}}
    >
       
      <View style={style.Body}>
        <Text style={{marginLeft:wp(5), marginTop:hp(5)}} > Reciepent address </Text>
        <TextInput style={style.textInput2}
        onChangeText={(input)=>{
          console.log(input)
          setAddress(input)

        }}
        />
        <Text style={{marginLeft:wp(5), marginTop:hp(1)}} >Available balance {balance?balance:0}</Text>
        <Text style={{marginLeft:wp(5), marginTop:hp(10)}} > Amount </Text>
        <TextInput style={style.textInput2}
        keyboardType='numeric'
        onChangeText={(input)=>{
          console.log(input)
          setAmount(input)

        }}
        />
            {Loading? <View style={{marginBottom:hp('-4')}}><ActivityIndicator size="small" color="blue" /></View>:<Text> </Text>}

        <View style={{width:wp(30), marginTop:hp(10), marginLeft:wp(33)}} >
            <Button color='blue' title='Send' onPress={async ()=>{
              console.log(walletType)
              const myAddress = await state.wallet.address
              const token = props.route.params.token
              const wallet = await AsyncStorageLib.getItem('Wallet')
              console.log(wallet)
              const privateKey = await state.wallet.privateKey?await state.wallet.privateKey:JSON.parse(wallet).privateKey
              console.log(privateKey)

              await SendCrypto(address,amount,privateKey,balance,setLoading,walletType, setDisable,myAddress, token,navigation)
            }} ></Button>
            </View>

        
        </View>

   </Animated.View>
  )
}

export default SendTokens

const style = StyleSheet.create({
    Body:{
        display:'flex',
        backgroundColor:'white',
        height:hp(100),
        width:wp(100),
        
     
    },
    Text:{
        fontSize:18,
        color:'black'
        
    },
    welcomeText2:{
        fontSize:15,
        fontWeight:'200',
        color:'white',
        marginTop:hp(1)
    },
    Button:{
        marginTop:hp(10)
    },
    
      Text:{
        marginTop:hp(5),
        fontSize:15,
        fontWeight:'200',
        color:'white',
      },
      textInput2: {
        borderWidth:1,
        borderColor:'grey',
        width:wp(90),
        margin:10,
        borderRadius:10,
        shadowColor: "#000",
        height:wp(8),
 shadowOffset: {
     width: 0,
     height: 12,
 },
 shadowOpacity: 0.58,
 shadowRadius: 16.00,
 
 elevation: 24,
       },
     
      
})