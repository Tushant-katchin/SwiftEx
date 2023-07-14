import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
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
import { useSelector } from "react-redux";
import Etherimage from "../../assets/ethereum.png";
import { Animated, LayoutAnimation, Platform, UIManager } from "react-native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { getBnbPrice, getEthPrice } from "../utilities/utilities";

function InvestmentChart() {
  const state2 = useSelector((state) => state.walletBalance);

  const state = useSelector((state) => state);
  const wallet = useSelector((state) => state.wallet);
  const [bnbBalance, getBnbBalance] = useState(0);
  const [ethBalance, getEthBalance] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [bnbPrice, setBnbPrice] = useState(0);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const translation = useRef(new Animated.Value(0)).current;

  const getEthBnbPrice = async () => {
    await getEthPrice().then((response) => {
      setEthPrice(response.USD);
    });
    await getBnbPrice().then((response) => {
      setBnbPrice(response.USD);
    });
  };

  useEffect(async () => {
    const bal = await state.walletBalance;
    const EthBalance = await state.EthBalance;
    AsyncStorageLib.getItem("walletType").then((type) => {
      if (JSON.parse(type) === "Ethereum" || JSON.parse(type) === "BSC") {
        if (bal) {
          getBnbBalance(bal);
        } else {
          getBnbBalance(0.0);
        }
        if (EthBalance) {
          getEthBalance(EthBalance);
        } else {
          getEthBalance(0.0);
        }
      } else {
        getEthBalance(0.0);
        getBnbBalance(0.0);
      }
    });
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  useEffect(async () => {
    const bal = await state.walletBalance;
    const EthBalance = await state.EthBalance;
    AsyncStorageLib.getItem("walletType").then((type) => {
      if (JSON.parse(type) === "Ethereum") {
        if (EthBalance) {
          getEthBalance(Number(EthBalance).toFixed(5));
          getBnbBalance(0.0);
        } else {
          getEthBalance(0.0);
        }
      } else if (JSON.parse(type) === "BSC") {
        if (bal) {
          getBnbBalance(Number(bal).toFixed(5));
          getEthBalance(0.0);
        } else {
          getBnbBalance(0.0);
        }
      } else if (JSON.parse(type) === "Multi-coin") {
        if (EthBalance) {
          getEthBalance(Number(EthBalance).toFixed(5));
        } else {
          getEthBalance(0.0);
        }

        if (bal) {
          getBnbBalance(Number(bal).toFixed(5));
        } else {
          getBnbBalance(0.0);
        }
      } else {
        getEthBalance(0.0);
        getBnbBalance(0.0);
      }
    });
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [wallet.address]);

  useEffect(() => {
    getEthBnbPrice();
  }, []);

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
    <View>
      <View style={styles.flatlistContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
            }}
            style={styles.img}
          />
          <View style={styles.ethrumView}>
            <Text>BNB Coin</Text>
            <Text
              style={{
                color: "grey",
                fontWeight: "bold",
              }}
            >
              ${bnbPrice >= 0 ? bnbPrice : 300}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: "black",

            fontWeight: "bold",
          }}
        >
          {bnbBalance ? bnbBalance : 0} BNB
        </Text>
      </View>

      <View style={styles.flatlistContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={Etherimage} style={styles.img} />
          <View style={styles.ethrumView}>
            <Text>Ethereum</Text>
            <Text
              style={{
                color: "grey",
                fontWeight: "bold",
              }}
            >
              $ {ethPrice >= 0 ? ethPrice : 1300}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: "black",
            fontWeight: "bold",
          }}
        >
          {ethBalance ? ethBalance : 0} ETH
        </Text>
      </View>
    </View>
  );
}

export default InvestmentChart;

const styles = StyleSheet.create({
  flatlistContainer: {
    flexDirection: "row",
    marginVertical:hp(3),
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp(90),
    alignSelf: "center",
  },
  img: { height: hp(5), width: wp(10), borderWidth: 1, borderRadius: hp(3) },
  ethrumView: {
    marginHorizontal: wp(4),
  },
  view: {
    flex: 1,
    height: 75,
  },
  chart: {
    height: 75,
  },
  priceUp: {
    color: "rgb(0,153,51)",
  },
  priceDown: {
    color: "rgb(204,51,51)",
  },
});
