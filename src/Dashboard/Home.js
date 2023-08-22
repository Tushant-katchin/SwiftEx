import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../components/Redux/actions/auth";
import Home2 from "./Home2";
import Settings from "../../Settings";
import Ionicons from "react-native-vector-icons/Ionicons";
import Market from "./Market";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyHeader from "./MyHeader";
import Wallet from "./Wallet";
import MyHeader2 from "./MyHeader2";
import { Extend } from "../components/Redux/actions/auth";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Collapse } from "../components/Redux/actions/auth";
import store from "../components/Redux/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyHeader3 from "./Header3";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { REACT_APP_LOCAL_TOKEN } from "./exchange/crypto-exchange-front-end-main/src/ExchangeConstants";
import { ExchangeNavigation } from "./exchange/crypto-exchange-front-end-main/src/Navigation";
import { ExchangeLogin } from "./exchange/crypto-exchange-front-end-main/src/pages/auth/ExchangeLogin";
import { ExchangeHeaderApp } from "./reusables/ExchangeHeader";
import { AppHeader } from "./reusables/AppHeader";
import { ExchangeHeaderIcon } from "./header";

const Tab = createBottomTabNavigator();

const Dashboard = ({ navigation }) => {
  let statee = useSelector((state) => state);
  let extend = useSelector((state) => state.extended);
  const [extended, setExtended] = useState(extend);
  const [state, setState] = useState(statee);
  const dispatch = useDispatch();
  //let state = store.getState()
  console.log(state);
  const [token, setToken] = useState("");

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
  const Header3 = (title) => {
    // return <MyHeader2 title={title} state={state} changeState={collapseState} extended={extended} setExtended={setExtended}/>
    return <AppHeader name={title} />;
  };

  // useEffect(async () => {
  //   // CheckWallet(statee.user, dispatch, importAllWallets)
  //   const user = await AsyncStorageLib.getItem("user");
  //   console.log(user);
  //   dispatch(setUser(JSON.parse(user)));

  //   const data = await AsyncStorage.getItem(`${user}-wallets`);
  //   console.log(data);
  // }, []);

  useEffect(async () => {
    const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
    const token = await AsyncStorageLib.getItem(LOCAL_TOKEN);
    console.log(token);

    setToken(token);
  });

  return (
    <>
      <Tab.Navigator
        shifting={false}
        barStyle={{ backgroundColor: "#131E3A", color: "black" }} //This is where you can manipulate its look.
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            size = 25;
            if (route.name === "Home") {
              iconName = focused ? "ios-home-sharp" : "ios-home-sharp";
              iconName = "ios-home-sharp";
            }
            if (route.name === "Assets") {
              iconName = focused ? "ios-home-sharp" : "ios-home-outline";
              iconName = "ios-pie-chart-sharp";
            }
            if (route.name === "Market") {
              iconName = focused ? "ios-home-sharp" : "ios-home-outline";
              iconName = "ios-bar-chart-sharp";
            }
            if (route.name === "Settings") {
              iconName = focused ? "ios-settings-sharp" : "ios-settings-sharp";
              iconName = "ios-settings-sharp";
            }
            if (route.name === "Exchange") {
              iconName = focused
                ? "swap-vertical-outline"
                : "swap-vertical-outline";
              iconName = "swap-vertical-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          tabBarLabel: ({ focused }) => {
            let iconColor;

            iconColor = focused ? "blue" : "black";

            return (
              <Text
                style={{
                  color: iconColor,
                  // fontSize: hp("1"),
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                {route.name}
              </Text>
            );
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "#4CA6EA",
            height: hp("9"),
            // borderTopColor: "black",
            // borderTopWidth: 1,
          },
          headerTitleAlign: "center",

          //Tab bar styles can be added here
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home2}
          options={{
            header: () =>
              state.extended === false
                ? Header1("Home", state)
                : Header2("Home", state),
            headerShown: true,
          }}
        />

        <Tab.Screen
          name="Wallet"
          component={Wallet}
          options={{
            headerShown: true,
            unmountOnBlur: true,
            header: () => {
              return Header3("Wallet");
            },
            tabBarIcon: ({ focused }) => {
              let iconName;
              iconName = "ios-home-sharp"; //for icon or image
              let iconColor;

              iconColor = focused ? "blue" : "white";
              return (
                <View>
                  <Text>
                    <Ionicons
                      name={"wallet"}
                      size={hp("3")}
                      color={iconColor}
                    />
                  </Text>
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="Market"
          component={Market}
          options={{
            header: () => Header3("Market"),
            headerShown: true,
            unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="Exchange"
          component={token ? ExchangeNavigation : ExchangeLogin}
          options={{
            header: () => {
              null;
            },
            headerShown: true,
            display: "none",
            tabBarStyle: { display: "none" },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            header: () => Header3("Settings"),
            headerShown: true,
          }}
        />
      </Tab.Navigator>
    </>
  );
};
export default Dashboard;
