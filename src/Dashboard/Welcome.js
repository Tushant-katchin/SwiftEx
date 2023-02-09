import React,{useRef, useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Animated} from 'react-native';
import title_icon from '../../assets/title_icon.png'
import { LoginModal } from './Modals/LoginModal';

const Welcome = (props) => {
    const [loginVisible,setLoginVisible] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current

    const Spin =  new Animated.Value ( 0 )
    const SpinValue =  Spin.interpolate ({
                inputRange :  [ 0, 1 ],
                outputRange :  [ '0deg', '360deg' ]
} )

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
            duration:1500,
            useNativeDriver:true
        }).start()
      }, [fadeAnim, Spin])
    

  return (
    <Animated.View                 // Special animatable View
      style={{opacity:fadeAnim}}
    >
      <View style={style.Body}>
    <Text style={style.welcomeText}> Hi,</Text>
    <Text style={style.welcomeText}>  Welcome to Munzi Wallet Dapp</Text>
    < Animated.Image
    style={{width: wp('5'),
    height: hp('5'),
    padding:30,
    marginTop:hp(10),
    transform:[{rotate:SpinValue}]}}
    source={title_icon}
  />
      <Text style={style.welcomeText2}>  Please choose a wallet to continue</Text>

    <View style={style.Button}>
    <Button title='Create wallet' color={'green'} onPress={()=>{
      const wallet =''
      props.navigation.navigate('GenerateWallet')
    }} ></Button>
    </View>
    <TouchableOpacity onPress={()=>{
      props.navigation.navigate('Import')
    }}>

       <Text style={style.Text}>
         I already have a wallet
        </Text>
    </TouchableOpacity>
    
    </View>
        </Animated.View>
  )
}

export default Welcome

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
        marginTop:hp(20)
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
      }
})