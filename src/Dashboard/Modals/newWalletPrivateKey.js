import React,{useRef, useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Animated} from 'react-native';
import title_icon from '../../../assets/title_icon.png'
import { TextInput, Checkbox } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { AddToAllWallets, getBalance, setCurrentWallet, setUser, setToken, setWalletType } from '../../components/Redux/actions/auth';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import DialogInput from 'react-native-dialog-input';
import { encryptFile } from '../../utilities/utilities';
import { urls } from '../constants';
import Modal from "react-native-modal";
import CheckNewWalletMnemonic from './checkNewWalletMnemonic';

const NewWalletPrivateKey = ({props,Wallet,Visible,SetVisible,setModalVisible,setNewWalletVisible}) => {
    const[accountName, setAccountName] = useState('')
    const[visible, setVisible]= useState(false)
    const[newWallet,setNewWallet] = useState(false)
    const[MnemonicVisible,setMnemonicVisible] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const dispatch = useDispatch();

    const Spin =  new Animated.Value ( 0 )
    const SpinValue =  Spin.interpolate ({
                inputRange :  [ 0, 1 ],
                outputRange :  [ '0deg', '360deg' ]
} )

async function saveUserDetails(){
  let response
  try{

  
    response = await fetch(`http://${urls.testUrl}/user/saveUserDetails`, {
      method: 'POST',
      headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
      },
     body: JSON.stringify({
               emailId: accountName,
               walletAddress:Wallet.address
               })
     }).then((response) => response.json())
     .then(async (responseJson) => {
      
      if(responseJson.responseCode===200){
        alert('success')
        return responseJson.responseCode
      }
      else if(responseJson.responseCode===400){
        alert('account with same name already exists. Please use a different name')
        return responseJson.responseCode
      }
      else{
        alert('Unable to create account. Please try again')
        return 401
      }
      
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

    useEffect(async() => {
     
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 1000,
          }
        ).start();

       
        console.log(Wallet)
      }, [fadeAnim])
    

  return (
    <Animated.View                 // Special animatable View
      style={{opacity:fadeAnim}}
    >
        <Modal
    animationIn="slideInRight"
  animationOut="slideOutRight"
  animationInTiming={500}
  animationOutTiming={650}
  isVisible={Visible}
  useNativeDriver={true}
  statusBarTranslucent={true}

  onBackButtonPress={() => {
      SetVisible(false);
  }}>
      <View style={style.Body}>
    
    < Animated.Image
    style={{width: wp('5'),
    height: hp('5'),
    padding:30,
    marginTop:hp(10),
    }}
    source={title_icon}
  />
  <Text style={style.welcomeText}> Hi,</Text>
    <Text style={style.welcomeText}>  Please note your mnemonic or save it</Text>
    <Text style={style.welcomeText2}> Your Mnemonic Phrase</Text>

      <Text selectable={true} style={style.welcomeText2}>{Wallet?Wallet.mnemonic:''}</Text>
      <Text style={style.welcomeText2}> Account Name</Text>


      <TextInput
      style={style.input}
      theme={{colors: {text: 'black' }}}
      value={accountName}
      onChangeText={(text) => setAccountName(text)}
      placeholderTextColor="#FFF"
      autoCapitalize={"none"}
      />
    <View style={style.Button}>
    <Button title='Next' color={'green'} disabled={accountName?false:true} onPress={()=>{
      //setVisible(!visible)
      let wallet = Wallet
      wallet.accountName = accountName
      setNewWallet(wallet)
      setMnemonicVisible(true)
      
}} ></Button>
    </View>
    <DialogInput 
                isDialogVisible={visible}
                title={"Wallet password"}
                message={"Please set your wallet password below"}
                hintInput ={"Enter Passsword here"}
                submitInput={ async (inputText) => {
                  setVisible(!visible)
                  if(!inputText){
                    return alert('please enter a password to continue')
                  }
                  else{
                    const response = await saveUserDetails().then((response)=>{
                      if(response===400){
                        return 
                      }
                     else if(response===401){
                        return 
                      }
                      const password = inputText
                      const encrypt = encryptFile(Wallet.privateKey,password)
  
                      const accounts ={
                        address:props.route.params.wallet.address,
                        privateKey:encrypt,
                        name:accountName,
                        wallets:[]
                      }
                      let wallets=[]
                      wallets.push(accounts)
                      const allWallets =[{
                        address:props.route.params.wallet.address,
                        privateKey:encrypt,
                        name:accountName
                      }]
                      AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(allWallets))
                      AsyncStorageLib.setItem("user",accountName)

                      dispatch(setUser(accountName))
                      dispatch(setCurrentWallet(props.route.params.wallet.address,accountName,encrypt))
                      dispatch(AddToAllWallets(wallets,accountName))
                      dispatch(getBalance(props.route.params.wallet.address))
                      dispatch(setToken(response))
                      dispatch(setWalletType('Xrp'))


                       props.navigation.navigate('HomeScreen')
                   
                    }).catch((e)=>{
                      
                      return alert('failed to create account. please try again')
                    })
                    
                    

                    
                   // alert('success ' + accountName)
                    //props.navigation.navigate('HomeScreen')
                  }
                    
                  }}
                closeDialog={() => setVisible(!visible)}>
            </DialogInput>

    </View>
    <CheckNewWalletMnemonic Wallet={newWallet} SetVisible={setMnemonicVisible} Visible={MnemonicVisible} setModalVisible={setModalVisible} SetPrivateKeyVisible={SetVisible} setNewWalletVisible={setNewWalletVisible}/>
    </Modal>
        </Animated.View>
  )
}

export default NewWalletPrivateKey

const style = StyleSheet.create({
    Body:{
        display:'flex',
        backgroundColor:'#131E3A',
        height:hp(100),
        width:wp(100),
        alignItems:'center',
        textAlign:'center',
    },
    welcomeText:{
        fontSize:20,
        fontWeight:'200',
        color:'white',
        marginTop:hp(5)
    },
    welcomeText2:{
        fontSize:20,
        fontWeight:'200',
        color:'white',
        marginTop:hp(10)
    },
    Button:{
        marginTop:hp(0)
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
        color:'#fff',
        marginTop:hp('2'),
        width:wp('70'),
        paddingRight:wp('7'),
        backgroundColor:'white',
        borderColor:'white'
    
      },
    
})