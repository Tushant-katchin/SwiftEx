import React, { useState, useEffect, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Image, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
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
import { useDispatch, useSelector } from "react-redux";
import Etherimage from "../../assets/ethereum.png";
import { Animated, LayoutAnimation, Platform, UIManager } from "react-native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { getBnbPrice, getEthPrice, getXLMPrice } from "../utilities/utilities";
import Maticimage from "../../assets/matic.png";
import Xrpimage from "../../assets/xrp.png";
import stellar from "../../assets/Stellar_(XLM).png"
import bnbimage from "../../assets/bnb-icon2_2x.png";
import { GetBalance, getAllBalances } from "../utilities/web3utilities";
import { getXrpBalance } from "../components/Redux/actions/auth";
import alert from "./reusables/Toasts";
const StellarSdk = require('stellar-sdk');

function InvestmentChart(setCurrentWallet) {
  const state = useSelector((state) => state);
  const [pull, setPull] = useState(false)
  const wallet = useSelector((state) => state.wallet);
  const [bnbBalance, getBnbBalance] = useState(0.00);
  const [xrpBalance, GetXrpBalance] = useState(0.00);
  const [maticBalance, getMaticBalance] = useState(0.00);
  const [ethBalance, getEthBalance] = useState(0.00);
  const [xmlBalance, setxmlBalance] = useState(0.00);
  const [current_xlm, setcurrent_xlm] = useState(0.00)
  const EthBalance = useSelector((state) => state.EthBalance);
  const XrpBalance = useSelector((state) => state.XrpBalance);
  const walletState = useSelector((state) => state.wallets);
  const type = useSelector((state) => state.walletType);
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [ethPrice, setEthPrice] = useState();
  const [bnbPrice, setBnbPrice] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const getEthBnbPrice = async () => {
    await getEthPrice().then((response) => {
      setEthPrice(response.USD);
    });
    await getBnbPrice().then((response) => {
      setBnbPrice(response.USD);
    });
    await getXLMPrice().then((response) => {
      setcurrent_xlm(response.USD);
    });
  };
  const getData = async () => {
    try {
      const storedData = await AsyncStorageLib.getItem('myDataKey');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved data:', parsedData);
        const publicKey = parsedData.key1;
        const secretKey = parsedData.key2;
        setPublicKey(publicKey);
        setSecretKey(secretKey);
      } else {
        console.log('No data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };


  const getTokenBalance = async () => {
    const bal = await state.walletBalance;
    const EthBalance = await state.EthBalance;
    const xrpBalance = await state.XrpBalance;
    const maticBalance = await state.MaticBalance;
    const wallet = await state.wallet
    console.log('wall', wallet.address)
    AsyncStorageLib.getItem("walletType").then(async (type) => {

      console.log(JSON.parse(type))
      if (JSON.parse(type) === "Ethereum") {
        if (EthBalance) {
          getEthBalance(Number(EthBalance).toFixed(2));
          getBnbBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        } else {
          getEthBalance(0.00);
          getBnbBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        }
      } else if (JSON.parse(type) === "BSC") {
        // provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC)
        // const balance = provider.getBalance(address)
        // console.log('balance',balance)
        if (bal) {
          getBnbBalance(Number(bal).toFixed(2));
          getEthBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        } else {
          getBnbBalance(0.00);
          getEthBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        }
      } else if (JSON.parse(type) === "Xrp") {
        console.log('fetching')
        // provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC)
        // const balance = provider.getBalance(address)
        // console.log('balance',balance)
        if (xrpBalance) {
          dispatch(getXrpBalance(wallet.address))
          GetXrpBalance(xrpBalance)
          getBnbBalance(0.00);
          getEthBalance(0.00);
          getMaticBalance(0.00);
        } else {
          getBnbBalance(0.00);
          getEthBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        }
      } else if (JSON.parse(type) === "Multi-coin") {
        // provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC)
        // const balance = await provider.getBalance(address)
        // console.log('balances=',balance)
        if (
          EthBalance >= 0
        ) {
          getEthBalance(Number(EthBalance).toFixed(2));

        } else {
          getEthBalance(0.00);
        }
        if (bal >= 0) {
          console.log('bal', bal)
          getBnbBalance(Number(bal).toFixed(2));
        } else {
          getBnbBalance(0.00);
        }
        if (xrpBalance >= 0) {
          try {

            dispatch(getXrpBalance(wallet.xrp.address))
          } catch (e) {
            console.log(e)
          }

          GetXrpBalance(Number(xrpBalance).toFixed(2));



        } else {
          GetXrpBalance(0.00);
        }
        if (maticBalance >= 0) {
          getMaticBalance(Number(maticBalance).toFixed(2));
        } else {
          getMaticBalance(0.00);
        }
      } else {
        getEthBalance(0.00);
        getBnbBalance(0.00);
        getMaticBalance(0.00);
        GetXrpBalance(0.00);
      }
      setPull(false)
    });
  }

  useEffect(async () => {
    try {
      await getData();
      await getTokenBalance()
      getEthBnbPrice();
      // get_stellar();

    } catch (e) {
      console.log(e)
    }
  }, []);

  useEffect(async () => {
    try {

      getTokenBalance();
    } catch (e) {
      console.log(e)
    }
    // await GetBalance(await state)
  }, [wallet.address, wallet.name, EthBalance, bnbBalance, XrpBalance, state.walletBalance, state.EthBalance, state.XrpBalance, state.MaticBalance]);

  let LeftContent = (props) => (
    <Avatar.Image
      {...props}
      source={{
        uri: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
      }}
    />
  );
  let LeftContent2 = (props) => <Avatar.Image {...props} source={Etherimage} />;

  const get_stellar = async () => {
    // const publicKey="GCW6DBA7KLB5HZEJEQ2F5F552SLQ66KZFKEPPIPI3OF7XNLIAGCP6JER";
    try {
      console.log("<><", publicKey)

      StellarSdk.Network.useTestNetwork();
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
      server.loadAccount(publicKey)
        .then(account => {
          console.log('Balances for account:', publicKey);
          account.balances.forEach(balance => {
            console.log(`${balance.asset_type}: ${balance.balance}`);
            setxmlBalance(balance.balance)
          });
        })
        .catch(error => {
          console.log('Error loading account:', error);
          alert("error", "Need to fund amount.")
        });
    } catch (error) {
      console.log("Error in get_stellar")
    }
  }
  getData();
  get_stellar()

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={pull}
          onRefresh={() => {
            setPull(true);
            getTokenBalance();
          }}
        />
      }

      nestedScrollEnabled={true} contentContainerStyle={{ paddingBottom: hp(60) }} sp>
      <TouchableOpacity style={styles.refresh} onPress={() => {
        getAllBalances(state, dispatch)
      }}>
        <Text style={{ color: "white", fontSize: 14 }}>Refresh</Text>
      </TouchableOpacity>
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
              $ {4}
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
              $ {0.78}
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

      <View style={styles.flatlistContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={stellar} style={styles.img} />
          <View style={styles.ethrumView}>
            <Text>XLM</Text>
            <Text
              style={{
                color: "grey",
                fontWeight: "bold",
              }}
            >
              $ {current_xlm}
            </Text>
          </View>
        </View>

        {/* <Text
            style={{
              color: "black",
              fontWeight: "bold",
            }}
          >
            {xmlBalance ? xmlBalance : "0.00"} XLM 
          </Text> */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: "6.9%", marginLeft: '46%' }}>
          <Text style={{ alignSelf: 'flex-end', color: "black", fontWeight: "bold" }}>
            {xmlBalance ? xmlBalance : "0.00"}
          </Text>
        </ScrollView>
        <Text style={{ color: "black", fontWeight: "bold" }}> XLM</Text>
      </View>

    </ScrollView>
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
  refresh: { backgroundColor: "#4CA6EA", width: wp(20), paddingVertical: hp(1), marginTop: hp(1.9), marginLeft: wp(5), alignItems: "center", borderRadius: hp(1) }
});
