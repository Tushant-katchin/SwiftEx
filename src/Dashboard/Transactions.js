import React,{useEffect, useState} from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, ActivityIndicator, KeyboardAvoidingView,View, Button, Modal, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { urls } from './constants';
import { Avatar,  Card, Title, Paragraph, CardItem, WebView } from 'react-native-paper';
import Bnbimage from '../../assets/bnb-icon2_2x.png'
import Etherimage from '../../assets/ethereum.png'
import Xrpimage from '../../assets/xrp.png'
import Maticimage from '../../assets/matic.png'
import title_icon from '../../assets/title_icon.png'
import AsyncStorageLib from '@react-native-async-storage/async-storage';
 const Transactions = (props)=>{

    const[transactions, setTransactions] = useState('')
    const state = useSelector((state) => state);

    const getTransactions = async ()=>{
      const user = await AsyncStorageLib.getItem('user')
      await AsyncStorageLib.getItem(`${user}-transactions`)
      .then((transactions)=>{
        const data = JSON.parse(transactions)
        if(data){
          setTransactions(data)
        }
      })
      /*  const token = await state.token
        const user = await state.user
        
try{
     let   response = await fetch(`http://${urls.testUrl}/user/getTransactions`, {
    method: 'POST',
    headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
    },
   body: JSON.stringify({
    token:token,
    user:user})
   }).then((response) => response.json())
   .then((responseJson) => {
    console.log(responseJson.responseData)
    if(responseJson.responseData){

      setTransactions(responseJson.responseData.reverse())
    }
   
    
    
  
  }).catch((error)=>{
    console.log(error)
  })
}catch(e){
  console.log(e)
  alert(e)
}
*/
    }
    let LeftContent = props => <Avatar.Image {...props} source={  title_icon } />
    let multiCoinLeftContent = props => <Avatar.Image {...props} source={  title_icon } />
    let EtherLeftContent = props => <Avatar.Image {...props} source={  Etherimage} />
    let BnbLeftContent = props => <Avatar.Image {...props} source={  Bnbimage} />
    let XrpLeftContent = props => <Avatar.Image {...props} source={  Xrpimage} />
    let MaticLeftContent = props => <Avatar.Image {...props} source={  Maticimage} />
    useEffect(async()=>{

        await getTransactions()
    },[])

return(

  <View
    style={{
      height: hp(100),
      marginTop: 'auto',
      backgroundColor:'white',
     
    }}>
    <View style={styles.footer}>
      <Text style={styles.headerText}>Transactions</Text>
      <View elevation={5} style={{height:hp(100)}}>
      <ScrollView
     alwaysBounceVertical={true} 
    
      >
      {transactions[0]?transactions.map((item)=>{
      const hash = item.hash
      console.log(hash)
      let LeftContent
      console.log(item.walleType)
      if(item.walletType==="Ethereum"){
        LeftContent = props => <Avatar.Image {...props} source={  Etherimage} />

      }else if(item.walletType==="BSC"){

          LeftContent = BnbLeftContent
      }else if(item.walletType==="Multi-coin"){
        if(item.chainType==='Eth'){
          LeftContent = EtherLeftContent

        }
        else if(item.chainType==='BSC'){
          LeftContent = BnbLeftContent

        }
        else if(item.chainType==='Matic'){
          LeftContent = MaticLeftContent
        }
        else{

          LeftContent = multiCoinLeftContent//props => <Avatar.Image {...props}  source={{ uri: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850' }} />
        }


      }
      else{
        let multiCoinLeftContent = props => <Avatar.Image {...props} source={  title_icon } />

        LeftContent = multiCoinLeftContent//props => <Avatar.Image {...props}  source={{ uri: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850' }} />

      }
      const data ={
        hash:hash,
        walleType:item.walletType,
        chainType:item.chainType
      }
        return(
          <TouchableOpacity key={item.hash} onPress={()=>{
            if(!item.chainType){
              return alert('Chain not supported for checking In-App transaction details ')
            }
            props.navigation.navigate('TxDetail',
        {data})
          }}>

            <View style={{marginTop:10,  width:wp(99),margin:2}}>
            <Card style={{width:wp(95), height:hp(10), backgroundColor:'white', borderRadius:10, marginLeft:5}}>
<Card.Title titleStyle={{ color: "black", fontSize:15, marginBottom:23 }}  title={item.type}  left={LeftContent} />
<Card.Content style={{display:'flex',flexDirection:'row',color:'black'}}>
<Title style={{color:'black'}} ></Title>
<Paragraph style={{color:'grey', marginLeft:wp('12'), fontWeight:'bold',top:-39}}>{item.hash}</Paragraph>



</Card.Content>


</Card>
            </View>
          </TouchableOpacity>
        )


      }):<Text>No transactions yet!</Text>}
    </ScrollView>
      </View>
     
    </View>
  </View>


)


}

export default Transactions

const styles = StyleSheet.create({
    
    Amount:{
    display:'flex',
    alignItems:'center',
    textAlign:'center',
    justifyContent:'center'
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
      borderRadius:20
    },
    textInput: {
     borderWidth:1,
     borderColor:'grey',
     width:wp('95'),
     margin:10,
     borderRadius:10,
     shadowColor: "#000",
     height:hp('5'),
shadowOffset: {
  width: 0,
  height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,

elevation: 24,
    },
  
    textInput2: {
      borderWidth:1,
      borderColor:'grey',
      width:wp('40'),
      margin:10,
      borderRadius:10,
      shadowColor: "#000",
      height:hp('7'),
shadowOffset: {
   width: 0,
   height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,

elevation: 24,
     },
   
    addButton: {
      position: 'absolute',
      zIndex: 11,
      right: 20,
      bottom: 30,
      backgroundColor: 'red',
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8
        },
    addButton2: {
      position: 'absolute',
      zIndex: 11,
      left: 20,
      bottom: 40,
      backgroundColor: 'green',
      width: 80,
      height: 70,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 18,
    }
  

})
