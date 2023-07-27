import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
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
  setWalletType,
} from "../../components/Redux/actions/auth";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import DialogInput from "react-native-dialog-input";
import { encryptFile } from "../../utilities/utilities";
import { urls } from "../constants";
import Modal from "react-native-modal";
import CheckNewWalletMnemonic from "./checkNewWalletMnemonic";
import ModalHeader from "../reusables/ModalHeader";
import Icon from "../../icon";

const NewWalletPrivateKey = ({
  props,
  Wallet,
  Visible,
  SetVisible,
  setModalVisible,
  setNewWalletVisible,
}) => {
  const [accountName, setAccountName] = useState("");
  const [visible, setVisible] = useState(false);
  const [newWallet, setNewWallet] = useState(Wallet);
  const [data, setData] = useState();

  const [MnemonicVisible, setMnemonicVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  async function saveUserDetails() {
    let response;
    try {
      response = await fetch(`http://${urls.testUrl}/user/saveUserDetails`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId: accountName,
          walletAddress: Wallet.address,
        }),
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          if (responseJson.responseCode === 200) {
            alert("success", "success");
            return responseJson.responseCode;
          } else if (responseJson.responseCode === 400) {
            alert(
              "error",
              "account with same name already exists. Please use a different name"
            );
            return responseJson.responseCode;
          } else {
            alert("error", "Unable to create account. Please try again");
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
      alert("error", e);
    }
    console.log(response);
    return response;
  }

  const closeModal = () => {
    SetVisible(false);
  };
  const mnemonic = Wallet?.mnemonic.match(/.*?[\.\s]+?/g);
  console.log("My mnemonic", mnemonic);

  useEffect(async () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    console.log(Wallet);
    let wallet = Wallet
    wallet.Mnemonic = mnemonic
    setNewWallet(wallet)
  }, []);

  
  const RenderItem = ({ item, index }) => {
    console.log("============------------", item);
    setData(data);
    return (
      <TouchableOpacity style={style.flatBtn}>
        <Text style={{ textAlign: "right" }}>{index + 1}</Text>
        <Text>{item}</Text>
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
        statusBarTranslucent={true}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        onBackdropPress={() => {
          SetVisible(false);
        }}
        onBackButtonPress={() => {
          SetVisible(false);
        }}
      >
        <View style={style.Body}>
          {/* <ModalHeader Function={closeModal} name={'Private Key'}/> */}

          <Text style={style.backupText}>Backup Mneumonic Phrase</Text>
          <Text style={style.welcomeText1}>
            Please select the menumonic in order to ensure the backup is
            correct.
          </Text>

          <View style={{ marginTop: hp(4) }}>
            <FlatList
              data={mnemonic}
              renderItem={RenderItem}
              numColumns={3}
              contentContainerStyle={{
                alignSelf: "center",
              }}
            />
          </View>

          <View style={style.dotView}>
          <Icon name="dot-single" type={"entypo"} size={20} />
          <Text style={{ color: "black" }}>
            Keep your mneumonic in a safe place isolated from network
          </Text>
        </View>
        <View style={style.dotView1}>
          <Icon name="dot-single" type={"entypo"} size={20} />
          <Text style={{color:"black",width:"90%"}}>
            Don't share and store mneumonic with a network, such as email,photo,
            social apps, and so on
          </Text>
        </View>
          {/* <Text selectable={true} style={style.welcomeText2}>
            {Wallet ? Wallet.mnemonic : ""}
          </Text> */}
          <Text style={style.welcomeText2}> Account Name</Text>

          <TextInput
            style={style.input}
            value={accountName}
            placeholder='Enter account name'
            onChangeText={(text) => setAccountName(text)}
            placeholderTextColor="black"
            autoCapitalize={"none"}
          />

          <View style={{ width: wp(95) }}>
            <TouchableOpacity
              style={style.ButtonView}
              disabled={accountName ? false : true}
              onPress={() => {
                //setVisible(!visible)
                let wallet = Wallet;
                wallet.accountName = accountName;
                wallet.Mnemonic =mnemonic
                setNewWallet(wallet);
                console.log(newWallet)
                setMnemonicVisible(true);
              }}
            >
              <Text style={{ color: "white" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
        {MnemonicVisible &&(<CheckNewWalletMnemonic
          Wallet={newWallet}
          SetVisible={setMnemonicVisible}
          Visible={MnemonicVisible}
          setModalVisible={setModalVisible}
          SetPrivateKeyVisible={SetVisible}
          setNewWalletVisible={setNewWalletVisible}
        />)}
      </Modal>
    </Animated.View>
  );
};

export default NewWalletPrivateKey;

const style = StyleSheet.create({
  Body: {
    backgroundColor: "white",
    height: hp(90),
    borderRadius: hp(2),
    width: wp(95),
    alignSelf: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "200",
    color: "white",
    marginTop: hp(5),
  },
  welcomeText2: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginTop: hp(5),
  },
  Button: {
    marginTop: hp(0),
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
    marginTop: hp(2),
    width: wp("70"),
    height: hp(4),
    backgroundColor: "white",
    alignSelf: "center",
    borderWidth: StyleSheet.hairlineWidth * 1,
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
    width: wp(55),
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: hp(1.5),
    paddingVertical: hp(1.7),
  },
  flatBtn: {
    backgroundColor: "#F2F2F2",
    borderRadius: hp(0.3),
    width: wp(28),
    paddingVertical: hp(2),
    borderWidth: 0.3,
    borderColor: "#D7D7D7",
    padding: 6,
  },
  backupText: {
    fontWeight: "bold",
    fontSize: 17,
    color: "black",
    marginLeft: 20,
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  welcomeText1: {
    marginLeft: wp(4.7),
    color: "gray",
    marginLeft: wp(4),
    width: wp(90),
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
  welcomeText: {
    color: "black",
    textAlign:'center'
  },
});
