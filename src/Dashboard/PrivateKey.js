import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import title_icon from "../../assets/title_icon.png";
import { useDispatch, useSelector } from "react-redux";
import {
  AddToAllWallets,
  getBalance,
  setCurrentWallet,
  setUser,
  setToken,
  setWalletType,
} from "../components/Redux/actions/auth";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import DialogInput from "react-native-dialog-input";
import { encryptFile } from "../utilities/utilities";
import { urls } from "./constants";
import { alert } from "./reusables/Toasts";
import Icon from "../icon";
const PrivateKey = (props) => {
  const [accountName, setAccountName] = useState("");
  const [visible, setVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(async () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    console.log(props.route.params.wallet);
  }, [fadeAnim]);

  const RenderItem = ({ item, index }) => {
    console.log("-------------", item);
    return (
      <Pressable style={style.pressable}>
        <Text style={style.pressText}>{index + 1}</Text>

        <Text style={style.itemText}>{item}</Text>
      </Pressable>
    );
  };

  return (
    <View style={{ backgroundColor: "white", height: hp(100) }}>
      <Animated.View // Special animatable View
        style={{ opacity: fadeAnim }}
      >
        <View style={style.Body}>
          {/* <Animated.Image
          style={{
            width: wp("5"),
            height: hp("5"),
            padding: 30,
            marginTop: hp(3),
          }}
          source={title_icon}
        /> */}
          <Text style={style.backupText}>Backup Mneumonic Phrase</Text>
          <Text style={style.welcomeText1}>
            Please select the menumonic in order to ensure the backup is
            correct.
          </Text>
        </View>
        <View style={{ marginTop: hp(3) }}>
          <FlatList
            data={[
              "name",
              "avxd",
              "call",
              "ringtone",
              "cricket",
              "nave",
              "arrow",
              "never",
              "evergreen",
            ]}
            // data={props.route.params.wallet.wallet.mnemonic}
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
            Keep your mneumonic in a safe place isolated from any network
          </Text>
        </View>
        <View style={style.dotView1}>
          <Icon name="dot-single" type={"entypo"} size={20} />
          <Text style={style.welcomeText}>
            Don't share and store mneumonic with a network, such as email,photo,
            social apps, and so on
          </Text>
        </View>

        {/* <Text selectable={true} style={style.welcomeText2}>
          {props.route.params.wallet.wallet.mnemonic}
        </Text> */}

        <Text style={style.accountText}> Account Name</Text>

        <TextInput
          style={style.input}
          placeholder="Enter your account name"
          value={accountName}
          onChangeText={(text) => setAccountName(text)}
          placeholderTextColor="#FFF"
          autoCapitalize={"none"}
        />
        <TouchableOpacity
          style={style.nextButton}
          disabled={accountName ? false : true}
          onPress={() => {
            //setVisible(!visible)
            if (!accountName) {
              return alert("error", "you must set an account name to continue");
            }
            let wallet = props.route.params.wallet.wallet;
            wallet.accountName = accountName;
            console.log(wallet);
            props.navigation.navigate("Check Mnemonic", {
              wallet,
            });
          }}
        >
          <Text>Next</Text>
        </TouchableOpacity>

        {/* <View style={style.Button}> */}

        {/* </View> */}
      </Animated.View>
    </View>
  );
};

export default PrivateKey;

const style = StyleSheet.create({
  Body: {
    width: wp(100),
    alignItems: "center",
    textAlign: "center",
  },
  welcomeText: {
    color: "black",
  },
  welcomeText1: {
    marginLeft: wp(4.7),
    color: "gray",
    marginLeft: wp(4),
    width: wp(90),
  },
  welcomeText2: {
    fontSize: 20,
    fontWeight: "200",
    color: "black",
  },
  Button: {
    backgroundColor: "red",
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
    backgroundColor: "white",
    borderWidth: 1,
    paddingHorizontal:wp(3),
    borderRadius: 10,
    width: wp(80),
    height: hp(5),
    marginTop: hp(2),
    alignSelf: "center",
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
