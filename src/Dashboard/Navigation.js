import React,{useState} from "react";
import "react-native-gesture-handler";
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import store from "../components/Redux/Store";
import Dashboard from "./Home";
import { Register } from "../../Register";
import { LoginPage } from "../Login/Login";
import MyWallet from "./MyWallet";
import { useDispatch, useSelector } from "react-redux";
import CreateWallet from "./CreateWallet";
import ImportWallet from "./ImportWallet"
import { CardStyleInterpolators, TransitionPreset } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import MyHeader from "./MyHeader";
import MyHeader2 from "./MyHeader2";
import { Extend, Collapse } from "../components/Redux/actions/auth";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { ConfirmOtp } from "../Register/confirmOtp";
import Generate from "../../Generate"
import { CoinDetails } from "./CoinDetail";
import {TxDetail} from "./TxDetail";
import Welcome from "./Welcome";
import GenerateWallet from "./GenerateWallet";
import PrivateKey from "./PrivateKey";
import Passcode from "./Passcode";
import ImportAccount from "./ImportAccount";
import ImportMunziWallet from "./importMunziWallet";
import ImportOtherWallets from "./ImportOtherWallets"
import ImportBscWallet from "./importBscWallet";
import ImportPolygon from "./importPolygon";
import ImportXrp from "./importXrp";
import CheckMnemonic from "./CheckMnemonic";
import ConfirmTransaction from "./ConfirmTransaction";
import SendTokens from "./tokens/SendTokens";
import Transactions from "./Transactions";
import AllWallets from "./Wallets/allWallets";
import ExchangeRoutes from "./exchange/crypto-exchange-front-end-main/src/exchangeRoutes";
import { ExchangeLogin } from "./exchange/crypto-exchange-front-end-main/src/pages/auth/ExchangeLogin";
import { ExchangeRegister } from "./exchange/crypto-exchange-front-end-main/src/pages/auth/signup";
const Stack = createNativeStackNavigator();


const AuthStack = ({Header1,Header2, state, dispatch, getHeaderTitle}) => (
  
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Passcode" mode='modal' 
    screenOptions={{
      animation: "slide_from_right",
      
    }} 
    
    >
      <Stack.Screen
        name="LoginScreen"
        component={LoginPage}
        options={{ headerShown: false,
          
          
         }}
         
         
      />
      <Stack.Screen
        name="RegisterScreen"
        component={Register}
        options={{ headerShown: false,
          
        }}
      />
      <Stack.Screen
        name="confirmOtp"
        component={ConfirmOtp}
        options={{ headerShown: false,
          
        }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={Dashboard}
        options={{  
          headerShown:false,
          //header: ({route}) => state.extended===false?Header1( getHeaderTitle(route), state):Header1(getHeaderTitle(route), state) 
        }}
      />
      <Stack.Screen
        name="MyWallet"
        component={MyWallet}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        
        }}
      />
      <Stack.Screen
        name="CreateWallet"
        component={CreateWallet}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />
      <Stack.Screen
        name="ImportWallet"
        component={ImportWallet}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />
      <Stack.Screen
        name="buycrypto"
        component={Generate}
        options={{ headerShown: true,
          
        }}
      />

<Stack.Screen
        name="CoinDetails"
        component={CoinDetails}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="TxDetail"
        component={TxDetail}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />
      <Stack.Screen
        name="GenerateWallet"
        component={GenerateWallet}
        options={{ headerShown: false,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="PrivateKey"
        component={PrivateKey}
        options={{ headerShown: false,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Passcode"
        component={Passcode}
        options={{ headerShown: false,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Import"
        component={ImportAccount}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Import Multi-Coin Wallet"
        component={ImportMunziWallet}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Import Ethereum"
        component={ImportOtherWallets}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Import Binance"
        component={ImportBscWallet}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Import Polygon"
        component={ImportPolygon}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Import Xrp"
        component={ImportXrp}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Check Mnemonic"
        component={CheckMnemonic}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Send"
        component={SendTokens}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />


<Stack.Screen
        name="Confirm Tx"
        component={ConfirmTransaction}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="Transactions"
        component={Transactions}
        options={{ headerShown: true,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />
<Stack.Screen
        name="AllWallets"
        component={AllWallets}
        options={{ headerShown: false,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="exchangeLogin"
        component={ExchangeLogin}
        options={{ headerShown: false,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />
<Stack.Screen
        name="exchangeRegister"
        component={ExchangeRegister}
        options={{ headerShown: false,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />

<Stack.Screen
        name="exchange"
        component={ExchangeRoutes}
        options={{ headerShown: false,
          headerStyle:{backgroundColor:'#000C66'},
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         }}
      />


    </Stack.Navigator>
  </NavigationContainer>
);
const NavigationProvider = () => {
  let statee = useSelector((state) => state)
  const[extended, setExtended]=useState(false)
  const[state, setState]=useState(statee)

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
    return <MyHeader title={title} state={state}  changeState={changeState} extended={extended} setExtended={setExtended} />
  
  }
  const Header2 = (title, state)=>{
    return <MyHeader2 title={title}  state={state} changeState={collapseState} extended={extended} setExtended={setExtended}/>
  
  }
  
  const dispatch = useDispatch();

  function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route);
  console.log(routeName)
  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Market':
      return 'Market';
    case 'Account':
      return 'Account';
    case 'Wallet':
      return 'Wallet';
      case 'Assets':
      return 'Assets';
      default:
      return "Home"
  }
  }

  return <AuthStack getHeaderTitle={getHeaderTitle}  extended={extended} state={state} Header1={Header1} Header2={Header2} dispatch={dispatch}/>;
};
export default NavigationProvider;