import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
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
import Chart from "./Chart";
import MarketChart from "./MarketChart";
import { urls } from "./constants";
import IconWithCircle from "../Screens/iconwithCircle";
import Icon from "../icon";
import { LineChart, XAxis } from "react-native-svg-charts";

export const CoinDetails = (props) => {
  const [trades, setTrades] = useState();
  const [percent, setPercent] = useState(1);
  console.log(props?.route?.params?.data);
  const image = props?.route?.params?.data?.image;
  // const data = props?.route?.params?.data?.name;
  const state = useSelector((state) => state);
  const [Data, setData] = useState();
  const [timeFrame, setTimeFrame] = useState("30m");
  const [pressed, setPressed] = useState();
  const [timeData, setTimeData] = useState([
    "5m",
    "10m",
    "15m",
    "20m",
    "25m",
    "30m",
  ]);

  const data2 = ["2h", "4h", "8h", "12h", "18h", "24h"];

  const contentInset = { left: -100, bottom: 0 };
  function chooseStyle(percent) {
    if (parseFloat(percent) === 0) {
      return setStyle("rgba(0,153,51,0.8)");
    }
    if (parseFloat(percent) < 0) {
      return setStyle("rgba(204,51,51,0.8)");
    }

    return setStyle("rgba(0,153,51,0.8)");
  }
  useEffect(async () => {
    await getchart(name.toUpperCase(), "30m");
    chooseStyle(Percent);
    //fetchKline()
  }, []);
  useEffect(async () => {
    await getchart(name.toUpperCase(), timeFrame);
    chooseStyle(Percent);
    //fetchKline()
  }, [timeFrame]);

  async function getchart(name, timeFrame) {
    if (timeFrame === "1h") {
      console.log(name);
      if (name === "USDT") {
        name = "USDC";
      }

      await fetch(
        `https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=1h&limit=5`,
        {
          method: "GET",
        }
      )
        .then((resp) => resp.json())
        .then((resp) => {
          const trades = resp.map((interval) => parseFloat(interval[1]));
          console.log(resp);
          const firstTrade = trades[0];
          const lastTrade = trades.slice(-1)[0];
          const percent = (
            ((lastTrade - firstTrade) / firstTrade) *
            100
          ).toFixed(2);

          setData(trades);
          console.log(trades);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (timeFrame === "12h") {
      console.log(name);
      if (name === "USDT") {
        name = "USDC";
      }

      await fetch(
        `https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=12h&limit=5`,
        {
          method: "GET",
        }
      )
        .then((resp) => resp.json())
        .then((resp) => {
          const trades = resp.map((interval) => parseFloat(interval[1]));
          console.log(resp);
          const firstTrade = trades[0];
          const lastTrade = trades.slice(-1)[0];
          const percent = (
            ((lastTrade - firstTrade) / firstTrade) *
            100
          ).toFixed(2);

          setData(trades);
          console.log(trades);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (timeFrame === "1d") {
      console.log(name);
      if (name === "USDT") {
        name = "USDC";
      }

      await fetch(
        `https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=1d&limit=5`,
        {
          method: "GET",
        }
      )
        .then((resp) => resp.json())
        .then((resp) => {
          const trades = resp.map((interval) => parseFloat(interval[1]));
          console.log(resp);
          const firstTrade = trades[0];
          const lastTrade = trades.slice(-1)[0];
          const percent = (
            ((lastTrade - firstTrade) / firstTrade) *
            100
          ).toFixed(2);

          setData(trades);
          console.log(trades);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(name);
      if (name === "USDT") {
        name = "USDC";
      }

      await fetch(
        `https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=30m&limit=5`,
        {
          method: "GET",
        }
      )
        .then((resp) => resp.json())
        .then((resp) => {
          const trades = resp.map((interval) => parseFloat(interval[1]));
          console.log(resp);
          const firstTrade = trades[0];
          const lastTrade = trades.slice(-1)[0];
          const percent = (
            ((lastTrade - firstTrade) / firstTrade) *
            100
          ).toFixed(2);

          setData(trades);
          console.log(trades);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const data = [
    150, 130, 140, 135, 149, 158, 125, 105, 155, 153, 153, 144, 150, 160, 80,
  ];
  async function getchart(name) {
    const token = await state.token;
    if (name == "USDT") {
      name = "USD";
    }
    if (name == "WETH") {
      name = "ETH";
    }
    const data = await fetch(`http://${urls.testUrl}/user/getChart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: name,
        token: token,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson)
        setTrades(responseJson.trades);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getchart(props?.route?.params?.data?.symbol);
  }, []);

  let LeftContent = (props) => {
    return <Avatar.Image {...props} source={{ uri: image }} />;
  };
  const color =
    props?.route?.params?.data?.price_change_24h > 0 ? "green" : "red";
  return (
    <ScrollView
      contentContainerStyle={{ backgroundColor: "white", paddingBottom: 20 }}
    >
      {/* <View style={{flexDirection:"row",alignItems:"center",marginHorizontal:wp(7),marginTop:hp(2)}}>
  <Image source={{uri: image}} style={{height:hp(3),width:wp(6)}}/>
  <Avatar.Image {...props} source={{ uri: image }} />
  <Text style={{marginHorizontal:wp(3)}}>wallet:{props?.route?.params?.data?.name}</Text>
</View> */}

      <XAxis
        style={styles.xAxis}
        data={timeData}
        formatLabel={(value, index) => timeData[index]}
        contentInset={{ left: 18, right: 18 }}
        svg={{ fontSize: 11, fill: "black" }}
      />

      <LineChart
        style={{
          height: hp(30),
          width: wp(90),
          alignSelf: "center",
          marginTop: hp(6),
        }}
        data={Data ? Data : data}
        svg={{ stroke: "rgb(134, 65, 244)" }}
        contentInset={{ top: 10, bottom: 10 }}
      />

      <View style={styles.btnView}>
        <TouchableOpacity
          style={
            pressed == "1"
              ? { ...styles.tabBtns, borderColor: "#4CA6EA" }
              : styles.tabBtns
          }
          // title="1h" color={pressed==='1'?'green':'grey'}
          onPress={() => {
            setPressed("1");
            setTimeData(["10m", "20m", "30m", "40m", "50m", "60m"]);
            setTimeFrame("1h");
          }}
        >
          <Text style={{ color: pressed == "1" ? "#4CA6EA" : "grey" }}>1h</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            pressed == "2"
              ? { ...styles.tabBtns, borderColor: "#4CA6EA" }
              : styles.tabBtns
          }
          // title="12h"
          // color={pressed === "2" ? "green" : "grey"}
          onPress={() => {
            setPressed("2");
            setTimeData(["2h", "4h", "6h", "8h", "10h", "12h"]);
            setTimeFrame("12h");
          }}
        >
          <Text style={{ color: pressed == "2" ? "#4CA6EA" : "grey" }}>
            12h
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            pressed == "3"
              ? { ...styles.tabBtns, borderColor: "#4CA6EA" }
              : styles.tabBtns
          }
          // title="1d"
          // color={pressed === "3" ? "green" : "grey"}
          onPress={() => {
            setPressed("3");
            setTimeData(["2h", "4h", "8h", "12h", "18h", "24h"]);
            setTimeFrame("1d");
          }}
        >
          <Text style={{ color: pressed == "3" ? "#4CA6EA" : "grey" }}>3d</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
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
          name={"more-vertical"}
          type={"feather"}
          title={"More"}
          onPress={() => {}}
        />
      </View>
      <Text style={styles.bitcoin} numberOfLines={3}>
        Bitcoin is a cryptocurrency and worldwide payment system. It is the
        first decentralized digital currency. as the system works without a It
        is the first decentralized digital currency. as the system works without
        a
      </Text>

      <View style={styles.iconText}>
        <Text> Last 24h:</Text>
        <View style={styles.arrowText}>
          <Text>
            {props?.route?.params?.data?.price_change_percentage_24h}%
          </Text>
          <Icon name="arrow-up-right" type={"feather"} size={20} />
        </View>
      </View>
      <View style={styles.iconText}>
        <Text>Wallet</Text>
        <View style={styles.arrowText}>
          <Text>$ {props?.route?.params?.data?.current_price}</Text>
          <Icon name="arrow-up-right" type={"feather"} size={20} />
        </View>
      </View>

      <View style={styles.iconText}>
        <Text>Market Cap : </Text>
        <Text> ${props?.route?.params?.data?.market_cap}</Text>
      </View>

      <View style={styles.iconText}>
        <Text>Total Supply :</Text>
        <Text>${props?.route?.params?.data?.total_supply}</Text>
      </View>

      <View style={styles.iconText}>
        <Text> 24H high :</Text>
        <Text>${props?.route?.params?.data?.high_24h} </Text>
      </View>

      <View style={styles.iconText}>
        <Text>24H low :</Text>
        <Text>${props?.route?.params?.data?.low_24h}</Text>
      </View>

      <View style={styles.iconText}>
        <Text> All Time High :</Text>
        <Text>${props?.route?.params?.data?.ath}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttons: {
    marginTop: hp(7),
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  bitcoin: {
    width: wp(88),
    marginHorizontal: wp(5.3),
    marginTop: hp(3),
  },
  iconText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: wp(88),
    marginTop: hp(2.3),
  },
  arrowText: {
    flexDirection: "row",
  },
  xAxis: {
    marginTop: hp(43.5),
    position: "absolute",
    height: hp(55),
    alignSelf: "center",
    width: wp(90),
  },
  tabBtns: {
    borderBottomWidth: 1,
    width: "23%",
    alignItems: "center",
    padding: 3,
  },
  btnView: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: wp(55),
    marginTop: hp(2),
    justifyContent: "space-between",
  },
});
