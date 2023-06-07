import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
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

import Etherimage from "../../assets/ethereum.png";
import { Animated, LayoutAnimation, Platform, UIManager } from "react-native";
import IconWithCircle from "../Screens/iconwithCircle";
import Icon from "../icon";
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
    // <Animated.View
    //   style={{  marginTop: 5 ,backgroundColor:"#fff",height:hp(100)}} >
    //     <View style={styles.iconContainer}>
    //     <Icon name="bell-o"
    //     size={20}
    //    color="black"
    //     />
    //      <Icon name="bell-o"
    //     size={20}
    //    color="black"
    //     />

    //     </View>

    // </Animated.View>
    <View style={styles.mainContainer}>
      <View style={styles.iconContainer}>
        <Icon name="bell-o" size={20} color="black" />
        <Icon name="sliders" type={'fa'} size={20} color="black" />
      </View>
      <Text style={styles.dollarText}>$0.00</Text>
      <View style={styles.textwithIcon}>
        <Text style={styles.textColor}>Main Wallet 1</Text>
        <Icon
          name="caretdown"
          type={"antDesign"}
          size={16}
          style={{ marginHorizontal: hp(0.7) }}
          color="gray"
        />
      </View>
      <View style={styles.iconsContainer}>
        <IconWithCircle name={"arrowup"} type={"antDesign"} title={"Send"} />
        <IconWithCircle
          name={"arrowdown"}
          type={"antDesign"}
          title={"Receive"}
        />
        <IconWithCircle
          name={"credit-card-outline"}
          type={"materialCommunity"}
          title={"Buy"}
        />
        <IconWithCircle
          name={"swap-horizontal"}
          type={"ionicon"}
          title={"Swap"}
        />
      </View>
      <View style={styles.iconmainContainer}>
        <View style={styles.iconTextContainer}>
          <Icon name="graph" type={"simpleLine"} size={hp(3)} />
          <Text style={{ marginHorizontal: hp(1) }}>
            Your Portfolio insights
          </Text>
        </View>
        <View style={styles.iconTextContainer}>
        <View style={styles.numberContainer}>
        <Text style={styles.number}>3</Text>
      </View>
          <Icon name="cross" type={"entypo"} size={hp(3.6)} color="black" />
          
        </View>
      </View>
     
    </View>
  );
};

export default Nfts;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    height: hp(100),
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: hp(40),
    alignSelf: "center",
    marginTop: hp(3),
  },
  dollarText: {
    textAlign: "center",
    color: "black",
    fontSize: 30,
    marginTop: hp(3),
  },
  textwithIcon: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: hp(2),
  },
  textColor: {
    color: "gray",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp(5),
  },
  iconTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconmainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: hp(42),
    alignSelf: "center",
    marginTop: hp(5),
    height:hp(9),
    alignItems:"center",
    borderRadius:hp(2),
    padding:hp(2),
    backgroundColor:"#e8f0f8"
  },
  numberContainer:{
    backgroundColor:"#9bbfde",
    width:hp(4.3),
    height:hp(4.3),
    borderRadius:hp(10),
    justifyContent:"center",
    alignItems:"center",
  },
  number:{
    textAlign:"center",
    color:"#fff",
    backgroundColor:"#145DA0",
    paddingHorizontal:10,
    paddingVertical:4,
    borderRadius:hp(10)
  }
});
