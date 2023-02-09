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
import { urls } from './constants';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers"
const ImportOtherWallets = (props) => {
    
    
    const[loading, setLoading] = useState(false)
    const[accountName, setAccountName] = useState('')
    const [mnemonic, setMnemonic]= useState('')
    const[visible, setVisible] =useState(false)
    const[Wallet, setWallet] = useState()
    const[label, setLabel] = useState('privateKey')
    const [privateKey, setPrivateKey] = useState('')
    const[json, setJson] = useState()
    const[jsonKey, setJsonKey] = useState()
    const[optionVisible, setOptionVisible] = useState(false)



    const dispatch = useDispatch();


    const fadeAnim = useRef(new Animated.Value(0)).current

    const Spin =  new Animated.Value ( 0 )
    const SpinValue =  Spin.interpolate ({
                inputRange :  [ 0, 1 ],
                outputRange :  [ '0deg', '360deg' ]
} )

async function saveUserDetails(address){
  let response
  try{

  
    response = await fetch(`http://${urls.testUrl}/user/createUser`, {
      method: 'POST',
      headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
      },
     body: JSON.stringify({
      walletAddress: address,
      user:accountName
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

      alert(error)
    })
  }catch(e){

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
      }, [fadeAnim, Spin])
    

  return (
    <Animated.View                 // Special animatable View
      style={{opacity:fadeAnim}}
    >
      <View style={style.Body}>
      <View style={style.Button}>
<View style={{margin:2, width:wp(32)}}>

<Button title={'privateKey'}  color={label=='privateKey'?'green':'grey'} onPress={()=>{
    setOptionVisible(false)
    setLabel('privateKey')
}}></Button>
    </View>
<View style={{margin:2,width:wp(32)}}>
<Button title={'Mnemonic'} color={label=='mnemonic'?'green':'grey'} onPress={()=>{
    setOptionVisible(false)
    setLabel('mnemonic')

}}></Button>
    </View>
    <View style={{margin:2,width:wp(33)}}>
<Button title={'JSON key'} color={label=='JSON'?'green':'grey'} onPress={()=>{
    setLabel('JSON')
    setOptionVisible(true)
}}></Button>
    </View>    
    
</View>
    
        <View style={{display:'flex', alignContent:'flex-start'}}>
        <Text style={style.welcomeText}>Name</Text>
        </View>
        <TextInput
      style={style.input2}
      theme={{colors: {text: 'black' }}}
      value={accountName}
      onChangeText={(text) => {
       setAccountName(text)

        }
      }
      placeholderTextColor="black"
      autoCapitalize={"none"}
      placeholder='Wallet 1'
      />
      
    <TextInput style={style.textInput} 
      onChangeText={(text) => {
        if(label==='privateKey'){
          setPrivateKey(text)

        }else if(label==='mnemonic'){
          setMnemonic(text)

        }else if(label==='JSON'){
          setJson(text)

        }else{
          return alert(`please input ${label} to proceed `)
        }
    }}
    placeholder={label==='privateKey'?'Enter your private Key here':label==='JSON'?'Enter your secret JSON Key here':'Enter your secret phrase here'}
      />
      
      <TextInput
      style={{borderWidth:1,
        borderColor:'grey',
        height:hp(5),
        width:wp(95),
        display:optionVisible===false?'none':'flex',
        margin:10,
        borderRadius:10,
        shadowColor: "#000",
      shadowOffset: {
      width: 0,
      height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,
      
      elevation: 24}}
      theme={{colors: {text: 'black' }}}
      value={jsonKey}
      onChangeText={(text) => {
       setJsonKey(text)

        }
      }
      placeholderTextColor="black"
      autoCapitalize={"none"}
      placeholder='JSON password'
      />
      
      {loading? <ActivityIndicator size="large" color="green" />:<Text> </Text>}
      <View style={{width:wp(95), margin:10}}>
<Button title={'Import'}  color={'blue'} onPress={()=>{
   if(!accountName){
    return alert('please enter an accountName to proceed')

  }
           setLoading(true)
           setTimeout(() => {
            if(label==='mnemonic'){
              const phrase = mnemonic.trimStart()
              const trimmedPhrase = phrase.trimEnd()
              const check = ethers.utils.isValidMnemonic(trimmedPhrase)
              if(!check){
                setLoading(false)
                return alert('Incorrect Mnemonic. Please provide a valid Mnemonic')
              }
                
              const accountFromMnemonic = new ethers.Wallet.fromMnemonic(trimmedPhrase);
              const Keys = accountFromMnemonic._signingKey()
              const privateKey = Keys.privateKey
              const wallet = {
                address:accountFromMnemonic.address,
                privateKey:privateKey
               }
               const response = saveUserDetails(accountFromMnemonic.address).then((response)=>{
                if(response.code===400){
                  return alert(response.message)
                }
                else if(response.code===401){
                  return alert(response.message)
                }
                  const token =`${response.token}`
                  console.log(token)


                const accounts ={
                  address:wallet.address,
                  privateKey:wallet.privateKey,
                  name:accountName,
                  walletType:'Ethereum',
                  wallets:[]
                }
                let wallets=[]
                wallets.push(accounts)
                const allWallets =[{
                  address:wallet.address,
                  privateKey:wallet.privateKey,
                  name:accountName,
                  walletType:'Ethereum',
                }]
                AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(allWallets))
                AsyncStorageLib.setItem("user",accountName)
                AsyncStorageLib.setItem('currentWallet',accountName)
               // dispatch(setUser(accountName))
                dispatch(setCurrentWallet(wallet.address,accountName,wallet.privateKey))
                dispatch(AddToAllWallets(wallets,accountName))
                dispatch(getBalance(wallet.address))
                dispatch(setToken(token))
                //dispatch(setProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
                dispatch(setWalletType('Ethereum'))

                 props.navigation.navigate('HomeScreen')
             
              }).catch((e)=>{
                console.log(e)
                setLoading(false)

                return alert('failed to create account. please try again')
              })
               

            }else if(label==='privateKey'){
              const check = ethers.utils.isHexString(privateKey, 32)
              if(!check){
                setLoading(false)
                return alert('Incorrect PrivateKey. Please provide a valid privatekey')
              }
              const walletPrivateKey = new ethers.Wallet(privateKey)
              console.log(walletPrivateKey)
              const Keys = walletPrivateKey._signingKey()
              const privatekey = Keys.privateKey
              const wallet = {
                address:walletPrivateKey.address,
                privateKey:privatekey
               }
               const response = saveUserDetails(wallet.address).then((response)=>{
                if(response.code===400){
                  return alert(response.message)
                }
                else if(response.code===401){
                  return alert(response.message)
                }
                  const token =`${response.token}`
                  console.log(token)


                const accounts ={
                  address:wallet.address,
                  privateKey:wallet.privateKey,
                  name:accountName,
                  walletType:'Ethereum',
                  wallets:[]
                }
                let wallets=[]
                wallets.push(accounts)
                const allWallets =[{
                  address:wallet.address,
                  privateKey:wallet.privateKey,
                  name:accountName,
                  walletType:'Ethereum',
                }]
                AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(allWallets))
                AsyncStorageLib.setItem("user",accountName)
                AsyncStorageLib.setItem('currentWallet',accountName)

                dispatch(setUser(accountName))
                dispatch(setCurrentWallet(wallet.address,accountName,wallet.privateKey))
                dispatch(AddToAllWallets(wallets,accountName))
                dispatch(getBalance(wallet.address))
                dispatch(setToken(token))
                //dispatch(setProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
                dispatch(setWalletType('Ethereum'))

                setLoading(false)
                props.navigation.navigate('HomeScreen')
             
              }).catch((e)=>{
                console.log(e)
                setLoading(false)
                alert(e)

              })
               

            }else{

   ethers.Wallet.fromEncryptedJson(json, jsonKey).then((wallet) =>{
    console.log("Address: " + wallet.address);
    const Wallet = {
      address:wallet.address,
      privateKey:wallet.privateKey
     }
     setWallet(wallet)

     const response = saveUserDetails(wallet.address).then((response)=>{
      if(response.code===400){
        return alert(response.message)
      }
      else if(response.code===401){
        return alert(response.message)
      }
        const token =`${response.token}`
        console.log(token)


      const accounts ={
        address:wallet.address,
        privateKey:wallet.privateKey,
        name:accountName,
        walletType:'Ethereum',
        wallets:[]
      }
      let wallets=[]
      wallets.push(accounts)
      const allWallets =[{
        address:wallet.address,
        privateKey:wallet.privateKey,
        name:accountName,
        walletType:'Ethereum',
      }]
      AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(allWallets))
      AsyncStorageLib.setItem("user",accountName)
      AsyncStorageLib.setItem('currentWallet',accountName)

      dispatch(setUser(accountName))
      dispatch(setCurrentWallet(wallet.address,accountName,wallet.privateKey))
      dispatch(AddToAllWallets(wallets,accountName))
      dispatch(getBalance(wallet.address))
      dispatch(setToken(token))
      //dispatch(setProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
      dispatch(setWalletType('Ethereum'))

       props.navigation.navigate('HomeScreen')
   
    }).catch((e)=>{
      setLoading(false)

      console.log(e)
      return alert('failed to create account. please try again')
    })
     
    
}).catch((e)=>{
  console.log(e)
  setLoading(false)

            })
setLoading(false)

            }
            
            }, 1);
              
      }}></Button>
      </View>
      
    </View>
    
        </Animated.View>
  )
}

export default ImportOtherWallets

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
        marginTop:hp(0),
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

/*<View style={style.Button}>
<View style={{margin:10}}>

<Button title={'privateKey'}  color={label=='privateKey'?'green':'grey'} onPress={()=>{
    setLabel('privateKey')
}}></Button>
    </View>
<View style={{margin:10}}>
<Button title={'Mnemonic'} color={label=='mnemonic'?'green':'grey'} onPress={()=>{
    setLabel('mnemonic')
}}></Button>
    </View>    
    
</View>*/