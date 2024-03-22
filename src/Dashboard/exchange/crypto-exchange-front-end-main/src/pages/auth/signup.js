import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import PhoneInput from "react-native-phone-number-input";
import { signup } from "../../api";
import { useSelector } from "react-redux";
import {alert} from '../../../../../reusables/Toasts'

export const ExchangeRegister = (props) => {
  const state = useSelector((state) => state);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showMessage, setShowMessage] = useState();
  const [message, setMessage] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [formContent, setFormContent] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: email,
    email: "",
    accountAddress: "",
    walletAddress: state.wallet ? state.wallet.address : "",
    password: "",
  });

  const phoneInput = useRef(null);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    setLoading(true);
    const { err } = await signup({
      ...formContent,
      phoneNumber: `${formContent.email}`,
    });
    setLoading(false);
    console.log(err)
    if (err.message === "Otp Send successfully") {
        navigation.navigate("exchangeLogin", {
        phoneNumber: formContent.email,
      });
    }
    if(err.message==="Email already registered")
    {
      alert("error","Email already registered");
    }
    if(err.message==="Wallet already registered")
    {
      alert("error","Wallet already registered");
    }
    
    if (err) {
      setShowMessage(true);
      return setMessage(err.message);
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <ScrollView>
          <View
            style={{
              display: "flex",
              // alignItems: "center",
              textAlign: "center",
              justifyContent: "space-evenly",
              marginTop: platform === "ios" ? hp(20) : hp("1"),
              color: "white",
            }}
          >
            <Text style={{ color: "#fff", marginBottom: 20, fontSize: 16,textAlign:"center",marginTop:hp(3) ,fontWeight:"700"}}>
              Create your exchange account
            </Text>



            <View style={styles.inp}>
                <Text style={styles.text}>First Name</Text>

              <TextInput
                style={styles.input}
                theme={{ colors: { text: "white" } }}
                value={formContent.firstName}
                placeholder={"Enter your first name"}
                onChangeText={(text) =>
                  setFormContent({ ...formContent, firstName: text })
                }
                autoCapitalize={"none"}
                placeholderTextColor="gray"
              />
            </View>



            <View style={styles.inp}>
                <Text style={styles.text}>Last name</Text>
              <TextInput
                placeholderTextColor="gray"
                style={styles.input}
                theme={{ colors: { text: "white" } }}
                value={formContent.lastName}
                placeholder={"Enter your last name"}
                onChangeText={(text) =>
                  setFormContent({ ...formContent, lastName: text })
                }
              />
            </View>
            {/* <View>
                <Text style={styles.text}>
                  Phone Number
                </Text>
              <PhoneInput
              containerStyle={{alignSelf:"center",marginTop:hp(2)}}
              textContainerStyle={{ paddingVertical: hp(1) }}
              textInputStyle={{ paddingVertical: hp(0.1) }}
                ref={phoneInput}
                defaultValue={value}
                defaultCode="IN"
                layout="first"
                onChangeText={(text) => {
                  setValue(text);
                }}
                onChangeFormattedText={(text) => {
                  setFormattedValue(text);
                  setFormContent({ ...formContent, phoneNumber: text });
                }}
                withDarkTheme
                withShadow
                autoFocus
              />
            </View> */}
            <View style={styles.inp}>
                <Text style={styles.text}>
                  Email address
                </Text>
              <TextInput
                placeholderTextColor="gray"
                style={styles.input}
                theme={{ colors: { text: "white" } }}
                value={formContent.email}
                placeholder={"Enter your email address"}
                onChangeText={(text) =>
                  setFormContent({ ...formContent, email: text })
                }
              />
            </View>
            <View style={styles.inp}>
                <Text style={styles.text}>
                  Wallet Address
                </Text>
              <TextInput
                placeholderTextColor="gray"
                style={styles.input}
                theme={{ colors: { text: "white" } }}
                value={formContent.walletAddress}
                placeholder={
                  state.wallet ? state.wallet.address : "Wallet address"
                }
                // disabled={true}
                onChangeText={(text) =>
                  setFormContent({ ...formContent, walletAddress: text })
                }
              />
            </View>
            {showMessage ? (
              <Text style={{ color: "white" }}>{message}</Text>
            ) : (
              <View></View>
            )}

              <LinearGradient
                colors={["#12c2e9", "#c471ed", "#f64f59"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  <Text style={styles.buttonText}>
                    {loading ? (
                      <View style={{display:'flex', alignContent:'center', alignItems:'center', alignSelf:'center', marginLeft:wp(70)}}>
                        <ActivityIndicator size="small" color="white" />
                      </View>
                    ) : (
                      "Create my account"
                    )}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            <View style={styles.lowerbox}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("exchangeLogin");
                }}
              >
                <Text style={styles.lowerboxtext}>
                  <Text style={{ color: "#78909c" }}>
                    Already have an account?
                  </Text>{" "}
                  login now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};
const styles = StyleSheet.create({
  input: {
    height: hp("5%"),
    marginBottom: hp("2"),
    color: "#fff",
    marginTop: hp("1"),
    width: wp("70"),
    paddingRight: wp("7"),
    backgroundColor: "#131E3A",
    borderRadius: wp("20"),
    marginLeft: wp("10"),
  },
  content: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-evenly",
    marginTop: hp("1"),
    color: "white",
  },
  inp: {
    marginTop: hp(3),
    color: "#FFF",
   
  },
  btn: {
    width: wp("80"),
    borderRadius: 380,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.8)",
    marginTop: hp(2),
  },
  icon: {
    display: "flex",
    flexDirection: "row",
    marginTop: hp("10"),
    marginLeft: wp("15"),
  },
  text: {
    color: "#FFFFFF",
    marginBottom: wp("5"),
    fontSize: hp("5"),
  },
  tinyLogo: {
    width: wp("5"),
    height: hp("5"),
    padding: 20,
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
    width:wp(80),
    paddingVertical:hp(1),
    alignSelf:"center",
    borderRadius:hp(1),
    marginTop:hp(2),
    paddingVertical:hp(1.5),
    marginBottom:hp(3)

  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    // fontSize: 24,
  },
  lowerbox: {
    marginTop: hp(11),
    height:hp(6),
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
  contentIos: {
    flex: 1,
    backgroundColor: "#131E3A",
    height: 10,
    color: "#fff",
  },
  text:{
    color:"white",
    marginHorizontal:wp(11),
    fontSize:16,
  }
});

/*import React, { useState } from 'react'
import { signup } from '../../api'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { LoadingButton } from '@mui/lab'

export const SignUpView = (props) => {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formContent, setFormContent] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    accountAddress: '',
    walletAddress: '',
    password: '',
  })

  const handleChange = (event, phone = null) => {
    const newState = { ...formContent }
    newState[event.target.name] = phone || event.target.value
    setFormContent(newState)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const { err } = await signup({
      ...formContent,
      phoneNumber: `+${formContent.phoneNumber}`,
    })
    setIsSubmitting(false)
    if (err) return setMessage(`${err.status}: ${err.message}`)
    window.location = `/login?phone=${formContent.phoneNumber}`
  }

  return (
    <>
      <h1 className="my-4">Sign Up Here</h1>
      <hr></hr>
      <p className="my-1">{message}</p>
      <div className="p-6 mt-5">
        <div className="mt-6 mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formContent.firstName}
            onChange={handleChange}
            className="form-control"
            aria-describedby="emailHelp"
          ></input>
        </div>
        <div className="mt-6 mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formContent.lastName}
            onChange={handleChange}
            className="form-control"
            aria-describedby="emailHelp"
          ></input>
        </div>
        <div className="mt-6 mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Phone Number
          </label>
          <PhoneInput
            country={'us'}
            inputProps={{ name: 'phoneNumber' }}
            countryCodeEditable={true}
            value={formContent.phoneNumber}
            onChange={(phone, data, event) => handleChange(event, phone)}
            placeholder="Enter your phone number"
            disabled={false}
          />
        </div>
        <div className="mt-6 mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formContent.email}
            onChange={handleChange}
            className="form-control"
            aria-describedby="emailHelp"
          ></input>
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mt-6 mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Wallet Address
          </label>
          <input
            type="text"
            name="walletAddress"
            value={formContent.walletAddress}
            onChange={handleChange}
            className="form-control"
            aria-describedby="emailHelp"
          ></input>
        </div>
        <LoadingButton
          onClick={handleSubmit}
          variant="contained"
          loading={isSubmitting}
        >
          Submit
        </LoadingButton>
        <div className="form-text">
          If you already have an account <a href="/">sign in here</a>
        </div>
      </div>
    </>
  )
}
*/
