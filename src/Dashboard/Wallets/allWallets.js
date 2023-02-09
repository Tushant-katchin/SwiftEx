import React,{useRef, useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Animated} from 'react-native';
import title_icon from '../../../assets/title_icon.png'
import { useDispatch, useSelector } from "react-redux";
import { Avatar,  Card, Title, Paragraph, CardItem, WebView } from 'react-native-paper';
import Bnbimage from '../../../assets/bnb-icon2_2x.png'
import Etherimage from '../../../assets/ethereum.png'
import Xrpimage from '../../../assets/xrp.png'
import Maticimage from '../../../assets/matic.png'
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { setCurrentWallet, setWalletType } from '../../components/Redux/actions/auth';
import { getEthBalance, getXrpBalance , getMaticBalance, getBalance } from '../../components/Redux/actions/auth';
import { urls } from '../constants';
//'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850'
const AllWallets = (props) => {
    const state =  useSelector( (state) =>  state)

    console.log(state.walletType)
    const[Wallets, setAllWallets] = useState([])
    let wallet =[]
    const dispatch = useDispatch();

    let LeftContent = props => <Avatar.Image {...props} source={  title_icon } />
    let multiCoinLeftContent = props => <Avatar.Image {...props} source={  title_icon } />
    let EtherLeftContent = props => <Avatar.Image {...props} source={  Etherimage} />
    let BnbLeftContent = props => <Avatar.Image {...props} source={  Bnbimage} />
    let XrpLeftContent = props => <Avatar.Image {...props} source={  Xrpimage} />
    let MaticLeftContent = props => <Avatar.Image {...props} source={  Maticimage} />
    const getALlWallets =async ()=>{
        const user = await AsyncStorageLib.getItem("user")
        console.log(user)
      const data =  await AsyncStorageLib.getItem(`${user}-wallets`)
        
     // setAllWallets(JSON.parse(data))
      console.log(JSON.parse(data))
      return JSON.parse(data)
    }
    const getXrpBal = async (address)=>{
      try{
  
        const response = await fetch(`http://${urls.testUrl}/user/getXrpBalance`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address:address})
          }).then((response) => response.json())
          .then( (responseJson) => {
            console.log(responseJson)
            if(responseJson){
  
              console.log(responseJson.responseData)
            }
            else{
             
          console.log(response)
            }
            
            
            
          }).catch((e)=>{
            console.log(e)
            //alert('unable to update balance')
          })
          
          
          
          
          return response
          
          
          
        }catch(e){
          console.log(e)
        }
    }
  
  const getBalance = async () =>{
      try{
        const wallet = await AsyncStorageLib.getItem('wallet')
        const address =  await state.wallet.address?await state.wallet.address:JSON.parse(wallet).classicAddress
       
        AsyncStorageLib.getItem('walletType').then(async(type)=>{
          
          console.log("hi"+JSON.parse(type))
          if(!state.wallet.address){
           
            alert('no wallet selected')
          }else if(JSON.parse(type)=='Matic'){
            await dispatch(getMaticBalance(address))
            .then(async(res)=>{
              console.log("hi poly"+res.MaticBalance)
              
              let bal = await AsyncStorageLib.getItem('MaticBalance')
              console.log(bal)
              if(res){
                
                console.log("hi poly"+res.MaticBalance)
              }else{
                console.log('coudnt get balance')
              }
            }).catch((e)=>{
              console.log(e)
            })
            
            
          }
          else if(JSON.parse(type)=='Ethereum'){
            dispatch(getEthBalance(address))
            .then(async(e)=>{
              const Eth = await e.EthBalance
              let bal = await AsyncStorageLib.getItem('EthBalance')
              console.log("hi"+ Eth)
              console.log(bal)
              if(Eth){
                
               console.log(Eth)
              }else{
                console.log('coudnt get balance')
              }
              
            }).catch((e)=>{
              console.log(e)
            })
            
            
          }else if(JSON.parse(type)=='BSC'){
            
            const balance = await state.walletBalance
            if(balance){
              console.log('My bsc balance'  + balance)

            }
          }else if(JSON.parse(type)=='Xrp'){
              await AsyncStorageLib.getItem('wallet').then(async(wallet)=>{
  
                console.log(JSON.parse(wallet).classicAddress)
                if(wallet){
                  
                  const resp = await getXrpBal(JSON.parse(wallet).classicAddress)
                  console.log(resp)
                }
                
              }).catch((e)=>{
                console.log(e)
              })
              
                
          }else if(JSON.parse(type)=='Multi-coin'){
            console.log('Multi-coin')

            await dispatch(getMaticBalance(address))
            .then(async(res)=>{
              console.log("hi poly"+res.MaticBalance)
              
              let bal = await AsyncStorageLib.getItem('MaticBalance')
              console.log(bal)
              if(res){
                
                console.log("hi poly"+res.MaticBalance)
              }else{
                console.log('coudnt get balance')
              }
            }).catch((e)=>{
              console.log(e)
            })

            dispatch(getEthBalance(address))
            .then(async(e)=>{
              const Eth = await e.EthBalance
              let bal = await AsyncStorageLib.getItem('EthBalance')
              console.log("hi"+ Eth)
              console.log(bal)
              if(Eth){
                
               console.log(Eth)
              }else{
                console.log('coudnt get balance')
              }
              
            }).catch((e)=>{
              console.log(e)
            })

            const balance = await state.walletBalance
            if(balance){
              console.log('My bsc balance'  + balance)

            }
            
            
            
          }
          else{
            const wallet = await state.wallet.address
              console.log('hello'+wallet)
              if(wallet){
  
                await dispatch(getBalance(state.wallet.address))
                .then(async()=>{
  
                 const bal = await state.walletBalance
                 console.log("My"+bal)
                 
                }).catch((e)=>{
            console.log(e)
          })
          
              }
         
          }
          
          
      }) 
      }catch(e){
        console.log(e)
      }
    }
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

       
      }, [fadeAnim])
    
      useEffect(async()=>{
        let allwallets = []
      const data =  await getALlWallets()

      allwallets.push(data)
      console.log(data)
      console.log(allwallets)

      setAllWallets(allwallets)
     
        
        
      },[])

  return (
   
        <View style={style.Body}>
          <Text>Main Wallet</Text>
          

            <ScrollView
            style={{height:hp(1),width:wp(90)}}>
        {Wallets[0]?Wallets[0].map((item)=>{
          if(item.walletType==='BSC'){
            LeftContent=BnbLeftContent
          }
          else if(item.walletType==='Ethereum'){
            LeftContent=EtherLeftContent
          }else if(item.walletType==='Matic'){
            LeftContent=MaticLeftContent
          }else if(item.walletType==='Xrp'){
            LeftContent=XrpLeftContent
          }
          else if(item.walletType==='Multi-coin'){
            LeftContent=multiCoinLeftContent
          }
          else{
            LeftContent=multiCoinLeftContent
          }
          return(
            
            <View>
            <TouchableOpacity key={item.name}  style={style.Box} onPress={()=>{
              // props.navigation.navigate('Import Multi-Coin Wallet')
              if(item.walletType){
                
                AsyncStorageLib.setItem('currentWallet',item.name)
                dispatch(setCurrentWallet(item.address,item.name,item.privateKey))
                .then((response)=>{
                  console.log(response)
                  if(response){
                    
                    if(response.status=='success'){
                      
                      
                      AsyncStorageLib.setItem('walletType',JSON.stringify(item.walletType))
                      dispatch(setWalletType(item.walletType))
                      getBalance(state)
                      alert('Wallet Selected '+ item.name)
                      
                    } else{
                      alert('error while selecting wallet. please try again')
                      
                    }
                  }else{
                    alert('error while selecting wallet. please try again')
                  }
                })
              }else{
                alert('wallet not supported. Please try selecting a different wallet')
                
              }
            }}>
                  
<Card style={{width:wp(99), height:hp(10), backgroundColor:'white', borderRadius:10, marginRight:wp(-20)}}>
<Card.Title titleStyle={{ color: "black" }}  title={item.name}  left={LeftContent}  />
<Card.Content style={{display:'flex',flexDirection:'row',color:'#fff'}}>



</Card.Content>


</Card>
 
  </TouchableOpacity>
  </View>
                )
                
              }):<Text>No wallets</Text>
}
                    </ScrollView>

</View>
)
}

export default AllWallets

const style = StyleSheet.create({
    Body:{
        display:'flex',
        backgroundColor:'white',
        height:hp(100),
        width:wp(100),
        alignItems:'center',
        textAlign:'center',
        justifyContent:'flex-start'
    },
    welcomeText:{
        fontSize:20,
        fontWeight:'200',
        color:'black',
        marginTop:hp(5)
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
      Box:{
        height: hp('10'),
        width:wp('75'),
        fontSize:20,
        fontWeight:'200',
        color:'white',
        marginTop:hp(1),
        display:'flex', 
        alignItems:'center', 
        alignContent:'center',
        backgroundColor:'white'
      },
      Box2:{
        height: hp('15%'),
        width:wp('75'),
        fontSize:20,
        fontWeight:'200',
        color:'white',
        marginTop:hp(1),
        display:'flex', 
        alignItems:'center', 
        alignContent:'center',
        backgroundColor:'white',
      },
      Box3:{
        height: hp('15%'),
        width:wp('75'),
        fontSize:20,
        fontWeight:'200',
        color:'white',
        marginTop:hp(2),
        display:'flex', 
        alignItems:'center', 
        alignContent:'center',
        backgroundColor:'white',
        borderTopWidth:1
      }
      
})