import React, { useState, useEffect, useRef } from "react";
import { AppState, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import store from "../components/Redux/Store";
import Dashboard from "../Dashboard/Home";
import { Register } from "../../Register";
import { LoginPage } from "../Login/Login";
import MyWallet from "../Dashboard/MyWallet";
import { useDispatch, useSelector } from "react-redux";
import CreateWallet from "../Dashboard/CreateWallet";
import ImportWallet from "../Dashboard/ImportWallet";
import MyHeader from "../Dashboard/MyHeader";
import MyHeader2 from "../Dashboard/MyHeader2";
import { Extend, Collapse } from "../components/Redux/actions/auth";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { ConfirmOtp } from "../Register/confirmOtp";
import Generate from "../../Generate";
import { CoinDetails } from "../Dashboard/CoinDetail";
import { TxDetail } from "../Dashboard/TxDetail";
import Welcome from "../Dashboard/Welcome";
import GenerateWallet from "../Dashboard/GenerateWallet";
import PrivateKey from "../Dashboard/PrivateKey";
import Passcode from "../Dashboard/Passcode";
import ImportAccount from "../Dashboard/ImportAccount";
import ImportMunziWallet from "../Dashboard/importMunziWallet";
import ImportOtherWallets from "../Dashboard/ImportOtherWallets";
import ImportBscWallet from "../Dashboard/importBscWallet";
import ImportPolygon from "../Dashboard/importPolygon";
import ImportXrp from "../Dashboard/importXrp";
import CheckMnemonic from "../Dashboard/CheckMnemonic";
import ConfirmTransaction from "../Dashboard/ConfirmTransaction";
import SendTokens from "../Dashboard/tokens/SendTokens";
import Transactions from "../Dashboard/Transactions";
import AllWallets from "../Dashboard/Wallets/allWallets";
import { ExchangeLogin } from "../Dashboard/exchange/crypto-exchange-front-end-main/src/pages/auth/ExchangeLogin";
import { ExchangeRegister } from "../Dashboard/exchange/crypto-exchange-front-end-main/src/pages/auth/signup";
import LockApp from "../Dashboard/lockApp";
import { navigationRef } from "../utilities/utilities";
import { ExchangeNavigation } from "../Dashboard/exchange/crypto-exchange-front-end-main/src/Navigation";
import BiometricPage from "../Dashboard/BiometricPage";
import SplashScreen from "../Screens/splash";
import Nfts from "../Dashboard/Nfts";
import Token from "../Dashboard/Token";
import Settings from "../../Settings";
import Wallet from "../Dashboard/Wallet";
import {
  OfferListView,
  OfferListViewHome,
  OfferView,
} from "../Dashboard/exchange/crypto-exchange-front-end-main/src/pages/offers";
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <NavigationContainer
    theme={{ colors: { background: "#000C66" } }}
    ref={navigationRef}
  >
    <Stack.Navigator
      //  initialRouteName="Check Mnemonic"
      mode="modal"
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      
       {/* <Stack.Screen
        name="ExchangeNavigation"
        component={ExchangeNavigation}
        options={{ headerShown: false }}
      />     */}

      {/* <Stack.Screen
        name="Home2"
        component={Home2}
        options={{
          headerShown: true,
          header: () => {
            return <ProfileHeader />;
          },
        }}
      />

      <Stack.Screen
        name="WalletTopTab"
        component={WalletTopTab}
        options={{
          headerShown: true,
          header: () => {
            return <ProfileHeader />;
          },
        }}
      /> */}

      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="confirmOtp"
        component={ConfirmOtp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={Dashboard}
        options={{
          headerShown: false,
          //header: ({route}) => state.extended===false?Header1( getHeaderTitle(route), state):Header1(getHeaderTitle(route), state)
        }}
      />
      <Stack.Screen
        name="MyWallet"
        component={MyWallet}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="CreateWallet"
        component={CreateWallet}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="OfferListView"
        component={OfferListView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OfferListViewHome"
        component={OfferListViewHome}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImportWallet"
        component={ImportWallet}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="buycrypto"
        component={Generate}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="CoinDetails"
        component={CoinDetails}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
        name="ScoringTopTab"
        component={ScoringTopTab}
        options={{
          headerShown: true,
          header: () => {
            return <ProfileHeader />;
          },
        }}
      /> */}
      <Stack.Screen
        name="Token"
        component={Token}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Nfts"
        component={Nfts}
        options={{
          headerShown: false,
          //header: ({route}) => state.extended===false?Header1( getHeaderTitle(route), state):Header1(getHeaderTitle(route), state)
        }}
      />

      <Stack.Screen
        name="TxDetail"
        component={TxDetail}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="GenerateWallet"
        component={GenerateWallet}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="PrivateKey"
        component={PrivateKey}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Passcode"
        component={Passcode}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Import"
        component={ImportAccount}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Import Multi-Coin Wallet"
        component={ImportMunziWallet}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Import Ethereum"
        component={ImportOtherWallets}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Import Binance"
        component={ImportBscWallet}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Import Polygon"
        component={ImportPolygon}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Import Xrp"
        component={ImportXrp}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Check Mnemonic"
        component={CheckMnemonic}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Send"
        component={SendTokens}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Confirm Tx"
        component={ConfirmTransaction}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Transactions"
        component={Transactions}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="AllWallets"
        component={AllWallets}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Biometric"
        component={BiometricPage}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="exchangeLogin"
        component={ExchangeLogin}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="exchangeRegister"
        component={ExchangeRegister}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="exchange"
        component={ExchangeNavigation}
        options={{
          headerShown: false,

          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="appLock"
        component={LockApp}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "#000C66" },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
const NavigationProvider = () => {
  let statee = useSelector((state) => state);
  const [extended, setExtended] = useState(false);
  const [state, setState] = useState(statee);

  const updateState = () => {
    let data = store.getState();
    return setState(data);
  };

  function changeState() {
    const data = dispatch(Extend())
      .then((response) => {
        console.log(response);
        const res = response;
        if (res.status == "success") {
          console.log(res);
          console.log("success");
          updateState();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(data);
  }

  function collapseState() {
    const data = dispatch(Collapse())
      .then((response) => {
        console.log(response);
        const res = response;
        if (res.status == "success") {
          console.log(res);
          console.log("success");
          updateState();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const Header1 = (title, state) => {
    return (
      <MyHeader
        title={title}
        state={state}
        changeState={changeState}
        extended={extended}
        setExtended={setExtended}
      />
    );
  };
  const Header2 = (title, state) => {
    return (
      <MyHeader2
        title={title}
        state={state}
        changeState={collapseState}
        extended={extended}
        setExtended={setExtended}
      />
    );
  };

  const dispatch = useDispatch();

  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route);
    console.log(routeName);
    switch (routeName) {
      case "Home":
        return "Home";
      case "Market":
        return "Market";
      case "Account":
        return "Account";
      case "Wallet":
        return "Wallet";
      case "Assets":
        return "Assets";
      default:
        return "Home";
    }
  }

  return (
    <AuthStack
      getHeaderTitle={getHeaderTitle}
      extended={extended}
      state={state}
      Header1={Header1}
      Header2={Header2}
      dispatch={dispatch}
    />
  );
};
export default NavigationProvider;
