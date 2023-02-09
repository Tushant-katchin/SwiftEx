import React,{useEffect, useState} from 'react'
import { AreaChart, Grid, YAxis, XAxis,AreaStackChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { urls } from './constants'
import { View } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from "react-redux";

export default function MarketChart({Percent, name}) {
    const[style,setStyle]=useState('')
    const[Data, setData]=useState()
    const data = [150, 130, 140, 135, 149, 158, 125, 105,155, 153, 153,144, 150, 160, 80]
    const data2 = ['10m','20m','30m','40m','50m','60m']

    const contentInset = { left: -100, bottom: 0 }
    const state =  useSelector( (state) =>  state)

  


    async function getchart(name,token){
      console.log(name)
        if(name=='usdt'){
          name='usdc'
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
           // console.log(responseJson)
            setData(responseJson.trades)
          }).catch((e)=>{
            console.log(e)
          })
          
        }
    function chooseStyle(percent){
        if (parseFloat(percent) === 0) {
    
            return setStyle('rgba(0,153,51,0.8)')
            
      }
        if (parseFloat(percent) < 0) {
    
            return setStyle('rgba(204,51,51,0.8)')
            
      }
     
          return setStyle('rgba(0,153,51,0.8)')
    
        
    
    }
    useEffect(async() => {
      const token = await state.token
        getchart(name,token)
        chooseStyle(Percent)
        //fetchKline()
        
      }, [])

        return (
          <View style={{height:hp(120)}}>
              <YAxis
                    data={Data?Data:data}
                    style={{marginRight:wp(59), marginLeft:wp(-4), height:hp(19), width:wp(15),  marginTop:hp(4),position:'absolute', zIndex:10}}
                    contentInset={contentInset}
                    svg={{
                        fill: 'white',
                        fontSize: 12,
                        
                        
                    }}
                    numberOfTicks={5}
                    formatLabel={(value) => `${value}`}
                />  
                <XAxis
           style={{ paddingTop: 10, marginTop:hp(23), position:'absolute', height:hp(25), width:wp(90) }}
          data={data2}
          formatLabel={(value, index) => data2[index]}
          contentInset={{ left: 18, right: 18 }}
           svg={{ fontSize: 11, fill: 'white' }}/>
            <AreaChart
                style={{height:164}}
                data={Data?Data:data}
                contentInset={{ top: 10, bottom: 10 }}
                curve={shape.curveNatural}
                svg={{ fill: style }}
                >
                
            </AreaChart>
                            
              </View>
        )
    }
