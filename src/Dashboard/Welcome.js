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
import { Animated } from "react-native";
import splash from "../../assets/splash.jpeg";
import Wallet1 from "../../assets/Wallet1.png";
import girlProfile from "../../assets/girlProfile.jpg";
import profile from "../../assets/profile.jpg";
import { LoginModal } from "./Modals/LoginModal";
import { SliderBox } from "react-native-image-slider-box";
import { Colors } from "react-native-paper";

const Welcome = (props) => {
  var Slider = {
    images: [Wallet1, profile, splash,girlProfile],
  };
  const [loginVisible, setLoginVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    Animated.timing(Spin, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, Spin]);

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <View style={style.Body}>
        {/* <Text style={style.welcomeText}> Hi,</Text> */}
        {/* <Text style={style.welcomeText}>  Welcome to Munzi Wallet app</Text> */}
        {/* <Animated.Image
          style={{
            width: wp("5"),
            height: hp("5"),
            padding: 30,
            transform: [{ rotate: SpinValue }],
          }}
          source={title_icon}
        /> */}

        {/* <View style={style.Button}>
    <Button title='CREATE A NEW WALLET' color={'green'} onPress={()=>{
      const wallet =''
      props.navigation.navigate('GenerateWallet')
    }} ></Button>
    </View> */}

        <View style={style.imageContainer}>
          <SliderBox
            images={Slider.images}
            autoplay={true}
            circleLoop={true}
            ImageComponentStyle={style.imageStyle}
          />
        </View>

        <TouchableOpacity
          style={style.createView}
          onPress={() => {
            const wallet = "";
            props.navigation.navigate("GenerateWallet");
          }}
        >
          <Text style={style.btnText}>CREATE A NEW WALLET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Import");
          }}
        >
          <Text style={style.Text}>I already have a wallet</Text>
        </TouchableOpacity>
      </View>
      <LoginModal
        loginVisible={loginVisible}
        setLoginVisible={setLoginVisible}
      />
    </Animated.View>
  );
};

export default Welcome;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "#131E3A",
    width: wp(100),
    height: hp(100),
    justifyContent:"center",
    alignItems: "center",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "200",
    color: "white",
  },
  welcomeText2: {
    fontWeight: "200",
    color: "white",
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
  privateText: {
    color: "#fff",
    fontSize: 22,
    marginTop: hp(8),
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
  createView: {
    width: "80%",
    borderRadius: 8,
    backgroundColor: "green",
    height: "6%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: hp(10),
  },
  imageContainer: {
    // width:hp(100),
    height: hp(30),
    justifyContent: "center",
  },
  imageStyle: {
    width: hp(20),
    height: hp(20),
  },
});

