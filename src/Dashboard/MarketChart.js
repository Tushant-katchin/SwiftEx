import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Grid,
  YAxis,
  XAxis,
  AreaStackChart,
} from "react-native-svg-charts";
import * as shape from "d3-shape";
import { urls } from "./constants";
import { View, Button } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";

export default function MarketChart({ Percent, name }) {
  const [style, setStyle] = useState("");
  const [Data, setData] = useState();
  const[timeFrame, setTimeFrame] = useState('30m')
  const[pressed, setPressed] = useState()
  const [timeData, setTimeData] = useState(["5m", "10m", "15m", "20m", "25m", "30m"])
  const data = [
    150, 130, 140, 135, 149, 158, 125, 105, 155, 153, 153, 144, 150, 160, 80,
  ];
  const data2 = ["2h", "4h", "8h", "12h", "18h", "24h"];

  const contentInset = { left: -100, bottom: 0 };
  const state = useSelector((state) => state);

  async function getchart(name, timeFrame) {
   
    if(timeFrame==='1h'){

      console.log(name)
      if(name==='USDT'){
        name='USDC'
      }
      
      await fetch(`https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=1h&limit=5`, {
        method: 'GET'
      })
      .then(resp => resp.json())
      .then(resp => {
        const trades = resp.map(interval => parseFloat(interval[1]));
        console.log(resp)
        const firstTrade = trades[0];
        const lastTrade = trades.slice(-1)[0];
        const percent = (((lastTrade - firstTrade) / firstTrade) * 100).toFixed(2);
        
        setData(trades)
        console.log(trades)
        
      })
      .catch(err => {
        console.log(err);
        
        
      });
      
    }else if(timeFrame==='12h'){
      console.log(name)
      if(name==='USDT'){
        name='USDC'
      }
      
     await fetch(`https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=12h&limit=5`, {
        method: 'GET'
      })
      .then(resp => resp.json())
      .then(resp => {
        const trades = resp.map(interval => parseFloat(interval[1]));
        console.log(resp)
        const firstTrade = trades[0];
        const lastTrade = trades.slice(-1)[0];
        const percent = (((lastTrade - firstTrade) / firstTrade) * 100).toFixed(2);
        
        setData(trades)
        console.log(trades)
        
      })
      .catch(err => {
        console.log(err);
        
        
      });
    }
    else if(timeFrame==='1d'){
      console.log(name)
      if(name==='USDT'){
        name='USDC'
      }
      
       await fetch(`https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=1d&limit=5`, {
        method: 'GET'
      })
      .then(resp => resp.json())
      .then(resp => {
        const trades = resp.map(interval => parseFloat(interval[1]));
        console.log(resp)
        const firstTrade = trades[0];
        const lastTrade = trades.slice(-1)[0];
        const percent = (((lastTrade - firstTrade) / firstTrade) * 100).toFixed(2);
        
        setData(trades)
        console.log(trades)
        
      })
      .catch(err => {
        console.log(err);
        
        
      });
    }else{
      console.log(name)
      if(name==='USDT'){
        name='USDC'
      }
      
       await fetch(`https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=30m&limit=5`, {
        method: 'GET'
      })
      .then(resp => resp.json())
      .then(resp => {
        const trades = resp.map(interval => parseFloat(interval[1]));
        console.log(resp)
        const firstTrade = trades[0];
        const lastTrade = trades.slice(-1)[0];
        const percent = (((lastTrade - firstTrade) / firstTrade) * 100).toFixed(2);
        
        setData(trades)
        console.log(trades)
        
      })
      .catch(err => {
        console.log(err);
        
        
      });
    }
      
    }
    function chooseStyle(percent) {
      if (parseFloat(percent) === 0) {
      return setStyle("rgba(0,153,51,0.8)");
    }
    if (parseFloat(percent) < 0) {
      return setStyle("rgba(204,51,51,0.8)");
    }

    return setStyle("rgba(0,153,51,0.8)");
  }
  useEffect(async () => {
    await getchart(name.toUpperCase(),'30m');
    chooseStyle(Percent);
    //fetchKline()
  }, []);
  useEffect(async () => {
    await getchart(name.toUpperCase(),timeFrame);
    chooseStyle(Percent);
    //fetchKline()
  }, [timeFrame]);
 

  return (
    <View style={{ height: hp(120) }}>
      <View style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center', alignSelf:'center', justifyContent:"space-between"}}>
        <View style={{margin:2}}>
      <Button title="1h" color={pressed==='1'?'green':'grey'} 
       onPress={()=>{
        setPressed('1')
        setTimeData(['10m','20m','30m','40m','50m','60m'])
        setTimeFrame('1h')
      }
      }
       />
       </View>
       <View style={{margin:2}}>
       <Button title="12h" color={pressed==='2'?'green':'grey'}  
       onPress={()=>{
        setPressed('2')
        setTimeData(['2h','4h','6h','8h','10h','12h'])
        setTimeFrame('12h')
      }
      }
       />
       </View>
       <View style={{margin:1}}>
       <Button title="1d" color={pressed==='3'?'green':'grey'} 
      onPress={()=>{
        setPressed('3')
        setTimeData(["2h", "4h", "8h", "12h", "18h", "24h"])
        setTimeFrame('1d')
      }
      }
       />
       </View>
       
       </View>
      <YAxis
        data={Data ? Data : data}
        style={{
          marginRight: wp(59),
          marginLeft: wp(-4),
          height: hp(28),
          width: wp(15),
          marginTop: hp(7),
          position: "absolute",
          zIndex: 10,
        }}
        contentInset={contentInset}
        svg={{
          fill: "white",
          fontSize: 12,
        }}
        numberOfTicks={8}
        formatLabel={(value) => `${value}`}
      />
      <XAxis
        
        style={{
          marginTop: hp(35),
          position: "absolute",
          height: hp(55),
          width: wp(90),
        }}
        data={timeData}
        formatLabel={(value, index) => timeData[index]}
        contentInset={{ left: 18, right: 18 }}
        svg={{ fontSize: 11, fill: "white" }}
      />
      <AreaChart
        style={{ height: hp(30) }}
        data={Data ? Data : data}
        contentInset={{ top: 10, bottom: 10 }}
        curve={shape.curveNatural}
        svg={{ fill: style }}
      ></AreaChart>
    </View>
  );
}
