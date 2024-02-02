import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { alert } from "../reusables/Toasts";
import { Paste } from "../../utilities/utilities";
import Icon from "../../icon";
const StellarSdk = require('stellar-sdk');
const ImportStellarModal = ({
  setWalletVisible,
  Visible,
  onCrossPress
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [secretkey, setsecretkey] = useState("");
  const navigation = useNavigation();


const add_wallet=()=>{
    if(!secretkey)
    {
     alert("error","Secret Key Missing.");
    }
    else{
        storeData(secretkey)
    }
}
const storeData = async (secretKey) => {
        
    try {
      await AsyncStorageLib.removeItem('myDataKey');
      console.log('Data cleared successfully');
      try {
        const keypair = StellarSdk.Keypair.fromSecret(secretKey);
        const publicKey = keypair.publicKey();
          const data = {
            key1: publicKey,
            key2: secretKey,
          };
        const jsonData = JSON.stringify(data);
        await AsyncStorageLib.setItem('myDataKey', jsonData);
        alert('success',"Account Imported.");
        setWalletVisible(false)
        setTimeout(()=>{
        navigation.navigate("Home")
        },2000)
      } catch (error) {
        console.error('Error storing data:', error);
        alert('error', "Account Not import yet.");
      }
    } catch (error) {
      console.error('Error clearing data:', error);
    }
   
};

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
    >
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={500}
        animationOutTiming={650}
        isVisible={Visible}
        useNativeDriver={true}
        onBackdropPress={() => setWalletVisible(false)}
        onBackButtonPress={() => {
          setWalletVisible(false);
        }}
      >
        <View style={style.Body}>
          <Icon type={'entypo'} name='cross' color={'gray'} size={24} style={style.crossIcon} onPress={onCrossPress} />
          <Text style={style.coinText}>Stellar wallet</Text>
          <View style={style.inputView}>
            <TouchableOpacity
              onPress={async () => {
                Paste(setsecretkey);
              }}
            >
              <Text style={style.paste}>Paste</Text>
            </TouchableOpacity>
            <Text>Secret Key</Text>
            <TextInput
              placeholder={"Enter your secret Key here"}
              style={style.input}
              value={secretkey}
              onChangeText={(text) => {
                setsecretkey(text)
              }}
            />
          </View>
          <TouchableOpacity style={style.btn} onPress={()=>{add_wallet()}}>
            <Text style={{ color: "white" }}>Import</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default ImportStellarModal;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "white",
    height: hp(75),
    width: wp(97),
    textAlign: "center",
    borderRadius: hp(1),
    alignSelf: "center",
    marginTop: hp(5)
  },
  Button: {
    marginTop: hp(0),
    display: "flex",
    flexDirection: "row",
    alignContent: "space-around",
    alignItems: "center",
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
  btn: {
    backgroundColor: "#4CA6EA",
    paddingVertical: hp(1.6),
    width: wp(90),
    alignSelf: "center",
    borderRadius: hp(1),
    alignItems: "center",
    marginTop:hp(10)
  },
  paste: { textAlign: "right", color: "#4CA6EA" },
  coinText: {
    textAlign: "center",
    marginTop: hp(1.5),
    fontSize: 15,
    fontWeight: "700"
  },
  inputView: {
    borderWidth: 1,
    width: wp(90),
    alignSelf: "center",
    padding: 10,
    marginTop: hp(3),
    borderRadius: hp(1),
    borderColor: "#DADADA",
  },
  crossIcon: {
    alignSelf: "flex-end",
    padding: hp(1.5)
  }
});