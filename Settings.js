import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React from 'react'
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { logout } from './src/components/Redux/actions/auth';
import { REACT_APP_LOCAL_TOKEN } from './src/Dashboard/exchange/crypto-exchange-front-end-main/src/ExchangeConstants';

const Settings = (props) => {
  const dispatch = useDispatch()
  return (
    <View style={styles.container}>
      <View style={styles.accountBox} >
      <TouchableOpacity onPress={()=>{
      props.navigation.navigate("AllWallets")
    }}>
      <Text style={styles.text}>My Wallets</Text>
      <Icon name="chevron-right" size={hp('4')} color="white" style={{marginLeft:wp('63'), marginTop:hp('-4')}} />
      </TouchableOpacity>
      </View>
    <View style={styles.accountBox2} >
    <TouchableOpacity  onPress={()=>{
            props.navigation.navigate("Transactions")

    }} >
      <Text style={styles.text}>Transactions</Text>
      <Icon name="chevron-right" size={hp('4')} color="white" style={{marginLeft:wp('65'), marginTop:hp('-4')}} />
      </TouchableOpacity>
    </View>
    <View style={styles.accountBox2} >
    <TouchableOpacity  onPress={async()=>{
      const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN
   const token = await AsyncStorageLib.getItem(LOCAL_TOKEN)
   console.log(token)

        if(token){
          props.navigation.navigate("exchange")
        }else{
          
          props.navigation.navigate("exchangeLogin")
        }
     
          }} >
      <Text style={styles.text}>Exchange</Text>
      <Icon name="chevron-right" size={hp('4')} color="white" style={{marginLeft:wp('65'), marginTop:hp('-4')}} />
      </TouchableOpacity>
    </View>
    <View style={styles.accountBox2} >
    <TouchableOpacity  onPress={()=>{
      alert('coming soon')
    }} >
      <Text style={styles.text}>Biometric Authenticaton</Text>
      <Icon name="chevron-right" size={hp('4')} color="white" style={{marginLeft:wp('65'), marginTop:hp('-4')}} />
      </TouchableOpacity>
    </View>
    <View style={styles.accountBox2} >
    <TouchableOpacity  onPress={()=>{
      //props.navigation.navigate('ImportWallet')
      alert('coming soon')
    }} >
      <Text style={styles.text}>Payment Methods</Text>
      <Icon name="chevron-right" size={hp('4')} color="white" style={{marginLeft:wp('65'), marginTop:hp('-4')}} />
      </TouchableOpacity>
    </View>
    <View style={styles.accountBox3} >
    <TouchableOpacity  onPress={()=>{
      const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN
      AsyncStorageLib.removeItem('user')
      AsyncStorageLib.removeItem(LOCAL_TOKEN)
      dispatch(logout()).then((res)=>{
        props.navigation.navigate('Passcode')
      }).catch((e)=>{
        console.log(e)
      })
   }} >
      <Text style={styles.text}>Logout</Text>
      <Icon name="chevron-right" size={hp('4')} color="white" style={{marginLeft:wp('65'), marginTop:hp('-4')}} />
      </TouchableOpacity>
    </View>
    </View>
  )
}

export default Settings
const styles = StyleSheet.create({
    container:{
      display:'flex',
      backgroundColor:'white',
      height:hp('500'),
      width:wp('100'),
      alignContent:'center',
      alignItems:'center'
      

    },
    text:{
        color:'white',
        fontSize:hp('2.3'),
        fontWeight:'bold',
        fontFamily:'sans-serif',
        fontStyle:'italic',
        marginLeft:wp('10')
       
    },
    accountBox:{
        borderWidth:5,
        width:wp(95),
        paddingTop:hp('2'),
        borderRadius:20,
        borderColor:'#131E3A',
        height:hp('9'),
        marginTop:hp(7),
        backgroundColor:'#000C66',
        textAlign:'center',
        display:'flex',
        alignItems:'center'
    },
    accountBox2:{
      borderWidth:5,
      paddingTop:hp('2'),
      borderRadius:20,
      borderColor:'#131E3A',
      height:hp('9'),
      width:wp(95),
      marginTop:8,
      backgroundColor:'#000C66',
      textAlign:'center',
      display:'flex',
      alignItems:'center'
  }
  ,
  accountBox3:{
    borderWidth:5,
    paddingTop:hp('2'),
    borderRadius:20,
    borderColor:'#131E3A',
    height:hp('9'),
    marginLeft:40,
    marginRight:40,
    marginTop:10,
    backgroundColor:'#000C66',
    textAlign:'center',
    display:'flex',
    alignItems:'center'
}
})
  
