import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, Modal,  FlatList, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import MyHeader from './MyHeader';
import MyHeader2 from './MyHeader2'
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from 'expo-file-system';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {tokenAddresses,urls} from './constants'
import Etherimage from '../../assets/ethereum.png'
import { Avatar,  Card, Title, Paragraph, CardItem, WebView } from 'react-native-paper';
import {getEthBalance, getMaticBalance, getBalance } from "../components/Redux/actions/auth";
const { StorageAccessFramework } = FileSystem;




const MyWallet = (props) => {
    const state = useSelector((state) => state);
    const User =  useSelector( (state) =>  state.user)
    const dispatch = useDispatch();
    const[extended, setExtended]=useState(false)
    const[loading, setLoading] = useState()
    const [user, setUser] = useState('')
    const[balance,setBalance] = useState(0)
    const[bnbBalance,setBnbBalance] = useState(0)
    const[ethBalance,setEthBalance] = useState(0)
    const[bnbPrice,setBnbPrice] = useState(0)
    const[ethPrice,setEthPrice] = useState(0)
   
    let LeftContent = props => <Avatar.Image {...props}  source={{ uri: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850' }} />
    let LeftContent2 = props => <Avatar.Image {...props}  source={  Etherimage}  />
 
    const getPrice = async (address,address2) => {
      const token = await AsyncStorageLib.getItem('token')
     const result = await fetch(`http://${urls.testUrl}/user/getEtherTokenPrice`, {
    method: 'POST',
    headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
    },
   body: JSON.stringify({
            token:token,
             Ethaddress:address,
             Bnbaddress:address2
            })
   })
   .then((response)=>response.json())
   .then((response) => {
    console.log(response)
    return response.responseData
    
   })
   
   return result
    };
const getBalanceInUsd = (ethBalance,bnbBalance) =>{
  const ethInUsd = ethBalance*ethPrice
  const bnbInUsd = bnbBalance*bnbPrice
  console.log(ethInUsd)
  console.log(bnbInUsd)
  const totalBalance = ethInUsd+bnbInUsd
  console.log(totalBalance)
  setBalance(totalBalance.toFixed(1))
}

useEffect(async ()=>{
  const address = await state.wallet.address
 await fetch(`http://${urls.testUrl}/user/getLatestTransactions`,{
    method:'POST',
    headers:{
      accept:'application/json',
      'Content-Type':'application/json'

    },
    body:JSON.stringify({
      address:address
    })
  }).then((response)=>{
    console.log(response)
  }).catch((e)=>{
    console.log(e)
  })
},[])

useEffect(async()=>{
  try{

    const user =await AsyncStorageLib.getItem('user')
    setUser(user)
    await getPrice(tokenAddresses.ETH,tokenAddresses.BNB)
    .then((resp)=>{
      console.log(resp)
  setEthPrice(resp.Ethprice)
  setBnbPrice(resp.Bnbprice)
  
}).catch((e)=>{
  console.log(e)
})
const address = await state.wallet.address
console.log(address)
if(address){
  
  dispatch(getEthBalance(address)) 
  .then(async(e)=>{
    const Eth = await e.EthBalance
    let bal = await AsyncStorageLib.getItem('EthBalance')
    console.log("hi"+ Eth)
    console.log(bal)
    if(Eth){
      
      setEthBalance(Number(Eth).toFixed(1))
    }else{
      console.log('coudnt get balance')
    }
    
  }).catch((e)=>{
    console.log(e)
  })
  dispatch(getBalance(address))
  .then(async()=>{
    
    const bal = await state.walletBalance
    console.log("My"+bal)
    if(bal){
      
      setBnbBalance(bal)
    }else{
      setBnbBalance(0)
    }
  }).catch((e)=>{
    console.log(e)
  })
  
  
}
}catch(e){
  console.log(e)
}
},[])
useEffect(()=>{
  getBalanceInUsd(ethBalance,bnbBalance)
},[ethBalance,bnbBalance,ethPrice,bnbPrice])

return (
  <View style={styles.container}>
      
    <View style={styles.content}>
    <Text style={styles.text}>Hi,{user}</Text>
    <Text style={styles.text3}>$ {balance}</Text>
    <Text style={styles.text3}> Wallet Address</Text>
    
    <Text selectable={true} style={styles.text2}>{state.wallet.address?state.wallet.address:'You dont have any wallet yet'}</Text>
   
    {loading?<ActivityIndicator size="large" color="green" />:
    <View></View>}
    <View style={{width:wp('50'),marginTop:10}}>
      <Button title='My Tokens' color={'grey'} onPress={()=>{
       // setModalVisible2(true)
      }}></Button>
    </View>
    
    
    <View style={{display:'flex', flexDirection:'column', marginTop:5}}>
        <Card style={{width:wp(80), height:hp(10), backgroundColor:'white', borderRadius:10, marginLeft:5,marginTop:5}}>
<Card.Title titleStyle={{ color: "black", fontSize:15, marginBottom:23 }}  title={'BNB Coin'}  left={LeftContent} />
<Card.Content style={{display:'flex',flexDirection:'row',color:'black'}}>
<Title style={{color:'black'}} ></Title>
<Paragraph style={{color:'black', marginLeft:wp('50'), fontWeight:'bold',top:-50, left:50}}>{ bnbBalance?bnbBalance.toFixed(2):0} BNB</Paragraph>
<Paragraph style={{color:'grey', position:'absolute',marginLeft:wp('20'), fontWeight:'bold',top:-39}}>{bnbPrice?bnbPrice.toFixed(1):0}</Paragraph>



</Card.Content>


</Card>

<Card style={{width:wp(80), height:hp(10), backgroundColor:'white', borderRadius:10, marginLeft:5, marginTop:5}}>
<Card.Title titleStyle={{ color: "black", fontSize:15, marginBottom:23 }}  title={'Ethereum'}  left={LeftContent2} />
<Card.Content style={{display:'flex',flexDirection:'row',color:'black'}}>
<Title style={{color:'black'}} ></Title>
<Paragraph style={{color:'black', marginLeft:wp('50'), fontWeight:'bold',top:-50, left:50}}>{ ethBalance?ethBalance:0}  ETH</Paragraph>
<Paragraph style={{color:'grey', position:'absolute',marginLeft:wp('20'), fontWeight:'bold',top:-39,}}>{ethPrice?ethPrice.toFixed(1):0}</Paragraph>



</Card.Content>


</Card>
 

        </View>
    </View>
    </View>
  )
}

export default MyWallet
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#131E3A',
      height:hp('10'),
      color:'white',
      
     
      
    },
    text:{
        color:'black',
        fontSize:hp('3'),
        fontWeight:'bold',
        fontFamily:'sans-serif',
        fontStyle:'italic',

       
    },
    text3:{
      color:'black',
      fontSize:hp('3'),
      fontWeight:'bold',
      fontFamily:'sans-serif',
      fontStyle:'italic',
      marginTop:hp('8')

     
  },
  text2:{
    color:'black',
    fontSize:hp('2'),
    fontWeight:'bold',
    fontFamily:'sans-serif',
    fontStyle:'italic',
    marginTop:hp('5')

},
   content:{
    borderWidth:5,
    borderColor:'#131E3A',
    height:hp('86'),
    width:wp(90),
    margin:hp('3'),
    borderRadius:30,
    backgroundColor:'white',
    textAlign:'center',
    alignItems:'center',
    alignContent:'center'
   },
   content2:{
    display:'flex',
    borderWidth:wp('1'),
    borderColor:'#131E3A',
    margin:hp('2'),
    marginTop:hp('7'),
    padding:15,
    backgroundColor:'black',
    borderRadius:30,
    textAlign:'center',
    alignItems:'center'
   },
   btn:{
    borderWidth:1,
    borderRadius:20,
    borderColor:'#131E3A',
    width:wp('30'),
    marginLeft:wp('25'),
    marginTop:hp('5')
   },
   container2: {
    flex: 1,
    backgroundColor: '#98B3B7',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: hp('3'),
    padding: 26,
  },
  noteHeader: {
    backgroundColor: '#42f5aa',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  footer: {
    flex: 1,
    backgroundColor: '#ddd',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderTopLeftRadius:20,
    borderTopRightRadius:20
  },
  textInput: {
    alignSelf: 'stretch',
    color: 'black',
    padding: 20,
    backgroundColor: '#ddd',
    borderTopWidth: 2,
    borderTopColor: '#ddd',
  },

  addButton: {
    position: 'absolute',
    zIndex: 11,
    right: wp('10'),
    bottom: hp('14'),
    backgroundColor: 'red',
    width: wp('20'),
    height: hp('10'),
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  addButton2: {
    position: 'absolute',
    zIndex: 11,
    left: 20,
    bottom: hp('14'),
    backgroundColor: 'green',
    width: wp('20'),
    height: hp('10'),
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: hp('2'),
  },
  input: {
    height: hp('6'),
    marginBottom: hp('2'),
    color:'#fff',
    marginTop:hp('2'),
    width:wp('70'),
    paddingRight:wp('7'),
    backgroundColor:'#131E3A',   
  },

  });
  