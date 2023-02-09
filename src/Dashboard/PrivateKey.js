import React,{useRef, useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Animated} from 'react-native';
import title_icon from '../../assets/title_icon.png'
import { TextInput, Checkbox } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { AddToAllWallets, getBalance, setCurrentWallet, setUser, setToken, setWalletType } from '../components/Redux/actions/auth';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import DialogInput from 'react-native-dialog-input';
import { encryptFile } from '../utilities/utilities';
import { urls } from './constants';
const PrivateKey = (props) => {
    const[accountName, setAccountName] = useState('')
    const[visible, setVisible]= useState(false)

    const fadeAnim = useRef(new Animated.Value(0)).current
    const dispatch = useDispatch();

    const Spin =  new Animated.Value ( 0 )
    const SpinValue =  Spin.interpolate ({
                inputRange :  [ 0, 1 ],
                outputRange :  [ '0deg', '360deg' ]
} )


    useEffect(async() => {
     
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 1000,
          }
        ).start();

       
        console.log(props.route.params.wallet)
      }, [fadeAnim])
    

  return (
    <Animated.View                 // Special animatable View
      style={{opacity:fadeAnim}}
    >
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
    <Text style={style.welcomeText}>  Please copy your mnemonic or save it</Text>
    <Text style={style.welcomeText2}> Your Mnemonic Phrase</Text>

      <Text selectable={true} style={style.welcomeText2}>{props.route.params.wallet.wallet.mnemonic}</Text>
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
      if(!accountName){
        return alert('you must set an account name to continue')
      }
      let wallet = props.route.params.wallet.wallet
      wallet.accountName = accountName
      props.navigation.navigate("Check Mnemonic",{
        wallet

      })
      
}} ></Button>
    </View>
    
    </View>
        </Animated.View>
  )
}

export default PrivateKey

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