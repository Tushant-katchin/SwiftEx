import React, { useState } from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  CardItem,
  WebView,
} from "react-native-paper";
import { LineChart } from "react-native-svg-charts";
import { urls } from "./constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Market = (props) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [trades, setTrades] = useState();
  const [price, setPrice] = useState();
  const [percent, setPercent] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchKline = async (
    setData,
    setLoading,
    setPercent,
    setPrice,
    setTrades,
    setImageUrl
  ) => {
    try {
      const response = await fetch(
        `http://${urls.testUrl}/user/getcryptodata`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);

          setLoading(false);
          setData(responseJson);
          //setTrades(responseJson.trades)
          setPrice(responseJson.current_price);
          setPercent(responseJson.price_change_percentage_24h);
          setImageUrl(responseJson.image);
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      await fetchKline(
        setData,
        setLoading,
        setPercent,
        setPrice,
        setTrades,
        setImageUrl
      );
      setRefreshing(false);
    }, 2000);
  };

  useEffect(async () => {
    const resp = await fetchKline(
      setData,
      setLoading,
      setPercent,
      setPrice,
      setTrades,
      setImageUrl
    );
  }, []);
  let logo = "https://static.alchemyapi.io/images/assets/3408.png";
  let LeftContent;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ height: hp(75) }}>
        <ScrollView
          alwaysBounceVertical={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {data ? (
            data.map((item) => {
              const image = item.image;
              const data = item;
              //console.log(image)
              LeftContent = (props) => {
                return <Avatar.Image {...props} source={{ uri: image }} />;
              };
              const color = item.price_change_24h > 0 ? "green" : "red";
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    props.navigation.navigate("CoinDetails", { data });
                  }}
                >
                  <View key={item.id}>
                    <Card
                      style={{
                        width: wp(95),
                        height: hp(15),
                        backgroundColor: "#000C66",
                        borderRadius: 10,
                        marginLeft: 5,
                        marginTop: hp(1),
                      }}
                    >
                      <Card.Title
                        titleStyle={{ color: "#fff" }}
                        title={item.symbol}
                        left={LeftContent}
                      />
                      <Card.Content
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          color: "#fff",
                        }}
                      >
                        <Title style={{ color: "#fff" }}></Title>
                        <Paragraph
                          style={{
                            color: color,
                            marginLeft: wp("1"),
                            marginBottom: hp("10"),
                            fontWeight: "bold",
                          }}
                        >
                          Last 24h: {item.price_change_percentage_24h}%
                        </Paragraph>
                        <Paragraph
                          style={{
                            color: "#fff",
                            marginLeft: wp("35"),
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          $ {item.current_price}
                        </Paragraph>
                      </Card.Content>
                    </Card>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View>
              <ActivityIndicator size="large" color="blue" />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Market;
