import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import title_icon from "../../../assets/title_icon.png";
import ReactNativePinView from "react-native-pin-view";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Platform } from "react-native";
import {
  setPlatform,
  setWalletType,
} from "../../components/Redux/actions/auth";
import Modal from "react-native-modal";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { decodeUserToken } from "../Auth/jwtHandler";
import { SendLoadingComponent } from "../../utilities/loadingComponent";
const LockAppModal = ({ pinViewVisible, setPinViewVisible }) => {
  const state = useSelector((state) => state);
  const [pin, setPin] = useState();
  const [status, setStatus] = useState("pinset");
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [loader, setLoader] = useState(false);
  const pinView = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(async () => {
    const Check = await AsyncStorage.getItem(`pin`);
    console.log(Check);
    if (Check) {
      setStatus("pinset");
    }
    console.log(Platform.OS);
    if (Platform.OS === "ios") {
      const platform = "ios";
      dispatch(setPlatform(platform)).then((response) => {
        console.log(response);
      });
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    Animated.timing(Spin, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length === 4) {
      setShowCompletedButton(true);
    } else {
      setShowCompletedButton(false);
    }
  }, [fadeAnim, enteredPin]);

  return (
    <Modal
      animationIn="fadeInUpBig"
      animationOut="fadeOutDownBig"
      animationInTiming={500}
      animationOutTiming={650}
      isVisible={pinViewVisible}
      useNativeDriver={true}
      statusBarTranslucent={true}
      onBackdropPress={() => setPinViewVisible(false)}
      onBackButtonPress={() => {
        setPinViewVisible(false);
      }}
    >
      <Animated.View // Special animatable View
        style={{ opacity: fadeAnim }}
      >
        <View style={style.Body}>
          <Animated.Image
            style={{
              width: wp("5"),
              height: hp("5"),
              padding: 30,
              marginTop: hp(2),
              transform: [{ rotate: SpinValue }],
            }}
            source={title_icon}
          />
          <Text style={style.welcomeText}> Hi,</Text>
          <Text style={style.welcomeText}>
            {" "}
            {status == "verify"
              ? "please re enter pin"
              : status === "pinset"
              ? "please enter your pin"
              : "Please create a pin"}
          </Text>
          <View style={{ marginTop: hp(10) }}>
            {loader ? <SendLoadingComponent /> : <View></View>}
            <ReactNativePinView
              inputSize={32}
              ref={pinView}
              pinLength={4}
              buttonSize={60}
              onValueChange={(value) => setEnteredPin(value)}
              buttonAreaStyle={{
                marginTop: 24,
              }}
              inputAreaStyle={{
                marginBottom: 24,
              }}
              inputViewEmptyStyle={{
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: "#FFF",
              }}
              inputViewFilledStyle={{
                backgroundColor: "#FFF",
              }}
              buttonViewStyle={{
                borderWidth: 1,
                borderColor: "#FFF",
              }}
              buttonTextStyle={{
                color: "#FFF",
              }}
              onButtonPress={async (key) => {
                if (key === "custom_left") {
                  pinView.current.clear();
                }
                if (key === "custom_right") {
                  const Pin = await AsyncStorage.getItem("pin");
                  setLoader(true);
                  if (JSON.parse(Pin) === enteredPin) {
                    navigation.goBack();
                  }
                }
              }}
              customLeftButton={
                showRemoveButton ? (
                  <Icon name={"ios-backspace"} size={36} color={"#FFF"} />
                ) : undefined
              }
              customRightButton={
                showCompletedButton ? (
                  <Icon
                    name={"ios-chevron-forward-circle"}
                    size={36}
                    color={"#FFF"}
                  />
                ) : undefined
              }
            />
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default LockAppModal;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "#131E3A",
    height: hp(95),
    width: wp(90),
    alignItems: "center",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "200",
    color: "white",
    marginTop: hp(5),
  },
  welcomeText2: {
    fontSize: 20,
    fontWeight: "200",
    color: "white",
    marginTop: hp(10),
  },
  Button: {
    marginTop: hp(20),
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
});
