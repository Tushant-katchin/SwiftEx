import { ImageBackground } from "react-native";
import React, { useEffect } from "react";
import splashImg from "../../../assets/splashImg.png"
import styles from "./style";

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(async () => {
      navigation.navigate("HomeScreen");
    }, 3000);
  }, []);
  return (
    <ImageBackground source={splashImg} style={styles.mainContainer}>

    </ImageBackground>
  );
};

export default SplashScreen;
