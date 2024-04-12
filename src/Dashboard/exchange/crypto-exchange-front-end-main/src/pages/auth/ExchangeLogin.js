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
import { getAuth, login, saveToken, verifyLoginOtp } from "../../api";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import RNOtpVerify from "react-native-otp-verify";
import { alert } from "../../../../../reusables/Toasts";
import { ExchangeHeaderIcon } from "../../../../../header";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { REACT_APP_HOST } from "../../ExchangeConstants";

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
  const [Email, setEmail] = useState("");
  const [passcode_view, setpasscode_view] = useState(false);
  const [passcode, setpasscode] = useState("");
  const [con_passcode, setcon_passcode] = useState("");
  const [disable, setdisable] = useState(true);
  const [login_Passcode,setlogin_Passcode]=useState("");
  const [active_forgot,setactive_forgot]=useState(false);
  const [Loading_fog,setLoading_fog]=useState(false);
  const [lodaing_ver,setlodaing_ver]=useState(false);
  const navigation = useNavigation();
const FOCUSED=useIsFocused();
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

  // const submitPhoneNumber = async () => {
    // try {
    //   // if (!value) {
    //   //   return setMessage("phone number is required to proceed");
    //   // }

    //   console.log('formatted value', formattedValue);
    //   const { err } = await login({ email: `${Email}` });
    //   if (err) {
    //     return setMessage(err.message);
    //   }
    //   setMessage("OTP is sent");
    //   setIsOtpSent(true);
    // } catch (err) {
    //   console.log(err)
    //   setMessage(err.message);
    // } finally {
    //   setLoading(false);
    // }
  // };



  const submitPhoneNumber = async () => {
     if(!Email||!login_Passcode)
     {
      alert("error","Both fields are required");
      setEmail("");
      setlogin_Passcode("");
      setLoading(false)
     }
     else{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        "email": Email.toLowerCase(),
        "otp": login_Passcode
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
  
      fetch(REACT_APP_HOST+"/users/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if(result.message==="Invalid credintials"||result.statusCode===400)
          {
            alert("error","Invalid credintials");
            setEmail("");
            setlogin_Passcode("");
            setLoading(false);
          }
          else{
            saveToken(result.token);
            alert("success","Success");
            setLoading(false);
            setEmail("");
            setlogin_Passcode("");
            navigation.navigate("exchange");
          }

      })
        .catch((error) => {console.log(error)})
     }
  }

  const submitOtp = async () => {
    try {
      if (!otp) {
        alert("error","OTP is required");
        return setMessage("OTP is required");
      }
      const { err } = await verifyLoginOtp({
        email: `${Email.toLowerCase()}`,
        otp: otp,
      });
      if (err) {
        setMessage(err.message);
        alert("error","Worng OTP")
        setOtp(null);
      } else {
        setOtp(null);
        setIsOtpSent(false);
        setMessage("");
        setpasscode_view(true);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitpasscode = async () => {
    const token = await getAuth();
   const len=passcode.length;
   const len0=con_passcode.length;

    if (!passcode || !con_passcode) {
      setLoading(false);
      setcon_passcode("");
      setpasscode("");
      alert("error", "Both fields are required");
    }
    else {
      //  if(len>8||len0>8)
      //  {
        const result = passcode === con_passcode;
        if (result === true) {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", "Bearer " + token);
          const raw = JSON.stringify({
            "email": Email.toLowerCase(),
            "passcode": con_passcode
          });
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
  
          fetch(REACT_APP_HOST + "/users/updatePasscode", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              setLoading(false);
              if (result.success === true) {
                setpasscode_view(false);
                setpasscode("");
                setcon_passcode("");
                alert("success", "Exchange Account Ready.");
                setIsOtpSent(false);
                navigation.navigate("exchange");
              } else {
                setpasscode("");
               setcon_passcode("");
                alert("error", "Something went worng.");
              }
            })
            .catch((error) => {
              setLoading(false);
              console.error(error)
            });
        }
        else {
          setLoading(false);
          setpasscode("");
          setcon_passcode("");
          alert("error", "Password Not Match.");
        }
      //  }
      //  else{
      //   setLoading(false);
      //   setpasscode("");
      //   setcon_passcode("");
      //   alert("error","Password min length Eight.")
      //  }  
    }

  }

  const forgot_pass=()=>{
      setactive_forgot(true);
  }

  const get_otp_forget = async () => {
    setlodaing_ver(true);
    setLoading_fog(true);
    if (!Email) {
      setlodaing_ver(false);
       setLoading_fog(false);
      alert("error", "Email reqired.");
    } else {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          "email": Email.toLowerCase()
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        fetch(REACT_APP_HOST +"/users/forgot_passcode", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result.message === "Otp Send successfully") {
              setlodaing_ver(false);
              setLoading_fog(true);
              setEmail("");
              alert("success", "OTP sent in your mail.");
              setLoading_fog(false);
              navigation.navigate("exchangeLogin", {
                phoneNumber: Email,
              });
            }
            else {
              setlodaing_ver(false);
              setLoading_fog(true);
              setEmail("");
              setLoading_fog(false);
              alert("error", "User not found.");
            }
            console.log(result)
          })
          .catch((error) => console.error(error));
      } catch (err) {
        setLoading_fog(false);
         setLoading_fog(true);
        setMessage(err.message);
        setLoading_fog(false);
      } finally {
        setLoading_fog(false);
        setLoading_fog(true);
        setLoading(false);
        setLoading_fog(false);
      }
    }
    setLoading_fog(false);
  }

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
          setIsOtpSent(true);
          const phoneNumber = props.route.params.phoneNumber;
          if (phoneNumber) {
            setEmail(phoneNumber);
            console.log(Email);
            setIsOtpSent(true);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    setLoading(false);
    setactive_forgot(false);
    try {
      if (props.route.params) {
        if (props.route.params.phoneNumber) {
          console.log(props.route.params.phoneNumber);
          setIsOtpSent(true);
          const phoneNumber = props.route.params.phoneNumber;
          if (phoneNumber) {
            setEmail(phoneNumber);
            setIsOtpSent(true);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [FOCUSED]);

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
  }, [isOtpSent,FOCUSED]);
  const onChangepass = (input) => {
    const formattedInput = input.replace(/\s/g, '');
    setpasscode(formattedInput);
    // setcon_passcode
    // onChangeconpass
  };
  const onChangeconpass = (input) => {
    const formattedInput = input.replace(/\s/g, '');
    setcon_passcode(formattedInput);
  };
  return (
    <>
     {lodaing_ver==true?alert("success","Email Verifying...."):<></>}
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
                  {active_forgot===true?"Recover to your account":"Login to your account"}
                </Text>
                {/* <PhoneInput
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
                /> */}
                {/* <TouchableOpacity
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
                  > */}
                <TextInput textContentType="emailAddress" placeholder={"Email Adderss"} placeholderTextColor={"gray"} style={{ backgroundColor: "white", padding: 16, borderRadius: 5, fontSize: 16 }} value={Email} onChangeText={(text) => { setEmail(text) }} />
                {active_forgot===false?<TextInput placeholder={"Password"} placeholderTextColor={"gray"} style={{ backgroundColor: "white", padding: 16, borderRadius: 5, fontSize: 16,marginTop:19 }} value={login_Passcode} onChangeText={(text) => { setlogin_Passcode(text) }} secureTextEntry={true} />:<></>}                
                <TouchableOpacity
                  onPress={() => {
                    if (active_forgot === false) {
                      setLoading(true);
                      try {
                        setMessage("Your Mail is valid");
                        submitPhoneNumber();
                      } catch (e) {
                        setLoading(true);
                        console.log(e);
                        alert("error", e);
                      }
                      setShowMessage(true);
                      Keyboard.dismiss();
                    }
                    else{
                      get_otp_forget();
                    }
                  }}
                >

                  <LinearGradient
                    colors={["#12c2e9", "#c471ed", "#f64f59"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={{ color: "white" }}>{active_forgot===false?"Login":Loading_fog===false?"Verify":<ActivityIndicator color={"white"}/>}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                {/* {showMessage ? (
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
                )} */}
                <TouchableOpacity style={{alignSelf:"center",marginTop:15}} onPress={()=>{active_forgot===false?forgot_pass():[setactive_forgot(false),setEmail("")]}}>
                {active_forgot===false?<Text style={{color:"white"}}>Forgot Password</Text>:<Text style={{color:"white"}}>Login</Text>}
                </TouchableOpacity>
              </View>

              {loading ? (
                <View style={{ marginTop: 10 }}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              ) : (
                <Text> </Text>
              )}

              <View style={{
    marginTop: active_forgot===false?hp(15):hp(25),
    height: hp(6),
    width: 400,
    backgroundColor: "#003166",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  }}>
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
                Setup Exchange Account
              </Text>

              <View style={{ marginVertical: 3 }}>
                {passcode_view === false ? <><Text style={{ marginVertical: 15, color: "white" }}>Verification OTP</Text>
                  <TextInput
                    placeholderTextColor="gray"
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
                  /></> : <>{/* Set pass code  */}
                  <Text style={{ marginVertical: 15, color: "white" }}>Password</Text>
                  <TextInput
                  secureTextEntry={true}
                    placeholderTextColor="gray"
                    style={styles.input}
                    // theme={{ colors: { text: "white" } }}
                    value={passcode}
                    placeholder={"ABC@!123"}
                    onChangeText={(text) => {
                      onChangepass(text)
                    }}
                    autoCapitalize="none"
                    keyboardType="default"
                  />
                  {/* Set con-pass code  */}
                  <Text style={{ marginVertical: 15, color: "white" }}>Confirm Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    placeholderTextColor="gray"
                    style={styles.input}
                    // theme={{ colors: { text: "white" } }}
                    value={con_passcode}
                    placeholder={"ABC@!123"}
                    onChangeText={(text) => {
                      onChangeconpass(text);
                    }}
                    autoCapitalize="none"
                    keyboardType="default"
                  /></>}
               {passcode_view===false>0?<></>:passcode.length<8||con_passcode.length<8?<Text style={{color:"#B51E14",marginTop:6}}>Your password must be at least 8 characters long.</Text>:<></>}
              </View>
              {/* <View style={{ marginTop: 10 }}>
                {showMessage ? (
                  <Text style={{ color: "white" }}>{Message}</Text>
                ) : (
                  <Text></Text>
                )}
              </View> */}

              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text> </Text>
              )}

<TouchableOpacity
  disabled={passcode_view===false?false:passcode.length<8||con_passcode.length<8?true:false}
  onPress={() => {
    setLoading("true");
    { passcode_view === false ? submitOtp() : submitpasscode() }
    Keyboard.dismiss()
  }}
>
              <LinearGradient
                colors={["#12c2e9", "#c471ed"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 1 }}
                style={styles.verifyBtn}
              >
                  <Text style={styles.buttonText}>Verify</Text>
              </LinearGradient>
                </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => { navigation.navigate("exchangeLogin") }}> */}
              <TouchableOpacity onPress={() => { navigation.goBack() }}>
                <Text style={{ marginTop: 14, color: "gray" }}>Edit Email Id</Text>
              </TouchableOpacity>
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

