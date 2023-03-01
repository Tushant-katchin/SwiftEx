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

function Nfts() {
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
      style={{ display: "flex", flexDirection: "column", marginTop: 5 }}
    >
      <View style={{ marginTop: hp(20), marginLeft: wp(25) }}>
        <Text style={styles.text}>Nfts will appear here</Text>
      </View>
      <View style={{ width: wp(30), marginTop: hp(10), marginLeft: wp(35) }}>
        <Button color="blue" title="receive"></Button>
      </View>
    </Animated.View>
  );
}

export default Nfts;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    height: 75,
  },
  chart: {
    height: 75,
  },
  text: {
    fontSize: 20,
    color: "black",
  },
  priceUp: {
    color: "rgb(0,153,51)",
  },
  priceDown: {
    color: "rgb(204,51,51)",
  },
});
