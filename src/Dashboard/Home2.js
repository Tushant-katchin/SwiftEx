import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  AppState,
  BackHandler,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setWalletType } from "../components/Redux/actions/auth";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import InvestmentChart from "./InvestmentChart";
import Nfts from "./Nfts";
import { Animated, Platform, UIManager } from "react-native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { setCurrentWallet } from "../components/Redux/actions/auth";
import { useWindowDimensions } from "react-native";
import {
  TabView,
  SceneMap,
  TabBar,
  TabBarIndicator,
} from "react-native-tab-view";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useFirebaseCloudMessaging from "./notifications/firebaseNotifications";
import {
  getEthBalance,
  getMaticBalance,
  getBalance,
  getXrpBalance,
} from "../components/Redux/actions/auth";
import { useBiometrics } from "../biometrics/biometric";

const Home2 = ({ navigation }) => {
  const route = useRoute();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();
  const currentState = useRef(AppState.currentState);
  const [appState, setAppState] = useState(currentState.current);
  const [transactions, setTransactions] = useState();
  const [routes] = useState([
    { key: "first", title: "Tokens" },
    { key: "second", title: "NFTs" },
  ]);
  const Navigation = useNavigation();

  const { getToken, requestUserPermission } = useFirebaseCloudMessaging();

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const translation = useRef(new Animated.Value(0)).current;

  const getAllBalance = async () => {
    try {
      const wallet = await AsyncStorageLib.getItem("wallet");
      const address = (await state.wallet.address)
        ? await state.wallet.address
        : "";

      AsyncStorageLib.getItem("walletType").then(async (type) => {
        console.log("hi" + JSON.parse(type));
        if (!state.wallet.address) {
          console.log(res);
        } else if (JSON.parse(type) == "Matic") {
          await dispatch(getMaticBalance(address))
            .then(async (res) => {
              let bal = await AsyncStorageLib.getItem("MaticBalance");
              console.log(bal);
              if (res) {
                console.log(res);
              } else {
                console.log("coudnt get balance");
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (JSON.parse(type) == "Ethereum") {
          dispatch(getEthBalance(address))
            .then(async (e) => {
              const Eth = await e.EthBalance;
              let bal = await AsyncStorageLib.getItem("EthBalance");

              if (Eth) {
                console.log(res);
              } else {
                console.log("coudnt get balance");
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (JSON.parse(type) == "BSC") {
          const balance = await state.walletBalance;
          if (balance) {
            console.log(res);
          }
        } else if (JSON.parse(type) == "Xrp") {
          console.log("entering xrp balance");
          try {
            const resp = dispatch(getXrpBalance(address))
              .then((response) => {
                console.log(response);
              })
              .catch((e) => {
                console.log(e);
              });
          } catch (e) {
            console.log(e);
          }
          //await getXrpBal(address)
          /* await getXrpBal(address)
          .catch((e)=>{
            console.log(e)
          })*/
        } else if (JSON.parse(type) == "Multi-coin") {
          await dispatch(getMaticBalance(address))
            .then(async (res) => {
              console.log("hi poly" + res.MaticBalance);

              let bal = await AsyncStorageLib.getItem("MaticBalance");
              console.log(bal);
              if (res) {
                console.log(res);
              } else {
                console.log("coudnt get balance");
              }
            })
            .catch((e) => {
              console.log(e);
            });

          dispatch(getEthBalance(address))
            .then(async (e) => {
              const Eth = await e.EthBalance;
              let bal = await AsyncStorageLib.getItem("EthBalance");
              console.log("hi" + Eth);
              console.log(bal);
              if (Eth) {
                console.log(res);
              } else {
                console.log("coudnt get balance");
              }
            })
            .catch((e) => {
              console.log(e);
            });

          const balance = await state.walletBalance;
          if (balance) {
            console.log(res);
          }
        } else {
          setType("");
          /*const wallet = await state.wallet.address;

          if (wallet) {
            await dispatch(getBalance(wallet))
              .then(async () => {
                const bal = await state.walletBalance;

                if (bal) {
                  GetBalance(bal);
                } else {
                  GetBalance(0);
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }*/
          //alert('No wallet selected')
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const SetCurrentWallet = async () => {
    let user = await AsyncStorageLib.getItem("currentWallet");
    let mainUser = await AsyncStorageLib.getItem("user");
    console.log("hi", mainUser);
    console.log(user);
    let walletType = await AsyncStorageLib.getItem("walletType");
    let wallet = await AsyncStorageLib.getItem(`Wallet`).then((wallet) => {
      console.log(JSON.parse(wallet));
      if (JSON.parse(wallet).xrp) {
        dispatch(
          setCurrentWallet(
            JSON.parse(wallet).address,
            user,
            JSON.parse(wallet).privateKey,
            JSON.parse(wallet).xrp.address
              ? JSON.parse(wallet).xrp.address
              : "",
            JSON.parse(wallet).xrp.privateKey
              ? JSON.parse(wallet).xrp.privateKey
              : "",
            (walletType = "Multi-coin")
          )
        );
      } else {
        dispatch(
          setCurrentWallet(
            JSON.parse(wallet).address,
            user,
            JSON.parse(wallet).privateKey
          )
        );
      }
      console.log(mainUser);
      dispatch(setWalletType(JSON.parse(walletType)));
      dispatch(setUser(mainUser));
      getAllBalance().catch((e) => {
        console.log(e);
      });
    });

    return wallet;
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#4CA6EA" }}
      style={{ backgroundColor: "#fff" }}
      activeColor={"#4CA6EA"}
      inactiveColor={"black"}
      pressColor={"black"}
    />
  );

  const FirstRoute = () => (
    <View>
      <InvestmentChart />
    </View>
  );

  const SecondRoute = () => (
    <View>
      <Nfts />
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  useEffect(async () => {
    // getWallets(state.user, readData,dispatch, importAllWallets)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    Animated.timing(translation, {
      toValue: 1,
      delay: 0.1,
      useNativeDriver: true,
    }).start();
    /* if (!state.wallet.address) {
      try {
        await SetCurrentWallet().catch((e) => {
          console.log(e);
        });
      } catch (e) {
        console.log(e);
      }
    }
  */
  }, []);
  useEffect(async () => {
    try {
      await SetCurrentWallet().catch((e) => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", (changedState) => {
      currentState.current = changedState;
      setAppState(currentState.current);
      console.log(currentState.current);
      if (currentState.current === "background") {
        console.log(currentState.current);

        navigation.navigate("appLock");
        /* if(routeName.name!=='exchangeLogin'){
            
          }*/
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  /*useFocusEffect(
    React.useCallback(() => {
      try {
        getTransactions().then((res) => {
          console.log(res);
          checkIncomingTx(res);
        });
      } catch (e) {
        console.log(e);
      }
    }, [])
  );*/

  return (
    <Animated.View style={{ backgroundColor: "#000C66" }}>
      <View style={Styles.container}>
        <TabView
          swipeEnabled={true}
          navigationState={{ index, routes }}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          // style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
        />
      </View>
    </Animated.View>
  );
};

export default Home2;
const Styles = StyleSheet.create({
  container: {
    // display: "flex",
    backgroundColor: "white",
    height: hp("100"),
    width: wp("100"),
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // zIndex: 100,
  },
  content: {
    display: "flex",
    flexDirection: "row",
    marginTop: 0,
    color: "white",
    width: wp(100),
    zIndex: 100,
  },
  text: {
    color: "grey",
    fontWeight: "bold",
  },
  text2: {
    color: "grey",
    fontWeight: "bold",
  },
  priceUp: {
    color: "rgba(0,153,51,0.6)",
  },
  priceDown: {
    color: "rgba(204,51,51,0.6)",
  },
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
