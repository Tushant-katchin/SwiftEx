import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  Touchable,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Button } from "react-native-paper";
import Icons from "react-native-vector-icons/FontAwesome";
import FontAwesome from "react-native-vector-icons";
import SendModal from "./Modals/SendModal";
import RecieveModal from "./Modals/RecieveModal";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import {
  getEthBalance,
  getMaticBalance,
  getBalance,
  getXrpBalance,
} from "../components/Redux/actions/auth";
import { Animated } from "react-native";
import SwapModal from "./Modals/SwapModal";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { urls } from "./constants";
import {
  getEtherBnbPrice,
  getEthPrice,
  getBnbPrice,
} from "../utilities/utilities";
import { tokenAddresses } from "./constants";
import { FaucetModal } from "./Modals/faucetModal";
import Icon from "../icon";
import IconWithCircle from "../Screens/iconwithCircle";
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const MyHeader2 = ({ title, changeState, state, extended, setExtended }) => {
  state = useSelector((state) => state);
  const state2 = useSelector((state) => state.walletBalance);
  const EthBalance = useSelector((state) => state.EthBalance);
  const bnbBalance = useSelector((state) => state.walletBalance);
  const walletState = useSelector((state) => state.wallets);
  const type = useSelector((state) => state.walletType);

  console.log(state.wallets);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [swapType, setSwapType] = useState("");
  const [balance, GetBalance] = useState(0.0);
  const [wallet, getWallet] = useState(walletState ? walletState : []);
  const [Type, setType] = useState("");
  const [bnbPrice, setBnbPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [balanceUsd, setBalance] = useState(0.0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // onPress={() => setModalVisible(true)}
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const Logo = () => {
    return <Icons name="bitcoin" size={20} color="white" />;
  };
  const translation = useRef(new Animated.Value(0)).current;
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
            setType("XRP");
            console.log(responseJson.responseData);
            GetBalance(
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

  const getAllBalance = async () => {
    try {
      const wallet = await AsyncStorageLib.getItem("wallet");
      const address = (await state.wallet.address)
        ? await state.wallet.address
        : "";
      const wType = await type;

      AsyncStorageLib.getItem("walletType").then(async (type) => {
        console.log("hi" + JSON.parse(type));
        if (!state.wallet.address) {
          GetBalance(0.0);
          setType("");
        } else if (JSON.parse(type) == "Matic") {
          await dispatch(getMaticBalance(address))
            .then(async (res) => {
              let bal = await AsyncStorageLib.getItem("MaticBalance");
              console.log(bal);
              if (res) {
                setType("Mat");
                GetBalance(bal);
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
                setType("Eth");
                GetBalance(Eth);
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
            GetBalance(balance);
            setType("BNB");
          }
        } else if (JSON.parse(type) == "Xrp") {
          console.log("entering xrp balance");
          try {
            const resp = dispatch(getXrpBalance(address))
              .then((response) => {
                console.log(response);
                setType("XRP");
                console.log(response.XrpBalance);
                GetBalance(response.XrpBalance ? response.XrpBalance : 0);
              })
              .catch((e) => {
                console.log(e);
              });
            //await getXrpBal(address)
            //await getXrpBal(address)
          } catch (e) {
            console.log(e);
          }
        } else if (JSON.parse(type) == "Multi-coin") {
          await dispatch(getMaticBalance(address))
            .then(async (res) => {
              console.log("hi poly" + res.MaticBalance);

              let bal = await AsyncStorageLib.getItem("MaticBalance");
              console.log(bal);
              if (res) {
                setType("Mat");
                GetBalance(bal);
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
                setType("Eth");
                GetBalance(bal);
              } else {
                console.log("coudnt get balance");
              }
            })
            .catch((e) => {
              console.log(e);
            });

          const balance = await state.walletBalance;
          if (balance) {
            GetBalance(balance);
            setType("BNB");
          }
        } else {
          setType("");
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => {
    try {
      getAllBalance().catch((e) => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }

    Animated.timing(translation, {
      toValue: 1,
      delay: 0.1,
      useNativeDriver: true,
    }).start();
  }, [state2, wallet]);

  useEffect(() => {
    try {
      getAllBalance().catch((e) => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  }, [state.wallet.address, state.wallet.name, state.walletType]);

  const openExtended = () => {
    changeState();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const getBalanceInUsd = (ethBalance, bnbBalance) => {
    console.log("My wallet Type", Type);
    console.log(ethBalance, bnbBalance);
    const ethInUsd = ethBalance * ethPrice;
    const bnbInUsd = bnbBalance * bnbPrice;
    console.log("Eth balance", ethInUsd);
    console.log("BNB balance", bnbInUsd);
    AsyncStorageLib.getItem("walletType").then((Type) => {
      console.log("Async type", Type);
      if (JSON.parse(Type) === "Ethereum") {
        const totalBalance = Number(ethInUsd);
        setBalance(totalBalance.toFixed(1));
        return;
      } else if (JSON.parse(Type) === "BSC") {
        const totalBalance = Number(bnbInUsd);
        setBalance(totalBalance.toFixed(1));
        return;
      } else if (Type === "Xrp") {
        setBalance(0.0);
        return;
      } else if (Type === "Matic") {
        setBalance(0.0);
        return;
      } else if (JSON.parse(Type) === "Multi-coin") {
        const totalBalance = Number(ethInUsd) + Number(bnbInUsd);
        console.log(totalBalance);
        setBalance(totalBalance.toFixed(1));
        return;
      }
    });
    return;
    // setLoading(false)
  };

  const getETHBNBPrice = async () => {
    /* await getEtherBnbPrice(tokenAddresses.ETH, tokenAddresses.BNB)
    .then((resp) => {
      console.log(resp);
      setEthPrice(resp.Ethprice);
      setBnbPrice(resp.Bnbprice);
    })
    .catch((e) => {
      console.log(e);
    });*/
    await getEthPrice().then((response) => {
      console.log("eth price = ", response.USD);
      setEthPrice(response.USD);
    });
    await getBnbPrice().then((response) => {
      console.log("BNB price= ", response.USD);
      setBnbPrice(response.USD);
    });
  };

  useEffect(async () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    Animated.timing(translation, {
      toValue: 1,
      delay: 0.1,
      useNativeDriver: true,
    }).start();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  useEffect(() => {
    console.log(balanceUsd);
    //getEthPrice()
    getETHBNBPrice();
    getBalanceInUsd(EthBalance, bnbBalance);
  }, [ethPrice, bnbPrice, EthBalance, bnbBalance, Type]);

  useEffect(() => {
    console.log(balanceUsd);
    //getEthPrice()
    getETHBNBPrice();
    getBalanceInUsd(EthBalance, bnbBalance);
  }, []);

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => alert("Notifications will be added soon")}>
          <Icon name="bell" type={"fontisto"} size={24} />
        </Pressable>
        <FaucetModal showModal={showModal} setShowModal={setShowModal} />

        {/* <TouchableOpacity
          style={styles.faucetBtn}
          onPress={() => {
            console.log("pressed");
            setShowModal(true);
          }}
        >
          <Text style={styles.faucetText}>Faucet</Text>
        </TouchableOpacity> */}
        <Pressable onPress={() => openExtended()}>
          <Icon name="sliders" type={"FAIcon"} size={24} />
        </Pressable>
      </View>
      <View style={{ marginVertical: hp(2) }}>
        <Text style={styles.dollartxt}>
          $ {balanceUsd >= 0 ? balanceUsd : 0.0}
        </Text>
        
      </View>
      <View style={styles.buttons}>
        <IconWithCircle
          name={"arrowup"}
          type={"antDesign"}
          title={"Send"}
          onPress={() => setModalVisible(!modalVisible)}
        />

        <IconWithCircle
          name={"arrowdown"}
          type={"antDesign"}
          title={"Receive"}
          onPress={() => setModalVisible2(true)}
        />

        <IconWithCircle
          name={"swap-horizontal"}
          type={"ionicon"}
          title={"Swap"}
          onPress={async () => {
            const walletType = await AsyncStorageLib.getItem("walletType");
            console.log(JSON.parse(walletType));
            if (!JSON.parse(walletType))
              return alert("please select a wallet first to swap tokens");
            if (
              JSON.parse(walletType) === "BSC" ||
              JSON.parse(walletType) === "Ethereum" ||
              JSON.parse(walletType) === "Multi-coin"
            ) {
              setModalVisible3(true);
            } else {
              alert("Swapping is only supported for Ethereum and Binance ");
            }
          }}
        />

        <IconWithCircle
          name={"credit-card-outline"}
          type={"materialCommunity"}
          title={"Buy"}
          onPress={() => navigation.navigate("buycrypto")}
        />
      </View>
      <SendModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <RecieveModal
        modalVisible={modalVisible2}
        setModalVisible={setModalVisible2}
      />
      <SwapModal
        modalVisible={modalVisible3}
        setModalVisible={setModalVisible3}
        swapType={swapType}
      />

      <View style={styles.iconmainContainer}>
        <View style={styles.iconTextContainer}>
          <Icon name="graph" type={"simpleLine"} size={hp(3)} />
          <Text style={{ marginHorizontal: hp(1) }}>
            Your Portfolio insights
          </Text>
        </View>
        <View style={styles.iconTextContainer}>
          <View style={styles.numberContainer}>
            <Text style={styles.number}>3</Text>
          </View>
          <Icon name="cross" type={"entypo"} size={hp(3.6)} color="black" />
        </View>
      </View>
    </View>
  );
};

export default MyHeader2;
const styles = StyleSheet.create({
  profile: {
    borderWidth: 1,
    width: wp("15.1"),
    height: hp("7.7"),
    marginTop: hp("5"),
    marginRight: wp("5"),
    borderRadius: 10,
  },
  profileText: {
    color: "white",
    fontWeight: "bold",
    marginTop: hp("1"),
    marginLeft: wp("3"),
  },
  text: {
    bottom: wp("33"),
    color: "white",
  },
  textDesign: {
    color: "white",
    fontStyle: "italic",
    fontWeight: "bold",
    marginLeft: wp("3"),
  },
  textDesign2: {
    color: "black",
    fontWeight: "bold",
    marginLeft: wp("5"),
  },
  textDesign3: {
    color: "black",
    fontWeight: "bold",
    marginLeft: wp("2"),
  },
  textDesign4: {
    color: "black",
    fontWeight: "bold",
    marginLeft: wp("4"),
  },
  buttons: {
    marginTop: hp(2),
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#3574B6",
    width: wp("13"),
    height: hp("6"),
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButton2: {
    position: "absolute",
    zIndex: 11,
    left: 20,
    bottom: 90,
    backgroundColor: "green",
    width: 80,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  container: {
    backgroundColor: "#000C66",
    position: "absolute",
    padding: 10,
    width: wp("50"),
    marginTop: hp("15"),
    marginLeft: wp("23"),
  },
  dropdown: {
    height: hp("6"),
    width: wp("50"),
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: hp("1"),
    marginRight: 20,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "#000C66",
    left: wp("13"),
    zIndex: -999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "white",
    height: hp("3"),
    bottom: hp("8"),
  },
  placeholderStyle: {
    fontSize: 16,
    color: "white",
  },
  selectedTextStyle: {
    fontSize: 11,
    color: "white",
  },
  iconStyle: {
    width: 20,
    height: 20,
    backgroundColor: "white",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  faucetText: {
    color: "black",
  },
  faucetBtn: {
    backgroundColor: "#4CA6EA",
    width: wp(15),
    alignItems: "center",
    borderRadius: 5,
  },
  headerContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: hp(2),
    width: wp(90),
    alignSelf: "center",
  },
  dollartxt: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: hp(1),
  },
  wallet: {
    flexDirection: "row",
    alignSelf: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
  iconTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconmainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: hp(42),
    alignSelf: "center",
    marginTop: hp(3),
    height: hp(9),
    alignItems: "center",
    borderRadius: hp(2),
    padding: hp(2),
    backgroundColor: "#e8f0f8",
  },
  numberContainer: {
    backgroundColor: "#9bbfde",
    width: hp(4.3),
    height: hp(4.3),
    borderRadius: hp(10),
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#145DA0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: hp(10),
  },
});
/*
 <View style={styles.buttons}>
          <TouchableOpacity
    style={styles.addButton}
    onPress={() => {
       
        }}>
    <Text style={styles.addButtonText}>Import</Text>
  </TouchableOpacity>
   
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => {
      
      }}>
      <Text style={styles.addButtonText}>Close</Text>
    </TouchableOpacity>
  
          
          </View>
          <View style={styles.container}>
        <Text style={styles.label}>
          My Wallets
        </Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={Data?Data:WalletData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? state.wallet.name ?state.wallet.name :'Select Wallet'  : 'Select wallet'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={async (item) => {
            console.log(item.label)
            setValue(item.value);
            console.log(item.privateKey)
            setIsFocus(false);

            try{
             await dispatch(setCurrentWallet(item.value, item.label, item.privateKey))
            .then( (response) => {
              if(response){
             //console.log(response)
             alert(`Wallet selected :${item.label}`)
            }
            else{
              alert('failed to select wallet. please try again')
            }
              
              
            })
            .catch((error) => {
              
              console.log(error)
              alert('failed to select wallet. please try again')
              
            });
     
            }catch(e){
              alert('failed to select wallet')
            }
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'white'}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>

      <View style={styles.wallet}>
          <Text style={styles.textDesign3}>
            <Text>{balance ? balance : 0}</Text> {Type}
          </Text>
          
        </View>
        <Text style={styles.text}>
            {state.wallet
              ? state.wallet.name
                ? state.wallet.name
                : state.wallet.accountName
                ? state.wallet.accountName
                : "Main Wallet"
              : "No connected wallet"}
          </Text>
*/
