import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  AddToAllWallets,
} from "../../components/Redux/actions/auth";
import {  urls } from "../constants";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import ModalHeader from "../reusables/ModalHeader";
import { alert } from "../reusables/Toasts";
const CheckNewWalletMnemonic = ({
  Wallet,
  Visible,
  SetVisible,
  setModalVisible,
  SetPrivateKeyVisible,
  setNewWalletVisible,
}) => {
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  async function saveUserDetails() {
    let response;
    const user = await AsyncStorageLib.getItem("user");
    console.log(user);
    const token = await AsyncStorageLib.getItem("token");
    try {
      response = await fetch(`http://${urls.testUrl}/user/saveUserDetails`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          user: user,
          walletAddress: Wallet.address,
          accountName: Wallet.accountName,
        }),
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          console.log(responseJson);
          console.log(responseJson);
          if (responseJson.responseCode === 200) {
            alert("success");
            return responseJson.responseCode;
          } else if (responseJson.responseCode === 400) {
            alert(
              "account with same name already exists. Please use a different name"
            );
            return responseJson.responseCode;
          } else {
            alert("Unable to create account. Please try again");
            return 401;
          }
        })
        .catch((error) => {
          setVisible(!visible);

          alert(error);
        });
    } catch (e) {
      setVisible(!visible);

      console.log(e);
      alert(e);
    }
    console.log(response);
    return response;
  }

  const closeModal=()=>{
    SetVisible(false)
  }

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
    const wallet = Wallet;
    console.log(wallet);
  }, [fadeAnim, Spin]);

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={500}
        animationOutTiming={650}
        isVisible={Visible}
        useNativeDriver={true}
        onBackdropPress={() => SetVisible(false)}
        onBackButtonPress={() => {
          SetVisible(false);
        }}
      >
        <View style={style.Body}>
          <ModalHeader Function={closeModal} name={'Check Mnemonic'}/>
          <View style={{ display: "flex", alignContent: "flex-start" }}>
            <Text style={style.welcomeText}>Enter your mnemonic below</Text>
          </View>

          <TextInput
            style={style.textInput}
            onChangeText={(text) => {
              setMnemonic(text);
            }}
            placeholder={"Enter your secret phrase here"}
          />
          <Text style={{ margin: 5 }}>
            Secret Phrases are typically 12(sometimes 16) words long.They are
            also called mnemonic phrase.{" "}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="green" />
          ) : (
            <Text> </Text>
          )}
          <View style={{ display:'flex',alignSelf:'center',width: wp(30), margin: 10 }}>
            <Button
              title={"Import"}
              color={"blue"}
              onPress={async () => {
                setLoading(true);
                try {
                  const user = await AsyncStorageLib.getItem("user");

                  if (mnemonic === Wallet.mnemonic) {
                    /*const response = await saveUserDetails().then(async (response)=>{
                 if(response===400){
                   return 
                  }
                  else if(response===401){
                    return 
                  }
                }).catch((e)=>{
                  console.log(e)
                  setLoading(false)
                  SetVisible(false)
                  setModalVisible(false)
                  
                  
                })*/

                    let wallets = [];
                    const data = await AsyncStorageLib.getItem(
                      `${user}-wallets`
                    )
                      .then((response) => {
                        console.log(response);
                        JSON.parse(response).map((item) => {
                          wallets.push(item);
                        });
                      })
                      .catch((e) => {
                        setWalletVisible(false);
                        setVisible(false);
                        setModalVisible(false);
                        console.log(e);
                      });

                    //wallets.push(accounts)
                    const allWallets = [
                      {
                        address: Wallet.address,
                        privateKey: Wallet.privateKey,
                        name: Wallet.accountName,
                        walletType: "Multi-coin",
                        xrp:{
                          address:Wallet.xrp.address,
                          privateKey:Wallet.xrp.privateKey
                        },
                        wallets: wallets,
                      },
                    ];
                    // AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(wallets))

                    dispatch(AddToAllWallets(allWallets, user))
                    .then((response)=>{
                      if(response){
                        if(response.status==='Already Exists'){
                          
                          alert("error",'Account with same name already exists')
                          setLoading(false)
                          return
                        }

                        else if(response.status==='success'){
                          setTimeout(() => {
                      
                            setLoading(false);
                            SetVisible(false);
                            setModalVisible(false);
                            SetPrivateKeyVisible(false);
                            setNewWalletVisible(false);
                            navigation.navigate("AllWallets");
                          }, 0);
                          
                        }
                        else{
                          alert("error",'failed please try again')
                          return
                        }
                      }
                    })
                    
                    // dispatch(getBalance(wallet.address))
                    //dispatch(setProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))


                    
                      
                    
                  }
                } catch (e) {
                  setLoading(false);
                  SetVisible(false);
                  setModalVisible(false);
                  SetPrivateKeyVisible(false);
                  setNewWalletVisible(false);
                  alert("error","Failed to import wallet. Please try again");
                }
              }}
            ></Button>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default CheckNewWalletMnemonic;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "white",
    height: hp(90),
    width: wp(90),
    borderRadius:20,
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
    width: wp("85"),
    paddingRight: wp("7"),
    backgroundColor: "white",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    height: hp(20),
    width: wp(85),
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
  input2: {
    borderWidth: 1,
    borderColor: "grey",
    height: hp(5),
    width: wp(90),
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
});
