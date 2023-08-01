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
import title_icon from "../../../assets/title_icon.png";
import { useDispatch, useSelector } from "react-redux";
import {
  AddToAllWallets,
  getBalance,
  setCurrentWallet,
  setUser,
  setToken,
  setProvider,
  setWalletType,
} from "../../components/Redux/actions/auth";
import { urls } from "../constants";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import Modal from "react-native-modal";
import ModalHeader from "../reusables/ModalHeader";
import { alert } from "../reusables/Toasts";

const ImportEthereumModal = ({
  props,
  setWalletVisible,
  Visible,
  setModalVisible,
}) => {
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [visible, setVisible] = useState(false);
  const [Wallet, setWallet] = useState();
  const [label, setLabel] = useState("privateKey");
  const [privateKey, setPrivateKey] = useState("");
  const [json, setJson] = useState();
  const [jsonKey, setJsonKey] = useState();
  const [optionVisible, setOptionVisible] = useState(false);
  const [provider, setProvider] = useState("");
  const [message,setMessage] = useState(false)
  const [disable, setDisable] = useState(true)
  const[text, setText] = useState('')
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Spin = new Animated.Value(0);

  
  const closeModal =() =>{
    setWalletVisible(false)
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
  }, [fadeAnim, Spin]);

  useEffect(()=>{
    if(!accountName)
    {
      setDisable(true)
    }
    
    if(accountName && (privateKey || mnemonic || json))
    {
      let valid
      if(label==='mnemonic'){
        const phrase = mnemonic.trimStart();
        const trimmedPhrase = phrase.trimEnd();
        valid = ethers.utils.isValidMnemonic(trimmedPhrase);
        if(!valid){
          setMessage('Please enter a valid mnemonic')
        }
        else{
          setMessage('')
        }
        
      }else if(label==='privateKey'){
        valid = ethers.utils.isHexString(privateKey, 32);
        if(!valid){
          setMessage('Please enter a valid private key')
        }
        else{
          setMessage('')
        }
      }
      
      if(accountName && (mnemonic || privateKey || json) && valid){
        setDisable(false)
      }else{
        setDisable(true)
      }
    }else{
      setMessage('')
    }
    },[mnemonic,privateKey,json,accountName])
   


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
        statusBarTranslucent={true}
        onBackdropPress={() => setWalletVisible(false)}
        onBackButtonPress={() => {
          setWalletVisible(false);
        }}
      >
        <View style={style.Body}>
          <ModalHeader Function={closeModal} name={'Ethereum'} />
          <View style={style.Button}>
            <View style={{ margin: 2, width: wp(30) }}>
              <Button
                title={"privateKey"}
                color={label == "privateKey" ? "green" : "grey"}
                onPress={() => {
                  setOptionVisible(false);
                  setLabel("privateKey");
                  if(text){
                    setPrivateKey(text)
                  }
                }}
              ></Button>
            </View>
            <View style={{ margin: 2, width: wp(30) }}>
              <Button
                title={"Mnemonic"}
                color={label == "mnemonic" ? "green" : "grey"}
                onPress={() => {
                  setOptionVisible(false);
                  setLabel("mnemonic");
                  if(text){
                    setMnemonic(text)
                  }
                }}
              ></Button>
            </View>
            <View style={{ margin: 2, width: wp(27) }}>
              <Button
                title={"JSON key"}
                color={label == "JSON" ? "green" : "grey"}
                onPress={() => {
                  setLabel("JSON");
                  setOptionVisible(true);
                  if(text){
                    setJson(text)
                  }
                }}
              ></Button>
            </View>
          </View>

          <View style={{ display: "flex", alignContent: "flex-start" }}>
            <Text style={style.welcomeText}>Name</Text>
          </View>
          <TextInput
            style={style.input2}
            theme={{ colors: { text: "black" } }}
            value={accountName}
            onChangeText={(text) => {
              setAccountName(text);
            }}
            placeholderTextColor="black"
            autoCapitalize={"none"}
            placeholder="Wallet 1"
          />

          <TextInput
            style={style.textInput}
            onChangeText={(text) => {
              if (label === "privateKey") {
                setText(text)
                setPrivateKey(text);
              } else if (label === "mnemonic") {
                setText(text)
                setMnemonic(text);
              } else if (label === "JSON") {
                setText(text)
                setJson(text);
              } else {
                return alert(`please input ${label} to proceed `);
              }
            }}
            placeholder={
              label === "privateKey"
                ? "Enter your private Key here"
                : label === "JSON"
                ? "Enter your secret JSON Key here"
                : "Enter your secret phrase here"
            }
          />

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "grey",
              height: hp(5),
              width: wp(70),
              display: optionVisible === false ? "none" : "flex",
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
            }}
            theme={{ colors: { text: "black" } }}
            value={jsonKey}
            onChangeText={(text) => {
              setJsonKey(text);
            }}
            placeholderTextColor="black"
            autoCapitalize={"none"}
            placeholder="JSON password"
          />

          {loading ? (
            <ActivityIndicator size="large" color="green" />
          ) : (
            <Text> </Text>
          )}
          <View style={{display:'flex', alignContent:'center',alignItems:'center'}}>
        <Text style={{color:'red'}}>{message}</Text>
        </View>
          <View style={{ display:'flex',alignSelf:'center',width: wp(30), margin: 10 }}>
            <Button
              title={"Import"}
              color={"blue"}
              disabled={disable}
              onPress={async () => {
                if (!accountName) {
                  return alert("please enter an accountName to proceed");
                }
                setLoading(true);

                if (label === "mnemonic") {
                  const user = await AsyncStorageLib.getItem("user");

                  const phrase = mnemonic.trimStart();
                  const trimmedPhrase = phrase.trimEnd();
                  const check = ethers.utils.isValidMnemonic(trimmedPhrase);
                  if (!check) {
                    setLoading(false);
                    
                    return alert(
                      'error',
                      "Incorrect Mnemonic. Please provide a valid Mnemonic"
                    );
                  }
                  const accountFromMnemonic = new ethers.Wallet.fromMnemonic(
                    trimmedPhrase
                  );
                  const Keys = accountFromMnemonic._signingKey();
                  const privateKey = Keys.privateKey;
                  const wallet = {
                    address: accountFromMnemonic.address,
                    privateKey: privateKey,
                  };
                  /*const response = saveUserDetails(accountFromMnemonic.address).then(async(response)=>{
                
                  if(response===400){
                    return 
                  }
                 else if(response===401){
                    return 
                  }
                })
                .catch((e)=>{
                    console.log(e)
                    setLoading(false)
                    setWalletVisible(false)
                    setVisible(false)
                    setModalVisible(false)


                  })*/
                  const accounts = {
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    name: accountName,
                    wallets: [],
                  };
                  let wallets = [];
                  const data = await AsyncStorageLib.getItem(`${user}-wallets`)
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
                      address: wallet.address,
                      privateKey: wallet.privateKey,
                      mnemonic:trimmedPhrase,
                      name: accountName,
                      walletType: "Ethereum",
                      wallets: wallets,
                    },
                  ];
                  // AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(wallets))

                  dispatch(AddToAllWallets(allWallets, user))
                  .then(
                    (response) => {
                      if (response) {
                        if (response.status === "Already Exists") {
                          alert("error","Account with same name already exists");
                          setLoading(false);
                          return;
                        } else if (response.status === "success") {
                          setTimeout(() => {
                    
                            setLoading(false);
                            setWalletVisible(false);
                            setVisible(false);
                            setModalVisible(false);
                            
                            navigation.navigate("AllWallets");
                          }, 0);
                        } else {
                          alert("error","failed please try again");
                          return;
                        }
                      }
                    }
                  );
                  
                  // dispatch(getBalance(wallet.address))
                  // dispatch(setToken(token))
                  //dispatch(setProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))


                  
                } else if (label === "privateKey") {
                  const check = ethers.utils.isHexString(privateKey, 32);
                  if (!check) {
                    setLoading(false);
                    return alert(
                      "error",
                      "Incorrect PrivateKey. Please provide a valid privatekey"
                    );
                  }
                  const user = await AsyncStorageLib.getItem("user");

                  const walletPrivateKey = new ethers.Wallet(privateKey);
                  console.log(walletPrivateKey);
                  const Keys = walletPrivateKey._signingKey();
                  const privatekey = Keys.privateKey;
                  const wallet = {
                    address: walletPrivateKey.address,
                    privateKey: privatekey,
                  };
                  /* const response = saveUserDetails(wallet.address).then(async (response)=>{
                  if(response===400){
                    return 
                  }
                 else if(response===401){
                    return 
                  }
                })
                .catch((e)=>{
                 
               
                  console.log(e)
                  setLoading(false)
                  setModalVisible(false)
                  setWalletVisible(false)
                  setVisible(false)


                })*/

                  let wallets = [];
                  const data = await AsyncStorageLib.getItem(`${user}-wallets`)
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
                      address: wallet.address,
                      privateKey: wallet.privateKey,
                      name: accountName,
                      walletType: "Ethereum",
                      wallets: wallets,
                    },
                  ];
                  // AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(wallets))

                  dispatch(AddToAllWallets(allWallets, user)).then(
                    (response) => {
                      if (response) {
                        if (response.status === "Already Exists") {
                          alert("error","Account with same name already exists");
                          setLoading(false);
                          return;
                        } else if (response.status === "success") {
                          setTimeout(() => {
                    
                            setLoading(false);
                            setWalletVisible(false);
                            setVisible(false);
                            setModalVisible(false);
                            
                            navigation.navigate("AllWallets");
                          }, 0);
                        } else {
                          alert("error","failed please try again");
                          return;
                        }
                      }
                    }
                  );
                  
                } else {
                  try {
                    const user = await AsyncStorageLib.getItem("user");

                    ethers.Wallet.fromEncryptedJson(json, jsonKey)
                      .then(async (wallet) => {
                        console.log("Address: " + wallet.address);
                        const Wallet = {
                          address: wallet.address,
                          privateKey: wallet.privateKey,
                        };
                        setWallet(wallet);

                        /*const response = saveUserDetails(wallet.address).then(async(response)=>{
                      if(response===400){
                        return 
                      }
                     else if(response===401){
                        return 
                      }
                    }).catch((e)=>{
                      console.log(e)
                      setLoading(false)
                      setWalletVisible(false)
                      setVisible(false)
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
                            address: wallet.address,
                            privateKey: wallet.privateKey,
                            name: accountName,
                            walletType: "Ethereum",
                            wallets: wallets,
                          },
                        ];
                        // AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(wallets))

                        dispatch(AddToAllWallets(allWallets, user)).then(
                          (response) => {
                            if (response) {
                              if (response.status === "Already Exists") {
                                alert("error","Account with same name already exists");
                                setLoading(false);
                                return;
                              } else if (response.status === "success") {
                                setTimeout(() => {
                          
                                  setLoading(false);
                                  setWalletVisible(false);
                                  setVisible(false);
                                  setModalVisible(false);
                                  
                                  navigation.navigate("AllWallets");
                                }, 0);
                              } else {
                                alert("error","failed please try again");
                                return;
                              }
                            }
                          }
                        );
                        
                      })
                      .catch((e) => {
                        console.log(e);
                        setLoading(false);
                        setWalletVisible(false);
                        setVisible(false);
                        setModalVisible(false);
                      });
                    setLoading(false);
                  } catch (e) {
                    console.log(e);
                    alert("error",e);
                  }
                }

                setWalletVisible(false);
                setVisible(false);
                setModalVisible(false);
                setLoading(false);
              }}
            ></Button>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default ImportEthereumModal;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "white",
    height: hp(90),
    width: wp(90),
    textAlign: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
    marginTop: hp(0),
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
    backgroundColor:'white',

    elevation: 24,
  },
});
