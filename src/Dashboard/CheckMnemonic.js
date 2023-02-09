import React,{useRef, useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ActivityIndicator} from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Animated} from 'react-native';
import title_icon from '../../assets/title_icon.png'
import { useDispatch, useSelector } from "react-redux";
import { Generate_Wallet2 } from '../components/Redux/actions/auth';
import { AddToAllWallets, getBalance, setCurrentWallet, setUser, setToken, setWalletType } from '../components/Redux/actions/auth';
import { encryptFile } from '../utilities/utilities';
import DialogInput from 'react-native-dialog-input';
import { EthRouterV2, urls } from './constants';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers"



const CheckMnemonic = (props) => {
    
    
    const[loading, setLoading] = useState(false)
    const[accountName, setAccountName] = useState('')
    const [mnemonic, setMnemonic]= useState('')
    const[visible, setVisible] =useState(false)
    const[Wallet, setWallet] = useState()


    const dispatch = useDispatch();



    const fadeAnim = useRef(new Animated.Value(0)).current

    const Spin =  new Animated.Value ( 0 )
    const SpinValue =  Spin.interpolate ({
                inputRange :  [ 0, 1 ],
                outputRange :  [ '0deg', '360deg' ]
} )

async function saveUserDetails(){
  let response
  try{

  
    response = await fetch(`http://${urls.testUrl}/user/createUser`, {
      method: 'POST',
      headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
      },
     body: JSON.stringify({
               walletAddress: props.route.params.wallet.address,
               user:props.route.params.wallet.accountName
               })
     }).then((response) => response.json())
     .then(async (responseJson) => {
      console.log(responseJson)
      console.log(responseJson)
      if(responseJson.responseCode===200){
        alert('success')
      }
      else if(responseJson.responseCode===400){
        return {code: responseJson.responseCode, message:'account with same name already exists. Please use a different name'}
      }
      else{
        
        return {code:401, message:'Unable to create account. Please try again'}
      }
      return {code:responseJson.responseCode,token:responseJson.responseData}
      
    
    }).catch((error)=>{
      setVisible(!visible)

      alert(error)
    })
  }catch(e){
    setVisible(!visible)

    console.log(e)
    alert(e)
  }
    console.log(response)
    return response
  
    
}


    useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 1000,
          }
        ).start();

        Animated.timing(Spin,{
            toValue:1,
            duration:2000,
            useNativeDriver:true
        }).start()
        const wallet = props.route.params.wallet
        console.log(wallet)
      }, [fadeAnim, Spin])
    

  return (
    <Animated.View                 // Special animatable View
      style={{opacity:fadeAnim}}
    >
      <View style={style.Body}>
        <View style={{display:'flex', alignContent:'flex-start'}}>
        <Text style={style.welcomeText}>Enter your mnemonic below</Text>
        </View>
        
    
    <TextInput style={style.textInput} 
      onChangeText={(text) => {
        setMnemonic(text)
    }}
    placeholder={'Enter your secret phrase here'}
      />
      <Text style={{margin:5}}>Secret Phrases are typically 12(sometimes 16) words long.They are also called mnemonic phrase. </Text>
      {loading? <ActivityIndicator size="large" color="green" />:<Text> </Text>}
      <View style={{width:wp(95), margin:10}}>
<Button title={'Import'}  color={'blue'} onPress={async()=>{
           setLoading(true)
           
            
             if(mnemonic===props.route.params.wallet.mnemonic){
                const response = await saveUserDetails().then((response)=>{
                  if(response.code===400){
                    return alert(response.message)
                  }
                  else if(response.code===401){
                    return alert(response.message)
                  }
                    const token =`${response.token}`
                    console.log(token)

                    const accounts ={
                      address:props.route.params.wallet.address,
                      privateKey:props.route.params.wallet.privateKey,
                      name:props.route.params.wallet.accountName,
                      walletType:'Multi-coin',
                      wallets:[]
                    }
                    let wallets=[]
                    wallets.push(accounts)
                    const allWallets =[{
                      address:props.route.params.wallet.address,
                      privateKey:props.route.params.wallet.privateKey,
                      name:props.route.params.wallet.accountName,
                      walletType:'Multi-coin'
                    }]
                    AsyncStorageLib.setItem(`${props.route.params.wallet.accountName}-wallets`,JSON.stringify(allWallets))
                    AsyncStorageLib.setItem("user",props.route.params.wallet.accountName)
                    AsyncStorageLib.setItem("currentWallet",props.route.params.wallet.accountName)

                    dispatch(setUser(props.route.params.wallet.emailId))
                   // dispatch(setCurrentWallet(props.route.params.wallet.address,props.route.params.wallet.accountName,props.route.params.wallet.privateKey))
                    dispatch(AddToAllWallets(wallets,props.route.params.wallet.accountName))
                    dispatch(getBalance(props.route.params.wallet.address))
                    dispatch(setToken(token))
                    dispatch(setWalletType('Multi-coin'))

                     props.navigation.navigate('HomeScreen')
                 
                  }).catch((e)=>{
                    console.log(e)
                    //return alert('failed to create account. please try again')
                  })

             }else{
              return alert('Wrong Mnemonic. Please retry with correct mnemonic ')
             }
           
              
      }}></Button>
      </View>
      
    </View>
    
        </Animated.View>
  )
}

export default CheckMnemonic

const style = StyleSheet.create({
    Body:{
        display:'flex',
        backgroundColor:'white',
        height:hp(100),
        width:wp(100),
        textAlign:'center',
    },
    welcomeText:{
        fontSize:15,
        fontWeight:'200',
        color:'black',
        marginLeft:10
    },
    welcomeText2:{
        fontSize:15,
        fontWeight:'200',
        color:'white',
        marginTop:hp(1)
    },
    Button:{
        marginTop:hp(10),
        display:'flex',
        flexDirection:'row',
        alignContent:'space-around',
        alignItems:'center',
    },
    tinyLogo: {
        width: wp('5'),
        height: hp('5'),
        padding:30,
        marginTop:hp(10)
      },
      Text:{
        marginTop:hp(5),
        fontSize:15,
        fontWeight:'200',
        color:'white',
      },
      input: {
        height: hp('5%'),
        marginBottom: hp('2'),
        color:'black',
        marginTop:hp('2'),
        width:wp('90'),
        paddingRight:wp('7'),
        backgroundColor:'white',
        
      },
      textInput: {
        borderWidth:1,
        borderColor:'grey',
        height:hp(20),
        width:wp(95),
        margin:10,
        borderRadius:10,
        shadowColor: "#000",
 shadowOffset: {
     width: 0,
     height: 12,
 },
 shadowOpacity: 0.58,
 shadowRadius: 16.00,
 
 elevation: 24,
       },
input2: {
  borderWidth:1,
  borderColor:'grey',
  height:hp(5),
  width:wp(95),
  margin:10,
  borderRadius:10,
  shadowColor: "#000",
shadowOffset: {
width: 0,
height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,

elevation: 24,
    
      },
      
})