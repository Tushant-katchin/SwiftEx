// import React, { useState } from "react";
// import { useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Button,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   RefreshControl,
//   ActivityIndicator,
//   BackHandler,
// } from "react-native";
// import axios from "axios";
// import {
//   Avatar,
//   Card,
//   Title,
//   Paragraph,
//   CardItem,
//   WebView,
// } from "react-native-paper";
// import { LineChart } from "react-native-svg-charts";
// import { urls } from "./constants";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";

// const Market = (props) => {
//   const [data, setData] = useState();
//   const [loading, setLoading] = useState();
//   const [trades, setTrades] = useState();
//   const [price, setPrice] = useState();
//   const [percent, setPercent] = useState(0);
//   const [imageUrl, setImageUrl] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const navigation = useNavigation()
//   const fetchKline = async (
//     setData,
//     setLoading,
//     setPercent,
//     setPrice,
//     setTrades,
//     setImageUrl
//   ) => {
//     try {
//       const response = await fetch(
//         `http://${urls.testUrl}/user/getcryptodata`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )
//         .then((response) => response.json())
//         .then((responseJson) => {
//           console.log(responseJson);

//           setLoading(false);
//           setData(responseJson);
//           //setTrades(responseJson.trades)
//           setPrice(responseJson.current_price);
//           setPercent(responseJson.price_change_percentage_24h);
//           setImageUrl(responseJson.image);
//         })
//         .catch((error) => {
//           console.error(error);
//           alert(error);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(async () => {
//       await fetchKline(
//         setData,
//         setLoading,
//         setPercent,
//         setPrice,
//         setTrades,
//         setImageUrl
//       );
//       setRefreshing(false);
//     }, 2000);
//   };

//   useEffect(async () => {
//     const resp = await fetchKline(
//       setData,
//       setLoading,
//       setPercent,
//       setPrice,
//       setTrades,
//       setImageUrl
//     );
//   }, []);
//   let logo = "https://static.alchemyapi.io/images/assets/3408.png";
//   let LeftContent;

//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }}>
//       <View style={{ height: hp(75) }}>
//         <ScrollView
//           alwaysBounceVertical={true}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//         >
//           {data ? (
//             data.map((item) => {
//               const image = item.image;
//               const data = item;
//               //console.log(image)
//               LeftContent = (props) => {
//                 return <Avatar.Image {...props} source={{ uri: image }} />;
//               };
//               const color = item.price_change_24h > 0 ? "green" : "red";
//               return (
//                 <TouchableOpacity
//                   key={item.id}
//                   onPress={() => {
//                     props.navigation.navigate("CoinDetails", { data });
//                   }}
//                 >
//                   <View key={item.id}>
//                     <Card
//                       style={{
//                         width: wp(95),
//                         height: hp(15),
//                         backgroundColor: "#000C66",
//                         borderRadius: 10,
//                         marginLeft: 5,
//                         marginTop: hp(1),
//                       }}
//                     >
//                       <Card.Title
//                         titleStyle={{ color: "#fff" }}
//                         title={item.symbol}
//                         left={LeftContent}
//                       />
//                       <Card.Content
//                         style={{
//                           display: "flex",
//                           flexDirection: "row",
//                           color: "#fff",
//                         }}
//                       >
//                         <Title style={{ color: "#fff" }}></Title>
//                         <Paragraph
//                           style={{
//                             color: color,
//                             marginLeft: wp("1"),
//                             marginBottom: hp("10"),
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Last 24h: {item.price_change_percentage_24h?item.price_change_percentage_24h.toFixed(1):'0'}%
//                         </Paragraph>
//                         <Paragraph
//                           style={{
//                             color: "#fff",
//                             marginLeft: wp("35"),
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {" "}
//                           $ {item.current_price?item.current_price.toFixed(2):'0'}
//                         </Paragraph>
//                       </Card.Content>
//                     </Card>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })
//           ) : (
//             <View>
//               <ActivityIndicator size="large" color="blue" />
//             </View>
//           )}
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default Market;

import React, { useState } from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,StatusBar
} from "react-native";
import { urls } from "./constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Icon from "../icon";
import { alert } from "./reusables/Toasts";

const Market = (props) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [trades, setTrades] = useState();
  const [price, setPrice] = useState();
  const [percent, setPercent] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [updatedData, setUpdatedData] = useState([])
  const [searchItem, setSearchItem] = useState('')
  const navigation = useNavigation();
  const fetchKline = async (
    setData,
    setLoading,
    setPercent,
    setPrice,
    setTrades,
    setImageUrl
  ) => {
    try {
      await fetch(
        `http://${urls.testUrl}/user/getcryptodata`,
        // `http://157.230.10.52:2000/user/getcryptodata`,
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
          setUpdatedData(responseJson)
          //setTrades(responseJson.trades)
          setPrice(responseJson.current_price);
          setPercent(responseJson.price_change_percentage_24h);
          setImageUrl(responseJson.image);
        })
        .catch((error) => {
          console.error(error);

          alert("error", error);
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
    await fetchKline(
      setData,
      setLoading,
      setPercent,
      setPrice,
      setTrades,
      setImageUrl
    );
  }, []);


  return (
    <View style={{ backgroundColor: "white" }}>
    {Platform.OS === 'ios' &&  <StatusBar hidden={true} />}
      <View style={{ height: hp(100) }}>
        <View style={Styles.searchContainer}>
          <Icon name="search1" type="antDesign" size={hp(2.4)} />
          <TextInput
            placeholder="Search Crypto"
            placeholderTextColor={"gray"}
            style={Styles.input}
            onChangeText={(input) => {
              setSearchItem(input)
              let UpdatedData = []
              updatedData.filter((item) => {
                console.log(item.name.toLowerCase().includes(input.toLowerCase()))
                if (item.name.toLowerCase().includes(input.toLowerCase())) {
                  UpdatedData.push(item)
                }

                setData(UpdatedData)
                return UpdatedData
              })

            }}
          />
        </View>
        <View style={Styles.iconwithTextContainer1}>
          <Text style={{ color: "gray" }}>New DApps</Text>
          {/* <Icon
            name={"arrowright"}
            type={"antDesign"}
            size={hp(3)}
            color={"gray"}
          /> */}
        </View>
        <View style={{height:hp(63)}}>
        <ScrollView
          alwaysBounceVertical={true}
          contentContainerStyle={{ marginBottom: hp(2) }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {data ? (
            data.map((item,index) => {
              const image = item.image;
              const color = item.price_change_24h > 0 ? "green" : "red";
              let data = item

              return (
                  <View key={index}>
                <ScrollView>
                  <TouchableOpacity
                    style={Styles.Container}
                    key={item.id}
                    onPress={() => {
                      props.navigation.navigate("CoinDetails", { data: data });
                    }}
                  >
                    <Image source={{ uri: image }} style={Styles.img} />
                    <View style={Styles.flatContainerText}>
                      <Text >{item.name}</Text>
                      <Text>{`$ ${item.current_price ? item.current_price.toFixed(2) : "0"
                        }`}</Text>
                      <Text>{`Last 24h: ${item.price_change_percentage_24h
                          ? item.price_change_percentage_24h.toFixed(1)
                          : "0"
                        }%`}</Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
                  </View>
              );
            })
          ) : (
            <View>
              <ActivityIndicator size="large" color="blue"/>
            </View>
          )}
        </ScrollView>
        </View>
      </View>
    </View>
  );
};
const Styles = StyleSheet.create({
  iconwithTextContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: hp(48),
    alignSelf: "center",
    padding: hp(2),
  },
  Container: {
    width: wp(90),
    paddingHorizontal: wp(2),
    alignSelf: "center",
    marginTop: hp(3),
    alignItems: "center",
    flexDirection: "row",

  },
  flatContainerText: {
    marginHorizontal: wp(4),
  },
  img: {
    height: hp(5),
    width: wp(10),
  },
  searchContainer: {
    flexDirection: "row",
    width: wp(90),
    borderWidth: StyleSheet.hairlineWidth * 1,
    alignItems: "center",
    paddingLeft: wp(3),
    borderRadius: wp(7),
    alignSelf: "center",
    marginTop: hp(2),
    paddingVertical: hp(1),
    backgroundColor: "#D9D5F2",
    marginVertical: hp(2),
  },
  input: {
    marginHorizontal: hp(1.5),
    padding: hp(0.6),
  },
  textWidth: {
    width: "45%",
  },
});
export default Market;
