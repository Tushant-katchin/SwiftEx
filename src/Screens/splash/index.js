import { ImageBackground, Text } from "react-native";
import React, { useEffect } from "react";
// import splashImg from "../../../assets/splashImg.png";
import splashImg from "../../../assets/splashImg.gif";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from "./style";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.navigate("Passcode");
    // setTimeout(async () => {
    //   navigation.navigate("Passcode");
    // }, 3000);
  }, []);
  return (
    <ImageBackground source={splashImg} style={styles.mainContainer}>
      <Text style={{ marginTop: hp(35), color: "white",fontSize:16.5,fontWeight:"bold" }}>
        Security, Control, Confidence
      </Text>
    </ImageBackground>
  );
};

export default SplashScreen;
