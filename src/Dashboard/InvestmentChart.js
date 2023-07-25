import React, { useState, useEffect, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
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
import Maticimage from "../../assets/matic.png";
import Xrpimage from "../../assets/xrp.png";
import bnbimage from "../../assets/bnb-icon2_2x.png";

function InvestmentChart(setCurrentWallet) {
  const state = useSelector((state) => state);
  const wallet = useSelector((state) => state.wallet);
  const [bnbBalance, getBnbBalance] = useState(0.00);
  const [xrpBalance, getXrpBalance] = useState(0.00);
  const [maticBalance, getMaticBalance] = useState(0.00);
  const [ethBalance, getEthBalance] = useState(0.00);
  const [ethPrice, setEthPrice] = useState();
  const [bnbPrice, setBnbPrice] = useState();
  const [loading, setLoading] = useState(false);

  const getEthBnbPrice = async () => {
    await getEthPrice().then((response) => {
      setEthPrice(response.USD);
    });
    await getBnbPrice().then((response) => {
      setBnbPrice(response.USD);
    });
  };

  const getTokenBalance =  async() => {
    const bal = await state.walletBalance;
    const EthBalance = await state.EthBalance;
    const xrpBalance = await state.XrpBalance;
    const maticBalance = await state.MaticBalance;
    AsyncStorageLib.getItem("walletType").then(async (type) => {
      console.log(JSON.parse(type))
      if (JSON.parse(type) === "Ethereum") {
        if (EthBalance) {
          getEthBalance(Number(EthBalance).toFixed(2));
          getBnbBalance(0.00);
          getMaticBalance(0.00);
          getXrpBalance(0.00);
        } else {
          getEthBalance(0.00);
          getBnbBalance(0.00);
          getMaticBalance(0.00);
          getXrpBalance(0.00);
        }
      } else if (JSON.parse(type) === "BSC") {
        // provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC)
        // const balance = provider.getBalance(address)
        // console.log('balance',balance)
        if (bal) {
          getBnbBalance(Number(bal).toFixed(2));
          getEthBalance(0.00);
          getMaticBalance(0.00);
          getXrpBalance(0.00);
        } else {
          getBnbBalance(0.00);
          getEthBalance(0.00);
          getMaticBalance(0.00);
          getXrpBalance(0.00);
        }
      } else if (JSON.parse(type) === "Multi-coin") {
        // provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC)
        // const balance = await provider.getBalance(address)
        // console.log('balances=',balance)
        if (
          EthBalance >=0
        ) {
          getEthBalance(Number(EthBalance).toFixed(2));
         
        } else {
          getEthBalance(0.00);
        }

        if (bal>=0) {
          console.log('bal',bal)
          getBnbBalance(Number(bal).toFixed(2));
        } else {
          getBnbBalance(0.00);
        }
        if (xrpBalance>=0) {
         getXrpBalance(Number(xrpBalance).toFixed(2));
          
          } else {
          getXrpBalance(0.00);
        }
        if (maticBalance>=0) {
         getMaticBalance(Number(maticBalance).toFixed(2));
        } else {
          getMaticBalance(0.00);
        }
      } else {
        getEthBalance(0.00);
        getBnbBalance(0.00);
        getMaticBalance(0.00);
        getXrpBalance(0.00);
      }
    });
  }

  useEffect(async () => {
    await getTokenBalance()
    getEthBnbPrice();
  }, []);

  useEffect(async () => {
   await getTokenBalance();
  }, [wallet.address]);

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
      <ScrollView>
        <View style={styles.flatlistContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={bnbimage} style={styles.img} />
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
        <View style={styles.flatlistContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={Maticimage} style={styles.img} />
            <View style={styles.ethrumView}>
              <Text>Matic</Text>
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
            {maticBalance ? maticBalance : 0} MAT
          </Text>
        </View>
        <View style={styles.flatlistContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={Xrpimage} style={styles.img} />
            <View style={styles.ethrumView}>
              <Text>XRP</Text>
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
            {xrpBalance ? xrpBalance : 0} XRP
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default InvestmentChart;

const styles = StyleSheet.create({
  flatlistContainer: {
    flexDirection: "row",
    marginVertical: hp(3),
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp(90),
    alignSelf: "center",
    marginBottom: 0,
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
