import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { TextInput, Checkbox, Switch } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import title_icon from "../../../assets/title_icon.png";
import { useDispatch, useSelector } from "react-redux";
import { Generate_Wallet2 } from "../../components/Redux/actions/auth";
import Modal from "react-native-modal";
import NewWalletPrivateKey from "./newWalletPrivateKey";
import ModalHeader from "../reusables/ModalHeader";
import { alert } from "../reusables/Toasts";
//import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import darkBlue from "../../../assets/darkBlue.png";
import Icon from "../../icon";

const NewWalletModal = ({ props,onCrossPress, visible, setVisible, setModalVisible }) => {
  const [Checked, setCheckBox] = useState(false);
  const [Checked2, setCheckBox2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newWalletPrivateKey, setNewWalletPrivateKey] = useState(false);
  const [Wallet, setWallet] = useState();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const closeModal = () => {
    setVisible(false);
  };
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
  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={500}
        animationOutTiming={650}
        isVisible={visible}
        statusBarTranslucent={true}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        onBackdropPress={() => setVisible(false)}
        onBackButtonPress={() => {
          setVisible(false);
        }}
      >
        <View style={style.Body}>
          <Icon type={'entypo'} name='cross' size={24} color={"white"} style={style.crossIcon} onPress={onCrossPress}/>
          <View style={{alignSelf:"center",alignItems:"center"}}>
          <Animated.Image
            style={{
              width: wp("12"),
              height: hp("12"),
              padding: 30,
            }}
            source={darkBlue}
          />

          <Text style={style.welcomeText}> Back up you wallet now </Text>
          <Text style={style.welcomeText}>
            In the next page , you will see your secret phrase
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: hp(5),
              alignItems: "center",
            }}
          >
            <Text style={style.welcomeText2}>
              If i loose my private key , my funds will be lost
            </Text>
            <View style={{ marginLeft: 10 }}>
              <Switch
                value={Checked}
                onValueChange={() => setCheckBox(!Checked)}
              />
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: hp(5),
              alignItems: "center",
            }}
          >
            <Text style={style.welcomeText2}>
              If i share my private key , my funds can get stolen
            </Text>
            <View style={{ marginLeft: 10 }}>
              <Switch
                value={Checked2}
                onValueChange={() => setCheckBox2(!Checked2)}
              />
            </View>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Text> </Text>
          )}

          <LinearGradient
            start={[1, 0]}
            end={[0, 1]}
            colors={
              Checked && Checked2
                ? ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"]
                : ["gray", "gray"]
            }
            style={style.PresssableBtn}
          >
            <TouchableOpacity
            style={{width:wp(30),alignItems:"center"}}
              disabled={loading ? true : Checked && Checked2 ? false : true}
              onPress={() => {
                setLoading(true);
                setTimeout(() => {
                  dispatch(Generate_Wallet2()).then((response) => {
                    if (response) {
                      if (response.status === "success") {
                        setLoading(false);

                        console.log(response.wallet);
                        const wallet = response.wallet;
                        setWallet(wallet);
                        setNewWalletPrivateKey(true);
                      } else {
                        setLoading(false);

                        alert(
                          "error",
                          "wallet generation failed. Please try again"
                        );
                      }
                    } else {
                      setLoading(false);

                      alert(
                        "error",
                        "Wallet creation failed . Please try again"
                      );
                    }
                  });
                }, 1);
              }}
            >
              <Text style={{ color: "white" }}>Continue</Text>
            </TouchableOpacity>
          </LinearGradient>
          </View>
          {/* <ModalHeader Function={closeModal} name={"Import"} /> */}
          
        </View>
        <NewWalletPrivateKey
          Wallet={Wallet}
          onCrossPress={()=>{setNewWalletPrivateKey(false)}}
          SetVisible={setNewWalletPrivateKey}
          Visible={newWalletPrivateKey}
          setModalVisible={setModalVisible}
          setNewWalletVisible={setVisible}
        />
      </Modal>
    </Animated.View>
  );
};

export default NewWalletModal;

const style = StyleSheet.create({
  Body: {
    backgroundColor: "#131E3A",
    paddingTop:hp(1),
    paddingBottom:hp(8),
    justifyContent: "center",
    borderRadius: hp(2),
    width: wp(94),
    // alignItems: "center",
    alignSelf:"center",
    textAlign: "center",
  },
  welcomeText: {
    color: "white",
    marginTop: hp(2),
  },
  welcomeText2: {
    fontSize: 15,
    fontWeight: "200",
    color: "white",
    marginTop: hp(1),
    width: wp(70),
  },
  Button: {
    marginTop: hp(10),
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
    width: wp("70"),
    paddingRight: wp("7"),
    backgroundColor: "white",
  },
  PresssableBtn: {
    backgroundColor: "#4CA6EA",
    padding: hp(1),
    width: wp(30),
    alignSelf: "center",
    paddingHorizontal: wp(3),
    borderRadius: hp(0.8),
    marginBottom: hp(2),
    marginTop:hp(3),
    alignItems: "center",
  },
  crossIcon:{
    alignSelf:"flex-end",
    padding:hp(1)
  }
});
