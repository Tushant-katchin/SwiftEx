import { View, Text } from "react-native";
import React, { useEffect } from "react";
import styles from "./style";

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(async () => {
      navigation.navigate("Passcode");
    }, 3000);
  }, []);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.heading}>Splash....</Text>
      <Text style={styles.text}>Screen</Text>
    </View>
  );
};

export default SplashScreen;
