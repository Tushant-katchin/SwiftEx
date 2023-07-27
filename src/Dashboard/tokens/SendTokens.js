import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import title_icon from "../../../assets/title_icon.png";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  getBalance,
  getEthBalance,
  getMaticBalance,
  getXrpBalance,
} from "../../components/Redux/actions/auth";
import { SendCrypto } from "./sendFunctions";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { urls } from "../constants";
import { checkAddressValidity } from "../../utilities/web3utilities";
import { isFloat, isInteger } from "../../utilities/utilities";
import { alert } from "../reusables/Toasts";
import Icon from "../../icon";
import { WalletHeader } from "../header";
var ethers = require("ethers");
const xrpl = require("xrpl");
//'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850'
const SendTokens = (props) => {
  const EthBalance = useSelector((state) => state.EthBalance);
  const MaticBalance = useSelector((state) => state.MaticBalance);
  const type = useSelector((state) => state.walletType);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [Loading, setLoading] = useState(false);
  const [balance, setBalance] = useState();
  const [walletType, setWallettype] = useState("");
  const [disable, setDisable] = useState(true);
  const [message, setMessage] = useState("");
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getXrpBal = async (address) => {
    console.log(address);

    try {
      const response = await fetch(
        `http://${urls.testUrl}/user/getXrpBalance`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: address,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson) {
            console.log(responseJson.responseData);
            setBalance(
              responseJson.responseData ? responseJson.responseData : 0
            );
          } else {
            console.log(response);
          }
        })
        .catch((e) => {
          console.log(e);
          //alert('unable to update balance')
        });

      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const Balance = async (Type) => {
    try {
      const wallet = await AsyncStorageLib.getItem("wallet");
      const address = (await state.wallet.address)
        ? await state.wallet.address
        : JSON.parse(wallet).address;
      console.log(state.wallet.address);
      if (!state.wallet.address) {
        setBalance(0);

        alert("error", "please select a wallet first");
      } else {
        if (Type) {
          if (Type == "Ethereum") {
            await dispatch(
              getEthBalance(
                state.wallet.address ? state.wallet.address : address
              )
            ).then((res) => {
              console.log(res.EthBalance);
              setBalance(res.EthBalance);
            });
          } else if (Type == "Matic") {
            console.log(MaticBalance);
            await dispatch(
              getMaticBalance(
                state.wallet.address ? state.wallet.address : address
              )
            ).then(async (res) => {
              let bal = await AsyncStorageLib.getItem("MaticBalance");
              console.log(bal);
              console.log(res.MaticBalance);
              setBalance(bal);
            });
          } else if (Type === "Multi-coin-Xrp") {
            try {
              await AsyncStorageLib.getItem("wallet")
                .then(async (wallet) => {
                  console.log("XrpMulti", JSON.parse(wallet));
                  await dispatch(getXrpBalance(JSON.parse(wallet).xrp.address))
                    .then((res) => {
                      console.log(res.XrpBalance);
                      setBalance(res.XrpBalance ? res.XrpBalance : 0);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
                });
            } catch (e) {
              console.log(e);
            }
          } else if (Type == "Xrp") {
            try {
              await AsyncStorageLib.getItem("wallet")
                .then(async (wallet) => {
                  console.log(JSON.parse(wallet).address);
                  await dispatch(getXrpBalance(JSON.parse(wallet).address))
                    .then((res) => {
                      console.log(res.XrpBalance);
                      setBalance(res.XrpBalance ? res.XrpBalance : 0);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
                });
            } catch (e) {
              console.log(e);
            }
          } else if (Type == "BNB") {
            await dispatch(getBalance(state.wallet.address))
              .then(async (response) => {
                console.log(response);
                const res = await response;
                if (res.status == "success") {
                  console.log(res);
                  setBalance(res.walletBalance);
                  console.log("success");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
    try {
      console.log(props.route.params.token);
      const Type = await AsyncStorageLib.getItem("walletType");
      setWallettype(JSON.parse(Type));

      await Balance(props.route.params.token).catch((e) => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    let inputValidation;
    let inputValidation1;
    const valid = checkAddressValidity(address);
    inputValidation = isFloat(amount);
    inputValidation1 = isInteger(amount);
    console.log(inputValidation, inputValidation1);
    if (
      amount &&
      balance &&
      address &&
      amount <= balance &&
      valid &&
      (inputValidation || inputValidation1)
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }

    if (address) {
      if (!valid) {
        setMessage("Please enter a valid address");
      } else {
        setMessage("");
      }
    }
  }, [amount, address]);
  useEffect(() => {
    let inputValidation;
    let inputValidation1;
    if (amount) {
      inputValidation = isFloat(amount);
      inputValidation1 = isInteger(amount);

      if (amount > balance) {
        setMessage("Low Balance");
      } else if (!inputValidation && !inputValidation1) {
        setMessage("Please enter a valid amount");
      } else {
        setMessage("");
      }
    }
  }, [amount]);

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <WalletHeader title={props.route.params.token}/>
      <View style={{ backgroundColor: "white", height: hp(100) }}>
        <View style={style.inputView}>
          <TextInput
            onChangeText={(input) => {
              if (input && address) {
                setDisable(false);
              } else {
                setDisable(true);
              }
              console.log(input);
              setAddress(input);
            }}
            placeholder="Recipient Address"
            style={style.input}
          ></TextInput>
          <Icon name="scan" type={"ionicon"} size={20} color={"blue"} />
          <Text style={style.pasteText}>PASTE</Text>
        </View>
        <Text style={style.balance}>
          Available balance :-{" "}
          {balance ? balance : <Text style={{ color: "#C1BDBD" }}>0</Text>}
        </Text>

        <View style={style.inputView}>
          <TextInput
            value={amount}
            keyboardType="numeric"
            onChangeText={(input) => {
              if (amount && address) {
                setDisable(false);
              } else {
                setDisable(true);
              }
              console.log(input);
              setAmount(input);
            }}
            placeholder="Amount ETH"
            style={style.input}
          ></TextInput>
          <Pressable
           
            onPress={() => {
              console.log("pressed", amount, balance);
              setAmount(balance);
            }}
          >
            <Text  onPress={()=>{console.log("pressed", amount, balance);
              setAmount(balance)}} style={{ color: "blue" }}>MAX</Text>
          </Pressable>
          <Text style={style.pasteText}>ETH</Text>
        </View>
        {Loading ? (
          <View style={{ marginBottom: hp("-4") }}>
            <ActivityIndicator size="small" color="blue" />
          </View>
        ) : (
          <Text> </Text>
        )}

        <Text style={style.msgText}>{message}</Text>

        <View style={style.btnView}>
          <Button
            disabled={disable}
            color="blue"
            title="Send"
            onPress={async () => {
              console.log(walletType);
              let privateKey;
              const myAddress = await state.wallet.address;
              const token = props.route.params.token;
              const wallet = await AsyncStorageLib.getItem("Wallet");
              console.log(wallet);
              if (amount && balance && amount > balance) {
                setLoading(false);
                console.log(amount, balance);
                return alert(
                  "You don't have enough balance to do this transaction "
                );
              }

              if (token === "Multi-coin-Xrp") {
                privateKey = (await state.wallet.xrp.privateKey)
                  ? await state.wallet.xrp.privateKey
                  : JSON.parse(wallet).xrp.privateKey;
              } else {
                privateKey = (await state.wallet.privateKey)
                  ? await state.wallet.privateKey
                  : JSON.parse(wallet).privateKey;
              }
              console.log(privateKey);
              /* if(balance<amount){
    console.log(balance,amount)
    return alert('You dont have enough balance to do this transaction')
  }*/

              if (
                walletType &&
                token &&
                myAddress &&
                privateKey &&
                amount &&
                address
              ) {
                await SendCrypto(
                  address,
                  amount,
                  privateKey,
                  balance,
                  setLoading,
                  walletType,
                  setDisable,
                  myAddress,
                  token,
                  navigation
                );
              }
            }}
          ></Button>
        </View>
      </View>
    </Animated.View>
  );
};

export default SendTokens;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "white",
    height: hp(100),
    width: wp(100),
  },
  Text: {
    fontSize: 18,
    color: "black",
  },
  welcomeText2: {
    fontSize: 15,
    fontWeight: "200",
    color: "white",
    marginTop: hp(1),
  },
  Button: {
    marginTop: hp(10),
  },

  Text: {
    marginTop: hp(5),
    fontSize: 15,
    fontWeight: "200",
    color: "white",
  },
  textInput2: {
    borderWidth: 1,
    borderColor: "grey",
    width: wp(90),
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    height: wp(8),
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    width: wp(93),
    alignSelf: "center",
    borderColor: "#C1BDBD",
    marginTop: hp(3),
    paddingVertical: hp(1.5),
    borderRadius: hp(1),
  },
  pasteText: { color: "blue", marginHorizontal: wp(3) },
  balance: { marginLeft: wp(5), marginTop: hp(2) },
  input: {
    width: wp(70),
    alignSelf: "center",
    paddingHorizontal: wp(4),
  },
  msgText: { color: "red", textAlign: "center" },
  btnView: { width: wp(30), alignSelf: "center", marginTop: hp(8) },
});

/* <View style={style.Body}>
<Text style={{ marginLeft: wp(5), marginTop: hp(5) }}>
  {" "}
  Reciepent address{" "}
</Text>
<TextInput
  style={style.textInput2}
  onChangeText={(input) => {
    if (input && address) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    console.log(input);
    setAddress(input);
  }}
/>
<Text style={{ marginLeft: wp(5), marginTop: hp(1) }}>
  Available balance {balance ? balance : 0}
</Text>
<Text style={{ marginLeft: wp(5), marginTop: hp(10) }}> Amount </Text>
<TextInput
  style={style.textInput2}
  value={amount}
  keyboardType="numeric"
  onChangeText={(input) => {
    if (amount && address) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    console.log(input);
    setAmount(input);
  }}
/>
<View style={{ width: wp(20), margin: 10 }}>
  <Button
    color={"blue"}
    title={"max"}
    onPress={() => {
      setAmount(balance);
      console.log("pressed", amount, balance);
    }}
  />
</View>
{Loading ? (
  <View style={{ marginBottom: hp("-4") }}>
    <ActivityIndicator size="small" color="blue" />
  </View>
) : (
  <Text> </Text>
)}
<View
  style={{
    display: "flex",
    alignItems: "center",
    alignContent: "center",
  }}
>
  <Text style={{ color: "red" }}>{message}</Text>
</View>
<View style={{ width: wp(30), marginTop: hp(10), marginLeft: wp(33) }}>
  <Button
    disabled={disable}
    color="blue"
    title="Send"
    onPress={async () => {
      console.log(walletType);
      let privateKey;
      const myAddress = await state.wallet.address;
      const token = props.route.params.token;
      const wallet = await AsyncStorageLib.getItem("Wallet");
      console.log(wallet);
      /*  if(amount&&balance&&amount>balance){
        setLoading(false)
        console.log(amount,balance)
        return alert("You don't have enough balance to do this transaction ")
      } */

//   if (token === "Multi-coin-Xrp") {
//     privateKey = (await state.wallet.xrp.privateKey)
//       ? await state.wallet.xrp.privateKey
//       : JSON.parse(wallet).xrp.privateKey;
//   } else {
//     privateKey = (await state.wallet.privateKey)
//       ? await state.wallet.privateKey
//       : JSON.parse(wallet).privateKey;
//   }
//   console.log(privateKey);
//   /* if(balance<amount){
//     console.log(balance,amount)
//     return alert('You dont have enough balance to do this transaction')
//   }*/

//   if (
//     walletType &&
//     token &&
//     myAddress &&
//     privateKey &&
//     amount &&
//     address
//   ) {
//     await SendCrypto(
//       address,
//       amount,
//       privateKey,
//       balance,
//       setLoading,
//       walletType,
//       setDisable,
//       myAddress,
//       token,
//       navigation
//     );
//   }
// }}
// ></Button>
// </View>
