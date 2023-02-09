import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../components/Redux/actions/auth";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {  TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import Home2 from "./Home2";
import Settings from '../../Settings'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Assests from "./Assests";
import Market from "./Market";
import munziicon from '../../assets/title_icon.png'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyHeader from "./MyHeader";
import Wallet from "./Wallet";
import MyHeader2 from "./MyHeader2";
import { Extend } from "../components/Redux/actions/auth";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {  Collapse } from "../components/Redux/actions/auth";
import store from "../components/Redux/Store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import MyHeader3 from "./Header3";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const Dashboard = ({ navigation }) => {
  let statee = useSelector((state) => state)
  let extend = useSelector((state) => state.extended)
  const[extended, setExtended]=useState(extend)
  const[state, setState]=useState(statee)
  const dispatch = useDispatch();
  //let state = store.getState()
  console.log(state)
  
  const updateState=(()=>{
    let data = store.getState()
    return setState(data)
  })
  

function changeState(){
 
  
  const data = dispatch(Extend())
  .then((response) => {
    
    console.log(response)
    const res =  response
    if (res.status == "success") {
      
      console.log(res)
      console.log('success')
      updateState()
    }
  })
  .catch((error) => {
    console.log(error)
    
    
  });
   console.log(data)
  }

  function collapseState(){
  
    
    const data = dispatch(Collapse())
  .then((response) => {
    
    console.log(response)
    const res =  response
    if (res.status == "success") {
      
      console.log(res)
      console.log('success')
     updateState()
      
    }
  })
  .catch((error) => {
    console.log(error)
    
    
  });
}

  const Header1 = (title, state)=>{
    return <MyHeader title={title} state={state} changeState={changeState} extended={extended} setExtended={setExtended} />
  
  }
  const Header2 = (title, state)=>{
    return <MyHeader2 title={title} state={state} changeState={collapseState} extended={extended} setExtended={setExtended}/>
  
  }
  const Header3 = (title)=>{
   // return <MyHeader2 title={title} state={state} changeState={collapseState} extended={extended} setExtended={setExtended}/>
  return <MyHeader3 title={title} />
  }

  useEffect(async()=>{
   // CheckWallet(statee.user, dispatch, importAllWallets)
   const user = await AsyncStorageLib.getItem('user')
   console.log(user)
   dispatch(setUser(JSON.parse(user)))

   const data = await AsyncStorage.getItem(`${user}-wallets`)
console.log(data)
  },[])

  
  
return (
  <>
       
      <Tab.Navigator
      shifting={false}
      barStyle={{ backgroundColor:'#131E3A',  color:'black' }} //This is where you can manipulate its look. 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            size=33
            if (route.name === 'Home') {

                iconName = focused? 'ios-home-sharp': 'ios-home-sharp';
                iconName='ios-home-sharp'
            } if (route.name === 'Assets') {
              iconName = focused? 'ios-home-sharp': 'ios-home-outline';
              iconName='ios-pie-chart-sharp'
          }
          if (route.name === 'Market') {
            iconName = focused? 'ios-home-sharp': 'ios-home-outline';
            iconName='ios-bar-chart-sharp'
        }
           if (route.name === 'Settings') {
                iconName = focused ? 'ios-settings-sharp' : 'ios-settings-sharp';
                iconName='ios-settings-sharp'
            }

          

            
           
            
            return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarLabel: ({focused}) => {
          let iconColor;
          
            iconColor = focused ? 'blue' : 'black'
          
          return <Text style={{color: iconColor, fontSize: hp('2'), textAlign: "center", marginBottom:10}}>{route.name}</Text>
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { position: 'absolute', backgroundColor:'white', height:hp('12'),  borderTopLeftRadius: 30,
        borderTopRightRadius: 30, borderTopColor:'black', borderTopWidth:1},
        headerTitleAlign: 'center'

        //Tab bar styles can be added here
      
    })}
     >
     
      <Tab.Screen name="Home" component={Home2} options={{
        header: () => (
          

            state.extended===false?Header1('Home', state):Header2('Home', state)
         
        ),
        headerShown: true
      
      } }/>
      
      <Tab.Screen name="Wallet" component={Wallet}  options={{
          unmountOnBlur:true,
        tabBarIcon: ({ focused }) => {
            let iconName;
            iconName = 'ios-home-sharp' //for icon or image
            let iconColor;
          
            iconColor = focused ? 'blue' : 'grey'
            return (
                <View>
                <Text>
                <Ionicons name={'wallet'} size={hp('5')} color={iconColor} />
                </Text>
                  </View>
            )
        },
        tabBarLabel: ({focused}) => {
          let iconColor;
          
            iconColor = focused ? 'blue' : 'black'
          
          return <Text style={{width:wp('30') ,color: iconColor, fontSize: hp('2.5'), textAlign: "center", marginBottom:10}}>Wallet</Text>
        },
        header: () => (
          Header3('Wallet')
        ),
        headerShown: true
      
      }}  />

    
<Tab.Screen name="Market"  component={Market}  options={{
       header: () => (
        Header3('Market')
      ),
      headerShown: true,
      unmountOnBlur:true
    }} />
      <Tab.Screen name="Settings"  component={Settings} options={{
        header: () => (
          Header3('Settings')
        ),
        headerShown: true,
      }} />
      </Tab.Navigator>
      
      </>
  );
};
export default Dashboard;


