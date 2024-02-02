import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
  DeviceEventEmitter,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button, ActivityIndicator, Image, Platform } from "react-native";
import title_icon from "../../../../../../../assets/title_icon.png";
import darkBlue from "../../../../../../../assets/darkBlue.png";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import PhoneInput from "react-native-phone-number-input";
import { login, verifyLoginOtp } from "../../api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import RNOtpVerify from "react-native-otp-verify";
import { alert } from "../../../../../reusables/Toasts";
import { ExchangeHeaderIcon } from "../../../../../header";

export const ExchangeLogin = (props) => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [Message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const otpHandler = (message) => {
    try {
      if (message) {
        console.log("the message is : ", message);
        let otp = /(\d{6})/g.exec(message)[1];
        setOtp(otp);
        console.log(otp);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeListener = () => {
    if (Platform.OS === "android") {
      RNOtpVerify.removeListener();
      console.log("removed listener");
    }
  };

  const submitPhoneNumber = async () => {
    try {
      if (!value) {
        return setMessage("phone number is required to proceed");
      }

      console.log('formatted value',formattedValue);
      const { err } = await login({ phoneNumber: `${formattedValue}` });
      if (err) {
        return setMessage(err.message);
      }

      setMessage("OTP is sent");
      setIsOtpSent(true);
    } catch (err) {
      console.log(err)
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async () => {
    try {
      if (!otp) {
        return setMessage("OTP is required");
      }

      const { err } = await verifyLoginOtp({
        phoneNumber: `${formattedValue}`,
        otp: otp,
      });
      if (err) {
        setMessage(err.message);
        setOtp(null);
      } else {
        setIsOtpSent(false);
        setMessage("");
        navigation.navigate("exchange");
        alert("success", "success");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  useFocusEffect(() => {
    console.log("focus changed");
    try {
      if (props.route.params) {
        if (props.route.params.phoneNumber) {
          console.log(props.route.params.phoneNumber);
          setIsOtpSent(true);
          const phoneNumber = props.route.params.phoneNumber;
          if (phoneNumber) {
            setFormattedValue(phoneNumber);
            setIsOtpSent(true);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    try {
      if (props.route.params) {
        if (props.route.params.phoneNumber) {
          console.log(props.route.params.phoneNumber);
          setIsOtpSent(true);
          const phoneNumber = props.route.params.phoneNumber;
          if (phoneNumber) {
            setFormattedValue(phoneNumber);
            setIsOtpSent(true);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      if (isOtpSent) {
        try {
          RNOtpVerify.getOtp()
            .then((p) => RNOtpVerify.addListener(otpHandler))
            .catch((error) => {
              console.log(error);
            });
        } catch (e) {
          console.log(e);
        }
      }
    }

    return () => removeListener();
  }, [isOtpSent]);

  return (
    <>
    <ExchangeHeaderIcon title="Exchange " isLogOut={false} />
      <SafeAreaView style={styles.container}>
        <View
          // style={styles.container}
          onStartShouldSetResponder={() => Keyboard.dismiss()}
        >
          {isOtpSent === false ? (
            <View style={styles.content}>
              <View style={{ marginTop: hp(3), borderRadius: hp(2) }}>
                <Image style={styles.tinyLogo} source={darkBlue} />

                <Text style={styles.text}>Welcome Back!</Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    textAlign: "center",
                    marginTop: hp(1),
                    marginBottom: hp(3),
                  }}
                >
                  Login to your account
                </Text>
                <PhoneInput
                  textContainerStyle={{ paddingVertical: hp(1) }}
                  textInputStyle={{ paddingVertical: hp(0.1) }}
                  ref={phoneInput}
                  defaultValue={value}
                  defaultCode="IN"
                  layout="first"
                  autoFocus={false}
                  onChangeText={(text) => {
                    setValue(text);
                  }}
                  onChangeFormattedText={(text) => {
                    setFormattedValue(text);
                  }}
                  withDarkTheme
                  withShadow
                />
                  <TouchableOpacity
                    onPress={() => {
                      setLoading(true);
                      const checkValid =
                        phoneInput.current?.isValidNumber(value);
                      console.log(checkValid);
                      if (checkValid) {
                        try {
                          setMessage("Your number is valid");
                          submitPhoneNumber();
                        } catch (e) {
                          console.log(e);
                          alert("error", e);
                        }
                      } else {
                        setMessage("Your number is invalid");
                        setLoading(false);
                      }
                      setShowMessage(true);
                      setValid(checkValid ? checkValid : false);
                      console.log(checkValid);
                      Keyboard.dismiss();
                    }}
                  >
                <LinearGradient
                  colors={["#12c2e9", "#c471ed", "#f64f59"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.button}
                >
                    <Text style={{ color: "white" }}>Login</Text>
                </LinearGradient>
                  </TouchableOpacity>
                {showMessage ? (
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginTop: hp(2),
                    }}
                  >
                    {Message}
                  </Text>
                ) : (
                  <Text></Text>
                )}
              </View>

              {loading ? (
                <View style={{ marginTop: 10 }}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              ) : (
                <Text> </Text>
              )}

              <View style={styles.lowerbox}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("exchangeRegister");
                  }}
                >
                  <Text style={styles.lowerboxtext}>
                    <Text style={{ color: "#78909c" }}>
                      Don't have an account?
                    </Text>{" "}
                    Register now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              <View>
                <Image style={styles.tinyLogo} source={darkBlue} />
              </View>

              <Text
                style={{ color: "#FFFFFF", marginBottom: 20, fontSize: 16 }}
              >
                Please Enter the OTP
              </Text>
              <View style={styles.inp}>
                <TextInput
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  theme={{ colors: { text: "white" } }}
                  value={otp}
                  placeholder={"OTP"}
                  onChangeText={(text) => {
                    console.log(text);
                    setOtp(text);
                  }}
                  autoComplete={"sms-otp"}
                  textContentType={"oneTimeCode"}
                  keyboardType={"number-pad"}
                  maxLength={6}
                />
              </View>

              <View style={{ marginTop: 10 }}>
                {showMessage ? (
                  <Text style={{ color: "white" }}>{Message}</Text>
                ) : (
                  <Text></Text>
                )}
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text> </Text>
              )}

              <LinearGradient
                colors={["#12c2e9", "#c471ed"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 1 }}
                style={styles.verifyBtn}
              >
                <TouchableOpacity
                  onPress={() => {
                    setLoading("true");
                    submitOtp();
                    Keyboard.dismiss()
                  }}
                >
                  <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
              </LinearGradient>
              <Text style={{marginTop:10,color:"gray"}} onPress={()=>{navigation.navigate("exchangeLogin")}}>Edit Phone Number</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: hp(1),
    paddingLeft: wp(7),
    color: "#fff",
    width: wp("84"),
    borderRadius: hp(1),
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: "gray",
  },
  content: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-evenly",
    // marginTop: hp("10"),
    color: "white",
  },

  btn: {
    marginTop: hp("10"),
    width: wp("80"),
    borderRadius: 380,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  icon: {
    display: "flex",
    flexDirection: "row",
    marginTop: hp("10"),
    marginLeft: wp("15"),
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    // paddingVertical: 10,
    textAlign: "center",
  },
  tinyLogo: {
    width: wp("13"),
    height: hp("13"),
    marginTop: hp(5),
    alignSelf: "center",
  },
  icon: {
    display: "flex",
    flexDirection: "row",
    marginTop: hp("2"),
    marginLeft: wp("4"),
  },
  icon2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp("5"),
    paddingLeft: wp("2"),
  },
  button: {
    marginTop: hp(10),
    width: wp(80),
    borderRadius: hp(1),
    paddingVertical: hp(1.5),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  lowerbox: {
    marginTop: hp(33),
    height: hp(6),
    width: 400,
    backgroundColor: "#003166",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  lowerboxtext: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#131E3A",
    height: 10,
    color: "#fff",
  },
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 300,
    height: 55,
    marginVertical: 20,
    borderColor: "red",
    borderWidth: 1,
  },
  verifyBtn: {
    backgroundColor: "red",
    width: wp(85),
    paddingVertical: hp(1),
    borderRadius: hp(1),
    marginTop: hp(10),
  },
});
