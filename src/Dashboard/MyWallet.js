import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  AppState,
  ActivityIndicator,
} from "react-native";
import MyHeader from "./MyHeader";
import MyHeader2 from "./MyHeader2";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { tokenAddresses, urls } from "./constants";
import Etherimage from "../../assets/ethereum.png";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  CardItem,
  WebView,
} from "react-native-paper";
import {
  getEthBalance,
  getMaticBalance,
  getBalance,
} from "../components/Redux/actions/auth";
import {
  getBnbPrice,
  getEtherBnbPrice,
  getEthPrice,
} from "../utilities/utilities";
import { LinearGradient } from "expo-linear-gradient";
const { StorageAccessFramework } = FileSystem;

const MyWallet = (props) => {
  const state = useSelector((state) => state);
  const User = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [extended, setExtended] = useState(false);
  const [loading, setLoading] = useState();
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [bnbPrice, setBnbPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  let LeftContent = (props) => (
    <Avatar.Image
      {...props}
      source={{
        uri: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
      }}
    />
  );
  let LeftContent2 = (props) => <Avatar.Image {...props} source={Etherimage} />;

  const getBalanceInUsd = (ethBalance, bnbBalance) => {
    const ethInUsd = ethBalance * ethPrice;
    const bnbInUsd = bnbBalance * bnbPrice;
    console.log(ethInUsd);
    console.log(bnbInUsd);
    const totalBalance = ethInUsd + bnbInUsd;
    console.log(totalBalance);
    setBalance(totalBalance.toFixed(1));
    setLoading(false);
  };

  const getEthBnbBalance = async () => {
    const address = await state.wallet.address;
    console.log(address);
    if (address) {
      //setLoading(true)
      dispatch(getEthBalance(address))
        .then(async (e) => {
          const Eth = await e.EthBalance;
          let bal = await AsyncStorageLib.getItem("EthBalance");

          if (Eth) {
            setEthBalance(Number(Eth).toFixed(4));
            setLoading(false);
          } else {
            console.log("coudnt get balance");
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log(e);
          //setLoading(false)
        });
      dispatch(getBalance(address))
        .then(async () => {
          const bal = await state.walletBalance;
          console.log("My" + bal);
          if (bal) {
            setBnbBalance(Number(bal).toFixed(4));
            setLoading(false);
          } else {
            setBnbBalance(0);
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  };

  const getEthBnbPrice = async () => {
    const user = await AsyncStorageLib.getItem("user");
    setUser(user);
    setLoading(true);

    /* await getEtherBnbPrice(tokenAddresses.ETH, tokenAddresses.BNB)
    .then((resp) => {
      console.log(resp);
      setEthPrice(resp.Ethprice);
      setBnbPrice(resp.Bnbprice);
    })
    .catch((e) => {
      console.log(e);
    });*/
    await getEthPrice().then((response) => {
      setEthPrice(response.USD);
    });
    await getBnbPrice().then((response) => {
      setBnbPrice(response.USD);
    });
  };

  useEffect(() => {
    setLoading(true);
    //getEthBalance()
    getEthBnbPrice();
    getEthBnbBalance();
    getBalanceInUsd(ethBalance, bnbBalance);
    setLoading(false);
  }, [ethBalance, bnbBalance]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Hi,{user}</Text>
        <Text style={styles.text3}>
          ${" "}
          {loading ? <ActivityIndicator size="large" color="green" /> : balance}
        </Text>
        <Text style={styles.text3}> Wallet Address</Text>

        <Text selectable={true} style={styles.text2}>
          {state.wallet.address
            ? state.wallet.address
            : "You dont have any wallet yet"}
        </Text>

        {/* <View style={{ width: wp("50"), marginTop: 10 }}>
          <Button
            title="My Tokens"
            color={"grey"}
            onPress={() => {
              // setModalVisible2(true)
            }}
          ></Button>
        </View> */}
        <LinearGradient
          start={[1, 0]}
          end={[0, 1]}
          colors={["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"]}
          style={styles.PresssableBtn}
        >
          <TouchableOpacity
            onPress={() => {
              // setModalVisible2(true)
            }}
          >
            <Text style={{ color: "white" }}>Create wallet</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View
          style={{ display: "flex", flexDirection: "column", marginTop: 5 }}
        >
          <Card
            style={{
              height: hp(10),
              width: wp(86),
              alignSelf: "center",
              backgroundColor: "white",
              borderRadius: 10,
              marginLeft: 5,
              marginTop: hp(2),
            }}
          >
            <Card.Title
              titleStyle={{ color: "black", fontSize: 15, marginBottom: 23 }}
              title={"BNB Coin"}
              left={LeftContent}
            />
            <Card.Content
              style={{ display: "flex", flexDirection: "row", color: "black" }}
            >
              <Title style={{ color: "black" }}></Title>
              <Paragraph
                style={{
                  color: "black",
                  marginLeft: wp("50"),
                  fontWeight: "bold",
                  top: -50,
                  left: 50,
                }}
              >
                {loading ? (
                  <ActivityIndicator size="large" color="green" />
                ) : bnbBalance ? (
                  bnbBalance
                ) : (
                  0
                )}{" "}
                BNB
              </Paragraph>
              <Paragraph
                style={{
                  color: "red",
                  position: "absolute",
                  marginLeft: wp("20"),
                  fontWeight: "bold",
                  top: -39,
                }}
              >
                {bnbPrice ? bnbPrice.toFixed(1) : 0}
              </Paragraph>
            </Card.Content>
          </Card>

          <Card
            style={{
              width: wp(86),
              alignSelf: "center",
              height: hp(10),
              backgroundColor: "white",
              borderRadius: 10,
              marginLeft: 5,
              marginTop: hp(2),
            }}
          >
            <Card.Title
              titleStyle={{ color: "black", fontSize: 15, marginBottom: 23 }}
              title={"Ethereum"}
              left={LeftContent2}
            />
            <Card.Content
              style={{ display: "flex", flexDirection: "row", color: "black" }}
            >
              <Title style={{ color: "black" }}></Title>
              <Paragraph
                style={{
                  color: "black",
                  marginLeft: wp("50"),
                  fontWeight: "bold",
                  top: -50,
                  left: 50,
                }}
              >
                {loading ? (
                  <ActivityIndicator size="large" color="green" />
                ) : ethBalance ? (
                  ethBalance
                ) : (
                  0
                )}{" "}
                ETH
              </Paragraph>
              <Paragraph
                style={{
                  color: "red",
                  position: "absolute",
                  marginLeft: wp("20"),
                  fontWeight: "bold",
                  top: -39,
                }}
              >
                {ethPrice ? ethPrice : 0}
              </Paragraph>
            </Card.Content>
          </Card>
        </View>
      </View>
    </View>
  );
};

export default MyWallet;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    height: hp("10"),
    justifyContent: "center",
    color: "white",
  },
  text: {
    color: "white",
    fontSize: hp("3"),
    fontWeight: "bold",
    marginTop: hp(2),
  },
  text3: {
    color: "white",
    fontSize: hp("3"),
    fontWeight: "bold",
    fontFamily: "sans-serif",
    fontStyle: "italic",
    marginTop: hp("2"),
  },
  text2: {
    color: "white",
    fontSize: hp("2"),
    fontWeight: "bold",
    fontFamily: "sans-serif",
    fontStyle: "italic",
    marginTop: hp("5"),
  },
  content: {
    height: hp("80"),
    width: wp(92),
    margin: hp("1"),
    backgroundColor: "#131E3A",
    textAlign: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    alignContent: "center",
  },
  content2: {
    display: "flex",
    borderWidth: wp("1"),
    margin: hp("2"),
    marginTop: hp("7"),
    padding: 15,
    backgroundColor: "black",
    borderRadius: 30,
    textAlign: "center",
    alignItems: "center",
  },
  btn: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#131E3A",
    width: wp("30"),
    marginLeft: wp("25"),
    marginTop: hp("5"),
  },
  container2: {
    flex: 1,
    backgroundColor: "#98B3B7",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "black",
    fontSize: hp("3"),
    padding: 26,
  },
  noteHeader: {
    backgroundColor: "#42f5aa",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  footer: {
    flex: 1,
    backgroundColor: "#ddd",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textInput: {
    alignSelf: "stretch",
    color: "black",
    padding: 20,
    backgroundColor: "#ddd",
    borderTopWidth: 2,
    borderTopColor: "#ddd",
  },

  addButton: {
    position: "absolute",
    zIndex: 11,
    right: wp("10"),
    bottom: hp("14"),
    backgroundColor: "red",
    width: wp("20"),
    height: hp("10"),
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButton2: {
    position: "absolute",
    zIndex: 11,
    left: 20,
    bottom: hp("14"),
    backgroundColor: "green",
    width: wp("20"),
    height: hp("10"),
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: hp("2"),
  },
  input: {
    height: hp("6"),
    marginBottom: hp("2"),
    color: "#fff",
    marginTop: hp("2"),
    width: wp("70"),
    paddingRight: wp("7"),
    backgroundColor: "#131E3A",
  },
  PresssableBtn: {
    backgroundColor: "#4CA6EA",
    padding: hp(1),
    width: wp(30),
    marginTop: hp(2),
    alignSelf: "center",
    paddingHorizontal: wp(3),
    borderRadius: hp(0.8),
    marginBottom: hp(2),
    alignItems: "center",
  },
});
