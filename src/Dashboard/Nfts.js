import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Button, Image, TouchableOpacity } from "react-native";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  CardItem,
  WebView,
} from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LineChart } from "react-native-svg-charts";
import { useDispatch, useSelector } from "react-redux";
import darkBlue from "../../assets/darkBlue.png"
import Etherimage from "../../assets/ethereum.png";
import monkey from "../../assets/monkey.png"
import wl from "../../assets/wl.jpg"
import { Animated, LayoutAnimation, Platform, UIManager } from "react-native";
// import profile from "../../assets/profile.jpg"
import { style } from "@mui/system";

const Nfts = () => {
  const state2 = useSelector((state) => state.walletBalance);

  const state = useSelector((state) => state);
  const [balance, getBalance] = useState(0);

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const translation = useRef(new Animated.Value(0)).current;

  useEffect(async () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    Animated.timing(translation, {
      toValue: 1,
      delay: 0.1,
      useNativeDriver: true,
    }).start();
    const bal = await state.walletBalance;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (bal) {
      getBalance(bal);
    }
  }, [state2]);

  let LeftContent = (props) => (
    <Avatar.Image
      {...props}
      source={{
        uri: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
      }}
    />
  );
  let LeftContent2 = (props) => <Avatar.Image {...props} source={Etherimage} />;

  return (
    <Animated.View
      style={styles.mainContainer}>
       
<Image source={monkey} style={styles.img}/>
<Text style={styles.text}>Collectibles will appear here</Text>
<TouchableOpacity style={styles.btnContainer}>
  <Text style={styles.btnText}>Receive</Text>
</TouchableOpacity>
    </Animated.View>
   
  );
};

export default Nfts;

const styles = StyleSheet.create({
  mainContainer:{
height:hp(100),
backgroundColor:"#fff"
  },
  img:{
    width:hp(10),
    height:hp(10),
    alignSelf:"center",
    marginTop:hp(10)
  },
  text:{
    marginTop:hp(2),
    textAlign:"center",
    fontSize:hp(2.6)
  },
  btnContainer:{
    marginTop:hp(2),
    alignSelf:"center",
    width:wp(30),
    padding:hp(2),
    backgroundColor:"#e8f0f8",
    borderRadius:hp(10)
  },
  btnText:{
    textAlign:"center"
  }
});
