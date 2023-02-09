import React,{useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button ,TextInput, FlatList, TouchableOpacity,ActivityIndicator, Alert, ScrollView  } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Avatar,  Card, Title, Paragraph, CardItem, WebView } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Chart from './Chart';
import MarketChart from './MarketChart';
import { urls } from './constants';

export const CoinDetails = (props)=>{
  const[trades, setTrades] = useState()
  const[percent, setPercent] = useState(1)
    console.log(props.route.params.data)
    const image = props.route.params.data.image
    const data = props.route.params.data.name
    const state =  useSelector( (state) =>  state)

async function getchart(name){
  const token = await state.token
  if(name=='USDT'){
    name='USD'
}
if(name=='WETH'){
    name='ETH'
}
const data = await fetch(`http://${urls.testUrl}/user/getChart`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input:name,
    token:token})
    })
    .then((response) => response.json())
    .then( (responseJson) => {
      //console.log(responseJson)
      setTrades(responseJson.trades)
    }).catch((e)=>{
      console.log(e)
    })
    
  }
useEffect(()=>{
getchart(props.route.params.data.symbol)
},[])


  let LeftContent = (props) => {
   return <Avatar.Image {...props} source={{ uri: image }} />
  }
    const color = props.route.params.data.price_change_24h>0?'green':'red'
    return(
        <View>
        <Card style={{width:wp(97), height:hp(85), backgroundColor:'#000C66', borderRadius:10, marginLeft:5, marginTop:hp(3)}}>
      <Card.Title titleStyle={{ color: "#fff" }}  title={ props.route.params.data.name} left={LeftContent}  />
      <Card.Content style={{display:'flex',flexDirection:'row',color:'#fff'}}>
      <Title style={{color:'#fff'}}></Title>
      
      </Card.Content>
      
      <Card.Content style={{ height: 100 }}>
      <MarketChart
      Percent={props.route.params.data.price_change_percentage_24h}
      name={props.route.params.data.symbol}
  />

  
 </Card.Content>
 <Card.Content>

 <Paragraph style={{color:color, marginLeft:wp('1'),marginTop:hp('13'), fontWeight:'bold'}}>Last 24h: { props.route.params.data.price_change_percentage_24h}%</Paragraph>
<Paragraph style={{color:'#fff', marginTop:hp('3'), fontWeight:'bold'}}> $ { props.route.params.data.current_price}</Paragraph>
<Paragraph style={{color:'#fff', marginTop:hp('3'), fontWeight:'bold'}}> Market Cap : $ { props.route.params.data.market_cap}</Paragraph>
<Paragraph style={{color:'#fff', marginTop:hp('3'), fontWeight:'bold'}}> Total Supply : { props.route.params.data.total_supply}</Paragraph>
<Paragraph style={{color:'#fff', marginTop:hp('3'), fontWeight:'bold'}}> 24H high :  $ { props.route.params.data.high_24h}</Paragraph>
<Paragraph style={{color:'#fff', marginTop:hp('3'), fontWeight:'bold'}}> 24H low :  $ { props.route.params.data.low_24h}</Paragraph>
<Paragraph style={{color:'#fff', marginTop:hp('3'), fontWeight:'bold'}}> All Time High :  $ { props.route.params.data.ath}</Paragraph>
  
 </Card.Content>


      
      
      </Card>
       
        </View>
    )




}