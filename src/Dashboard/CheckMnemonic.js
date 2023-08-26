// import React, { useRef, useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Button,
//   ActivityIndicator,
// } from "react-native";
// import { TextInput, Checkbox } from "react-native-paper";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { Animated } from "react-native";
// import title_icon from "../../assets/title_icon.png";
// import { useDispatch, useSelector } from "react-redux";
// import { Generate_Wallet2 } from "../components/Redux/actions/auth";

// import {
//   AddToAllWallets,
//   getBalance,
//   setCurrentWallet,
//   setUser,
//   setToken,
//   setWalletType,
// } from "../components/Redux/actions/auth";
// import { encryptFile } from "../utilities/utilities";
// import DialogInput from "react-native-dialog-input";
// import { EthRouterV2, urls } from "./constants";
// import AsyncStorageLib from "@react-native-async-storage/async-storage";
// import "react-native-get-random-values";
// import "@ethersproject/shims";
// import { ethers } from "ethers";
// import { genrateAuthToken, genUsrToken } from "./Auth/jwtHandler";
// import { alert } from "./reusables/Toasts";

// const CheckMnemonic = (props) => {
//   const [loading, setLoading] = useState(false);
//   const [accountName, setAccountName] = useState("");
//   const [mnemonic, setMnemonic] = useState("");
//   const [visible, setVisible] = useState(false);
//   const [Wallet, setWallet] = useState();

//   const dispatch = useDispatch();

//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const Spin = new Animated.Value(0);
//   const SpinValue = Spin.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "360deg"],
//   });

//   async function saveUserDetails() {
//     let response;
//     try {
//       response = await fetch(`http://${urls.testUrl}/user/createUser`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           walletAddress: props.route.params.wallet.address,
//           user: props.route.params.wallet.accountName,
//         }),
//       })
//         .then((response) => response.json())
//         .then(async (responseJson) => {
//           console.log(responseJson);
//           console.log(responseJson);
//           if (responseJson.responseCode === 200) {

//             alert("success","successfull");
//           } else if (responseJson.responseCode === 400) {
//             return {
//               code: responseJson.responseCode,
//               message:
//                 "account with same name already exists. Please use a different name",
//             };
//           } else {
//             return {
//               code: 401,
//               message: "Unable to create account. Please try again",
//             };
//           }
//           return {
//             code: responseJson.responseCode,
//             token: responseJson.responseData,
//           };
//         })
//         .catch((error) => {
//           setVisible(!visible);

//           alert(error);
//         });
//     } catch (e) {
//       setVisible(!visible);

//       console.log(e);
//       alert(e);
//     }
//     console.log(response);
//     return response;
//   }

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1000,
//     }).start();

//     Animated.timing(Spin, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//     const wallet = props?.route?.params?.wallet;
//     console.log(wallet);
//   }, [fadeAnim, Spin]);

//   return (
//     <Animated.View // Special animatable View
//       style={{ opacity: fadeAnim }}
//     >
//       <View style={style.Body}>
//         <View style={{ display: "flex", alignContent: "flex-start" }}>
//           <Text style={style.welcomeText}>Enter your mnemonic below</Text>
//         </View>

//         <TextInput
//           style={style.textInput}
//           onChangeText={(text) => {
//             setMnemonic(text);
//           }}
//           placeholder={"Enter your secret phrase here"}
//         />
//         <Text style={{ margin: 5 }}>
//           Secret Phrases are typically 12(sometimes 16) words long.They are also
//           called mnemonic phrase.{" "}
//         </Text>
//         {loading ? (
//           <ActivityIndicator size="large" color="green" />
//         ) : (
//           <Text> </Text>
//         )}
//         <View style={{ width: wp(95), margin: 10 }}>
//           <Button
//             title={"Import"}
//             color={"blue"}
//             onPress={async () => {
//               setLoading(true);
//               const pin = await AsyncStorageLib.getItem("pin");

//               if (mnemonic === props.route.params.wallet.mnemonic) {
//                 /* const response = await saveUserDetails().then((response)=>{

//                   if(response.code===400){
//                     return alert(response.message)
//                   }
//                   else if(response.code===401){
//                     return alert(response.message)
//                   }
//                 }).catch((e)=>{
//                   console.log(e)
//                   //return alert('failed to create account. please try again')
//                 })*/

//                 console.log(pin);
//                 const body = {
//                   accountName: props.route.params.wallet.accountName,
//                   pin: JSON.parse(pin),
//                 };
//                 const token = genUsrToken(body);
//                 console.log(token);

//                 const accounts = {
//                   address: props.route.params.wallet.address,
//                   privateKey: props.route.params.wallet.privateKey,
//                   name: props.route.params.wallet.accountName,
//                   walletType: "Multi-coin",
//                   xrp:{
//                     address:props.route.params.wallet.xrp.address,
//                     privateKey:props.route.params.wallet.xrp.privateKey
//                   },
//                   wallets: [],
//                 };
//                 let wallets = [];
//                 wallets.push(accounts);
//                 const allWallets = [
//                   {
//                     address: props.route.params.wallet.address,
//                     privateKey: props.route.params.wallet.privateKey,
//                     name: props.route.params.wallet.accountName,
//                     xrp:{
//                       address:props.route.params.wallet.xrp.address,
//                       privateKey:props.route.params.wallet.xrp.privateKey
//                     },
//                     walletType: "Multi-coin",
//                   },
//                 ];

//                 AsyncStorageLib.setItem(
//                   "wallet",
//                   JSON.stringify(allWallets[0])
//                 );
//                 AsyncStorageLib.setItem(
//                   `${props.route.params.wallet.accountName}-wallets`,
//                   JSON.stringify(allWallets)
//                 );
//                 AsyncStorageLib.setItem(
//                   "user",
//                   props.route.params.wallet.accountName
//                 );
//                 AsyncStorageLib.setItem(
//                   "currentWallet",
//                   props.route.params.wallet.accountName
//                 );
//                 AsyncStorageLib.setItem(
//                   `${props.route.params.wallet.accountName}-token`,
//                   token
//                 );

//                 dispatch(setUser(props.route.params.wallet.accountName));
//                 dispatch(
//                   setCurrentWallet(
//                     props.route.params.wallet.address,
//                     props.route.params.wallet.accountName,
//                     props.route.params.wallet.privateKey,
//                     props.route.params.wallet.xrp.address?props.route.params.wallet.xrp.address:'',
//                     props.route.params.wallet.xrp.privateKey?props.route.params.wallet.xrp.privateKey:'',
//                     walletType='Multi-coin'

//                   )
//                 );
//                 dispatch(
//                   AddToAllWallets(
//                     wallets,
//                     props.route.params.wallet.accountName
//                   )
//                 );
//                 dispatch(getBalance(props.route.params.wallet.address));
//                 dispatch(setWalletType("Multi-coin"));
//                 dispatch(setToken(token));

//                 props.navigation.navigate("HomeScreen");
//               } else {
//                 setLoading(false);
//                 return alert(
//                   "error",
//                   "Wrong Mnemonic. Please retry with correct mnemonic "
//                 );
//               }
//             }}
//           ></Button>
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// export default CheckMnemonic;

// const style = StyleSheet.create({
//   Body: {
//     display: "flex",
//     backgroundColor: "white",
//     height: hp(100),
//     width: wp(100),
//     textAlign: "center",
//   },
//   welcomeText: {
//     fontSize: 15,
//     fontWeight: "200",
//     color: "black",
//     marginLeft: 10,
//   },
//   welcomeText2: {
//     fontSize: 15,
//     fontWeight: "200",
//     color: "white",
//     marginTop: hp(1),
//   },
//   Button: {
//     marginTop: hp(10),
//     display: "flex",
//     flexDirection: "row",
//     alignContent: "space-around",
//     alignItems: "center",
//   },
//   tinyLogo: {
//     width: wp("5"),
//     height: hp("5"),
//     padding: 30,
//     marginTop: hp(10),
//   },
//   Text: {
//     marginTop: hp(5),
//     fontSize: 15,
//     fontWeight: "200",
//     color: "white",
//   },
//   input: {
//     height: hp("5%"),
//     marginBottom: hp("2"),
//     color: "black",
//     marginTop: hp("2"),
//     width: wp("90"),
//     paddingRight: wp("7"),
//     backgroundColor: "white",
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: "grey",
//     height: hp(20),
//     width: wp(95),
//     margin: 10,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 12,
//     },
//     shadowOpacity: 0.58,
//     shadowRadius: 16.0,

//     elevation: 24,
//   },
//   input2: {
//     borderWidth: 1,
//     borderColor: "grey",
//     height: hp(5),
//     width: wp(95),
//     margin: 10,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 12,
//     },
//     shadowOpacity: 0.58,
//     shadowRadius: 16.0,

//     elevation: 24,
//   },
// });

import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import title_icon from "../../assets/title_icon.png";
import { useDispatch, useSelector } from "react-redux";
import { Generate_Wallet2 } from "../components/Redux/actions/auth";

import {
  AddToAllWallets,
  getBalance,
  setCurrentWallet,
  setUser,
  setToken,
  setWalletType,
} from "../components/Redux/actions/auth";
import { encryptFile } from "../utilities/utilities";
import DialogInput from "react-native-dialog-input";
import { EthRouterV2, urls } from "./constants";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { genrateAuthToken, genUsrToken } from "./Auth/jwtHandler";
import { alert } from "./reusables/Toasts";

const CheckMnemonic = (props) => {
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [visible, setVisible] = useState(false);
  const [Wallet, setWallet] = useState();
  const [Mnemonic, SetMnemonic] = useState([]);
  const [data, setData] = useState();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    Animated.timing(Spin, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    const wallet = props?.route?.params?.wallet;
    console.log(wallet);
  }, [fadeAnim, Spin]);
  // <Text style={style.pressText}>{index + 1}</Text>

  const RenderItem = ({ item, index }) => {
    let Data = data.map((item) => {
      return item;
    });
    let newArray = [];
    newArray = Mnemonic;
    return (
      <TouchableOpacity
        style={{
          borderColor: "#D7D7D7",
          borderWidth: 0.5,
          backgroundColor: item.selected ? "#4CA6EA" : "#F2F2F2",
          width: wp(30),
          justifyContent: "center",
          paddingVertical: hp(2),
          paddingHorizontal: 3,
          position: "relative",
        }}
        onPress={() => {
          console.log("pressed");
          if (!item.selected) {
            Data[index].selected = true;
            newArray.push(item.mnemonic);
            console.log(newArray);
            SetMnemonic(newArray);
            setData(Data);
          } else {
            Data[index].selected = false;
            const data = newArray.filter((Item) => {
              return Item != item.mnemonic;
            });
            console.log(data);
            SetMnemonic(data);
            setData(Data);
          }
        }}
      >
        <Text style={style.itemText}>{item.mnemonic}</Text>
      </TouchableOpacity>
    );
  };

  function func(a, b) {
    return 0.5 - Math.random();
  }

  useEffect(() => {
    let data = props.route.params.mnemonic.map((item) => {
      let data = {
        mnemonic: item,
        selected: false,
      };
      return data;
    });
    console.log(data);
    const newData = data.sort(func);
    setData(newData);
  }, []);

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <View style={style.Body}>
        <Text style={style.verifyText}>Verify Secret Phrase</Text>
        <Text style={style.wordText}>
          Tap the words to put them next to each other in the correct order.
        </Text>

        <View style={{ marginTop: hp(8) }}>
          <FlatList
            data={data}
            // data={props.route.params.wallet.wallet.mnemonic}
            renderItem={RenderItem}
            numColumns={3}
            contentContainerStyle={{
              alignSelf: "center",
            }}
          />
        </View>
        <View
          style={{
            marginTop:hp(3),
            // display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            // backgroundColor: "red",
            // alignContent: "center",
            // alignSelf: "center",
            // alignItems: "center",
            // justifyContent: "center",
            marginLeft:wp(6),

            // width: wp(40),
            
          }}
        >
          {Mnemonic.length > 0 ? (
            Mnemonic.map((item) => {
              console.log("mnemonic words", item);
              return (
                <Text
                  style={{
                    color: "black",
                    marginHorizontal:4,
                    borderWidth:StyleSheet.hairlineWidth*1,
marginTop:hp(2),
alignItems:"center",
padding:hp(1)
                    // width:wp(50)
                  }}
                >
                  {item}
                </Text>
              );
            })
          ) : (
            <Text style={{ color: "black",textAlign:"center" ,alignSelf:"center"}}>Nothing added yet</Text>
          )}
        </View>
        {/* <TextInput
          style={style.textInput}
          onChangeText={(text) => {
            setMnemonic(text);
          }}
          placeholder={"Enter your secret phrase here"}
        /> */}
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <Text></Text>
        )}
          <TouchableOpacity
            style={style.ButtonView}
            onPress={async () => {
              setLoading(true);
              try {
                const pin = await AsyncStorageLib.getItem("pin");
                console.log(Mnemonic);
                console.log(props.route.params.mnemonic);

                if (
                  JSON.stringify(Mnemonic) ==
                  JSON.stringify(props.route.params.mnemonic)
                ) {
                  console.log(pin);
                  const body = {
                    accountName: props.route.params.wallet.accountName,
                    pin: JSON.parse(pin),
                  };
                  const token = genUsrToken(body);
                  console.log(token);

                  const accounts = {
                    address: props.route.params.wallet.address,
                    privateKey: props.route.params.wallet.privateKey,
                    mnemonic: props.route.params.wallet.mnemonic,
                    name: props.route.params.wallet.accountName,
                    walletType: "Multi-coin",
                    xrp: {
                      address: props.route.params.wallet.xrp.address,
                      privateKey: props.route.params.wallet.xrp.privateKey,
                    },
                    wallets: [],
                  };
                  let wallets = [];
                  wallets.push(accounts);
                  const allWallets = [
                    {
                      address: props.route.params.wallet.address,
                      privateKey: props.route.params.wallet.privateKey,
                      name: props.route.params.wallet.accountName,
                      mnemonic: props.route.params.wallet.mnemonic,
                      xrp: {
                        address: props.route.params.wallet.xrp.address,
                        privateKey: props.route.params.wallet.xrp.privateKey,
                      },
                      walletType: "Multi-coin",
                    },
                  ];

                  AsyncStorageLib.setItem(
                    "wallet",
                    JSON.stringify(allWallets[0])
                  );
                  AsyncStorageLib.setItem(
                    `${props.route.params.wallet.accountName}-wallets`,
                    JSON.stringify(allWallets)
                  );
                  AsyncStorageLib.setItem(
                    "user",
                    props.route.params.wallet.accountName
                  );
                  AsyncStorageLib.setItem(
                    "currentWallet",
                    props.route.params.wallet.accountName
                  );
                  AsyncStorageLib.setItem(
                    `${props.route.params.wallet.accountName}-token`,
                    token
                  );

                  dispatch(setUser(props.route.params.wallet.accountName));
                  dispatch(
                    setCurrentWallet(
                      props.route.params.wallet.address,
                      props.route.params.wallet.accountName,
                      props.route.params.wallet.privateKey,
                      props.route.params.wallet.mnemonic,
                      props.route.params.wallet.xrp.address
                        ? props.route.params.wallet.xrp.address
                        : "",
                      props.route.params.wallet.xrp.privateKey
                        ? props.route.params.wallet.xrp.privateKey
                        : "",
                      (walletType = "Multi-coin")
                    )
                  );
                  dispatch(
                    AddToAllWallets(
                      wallets,
                      props.route.params.wallet.accountName
                    )
                  );
                  dispatch(getBalance(props.route.params.wallet.address));
                  dispatch(setWalletType("Multi-coin"));
                  dispatch(setToken(token));
                  console.log("navigating to home screen");
                  props.navigation.navigate("HomeScreen");
                  alert("success", "correct mnemonic");
                } else {
                  setLoading(false);
                  SetMnemonic([]);
                  return alert(
                    "error",
                    "Wrong Mnemonic. Please retry with correct mnemonic "
                  );
                }
              } catch (e) {
                console.log(e);
              }
            }}
          >
            <Text style={{ color: "white" }}>Done</Text>
          </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default CheckMnemonic;

const style = StyleSheet.create({
  Body: {
    backgroundColor: "white",
    height: hp(100),

    textAlign: "center",
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "200",
    color: "black",
    marginLeft: 10,
  },
  welcomeText2: {
    fontSize: 15,
    fontWeight: "200",
    color: "white",
    marginTop: hp(1),
  },
  Button: {
    marginTop: hp(10),
    display: "flex",
    flexDirection: "row",
    alignContent: "space-around",
    alignItems: "center",
  },
  tinyLogo: {
    width: wp("5"),
    height: hp("5"),
    padding: 30,
    marginTop: hp(10),
  },
  Text: {
    marginTop: hp(5),
    fontSize: 15,
    fontWeight: "200",
    color: "white",
  },
  input: {
    height: hp("5%"),
    marginBottom: hp("2"),
    color: "black",
    marginTop: hp("2"),
    width: wp("90"),
    paddingRight: wp("7"),
    backgroundColor: "white",
  },
  textInput: {
    marginTop: hp(5),
    borderWidth: 1,
    borderColor: "grey",
    width: wp(85),
    alignSelf: "center",

    paddingVertical: hp(6),
  },
  input2: {
    borderWidth: 1,
    borderColor: "grey",
    height: hp(5),
    width: wp(95),
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  verifyText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: hp(2),
  },
  wordText: {
    color: "black",
    textAlign: "center",
    marginTop: hp(1),
    width: wp(88),
    marginHorizontal: wp(5),
  },
  ButtonView: {
    backgroundColor: "#4CA6EA",
    width: wp(85),
    alignSelf: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: hp(6),
  },
  pressable: {
    borderColor: "#D7D7D7",
    borderWidth: 0.5,
    backgroundColor: "#F2F2F2",
    width: wp(30),
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: 3,
    position: "relative",
  },
  pressText: {
    alignSelf: "flex-end",
    paddingRight: 5,
    top: 0,
    position: "absolute",
  },
  itemText: {
    textAlign: "left",
    marginVertical: 6,
    marginHorizontal: wp(1.5),
  },
  backupText: {
    fontWeight: "bold",
    fontSize: 17,
    color: "black",
    marginLeft: 20,
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  dotView: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(90),
    marginLeft: 18,
    marginTop: hp(4),
  },
  dotView1: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(90),
    marginLeft: 18,
    marginTop: hp(2),
  },
  accountText: { color: "black", marginHorizontal: wp(9), marginTop: hp(4) },
  nextButton: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "gray",
    marginTop: hp(4),
    width: wp(60),
    padding: 10,
    borderRadius: 10,
  },
});
