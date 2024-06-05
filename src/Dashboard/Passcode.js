import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import title_icon from "../../assets/title_icon.png";
// import title_icon from "../../assets/Pink.png"
import darkBlue from "../../assets/darkBlue.png";

import { Animated } from "react-native";
import ReactNativePinView from "react-native-pin-view";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { Platform } from "react-native";
import { setPlatform } from "../components/Redux/actions/auth";
import { useBiometrics } from "../biometrics/biometric";
import { useFocusEffect } from "@react-navigation/native";
import { alert } from "./reusables/Toasts";

const Passcode = (props) => {
  const [pin, setPin] = useState();
  const [status, setStatus] = useState("");
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const pinView = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const Screen = () => {
    return <View></View>;
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkBioMetric = async () => {
        const biometric = await AsyncStorage.getItem("Biometric");
        if (biometric === "SET") {
          useBiometrics(props.navigation);
          return;
        }
      };
      checkBioMetric();
    }, [])
  );
  useEffect(async () => {
    const Check = await AsyncStorage.getItem("pin");
    const biometric = await AsyncStorage.getItem("Biometric");
    if (biometric === "SET") {
      //useBiometrics(props.navigation);
    }

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
    if (enteredPin.length === 6) {
      setShowCompletedButton(true);
      if (status === "verify") {
        if (pin === enteredPin) {
          pinView.current.clearAll();
          props.navigation.navigate("Welcome");

          AsyncStorage.setItem("pin", JSON.stringify(pin));
        } else {
          
          pinView.current.clearAll();
          alert("error","password did not match. please try again");
          setStatus("");
        }
      } else if (status === "pinset") {
        const Pin = await AsyncStorage.getItem("pin");
        const user = await AsyncStorage.getItem("user");
        const wallets = await AsyncStorage.getItem(`${user}-wallets`);

        if (JSON.parse(Pin) === enteredPin) {
          console.log(Pin);
          console.log(user);
          console.log(wallets);
          if (user) {
            pinView.current.clearAll();
            props.navigation.navigate("HomeScreen");
          } else {
            pinView.current.clearAll();
            props.navigation.navigate("Welcome");
          }
        } else {
          pinView.current.clearAll();
          alert("error","Incorrect pin try again.");
        }
      } else {
        setPin(enteredPin);
        setStatus("verify");

        pinView.current.clearAll();
      }
    }
  }, [fadeAnim, enteredPin]);

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <View style={style.Body}>
         <Animated.Image
          style={{
            width: wp("20"),
            height: hp("15"),
            padding: 30,
            marginTop: hp(2),
            transform: [{ rotate: SpinValue }],
          }}
          source={darkBlue}
        /> 
        <Text style={style.welcomeText}> Hi,</Text>
        <Text style={style.welcomeText}>
          {" "}
          {status == "verify"
            ? "please re enter pin"
            : status === "pinset"
            ? "Please enter your pin"
            : "Please create a pin"}
        </Text>
        <View style={{ marginTop: hp(2) }}>
          <ReactNativePinView
            inputSize={23}
            ref={pinView}
            pinLength={6}
            buttonSize={60}
            // customLeftButtonViewStyle={{backgroundColor:'gray'}}
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
              borderColor: "#fff",
            }}
            inputViewFilledStyle={{
              backgroundColor: "#fff",
            }}
            // buttonViewStyle={{
            //   borderWidth: 1,
            //   borderColor: "#FFF",
            // }}
            buttonTextStyle={{
              color: "#fff",
            }}
            
            onButtonPress={async (key) => {
              if (key ===  "custom_right") {
                pinView.current.clear();
              }
              if (key === "custom_left") {
               
              }
              if (key === "three") {
                //alert("You can't use 3")
              }
            }}

            customLeftButton={
              
                <Icon
                  name={"finger-print"}
                  size={36}
                  color={"gray"}
                  onPress={async ()=>{
                    const biometric = await AsyncStorage.getItem("Biometric");
                    if (biometric === "SET") {
                      useBiometrics(props.navigation);
                    }else{
                      alert('error','Enable biometrics in your device settings.')
                    }
                
                  }}
                />
            
            }
            customRightButton={
              showRemoveButton ? (
                <Icon name={"ios-backspace"} size={36} color={"gray"} />
              ) : undefined
            }

          />
          <View style={style.textView}>
          <Text style={style.simpleText}>Passcode adds an extra layer of security</Text>
          <Text style={style.simpleText}>when using the app</Text>
          </View>
          
        </View>
      </View>
    </Animated.View>
  );
};

export default Passcode;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor:'#131E3A',
    height: hp(100),
    justifyContent: "center",
    width: wp(100),
    alignItems: "center",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "200",
    color: "#fff",
    marginTop: hp(2),
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
  textView:{
marginTop:"25%"
  },
  simpleText:{
    textAlign:"center",
    color:"#fff"
  }
});
