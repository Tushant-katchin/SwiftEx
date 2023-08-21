import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AddToAllWallets } from "../../components/Redux/actions/auth";
import { urls } from "../constants";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import ModalHeader from "../reusables/ModalHeader";
import { alert } from "../reusables/Toasts";
import Icon from "../../icon";
const CheckNewWalletMnemonic = ({
  Wallet,
  Visible,
  SetVisible,
  setModalVisible,
  SetPrivateKeyVisible,
  setNewWalletVisible,
  onCrossPress
}) => {
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");

  const [mnemonic, setMnemonic] = useState("");
  const [Mnemonic, SetMnemonic] = useState([]);
  const [data, setData] = useState();

  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  
  const closeModal = () => {
    SetVisible(false);
  };

  function func(a, b) {
    return 0.5 - Math.random();
  }

  useEffect(() => {
    console.log(Wallet)
    let data = Wallet.Mnemonic.map((item) => {
      let data = {
        mnemonic: item,
        selected: false,
      };
      return data;
    });
    console.log(data);
    const newData = data.sort(func);
    setData(newData);
    console.log(newData)
  }, []);


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
    let wallet = Wallet;
    console.log("mnemonic+++",Wallet.mnemonic)
    console.log(wallet);
  }, [fadeAnim, Spin]);



  console.log("000000000000000", Wallet?.mnemonic);
  const RenderItem = ({ item, index }) => {
    console.log("----------------------", item);
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
          {/* <ModalHeader Function={closeModal} name={'Check Mnemonic'}/> */}
          <Icon type={'entypo'} name='cross' color={'gray'} size={24} style={style.crossIcon} onPress={onCrossPress}/>
          <Text style={style.verifyText}>Verify Secret Phrase</Text>
          <Text style={style.wordText}>
            Tap the words to put them next to each other in the correct order.
          </Text>

          <View style={{ marginTop: hp(6) }}>
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
          <View style={{display:'flex',flexDirection:'row',flexWrap:"wrap",alignItems:"center",marginTop:hp(2)}}>
            {Mnemonic.length>0?Mnemonic.map((item)=>{
              console.log("mnemonic words",item)
            return(
              <Text style={{color:'black',textAlign:'center',fontStyle:'italic',marginTop:hp(1),margin:10,}} >{item}</Text>
            )
           }):<Text style={{color:'black',marginTop:hp(4),marginHorizontal:wp(6)}} >nothing added yet</Text>}
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
            <Text> </Text>
          )}
          <View
            style={{
              display: "flex",
              alignSelf: "center",
              width: wp(30),
              margin: 10,
            }}
          >
            <TouchableOpacity
              style={style.ButtonView}
              onPress={async () => {
                setLoading(true);
                try {
                  const user = await AsyncStorageLib.getItem("user");

                  if (JSON.stringify(Mnemonic) === JSON.stringify(Wallet.Mnemonic)) {
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
                        mnemonic: Wallet.mnemonic,
                        walletType: "Multi-coin",
                        xrp: {
                          address: Wallet.xrp.address,
                          privateKey: Wallet.xrp.privateKey,
                        },
                        wallets: wallets,
                      },
                    ];
                    // AsyncStorageLib.setItem(`${accountName}-wallets`,JSON.stringify(wallets))

                    dispatch(AddToAllWallets(allWallets, user)).then(
                      (response) => {
                        if (response) {
                          if (response.status === "Already Exists") {
                            alert(
                              "error",
                              "Account with same name already exists"
                            );
                            setLoading(false);
                            return;
                          } else if (response.status === "success") {
                            setTimeout(() => {
                              setLoading(false);
                              SetVisible(false);
                              setModalVisible(false);
                              SetPrivateKeyVisible(false);
                              setNewWalletVisible(false);
                              navigation.navigate("AllWallets");
                            }, 0);
                          } else {
                            alert("error", "failed please try again");
                            return;
                          }
                        }
                      }
                    );

                    // dispatch(getBalance(wallet.address))
                    //dispatch(setProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
                  }
                } catch (e) {
                  setLoading(false);
                  SetVisible(false);
                  setModalVisible(false);
                  SetPrivateKeyVisible(false);
                  setNewWalletVisible(false);
                  alert("error", "Failed to import wallet. Please try again");
                }
              }}
            >
              <Text style={{ color: "white" }}>Import</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default CheckNewWalletMnemonic;

const style = StyleSheet.create({
  Body: {
    backgroundColor: "white",
    height: hp(85),
    width: wp(95),
    borderRadius: 20,
    alignSelf: "center",
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
  verifyText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: hp(1),
  },
  wordText: {
    color: "black",
    textAlign: "center",
    marginTop: hp(1),
    width: wp(88),
    marginHorizontal: wp(5),
  },
  itemText: {
    textAlign: "left",
    marginVertical: 6,
    marginHorizontal: wp(1.5),
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
  crossIcon:{
    alignSelf:"flex-end",
    padding:hp(1.5)
  }
});
