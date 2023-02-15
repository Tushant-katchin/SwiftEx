import React,{useEffect, useState, useRef} from 'react'
import { StyleSheet, Text, View, AppState  } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import {  setUser, setWalletType } from "../components/Redux/actions/auth";
import { Avatar } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import InvestmentChart from './InvestmentChart';
import Nfts from './Nfts';
import { Animated, Platform, UIManager } from 'react-native';
import store from "../components/Redux/Store";
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { setCurrentWallet } from '../components/Redux/actions/auth';
import {  useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar, TabBarIndicator } from 'react-native-tab-view';
const Home2 = ({navigation}) => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
  const currentState = useRef(AppState.currentState);
  const [appState, setState] = useState(currentState.current);
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();
  const [routes] = useState([
    { key: 'first', title: 'Tokens' },
    { key: 'second', title: 'NFTs' },
  ]);
   
    
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);}
  }
  const fadeAnim = useRef(new Animated.Value(0)).current
  
  const translation = useRef(
      new Animated.Value(0)
    ).current;
  
  const SetCurrentWallet =async ()=>{
    let user = await AsyncStorageLib.getItem('currentWallet')
    let mainUser = await AsyncStorageLib.getItem('user')
    console.log('hi',mainUser)
    console.log(user)
    let walletType = await AsyncStorageLib.getItem('walletType')
    let wallet =  await AsyncStorageLib.getItem(`Wallet`).then((wallet)=>{
      console.log(JSON.parse(wallet))
      dispatch(setCurrentWallet(JSON.parse(wallet).address,user,JSON.parse(wallet).privateKey))
      dispatch(setWalletType(JSON.parse(walletType)))
      dispatch(setUser(JSON.parse(mainUser)))
    })
    
    
    
    return wallet
  }
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'blue' }}
      style={{ backgroundColor: '#189AB4'}}
      activeColor={'red'}
      inactiveColor={'white'}
      pressColor={'black'}
      
    />
  );
  

  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'white' }} >
             <InvestmentChart/>
    </View>
  );
  
  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'white' }} >
                      <Nfts/>
    </View>
  );
  
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  

   
    

    useEffect(async() => {
     // getWallets(state.user, readData,dispatch, importAllWallets)
     Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
      }
    ).start();
    useEffect(() => {
      const handleChange = AppState.addEventListener("change", changedState => {
    
        currentState.current = changedState;
        setState(currentState.current);
        console.log(currentState.current)
        if(currentState.current==='background'){
          navigation.navigate('appLock')
        }
        
      });
      
     
    }, [appState]);
  

  Animated.timing(translation, {
      toValue: 1,
      delay: 0.1,
      useNativeDriver: true,
    }).start(); 
    if(!state.wallet.address){

       await SetCurrentWallet()

    
    }
   
    }, [])
    useEffect(async ()=>{

      await SetCurrentWallet()
    },[])
    
    
    


  return (
    
      <Animated.View style={{backgroundColor:'#000C66'}}>
    <View style={Styles.container}>
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      style={{  borderTopRightRadius:20,
      borderTopLeftRadius:20 }}
    />
      </View>
     </Animated.View> 
  )
}

export default Home2
const Styles = StyleSheet.create({
    container: {
     display:'flex',
      backgroundColor:'white',
      height:hp('100'),
      width:wp('100'),
      borderTopRightRadius:20,
      borderTopLeftRadius:20,
      
     
    },
   content:{
    display:'flex',
    flexDirection:'row',
    marginTop:0,
    color:'white',
    width:wp(100), 

   },
   text:{
    color:'grey',
    fontWeight:'bold'
   },
   text2:{
    color:'grey',
    fontWeight:'bold'
   },
   priceUp: {
   
    color: 'rgba(0,153,51,0.6)',
  },
  priceDown: {
    
    color: 'rgba(204,51,51,0.6)',
  }
  });
  /*<View style={{marginTop:10}}>
<Button title='logout'  onPress={onLogout}/>
</View> 

<Card.Content style={{ height: 100 }}>
      <Chart
      name={item.symbol}
      setPercent={setPercent}
  />
 </Card.Content>
      
*/
/*
<View style={Styles.content}>
    <TouchableOpacity style={{ borderBottomWidth:color==='tokens'?2:0,borderColor:'black', width:wp(50), alignItems:'center', alignContent:'center'}}>
      <Text style={{color:color==='tokens'?'blue':'grey',
    fontWeight:'bold'}} onPress={()=>{
      setColor('tokens')
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    }}>Tokens</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{borderBottomWidth:color==='nfts'?2:0 ,width:wp(50), alignItems:'center', alignContent:'center'}}>
      <Text style={{color:color==='nfts'?'blue':'grey',
    fontWeight:'bold'}} onPress={()=>{
      setColor('nfts')
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    }}>NFTs</Text>
    </TouchableOpacity>
      </View>
      <ScrollView style={{marginTop:5, display:'flex', flexDirection:'row'}}
      vertical={true}
    showsHorizontalScrollIndicator={false}
    scrollEventThrottle={200}
    decelerationRate="fast"
    pagingEnabled
      >
                <View  style={{display:'flex', flexDirection:'row'}}>
                <View style={{ right:color==='tokens'?wp(0):wp(100)}}>
                <InvestmentChart/>
                </View>
                <View style={{position:'absolute', left:color==='nfts'?wp(0):wp(100)}}>
                <Nfts/>
                </View>
                </View>
      
      </ScrollView>
  

*/